// ============================================================
// PUBG JORDAN BOOSTED LOCK SCRIPT
// Full Final Version
// Strict Jordan IPv6 + Stable Lobby + Stable Match
// All supported proxy methods through one chain
// PAC-Compatible / Old Engine Friendly
// ============================================================

var PROXY  = "SOCKS5 46.185.131.218:20001; PROXY 46.185.131.218:20001; SOCKS 46.185.131.218:20001; HTTPS 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

// Toggle: allow PUBG IPv4 through proxy or block it
var ALLOW_IPV4 = true;

// ============================================================
// SESSION STATE
// ============================================================

var SESSION = {
  lobby: "",
  match: "",
  active: false
};

// ============================================================
// OBSERVED / TARGET JORDAN IPv6 BLOCKS
// ============================================================

var JORDAN_V6_CIDRS = [
  "2a00:18d8::/29",   // Orange
  "2a03:6b00::/29",   // Zain
  "2a03:b640::/32"    // Umniah
];

// ============================================================
// SIMPLE HOST CACHE
// ============================================================

var HOST_CACHE = {};

// ============================================================
// BASIC HELPERS
// ============================================================

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

// ============================================================
// SPECIAL PRECISE RANGE
// Allowed:
// 2a01:9700:3800:.... -> 2a01:9700:5000:.... (inclusive)
// ============================================================

function isJordan9700Range(ip){
  var full, parts, third;

  if(!isIPv6(ip))
    return false;

  full = expandIPv6(ip);
  parts = full.split(":");

  if(parts.length < 3)
    return false;

  if(safeLower(parts[0]) != "2a01")
    return false;

  if(safeLower(parts[1]) != "9700")
    return false;

  third = parseInt(parts[2], 16);
  if(isNaN(third))
    return false;

  return third >= 0x3800 && third <= 0x5000;
}

function isJordanIPv6(ip){
  var i;

  if(!isIPv6(ip))
    return false;

  if(isJordan9700Range(ip))
    return true;

  for(i = 0; i < JORDAN_V6_CIDRS.length; i++){
    if(matchIPv6CIDR(ip, JORDAN_V6_CIDRS[i]))
      return true;
  }

  return false;
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
// TRAFFIC TYPE DETECTION
// ============================================================

function isLobby(data){
  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download|notice|config/i.test(data);
}

function isMatch(data){
  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate|room|gamecore/i.test(data);
}

// ============================================================
// NETWORK SEGMENTS
// ============================================================

function getLobbyNet(ip){
  if(!isIPv6(ip)) return "";
  return ip.split(":").slice(0, 3).join(":");
}

function getMatchNet(ip){
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

function rememberLobby(net){
  if(SESSION.lobby === "")
    SESSION.lobby = net;
}

function rememberMatch(net){
  if(SESSION.match === ""){
    SESSION.match = net;
    SESSION.active = true;
  }
}

// ============================================================
// DNS RESOLVE WITH CACHE
// ============================================================

function resolveHostIP(host){
  if(HOST_CACHE[host])
    return HOST_CACHE[host];

  var ip = "";

  try{
    ip = dnsResolve(host);
  }catch(e){
    ip = "";
  }

  HOST_CACHE[host] = ip;
  return ip;
}

// ============================================================
// MAIN ENGINE
// ============================================================

function FindProxyForURL(url, host){

  var ip = "";
  var fullIP = "";
  var data = "";
  var lobby = false;
  var match = false;
  var lobbyNet = "";
  var matchNet = "";

  if(isPlainHostName(host))
    return DIRECT;

  if(!isPUBG(host))
    return DIRECT;

  ip = resolveHostIP(host);

  // If DNS fails, still try proxy chain
  if(!ip || ip === "")
    return PROXY;

  fullIP = ip;

  if(isIPv6(fullIP))
    fullIP = expandIPv6(fullIP);

  // Strict Jordan-only IPv6
  if(isIPv6(fullIP) && !isJordanIPv6(fullIP))
    return BLOCK;

  // IPv4 handling
  if(isIPv4(fullIP))
    return ALLOW_IPV4 ? PROXY : BLOCK;

  // Unknown / malformed
  if(!isIPv6(fullIP) && !isIPv4(fullIP))
    return BLOCK;

  data = safeLower(host + url);

  lobby = isLobby(data);
  match = isMatch(data);

  lobbyNet = getLobbyNet(fullIP);
  matchNet = getMatchNet(fullIP);

  // Reset match only when clear lobby traffic appears
  if(lobby && SESSION.active)
    resetMatchSession();

  // Lobby lock
  if(lobby){
    rememberLobby(lobbyNet);

    if(SESSION.lobby !== "" && lobbyNet != SESSION.lobby)
      return BLOCK;

    return PROXY;
  }

  // Match lock
  if(match){
    rememberMatch(matchNet);

    if(SESSION.match !== "" && matchNet != SESSION.match)
      return BLOCK;

    return PROXY;
  }

  // Other PUBG traffic
  return PROXY;
}
