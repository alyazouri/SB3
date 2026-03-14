// ============================================================
// PUBG JORDAN FINAL LOCK SCRIPT
// Jordan IPv6 Lock + Lobby(4) + Match(5)
// FINAL STABLE VERSION - CIDR ACCURATE
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobby: null,
  match: null,
  active: false
};

// ============================================================
// JORDAN IPv6 CIDRS (home/eyeball-oriented public prefixes)
// ============================================================

var JORDAN_V6_CIDRS = [

  // Orange / Jordan Telecommunications PSC
  "2a00:18d8::/29",

  // Jordan Data Communications / Orange
  "2a01:9700::/29",

  // Umniah / Batelco Jordan
  "2a03:b640::/32",

  // Zain Jordan
  "2a03:6b00::/40",
  "2a03:6b01::/34",
  "2a03:6b01:4000::/34",
  "2a03:6b01:4000::/38",
  "2a03:6b01:4400::/38",
  "2a03:6b01:6000::/38",
  "2a03:6b01:6400::/38",
  "2a03:6b01:8000::/34",
  "2a03:6b01:8000::/40",
  "2a03:6b02:2000::/48"
];

// ================= IPv6 CHECK =================

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

// ================= EXPAND IPv6 =================

function expandIPv6(address){

  if(!address || address.indexOf(":") === -1)
    return address;

  var parts = address.split("::");
  var full = [];

  if(parts.length === 2){

    var left = parts[0] ? parts[0].split(":") : [];
    var right = parts[1] ? parts[1].split(":") : [];

    var missing = 8 - (left.length + right.length);

    full = left;

    for(var i = 0; i < missing; i++)
      full.push("0000");

    full = full.concat(right);

  } else {

    full = address.split(":");

  }

  for(var j = 0; j < full.length; j++){
    if(full[j] === "")
      full[j] = "0000";

    while(full[j].length < 4)
      full[j] = "0" + full[j];
  }

  return full.join(":").toLowerCase();
}

// ================= IPv6 TO BINARY =================

function hexCharToBin(ch){
  switch(ch.toLowerCase()){
    case "0": return "0000";
    case "1": return "0001";
    case "2": return "0010";
    case "3": return "0011";
    case "4": return "0100";
    case "5": return "0101";
    case "6": return "0110";
    case "7": return "0111";
    case "8": return "1000";
    case "9": return "1001";
    case "a": return "1010";
    case "b": return "1011";
    case "c": return "1100";
    case "d": return "1101";
    case "e": return "1110";
    case "f": return "1111";
  }
  return "";
}

function ipv6ToBinary(ip){

  var full = expandIPv6(ip);
  var hex = full.split(":").join("");
  var out = "";

  for(var i = 0; i < hex.length; i++)
    out += hexCharToBin(hex.charAt(i));

  return out;
}

// ================= IPv6 CIDR MATCH =================

function matchIPv6CIDR(ip, cidr){

  if(!isIPv6(ip))
    return false;

  var slash = cidr.indexOf("/");
  if(slash === -1)
    return false;

  var net = cidr.substring(0, slash);
  var bits = parseInt(cidr.substring(slash + 1), 10);

  if(isNaN(bits) || bits < 0 || bits > 128)
    return false;

  var ipBin = ipv6ToBinary(ip);
  var netBin = ipv6ToBinary(net);

  return ipBin.substring(0, bits) === netBin.substring(0, bits);
}

// ================= JORDAN IPv6 CHECK =================

function isJordanIPv6(ip){

  if(!isIPv6(ip))
    return false;

  for(var i = 0; i < JORDAN_V6_CIDRS.length; i++){
    if(matchIPv6CIDR(ip, JORDAN_V6_CIDRS[i]))
      return true;
  }

  return false;
}

// ================= REGION BLOCK =================

function isBlocked(ip){

  if(isIPv6(ip)){
    if(isJordanIPv6(ip))
      return false;

    return (
      ip.startsWith("240") ||
      ip.startsWith("241") ||
      ip.startsWith("242") ||
      ip.startsWith("260") ||
      ip.startsWith("280") ||
      ip.startsWith("2c")
    );
  }

  return false;
}

// ================= PUBG DETECTION =================

function isPUBG(host){

  host = host.toLowerCase();

  if(host.indexOf("pubg") !== -1) return true;
  if(host.indexOf("tencent") !== -1) return true;
  if(host.indexOf("krafton") !== -1) return true;
  if(host.indexOf("levelinfinite") !== -1) return true;
  if(host.indexOf("lightspeed") !== -1) return true;

  return false;
}

// ================= LOBBY =================

function isLobby(data){

  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download/i
    .test(data);
}

// ================= MATCH =================

function isMatch(data){

  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate/i
    .test(data);
}

// ================= SEGMENTS =================

function getNet4(ip){
  return ip.split(":").slice(0, 3).join(":");
}

function getNet5(ip){
  return ip.split(":").slice(0, 4).join(":");
}

// ================= MAIN ENGINE =================

function FindProxyForURL(url, host){

  if(isPlainHostName(host))
    return DIRECT;

  if(!isPUBG(host))
    return DIRECT;

  var ip = "";

  try{
    ip = dnsResolve(host);
  }catch(e){
    ip = "";
  }

  if(!ip)
    return PROXY;

  var fullIP = ip;

  if(isIPv6(ip))
    fullIP = expandIPv6(ip);

  if(isBlocked(fullIP))
    return BLOCK;

  if(isIPv6(fullIP) && !isJordanIPv6(fullIP))
    return BLOCK;

  var data = (host + url).toLowerCase();

  var lobby = isLobby(data);
  var match = isMatch(data);

  var net4 = isIPv6(fullIP) ? getNet4(fullIP) : "";
  var net5 = isIPv6(fullIP) ? getNet5(fullIP) : "";

  if(!match && SESSION.active){
    SESSION.match = null;
    SESSION.active = false;
  }

  if(lobby){

    if(!SESSION.lobby)
      SESSION.lobby = net4;

    if(net4 !== SESSION.lobby)
      return BLOCK;

    return PROXY;
  }

  if(match){

    if(!SESSION.match){
      SESSION.match = net5;
      SESSION.active = true;
    }

    if(net5 !== SESSION.match)
      return BLOCK;

    return PROXY;
  }

  return PROXY;
}
