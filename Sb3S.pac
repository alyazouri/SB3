// ============================================================
// PUBG MOBILE — Jordan Priority PAC v3.0
// Full-session lock | No DNS dependency | Update 4.2
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SESSION STATE — Persistent for full session
// ============================================================

var SESSION = {
  locked:    false,
  lockedAt:  0,
  matchHost: null
};

// ============================================================
// PUBG DETECTION PATTERNS
// ============================================================

var PUBG_HOSTS = /pubg|tencent|krafton|lightspeed|levelinfinite|mihoyo|proxima/i;

var MATCH_PATTERNS = /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay|gs\d|msdk|msf|msfp/i;

var LOBBY_PATTERNS = /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|config|presence|social|friend|chat|voice|voip|turn|stun|signal/i;

var CDN_PATTERNS   = /patch|update|cdn|download|asset|res|ota|manifest|version/i;

// ============================================================
// JORDAN ISP IPv4 RANGES
// Orange Jordan AS8376 | Zain AS48832 | Umniah AS9038
// JT AS8697 | DAMAMAX AS47887
// ============================================================

var JORDAN_IPv4 = [
  // Orange Jordan
  [0x59CCCC00, 0xFFFFFF00],  // 89.204.204.0/24
  [0x59CCCD00, 0xFFFFFF00],  // 89.204.205.0/24
  [0x5A2D0000, 0xFFFF0000],  // 90.45.0.0/16
  [0xB9570000, 0xFFFF0000],  // 185.87.0.0/16
  // Zain
  [0x2EE50000, 0xFFFF0000],  // 46.229.0.0/16
  [0xB96F0000, 0xFFFF0000],  // 185.111.0.0/16
  // Umniah
  [0x5F320000, 0xFFFF0000],  // 95.50.0.0/16
  [0xBC6C0000, 0xFFFF0000],  // 188.108.0.0/16
  // Jordan Telecom
  [0x59B60000, 0xFFFF0000],  // 89.182.0.0/16
  // DAMAMAX
  [0x2EB90000, 0xFFFF0000],  // 46.185.0.0/16
];

// ============================================================
// HELPERS
// ============================================================

function isPUBG(h, u) {
  return PUBG_HOSTS.test(h + u);
}

function isIPv4(ip) {
  return ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip);
}

function isIPv6(ip) {
  return ip && ip.indexOf(":") !== -1;
}

function ipToInt(ip) {
  var p = ip.split(".");
  return ((parseInt(p[0]) * 16777216) +
          (parseInt(p[1]) * 65536)    +
          (parseInt(p[2]) * 256)       +
           parseInt(p[3]));
}

function isJordanIPv4(ip) {
  if (!isIPv4(ip)) return false;
  var n = ipToInt(ip);
  for (var i = 0; i < JORDAN_IPv4.length; i++) {
    if ((n & JORDAN_IPv4[i][1]) === JORDAN_IPv4[i][0]) return true;
  }
  return false;
}

// ============================================================
// MATCH SERVER IPv6 — Orange Jordan /48 Ranges
// ============================================================

function isMatchIPv6(ip) {
  return (
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:") ||
    ip.startsWith("2a01:9700:3900:") ||
    ip.startsWith("2a01:9700:4800:") ||
    ip.startsWith("2a01:9700:4700:") ||
    ip.startsWith("2a01:9700:4900:") ||
    ip.startsWith("2a01:9700:4600:") ||
    ip.startsWith("2a01:9700:4500:") ||
    ip.startsWith("2a01:9700:4000:") ||
    ip.startsWith("2a01:9700:4100:") ||
    ip.startsWith("2a01:9700:4400:")
  );
}

function isJordanPeerIPv6(ip) {
  return (
    ip.startsWith("2a01:9700:1b05:") ||
    ip.startsWith("2a01:9700:17e")   ||
    ip.startsWith("2a01:9700:1c")
  );
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host) {

  if (isPlainHostName(host)) return DIRECT;

  var data = (host + url).toLowerCase();

  // غير PUBG → DIRECT
  if (!isPUBG(host, url)) return DIRECT;

  // CDN/Patch → DIRECT دائماً (ما تأثر على الping)
  if (CDN_PATTERNS.test(data)) return DIRECT;

  // محاولة DNS
  var ip = "";
  try { ip = dnsResolveEx ? dnsResolveEx(host) : dnsResolve(host); } catch(e) {}
  if (!ip) { try { ip = dnsResolve(host); } catch(e) { ip = ""; } }

  var isMatch = MATCH_PATTERNS.test(data);
  var isLobby = LOBBY_PATTERNS.test(data);

  // ============================================================
  // IPv6 PATH — Jordan Server Detection
  // ============================================================

  if (isIPv6(ip)) {

    // Match server → Lock للجلسة كاملة
    if (isMatch && isMatchIPv6(ip)) {
      SESSION.locked    = true;
      SESSION.matchHost = host;
      return PROXY;
    }

    // Lobby على Jordan IPv6 → PROXY
    if (isLobby && (isMatchIPv6(ip) || isJordanPeerIPv6(ip))) {
      return PROXY;
    }

    // Jordan Peer infrastructure
    if (isJordanPeerIPv6(ip)) return PROXY;

    // IPv6 غير أردني → BLOCK
    return BLOCK;
  }

  // ============================================================
  // IPv4 PATH — Jordan ISP Range Check
  // ============================================================

  if (isIPv4(ip)) {

    if (isJordanIPv4(ip)) return PROXY;

    // Match/Lobby بدون تحقق من IP (host pattern كافي)
    if (isMatch) return PROXY;
    if (isLobby) return PROXY;

    return BLOCK;
  }

  // ============================================================
  // NO IP — اعتمد على Host Pattern فقط
  // ============================================================

  if (isMatch) return PROXY;
  if (isLobby) return PROXY;

  return BLOCK;
}
