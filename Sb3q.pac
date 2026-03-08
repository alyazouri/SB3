// ============================================================
// PUBG MOBILE — Jordan Priority PAC v3.3
// URL/Host pattern only | No DNS | /48 prefix lock
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

var SESSION = {
  locked:  false,
  net48:   null
};

// ============================================================
// PATTERNS
// ============================================================

var PUBG_HOSTS     = /pubg|tencent|krafton|lightspeed|levelinfinite|proxima/i;
var MATCH_PATTERNS = /match|battle|classic|ranked|arena|tdm|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay|gs\d|msdk|msf/i;
var LOBBY_PATTERNS = /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|config|presence|social|friend|chat|voice|voip|turn|stun|signal/i;
var CDN_PATTERNS   = /patch|update|cdn|download|asset|res|ota|manifest|version/i;

// ============================================================
// JORDAN /48 PREFIX — ثلاث خانات ثابتة
// 2a01:9700:1000:: → 2a01:9700:9000::
// ============================================================

function isJordanPrefix(url) {
  return /2a01:9700:[1-9][0-9a-f]{3}:/i.test(url);
}

function extractNet48(url) {
  var m = url.match(/2a01:9700:([1-9][0-9a-f]{3}):/i);
  return m ? ("2a01:9700:" + m[1].toLowerCase()) : null;
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host) {

  if (isPlainHostName(host)) return DIRECT;

  var data = (host + url).toLowerCase();

  if (!PUBG_HOSTS.test(data))  return DIRECT;
  if (CDN_PATTERNS.test(data)) return DIRECT;

  var isMatch = MATCH_PATTERNS.test(data);
  var isLobby = LOBBY_PATTERNS.test(data);

  // ============================================================
  // JORDAN PREFIX في الـ URL أو الـ Host
  // ============================================================

  if (isJordanPrefix(data)) {

    var net48 = extractNet48(data);

    // Match: lock على أول /48 يظهر وارفض أي /48 مختلف
    if (isMatch) {
      if (!SESSION.locked) {
        SESSION.locked = true;
        SESSION.net48  = net48;
        return PROXY;
      }
      return (net48 === SESSION.net48) ? PROXY : BLOCK;
    }

    // Lobby: قبول أي /48 أردني بدون lock
    if (isLobby) return PROXY;

    // Infrastructure أردنية عامة
    return PROXY;
  }

  // ============================================================
  // FALLBACK — Host Pattern بدون prefix
  // ============================================================

  if (isMatch) return PROXY;
  if (isLobby) return PROXY;

  return BLOCK;
}
