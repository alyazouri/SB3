// ============================================================
// PUBG MOBILE — JORDAN LOCK v8.1
// Ultra Low Ping
// Dynamic Lobby Rotation
// Jordan Player Bias + Infrastructure Detection
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
// MATCH SERVERS — Ultra Low Ping /48
// ============================================================

function isMatchIPv6(ip){
  return (
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:")
  );
}

// ============================================================
// LOBBY SERVERS — Dynamic Rotation /48
// ============================================================

function isLobbyIPv6(ip){
  return (
    ip.startsWith("2a01:9700:1000:") ||
    ip.startsWith("2a01:9700:1100:") ||
    ip.startsWith("2a01:9700:1200:") ||
    ip.startsWith("2a01:9700:1300:") ||
    ip.startsWith("2a01:9700:1400:") ||
    ip.startsWith("2a01:9700:1500:") ||
    ip.startsWith("2a01:9700:1600:") ||
    ip.startsWith("2a01:9700:1700:") ||
    ip.startsWith("2a01:9700:1800:") ||
    ip.startsWith("2a01:9700:1900:") ||
    ip.startsWith("2a01:9700:1a00:") ||
    ip.startsWith("2a01:9700:1b00:") ||
    ip.startsWith("2a01:9700:1c00:") ||
    ip.startsWith("2a01:9700:1d00:") ||
    ip.startsWith("2a01:9700:1e00:") ||
    ip.startsWith("2a01:9700:1f00:") ||
    ip.startsWith("2a01:9700:2000:") ||
    ip.startsWith("2a01:9700:2100:") ||
    ip.startsWith("2a01:9700:2200:") ||
    ip.startsWith("2a01:9700:2300:") ||
    ip.startsWith("2a01:9700:2400:") ||
    ip.startsWith("2a01:9700:2500:") ||
    ip.startsWith("2a01:9700:2600:") ||
    ip.startsWith("2a01:9700:2700:") ||
    ip.startsWith("2a01:9700:2800:") ||
    ip.startsWith("2a01:9700:2900:") ||
    ip.startsWith("2a01:9700:2a00:") ||
    ip.startsWith("2a01:9700:2b00:") ||
    ip.startsWith("2a01:9700:2c00:") ||
    ip.startsWith("2a01:9700:2d00:") ||
    ip.startsWith("2a01:9700:2e00:") ||
    ip.startsWith("2a01:9700:2f00:") ||
    ip.startsWith("2a01:9700:3000:") ||
    ip.startsWith("2a01:9700:3100:") ||
    ip.startsWith("2a01:9700:3200:") ||
    ip.startsWith("2a01:9700:3300:") ||
    ip.startsWith("2a01:9700:3400:") ||
    ip.startsWith("2a01:9700:3500:") ||
    ip.startsWith("2a01:9700:3600:") ||
    ip.startsWith("2a01:9700:3700:") ||
    ip.startsWith("2a01:9700:3800:") ||
    ip.startsWith("2a01:9700:3900:") ||
    ip.startsWith("2a01:9700:3a00:") ||
    ip.startsWith("2a01:9700:3b00:") ||
    ip.startsWith("2a01:9700:3c00:") ||
    ip.startsWith("2a01:9700:3d00:") ||
    ip.startsWith("2a01:9700:3e00:") ||
    ip.startsWith("2a01:9700:3f00:") ||
    ip.startsWith("2a01:9700:4000:") ||
    ip.startsWith("2a01:9700:4100:") ||
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:") ||
    ip.startsWith("2a01:9700:4400:") ||
    ip.startsWith("2a01:9700:4500:") ||
    ip.startsWith("2a01:9700:4600:") ||
    ip.startsWith("2a01:9700:4700:") ||
    ip.startsWith("2a01:9700:4800:") ||
    ip.startsWith("2a01:9700:4900:") ||
    ip.startsWith("2a01:9700:4a00:") ||
    ip.startsWith("2a01:9700:4b00:") ||
    ip.startsWith("2a01:9700:4c00:") ||
    ip.startsWith("2a01:9700:4d00:") ||
    ip.startsWith("2a01:9700:4e00:") ||
    ip.startsWith("2a01:9700:4f00:") ||
    ip.startsWith("2a01:9700:5000:") ||
    ip.startsWith("2a01:9700:5100:") ||
    ip.startsWith("2a01:9700:5200:") ||
    ip.startsWith("2a01:9700:5300:") ||
    ip.startsWith("2a01:9700:5400:") ||
    ip.startsWith("2a01:9700:5500:") ||
    ip.startsWith("2a01:9700:5600:") ||
    ip.startsWith("2a01:9700:5700:") ||
    ip.startsWith("2a01:9700:5800:") ||
    ip.startsWith("2a01:9700:5900:") ||
    ip.startsWith("2a01:9700:5a00:") ||
    ip.startsWith("2a01:9700:5b00:") ||
    ip.startsWith("2a01:9700:5c00:") ||
    ip.startsWith("2a01:9700:5d00:") ||
    ip.startsWith("2a01:9700:5e00:") ||
    ip.startsWith("2a01:9700:5f00:") ||
    ip.startsWith("2a01:9700:6000:") ||
    ip.startsWith("2a01:9700:6100:") ||
    ip.startsWith("2a01:9700:6200:") ||
    ip.startsWith("2a01:9700:6300:") ||
    ip.startsWith("2a01:9700:6400:") ||
    ip.startsWith("2a01:9700:6500:") ||
    ip.startsWith("2a01:9700:6600:") ||
    ip.startsWith("2a01:9700:6700:") ||
    ip.startsWith("2a01:9700:6800:") ||
    ip.startsWith("2a01:9700:6900:") ||
    ip.startsWith("2a01:9700:6a00:") ||
    ip.startsWith("2a01:9700:6b00:") ||
    ip.startsWith("2a01:9700:6c00:") ||
    ip.startsWith("2a01:9700:6d00:") ||
    ip.startsWith("2a01:9700:6e00:") ||
    ip.startsWith("2a01:9700:6f00:") ||
    ip.startsWith("2a01:9700:7000:") ||
    ip.startsWith("2a01:9700:7100:") ||
    ip.startsWith("2a01:9700:7200:") ||
    ip.startsWith("2a01:9700:7300:") ||
    ip.startsWith("2a01:9700:7400:") ||
    ip.startsWith("2a01:9700:7500:") ||
    ip.startsWith("2a01:9700:7600:") ||
    ip.startsWith("2a01:9700:7700:") ||
    ip.startsWith("2a01:9700:7800:") ||
    ip.startsWith("2a01:9700:7900:") ||
    ip.startsWith("2a01:9700:7a00:") ||
    ip.startsWith("2a01:9700:7b00:") ||
    ip.startsWith("2a01:9700:7c00:") ||
    ip.startsWith("2a01:9700:7d00:") ||
    ip.startsWith("2a01:9700:7e00:") ||
    ip.startsWith("2a01:9700:7f00:") ||
    ip.startsWith("2a01:9700:8000:") ||
    ip.startsWith("2a01:9700:8100:") ||
    ip.startsWith("2a01:9700:8200:") ||
    ip.startsWith("2a01:9700:8300:") ||
    ip.startsWith("2a01:9700:8400:") ||
    ip.startsWith("2a01:9700:8500:") ||
    ip.startsWith("2a01:9700:8600:") ||
    ip.startsWith("2a01:9700:8700:") ||
    ip.startsWith("2a01:9700:8800:") ||
    ip.startsWith("2a01:9700:8900:") ||
    ip.startsWith("2a01:9700:8a00:") ||
    ip.startsWith("2a01:9700:8b00:") ||
    ip.startsWith("2a01:9700:8c00:") ||
    ip.startsWith("2a01:9700:8d00:") ||
    ip.startsWith("2a01:9700:8e00:") ||
    ip.startsWith("2a01:9700:8f00:") ||
    ip.startsWith("2a01:9700:9000:")
  );
}

// ============================================================
// JORDAN PEER / INFRASTRUCTURE BIAS
// Orange Jordan — AS8376
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
  // MATCH LOCK /64
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
  // DYNAMIC LOBBY /48
  // ============================================================

  if (isLobby && isLobbyIPv6(ip)){

    var net48 = parts.slice(0, 3).join(":");

    if (!SESSION.lobbyNet){
      SESSION.lobbyNet = net48;
      return PROXY;
    }

    if (SESSION.lobbyNet !== net48){
      SESSION.lobbyNet = net48;
      return PROXY;
    }

    return PROXY;
  }

  // ============================================================
  // JORDAN PEER BIAS
  // ============================================================

  if (isJordanPeer(ip))
    return PROXY;

  return BLOCK;
}
