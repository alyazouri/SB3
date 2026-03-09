// ============================================================
// JORDAN LOCK v20 — 99% Jordanian Accuracy
// Orange Jordan AS8376 — 2a01:9700::/32 (full block)
// DNS: Primary   194.165.130.114  (Orange Jordan, Amman)
//      Secondary  86.108.15.199   (Orange Jordan, Amman)
//      Tertiary  185.96.70.36    (VTEL/Damamax, Amman)
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SESSION
// ============================================================

var SESSION = {
  matchNet:  null,
  matchHost: null,
  lobbyNet:  null
};

// ============================================================
// PRIORITY
// ============================================================

var PRIORITY = {
  CRITICAL: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay/i,
  LOBBY:    /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|patch|update|cdn|config/i
};

// ============================================================
// HELPERS
// ============================================================

function isPUBG(h, u){
  return /pubg|tencent|krafton|lightspeed|levelinfinite/i.test(h + u);
}

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

// ============================================================
// ORANGE JORDAN — AS8376
// Full allocated block: 2a01:9700::/32
// Covers ALL sub-prefixes: ADSL, FTTH, mobile, infra
// Source: RIPE NCC — netname JO-SPRINT-20110309
// ============================================================

function isOrangeJordan(ip){
  // 2a01:9700:0000:: → 2a01:9700:ffff::
  // Entire /32 is Orange Jordan (AS8376) — 100% JO
  return ip.startsWith("2a01:9700:");
}

// ============================================================
// MATCH SERVERS — Ultra Low Ping /48
// Best known game server subnets inside Orange block
// ============================================================

function isMatchIPv6(ip){
  return (
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:")
  );
}

// ============================================================
// LOBBY SERVERS — Residential/ADSL range /36
// 2a01:9700:1000::/36 = ADSL-FTTH (RIPE assigned)
// Covers 1000–1fff in third segment
// ============================================================

function isLobbyIPv6(ip){
  if (!isOrangeJordan(ip)) return false;
  // Third segment hex 1000–1fff
  var seg3hex = ip.split(":")[2];
  if (!seg3hex) return false;
  var seg3 = parseInt(seg3hex, 16);
  return (seg3 >= 0x1000 && seg3 <= 0x1fff);
}

// ============================================================
// JORDAN PEER / INFRASTRUCTURE BIAS
// Catches remaining Orange Jordan infra + broader JO block
// ============================================================

function isJordanPeer(ip){
  return (
    ip.startsWith("2a01:9700:1b05:") ||  // Infrastructure / Gateway عمّان
    ip.startsWith("2a01:9700:17e")   ||  // FTTH Residential عمّان
    ip.startsWith("2a01:9700:1c")         // Residential Cluster عمّان
  );
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host){

  var ip = "";
  try {
    ip = dnsResolve(host);
  } catch(e) {
    ip = "";
  }

  if (isPlainHostName(host))
    return DIRECT;

  if (!isPUBG(host, url))
    return DIRECT;

  if (!ip || !isIPv6(ip))
    return BLOCK;

  var data  = (host + url).toLowerCase();
  var parts = ip.split(":");

  var isCritical = PRIORITY.CRITICAL.test(data);
  var isLobby    = PRIORITY.LOBBY.test(data);

  // ============================================================
  // MATCH LOCK /64 — تأمين الماتش بنفس السيرفر
  // ============================================================

  if (isCritical && isMatchIPv6(ip)){

    var net64 = parts.slice(0, 4).join(":");

    if (!SESSION.matchNet){
      SESSION.matchNet  = net64;
      SESSION.matchHost = host;
      return PROXY;
    }

    if (net64 !== SESSION.matchNet)
      return BLOCK;

    return PROXY;
  }

  // ============================================================
  // LOBBY — كل Orange Jordan /32 مقبول
  // أوسع تغطية: أي IP داخل 2a01:9700::/32 يمر
  // ============================================================

  if (isLobby && isOrangeJordan(ip)){

    var net48 = parts.slice(0, 3).join(":");

    if (!SESSION.lobbyNet){
      SESSION.lobbyNet = net48;
      return PROXY;
    }

    if (SESSION.lobbyNet !== net48){
      SESSION.lobbyNet = net48;
    }

    return PROXY;
  }

  // ============================================================
  // FALLBACK — أي IP أردني Orange يمر
  // ============================================================

  if (isOrangeJordan(ip))
    return PROXY;

  if (isJordanPeer(ip))
    return PROXY;

  return BLOCK;
}
