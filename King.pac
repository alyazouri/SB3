// ============================================================
// PUBG MOBILE — Jordan Priority PAC v3.4
// Lobby = Relaxed | Match = Strict /48 Lock | No DNS
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SESSION STATE
// ============================================================

var SESSION = {
  phase:   "LOBBY",   // "LOBBY" | "MATCH"
  locked:  false,
  net48:   null
};

// ============================================================
// HOST / URL PATTERNS
// ============================================================

var PUBG_HOSTS = /pubg|tencent|krafton|lightspeed|levelinfinite|proxima|mihoyo|global\.cdn/i;

var MATCH_PATTERNS = /match|battle|classic|ranked|arena|tdm|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay|gs\d|msdk|msf|roomsvr|roomserver/i;

var LOBBY_PATTERNS = /lobby|matchmak|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|config|presence|social|friend|chat|voice|voip|turn|stun|signal|rank|leaderboard|notice|announce/i;

var CDN_PATTERNS = /patch|update|cdn|download|asset|res|ota|manifest|version|upgrade|pkg|apk|binary/i;

// ============================================================
// JORDAN IPv6 PREFIX DETECTION
// Covers: Orange Jordan AS8376 (2a01:9700::/32)
//         VTEL / Damamax AS50670 (2a06:8ec0::/29 approx)
//         Batelco / Umniah range fragments
// Primary check: 2a01:9700: covers the full /32 allocation
// ============================================================

function isJordanPrefix(str) {
  // Orange Jordan — single /32 covers all Orange allocations
  if (/2a01:9700:/i.test(str)) return true;

  // VTEL / Damamax Jordan
  if (/2a06:8ec[0-9a-f]:/i.test(str)) return true;

  // Umniah (AS47887) — known prefix fragment
  if (/2a0d:d6c[0-9a-f]:/i.test(str)) return true;

  return false;
}

function extractNet48(str) {
  // Extract first three groups as /48 key
  var m = str.match(/(2a01:9700:[0-9a-f]{1,4}|2a06:8ec[0-9a-f]:[0-9a-f]{1,4}|2a0d:d6c[0-9a-f]:[0-9a-f]{1,4}):/i);
  return m ? m[1].toLowerCase() : null;
}

// ============================================================
// SESSION HELPERS
// ============================================================

function resetSession() {
  SESSION.phase  = "LOBBY";
  SESSION.locked = false;
  SESSION.net48  = null;
}

function lockMatch(net48) {
  SESSION.phase  = "MATCH";
  SESSION.locked = true;
  SESSION.net48  = net48;
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host) {

  if (isPlainHostName(host)) return DIRECT;

  var data = (url + " " + host).toLowerCase();

  // Pass-through: non-PUBG traffic
  if (!PUBG_HOSTS.test(data)) return DIRECT;

  // Pass-through: CDN / patch traffic — always DIRECT to avoid breaking updates
  if (CDN_PATTERNS.test(data)) return DIRECT;

  var isMatch = MATCH_PATTERNS.test(data);
  var isLobby = LOBBY_PATTERNS.test(data);

  // ============================================================
  // LOBBY PHASE — مرن / Relaxed
  // قبول أي خادم PUBG يظهر خلال التجميع بدون قيود prefix
  // إعادة تعيين الـ session عند كل دورة lobby جديدة
  // ============================================================

  if (isLobby && !isMatch) {
    // إذا كانت الجلسة لا تزال مقفلة من مباراة سابقة — حررها
    if (SESSION.locked) resetSession();
    return PROXY;
  }

  // ============================================================
  // MATCH PHASE — صارم / Strict /48 Lock
  // ============================================================

  if (isMatch) {

    var hasJordan = isJordanPrefix(data);
    var net48     = hasJordan ? extractNet48(data) : null;

    if (!SESSION.locked) {
      // أول خادم match يظهر — إذا أردني: lock عليه
      if (hasJordan && net48) {
        lockMatch(net48);
        return PROXY;
      }
      // خادم غير أردني في بداية match — block
      return BLOCK;
    }

    // الجلسة مقفلة — تحقق من انتماء الطلب لنفس الـ /48
    if (hasJordan && net48 === SESSION.net48) return PROXY;

    return BLOCK;
  }

  // ============================================================
  // TRAFFIC أردني عام (infrastructure، heartbeat، إلخ)
  // ============================================================

  if (isJordanPrefix(data)) return PROXY;

  // ============================================================
  // FALLBACK — خادم PUBG غير محدد الهوية
  // في اللوبي: مرر | في المباراة: احجب
  // ============================================================

  if (SESSION.phase === "MATCH") return BLOCK;

  return PROXY;
}
