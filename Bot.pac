var PROXY = "SOCKS5 46.185.131.218:20001";
var BLOCK  = "SOCKS5 0.0.0.0:0";

// ============================================================
// ALLOWED IPv6 CIDRs - Latin America Only
// ============================================================
var ALLOWED_V6_CIDRS = [
  "2800::/12",
  "2001:1200::/32"
];

// ============================================================
// PUBG DETECTION
// ============================================================
function isPUBG(host) {
  host = host.toLowerCase();
  if (host.indexOf("pubg")         !== -1) return true;
  if (host.indexOf("tencent")      !== -1) return true;
  if (host.indexOf("krafton")      !== -1) return true;
  if (host.indexOf("levelinfinite") !== -1) return true;
  if (host.indexOf("lightspeed")   !== -1) return true;
  return false;
}

// ============================================================
// LOBBY / MATCH DETECTION
// ============================================================
function isLobby(data) {
  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download/i.test(data);
}

function isMatch(data) {
  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate/i.test(data);
}

// ============================================================
// IPv6 RANGE CHECK
// ============================================================
function parseIPv6Prefix(cidr) {
  var parts = cidr.split("/");
  var addr  = parts[0];
  var bits  = parseInt(parts[1], 10);
  var segs  = addr.split(":").map(function(s) {
    return parseInt(s || "0", 16);
  });
  while (segs.length < 8) segs.push(0);
  return { segs: segs, bits: bits };
}

function ipv6InRange(host, cidr) {
  var prefix = parseIPv6Prefix(cidr);
  var segs   = host.split(":").map(function(s) {
    return parseInt(s || "0", 16);
  });
  while (segs.length < 8) segs.push(0);

  var fullWords = Math.floor(prefix.bits / 16);
  for (var i = 0; i < fullWords; i++) {
    if (segs[i] !== prefix.segs[i]) return false;
  }
  var rem = prefix.bits % 16;
  if (rem > 0) {
    var mask = (0xFFFF << (16 - rem)) & 0xFFFF;
    if ((segs[fullWords] & mask) !== (prefix.segs[fullWords] & mask)) return false;
  }
  return true;
}

function isAllowedIPv6(host) {
  for (var i = 0; i < ALLOWED_V6_CIDRS.length; i++) {
    if (ipv6InRange(host, ALLOWED_V6_CIDRS[i])) return true;
  }
  return false;
}

function isIPv6(host) {
  return host.indexOf(":") !== -1;
}

// ============================================================
// MAIN
// ============================================================
function FindProxyForURL(url, host) {
  host = host.toLowerCase();

  if (!isPUBG(host)) return BLOCK;

  if (isIPv6(host)) {
    if (isAllowedIPv6(host)) return PROXY;
    return BLOCK;
  }

  // Lobby / Match
  if (isLobby(host) || isLobby(url)) return PROXY;
  if (isMatch(host) || isMatch(url))  return PROXY;

  return BLOCK;
}
