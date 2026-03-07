// ============================================================
//  JORDAN PUBG MOBILE — FULL STRICT LOCK v6.0
//  IPv6 ONLY — Exact Prefix Lock
//  Match: /64
//  Lobby: /48
//  Only Listed Prefixes Allowed
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SESSION STATE
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

  CRITICAL: /match|battle|classic|ranked|unranked|competitive|arena|tdm|teamdeathmatch|gungame|domination|assault|payload|metro|metroroyale|zombie|infection|evoground|ultimate|royale|wow|cheer|training|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|war|sniper|quickmatch|arcade|battlefield|clash|gunfight|dispatch|ingame|gaming|realtime|gamesvr|gsvoice|relay/i,

  SECURITY:  /anticheat|verify|shield|security|ban|compliance|safeguard|integrity/i,

  LOBBY:     /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|news|patch|update|cdn|asset|config|feedback/i
};

// ============================================================
// EXCLUSIONS
// ============================================================
function isYouTube(h) {
  return shExpMatch(h, "*.youtube.com") ||
         shExpMatch(h, "*.googlevideo.com") ||
         shExpMatch(h, "*.ytimg.com") ||
         shExpMatch(h, "*.youtube-nocookie.com") ||
         shExpMatch(h, "youtu.be");
}

function isGitHub(h) {
  return shExpMatch(h, "github.com") ||
         shExpMatch(h, "*.github.com") ||
         shExpMatch(h, "*.githubusercontent.com") ||
         shExpMatch(h, "*.githubassets.com") ||
         shExpMatch(h, "api.github.com");
}

// ============================================================
// EXACT ALLOWED PREFIXES (From Screenshots)
// ============================================================
var ALLOWED_PREFIXES = [
  "2a01:9700:1700","2a01:9700:3100","2a01:9700:3200","2a01:9700:3300",
  "2a01:9700:3400","2a01:9700:3500","2a01:9700:3800","2a01:9700:3900",
  "2a01:9700:3a00","2a01:9700:3b00","2a01:9700:3c00","2a01:9700:3d00",
  "2a01:9700:3e00","2a01:9700:3f00","2a01:9700:4000","2a01:9700:4100",
  "2a01:9700:4200","2a01:9700:4300","2a01:9700:4400","2a01:9700:4500",
  "2a01:9700:4600","2a01:9700:4700","2a01:9700:4800","2a01:9700:4900",
  "2a01:9700:4a00","2a01:9700:4b00","2a01:9700:4c00","2a01:9700:4d00",
  "2a01:9700:4e00","2a01:9700:4f00","2a01:9700:5000","2a01:9700:5100",
  "2a01:9700:5200","2a01:9700:5300","2a01:9700:5400","2a01:9700:5500",
  "2a01:9700:5600","2a01:9700:5700","2a01:9700:5800","2a01:9700:5900",
  "2a01:9700:5a00","2a01:9700:5b00","2a01:9700:5c00","2a01:9700:5e00",
  "2a01:9700:6000","2a01:9700:6100","2a01:9700:6200","2a01:9700:6300",
  "2a01:9700:6400","2a01:9700:6500","2a01:9700:6700","2a01:9700:6800",
  "2a01:9700:6900","2a01:9700:6a00","2a01:9700:6b00","2a01:9700:6c00",
  "2a01:9700:6e00","2a01:9700:7000","2a01:9700:7100","2a01:9700:7200",
  "2a01:9700:7300","2a01:9700:7400","2a01:9700:7500","2a01:9700:7600",
  "2a01:9700:7a00","2a01:9700:8000","2a01:9700:8100","2a01:9700:8400",
  "2a01:9700:8500","2a01:9700:8600","2a01:9700:9000","2a01:9700:9100",
  "2a01:9700:9200","2a01:9700:9300","2a01:9700:9400","2a01:9700:4338",
  "2a01:9700:4335","2a01:9700:4336","2a01:9700:4438","2a01:9700:5000"
];

// ============================================================
// HELPERS
// ============================================================
function isIPv6(ip) {
  return ip && ip.indexOf(":") !== -1;
}

function isAllowedIPv6(ip) {
  if (!isIPv6(ip)) return false;
  var ipLow = ip.toLowerCase();
  for (var i = 0; i < ALLOWED_PREFIXES.length; i++) {
    if (ipLow.indexOf(ALLOWED_PREFIXES[i]) === 0) return true;
  }
  return false;
}

function isPUBG(h,u){
  return /pubg|tencent|krafton|lightspeed|levelinfinite/i.test(h+u);
}

// ============================================================
// MAIN
// ============================================================
function FindProxyForURL(url, host) {

  var ip = "";
  try { ip = dnsResolve(host); } catch(e){ ip=""; }

  // Local
  if (isPlainHostName(host)) return DIRECT;

  // Exclusions
  if (isYouTube(host)) return DIRECT;
  if (isGitHub(host)) return DIRECT;

  // Non PUBG → Direct
  if (!isPUBG(host,url)) return DIRECT;

  // Block IPv4
  if (!ip || !isIPv6(ip)) return BLOCK;

  // Block if not in allowed prefixes
  if (!isAllowedIPv6(ip)) return BLOCK;

  var data = (host+url).toLowerCase();

  var isCritical = PRIORITY.CRITICAL.test(data);
  var isSecurity = PRIORITY.SECURITY.test(data);
  var isLobby    = PRIORITY.LOBBY.test(data);

  var parts = ip.split(":");

  // ===== MATCH / SECURITY → /64 lock =====
  if (isCritical || isSecurity) {

    var net64 = parts.slice(0,4).join(":");

    if (!SESSION.matchNet) {
      SESSION.matchNet  = net64;
      SESSION.matchHost = host;
      return PROXY;
    }

    if (host !== SESSION.matchHost) return BLOCK;
    if (net64 !== SESSION.matchNet) return BLOCK;

    return PROXY;
  }

  // ===== LOBBY → /48 lock =====
  if (isLobby) {

    var net48 = parts.slice(0,3).join(":");

    if (!SESSION.lobbyNet) {
      SESSION.lobbyNet = net48;
      return PROXY;
    }

    if (net48 !== SESSION.lobbyNet) return BLOCK;

    return PROXY;
  }

  return PROXY;
}
