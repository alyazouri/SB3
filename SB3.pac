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
    ip.startsWith("2a01:9700:3f00:") ||
    ip.startsWith("2a01:9700:4000:") ||
    ip.startsWith("2a01:9700:4100:") ||
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:") ||
    ip.startsWith("2a01:9700:4400:")
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
