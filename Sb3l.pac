// ============================================================
// PUBG MOBILE — JORDAN LOCK v9.0
// Optimized for Jordan Home Networks
// Ultra Low Ping + Dynamic Lobby Rotation
// PAC-Compatible / Cleaner / Lighter
// ============================================================

// -----------------------------
// ROUTING
// -----------------------------
var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// -----------------------------
// SESSION STATE
// -----------------------------
var SESSION = {
  matchNet64:  null,
  matchHost:   null,
  lobbyNet48:  null
};

// -----------------------------
// PRIORITY DETECTION
// -----------------------------
var PRIORITY = {
  CRITICAL: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay/i,
  LOBBY:    /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|patch|update|cdn|config/i
};

// ============================================================
// BASIC HELPERS
// ============================================================

function startsWith(str, prefix) {
  return str && prefix && str.indexOf(prefix) === 0;
}

function safeLower(str) {
  if (!str) return "";
  return ("" + str).toLowerCase();
}

function isPUBG(host, url) {
  var s = safeLower(host) + " " + safeLower(url);
  return /pubg|tencent|krafton|lightspeed|levelinfinite/i.test(s);
}

function isIPv6(ip) {
  return ip && ip.indexOf(":") !== -1;
}

function getIPv6Parts(ip) {
  if (!ip || !isIPv6(ip)) return [];
  return ip.toLowerCase().split(":");
}

function getNet48(ip) {
  var p = getIPv6Parts(ip);
  if (p.length < 3) return "";
  return p[0] + ":" + p[1] + ":" + p[2];
}

function getNet64(ip) {
  var p = getIPv6Parts(ip);
  if (p.length < 4) return "";
  return p[0] + ":" + p[1] + ":" + p[2] + ":" + p[3];
}

function hexToInt(h) {
  if (!h || h === "") return -1;
  return parseInt(h, 16);
}

// ============================================================
// PUBG IPv6 PROFILE
// ============================================================

// MATCH SERVERS — locked /64
function isMatchIPv6(ip) {
  return (
    startsWith(ip, "2a01:9700:4200:") ||
    startsWith(ip, "2a01:9700:4300:")
  );
}

// LOBBY SERVERS — rotating /48
// Old script listed 1000 .. 9000 manually.
// This version detects the same pattern dynamically.
function isLobbyIPv6(ip) {
  var parts = getIPv6Parts(ip);
  if (parts.length < 3) return false;

  if (parts[0] !== "2a01" || parts[1] !== "9700") return false;

  var block = hexToInt(parts[2]);
  if (block < 0) return false;

  // Accept 0x1000 .. 0x9000 inclusive
  return (block >= 0x1000 && block <= 0x9000);
}

// ============================================================
// JORDAN PEER / HOME INFRASTRUCTURE BIAS
// Orange Jordan — based on your current logic
// ============================================================

function isJordanPeer(ip) {
  return (
    startsWith(ip, "2a01:9700:1b05:") || // Gateway / Infrastructure
    startsWith(ip, "2a01:9700:17e")   || // FTTH Residential
    startsWith(ip, "2a01:9700:1c")       // Residential Cluster
  );
}

// ============================================================
// FAIL-SAFE
// ============================================================

function resolveHost(host) {
  var ip = "";
  try {
    ip = dnsResolve(host);
  } catch (e) {
    ip = "";
  }
  return safeLower(ip);
}

// ============================================================
// MAIN PAC
// ============================================================

function FindProxyForURL(url, host) {
  var h = safeLower(host);
  var u = safeLower(url);
  var data = h + " " + u;

  if (isPlainHostName(host)) {
    return DIRECT;
  }

  // Only inspect PUBG-related traffic
  if (!isPUBG(h, u)) {
    return DIRECT;
  }

  var ip = resolveHost(host);

  // Force IPv6-only behavior for this logic
  if (!ip || !isIPv6(ip)) {
    return BLOCK;
  }

  var isCritical = PRIORITY.CRITICAL.test(data);
  var isLobby    = PRIORITY.LOBBY.test(data);

  // ==========================================================
  // MATCH LOCK /64
  // First matched critical server becomes locked for session
  // ==========================================================
  if (isCritical && isMatchIPv6(ip)) {
    var net64 = getNet64(ip);

    if (!SESSION.matchNet64) {
      SESSION.matchNet64 = net64;
      SESSION.matchHost  = h;
      return PROXY;
    }

    if (SESSION.matchNet64 !== net64) {
      return BLOCK;
    }

    return PROXY;
  }

  // ==========================================================
  // DYNAMIC LOBBY /48
  // Allow lobby network rotation, keep latest seen /48
  // ==========================================================
  if (isLobby && isLobbyIPv6(ip)) {
    var net48 = getNet48(ip);

    if (!SESSION.lobbyNet48) {
      SESSION.lobbyNet48 = net48;
      return PROXY;
    }

    if (SESSION.lobbyNet48 !== net48) {
      SESSION.lobbyNet48 = net48;
      return PROXY;
    }

    return PROXY;
  }

  // ==========================================================
  // JORDAN HOME / PEER BIAS
  // ==========================================================
  if (isJordanPeer(ip)) {
    return PROXY;
  }

  return BLOCK;
}
