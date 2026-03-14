// ============================================================
// PUBG JORDAN ADVANCED LOCK SCRIPT
// Jordan Home IPv6 Lock + Stable Lobby(4) + Match(5)
// PAC-Compatible / Old Engine Friendly
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobby: "",
  match: "",
  active: false
};

// ============================================================
// JORDAN HOME IPv6 CIDRS
// ============================================================

var JORDAN_V6_CIDRS = [
  "2a00:18d8::/29",   // Orange
  "2a01:9700::/29",   // JDC / Orange
  "2a03:b640::/32",   // Umniah
  "2a03:6b00::/40",   // Zain
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

// ============================================================
// BASIC HELPERS
// ============================================================

function strStartsWith(s, prefix){
  if(!s || !prefix) return false;
  return s.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase();
}

function safeLower(s){
  if(!s) return "";
  return ("" + s).toLowerCase();
}

function isIPv6(ip){
  return ip && ip.indexOf(":") != -1;
}

function isIPv4(ip){
  return ip && ip.indexOf(".") != -1;
}

// ============================================================
// IPv6 EXPANSION
// ============================================================

function expandIPv6(address){

  if(!address || address.indexOf(":") == -1)
    return address;

  var parts = address.split("::");
  var left = [];
  var right = [];
  var full = [];
  var i, missing;

  if(parts.length == 2){
    if(parts[0] !== "")
      left = parts[0].split(":");
    if(parts[1] !== "")
      right = parts[1].split(":");

    missing = 8 - (left.length + right.length);

    for(i = 0; i < left.length; i++)
      full.push(left[i]);

    for(i = 0; i < missing; i++)
      full.push("0000");

    for(i = 0; i < right.length; i++)
      full.push(right[i]);
  } else {
    full = address.split(":");
  }

  for(i = 0; i < full.length; i++){
    if(full[i] === "")
      full[i] = "0000";

    while(full[i].length < 4)
      full[i] = "0" + full[i];
  }

  return full.join(":").toLowerCase();
}

// ============================================================
// HEX / BINARY HELPERS
// ============================================================

function hexNibbleToBin(ch){
  ch = safeLower(ch);

  if(ch == "0") return "0000";
  if(ch == "1") return "0001";
  if(ch == "2") return "0010";
  if(ch == "3") return "0011";
  if(ch == "4") return "0100";
  if(ch == "5") return "0101";
  if(ch == "6") return "0110";
  if(ch == "7") return "0111";
  if(ch == "8") return "1000";
  if(ch == "9") return "1001";
  if(ch == "a") return "1010";
  if(ch == "b") return "1011";
  if(ch == "c") return "1100";
  if(ch == "d") return "1101";
  if(ch == "e") return "1110";
  if(ch == "f") return "1111";

  return "";
}

function ipv6ToBinary(ip){
  var full = expandIPv6(ip);
  var hex = full.split(":").join("");
  var out = "";
  var i;

  for(i = 0; i < hex.length; i++)
    out += hexNibbleToBin(hex.charAt(i));

  return out;
}

// ============================================================
// IPv6 CIDR MATCH
// ============================================================

function matchIPv6CIDR(ip, cidr){

  if(!isIPv6(ip) || !cidr)
    return false;

  var p = cidr.indexOf("/");
  var net, bits, ipBin, netBin;

  if(p == -1)
    return false;

  net = cidr.substring(0, p);
  bits = parseInt(cidr.substring(p + 1), 10);

  if(isNaN(bits) || bits < 0 || bits > 128)
    return false;

  ipBin = ipv6ToBinary(ip);
  netBin = ipv6ToBinary(net);

  return ipBin.substring(0, bits) == netBin.substring(0, bits);
}

function isJordanIPv6(ip){
  var i;

  if(!isIPv6(ip))
    return false;

  for(i = 0; i < JORDAN_V6_CIDRS.length; i++){
    if(matchIPv6CIDR(ip, JORDAN_V6_CIDRS[i]))
      return true;
  }

  return false;
}

// ============================================================
// OPTIONAL REGION BLOCK
// Blocks obvious non-target IPv6 regions quickly
// ============================================================

function isClearlyForeignIPv6(ip){

  if(!isIPv6(ip))
    return false;

  if(isJordanIPv6(ip))
    return false;

  ip = safeLower(ip);

  return (
    strStartsWith(ip, "240") ||
    strStartsWith(ip, "241") ||
    strStartsWith(ip, "242") ||
    strStartsWith(ip, "260") ||
    strStartsWith(ip, "280") ||
    strStartsWith(ip, "2c")
  );
}

// ============================================================
// NETWORK CLASSIFICATION
// ============================================================

function classifyIP(ip){

  if(!ip || ip === "")
    return "UNKNOWN";

  if(isIPv6(ip)){
    if(isJordanIPv6(ip))
      return "JORDAN_HOME_V6";

    if(isClearlyForeignIPv6(ip))
      return "FOREIGN_V6";

    return "OTHER_V6";
  }

  if(isIPv4(ip))
    return "IPV4";

  return "UNKNOWN";
}

// ============================================================
// PUBG DETECTION
// ============================================================

function isPUBG(host){

  host = safeLower(host);

  if(host.indexOf("pubg") != -1) return true;
  if(host.indexOf("tencent") != -1) return true;
  if(host.indexOf("krafton") != -1) return true;
  if(host.indexOf("levelinfinite") != -1) return true;
  if(host.indexOf("lightspeed") != -1) return true;

  return false;
}

// ============================================================
// LOBBY / MATCH DETECTION
// ============================================================

function isLobby(data){
  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download/i.test(data);
}

function isMatch(data){
  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate/i.test(data);
}

// ============================================================
// NETWORK SEGMENTS
// ============================================================

function getNet4(ip){
  if(!isIPv6(ip)) return "";
  return ip.split(":").slice(0, 3).join(":");
}

function getNet5(ip){
  if(!isIPv6(ip)) return "";
  return ip.split(":").slice(0, 4).join(":");
}

// ============================================================
// SESSION CONTROL
// ============================================================

function resetMatchSession(){
  SESSION.match = "";
  SESSION.active = false;
}

function rememberLobby(net4){
  if(SESSION.lobby === "")
    SESSION.lobby = net4;
}

function rememberMatch(net5){
  if(SESSION.match === ""){
    SESSION.match = net5;
    SESSION.active = true;
  }
}

// ============================================================
// MAIN ENGINE
// ============================================================

function FindProxyForURL(url, host){

  var ip = "";
  var fullIP = "";
  var cls = "";
  var data = "";
  var lobby = false;
  var match = false;
  var net4 = "";
  var net5 = "";

  if(isPlainHostName(host))
    return DIRECT;

  if(!isPUBG(host))
    return DIRECT;

  try{
    ip = dnsResolve(host);
  }catch(e){
    ip = "";
  }

  if(!ip || ip === "")
    return PROXY;

  fullIP = ip;

  if(isIPv6(ip))
    fullIP = expandIPv6(ip);

  cls = classifyIP(fullIP);

  // Strict IPv6 lock:
  // Allow only Jordan home IPv6 for PUBG IPv6 targets.
  if(cls == "FOREIGN_V6")
    return BLOCK;

  if(cls == "OTHER_V6")
    return BLOCK;

  // If target is IPv4, let it pass to proxy.
  // If you want full Jordan-only strictness, change this to BLOCK.
  if(cls == "IPV4")
    return PROXY;

  // Unknown or malformed
  if(cls == "UNKNOWN")
    return BLOCK;

  data = safeLower(host + url);

  lobby = isLobby(data);
  match = isMatch(data);

  net4 = getNet4(fullIP);
  net5 = getNet5(fullIP);

  // If current request is not match traffic, drop active match lock
  if(!match && SESSION.active)
    resetMatchSession();

  // Lobby lock on /48-ish grouping using first 3 hextets
  if(lobby){

    rememberLobby(net4);

    if(SESSION.lobby !== "" && net4 != SESSION.lobby)
      return BLOCK;

    return PROXY;
  }

  // Match lock on tighter grouping using first 4 hextets
  if(match){

    rememberMatch(net5);

    if(SESSION.match !== "" && net5 != SESSION.match)
      return BLOCK;

    return PROXY;
  }

  // Non-lobby non-match PUBG traffic inside allowed Jordan home IPv6
  return PROXY;
}
