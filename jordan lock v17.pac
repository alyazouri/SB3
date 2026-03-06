// ============================================================
// PUBG MOBILE — JORDAN LOCK v17.0 FINAL
// 🇯🇴 للعب مع أردنيين فقط
// ============================================================
// Orange Jordan (AS8376) - 2a01:9700::/29
//
// توزيع النطاقات:
// ┌────────────────────────────────────────────────────────┐
// │ MATCH:  أول 3 خانات ثابتة /48                          │
// │         مثال: 2a01:9700:4abc  ← ثابت طوال المأتم       │
// │                                                        │
// │ LOBBY:  أول خانتين /32                                  │
// │         2a01:9700  ← مرن داخل أردن                     │
// └────────────────────────────────────────────────────────┘
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// 📊 SESSION
// ============================================================

var SESSION = {
  matchNet:  null,   // /48 — أول 3 خانات للـ Match
  lobbyNet:  null,   // /32 — أول خانتين للـ Lobby
  startTime: Date.now()
};

// ============================================================
// 🎯 MODES
// ============================================================

var MODE = {
  STRICT_JORDAN: true,
  ALLOW_MOBILE:  true,
  LOCK_MATCH:    true,
  LOCK_LOBBY:    true
};

// ============================================================
// 🇯🇴 JORDAN IPv6 — Orange Jordan AS8376
// ============================================================

function isJordanIP(ip) {
  if (!ip) return false;

  // 🟠 Orange Jordan AS8376 — /29 الكامل
  if (ip.indexOf('2a01:9700:') === 0) return true;

  // 📡 VTEL Jordan
  if (ip.indexOf('2a01:1d0:') === 0) return true;

  // 🌐 نطاقات أردنية إضافية
  if (ip.indexOf('2a01:e24') === 0) return true;
  if (ip.indexOf('2a10:974') === 0) return true;
  if (ip.indexOf('2a13:8d4') === 0) return true;

  return false;
}

// ============================================================
// 🎮 PATTERNS
// ============================================================

var PATTERNS = {
  MATCH:  /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|deston|taego|fpp|tpp|squad|duo|solo|gamesvr|gameserver|relay|pvp|ingame|playfab|multiplayer/i,
  LOBBY:  /lobby|matchmaking|queue|login|auth|gateway|region|profile|inventory|store|catalog|patch|update|config|api|session|account|social|friend|chat|guild|clan|event|reward|pass|shop|market/i,
  CDN:    /cdn|static|assets|download|patch|resource|bundle|pak|obb|update|dl|mirror|akamai|cloudfront|fastly/i,
  VOICE:  /voice|voip|talk|mic|audio|webrtc|rtc|turn|stun/i,
  SOCIAL: /push|notify|fcm|gcm|apns|firebase|xmpp|mqtt|websocket|realtime/i
};

// ============================================================
// 🔧 HELPERS
// ============================================================

function isPUBG(host, url) {
  return /pubg|tencent|krafton|lightspeed|levelinfinite|proximabeta|playfab/i
    .test(host + url);
}

function isIPv6(ip) {
  return ip && ip.indexOf(':') !== -1;
}

function isIPv4(ip) {
  return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

// /48 — أول 3 خانات (للـ Match)
// مثال: "2a01:9700:4abc:1234:..." → "2a01:9700:4abc"
function getMatchPrefix(ip) {
  var parts = ip.split(':');
  if (parts.length < 3) return ip;
  return parts[0] + ':' + parts[1] + ':' + parts[2];
}

// /32 — أول خانتين (للـ Lobby)
// مثال: "2a01:9700:4abc:..." → "2a01:9700"
function getLobbyPrefix(ip) {
  var parts = ip.split(':');
  if (parts.length < 2) return ip;
  return parts[0] + ':' + parts[1];
}

// ============================================================
// 🚀 MAIN
// ============================================================

function FindProxyForURL(url, host) {

  // ── DNS ──────────────────────────────────────────────────
  var ip = '';
  try { ip = dnsResolve(host); } catch(e) {}

  // ── Local / non-PUBG ─────────────────────────────────────
  if (isPlainHostName(host)) return DIRECT;
  if (!isPUBG(host, url))    return DIRECT;

  // ── Block IPv4 ───────────────────────────────────────────
  if (isIPv4(ip)) return BLOCK;

  // ── No IPv6 ──────────────────────────────────────────────
  if (!ip || !isIPv6(ip)) return BLOCK;

  // ── غير أردني = حظر ──────────────────────────────────────
  if (!isJordanIP(ip)) return BLOCK;

  // ── تحليل نوع الطلب ──────────────────────────────────────
  var data     = (host + url).toLowerCase();
  var isMatch  = PATTERNS.MATCH.test(data);
  var isLobby  = PATTERNS.LOBBY.test(data);
  var isCDN    = PATTERNS.CDN.test(data);
  var isVoice  = PATTERNS.VOICE.test(data);
  var isSocial = PATTERNS.SOCIAL.test(data);

  // ──────────────────────────────────────────────────────────
  // 🎮 MATCH — تثبيت /48 (3 خانات)
  // مثال: 2a01:9700:4abc
  // الخانة 1: 2a01  ← ISP
  // الخانة 2: 9700  ← Orange Jordan
  // الخانة 3: 4abc  ← كتلة السيرفر ← هذا المهم للتثبيت
  // ──────────────────────────────────────────────────────────
  if (isMatch) {
    var matchPrefix = getMatchPrefix(ip);

    if (!SESSION.matchNet) {
      // أول اتصال — سجّل النطاق واسمح
      SESSION.matchNet = matchPrefix;
      return PROXY;
    }

    if (matchPrefix === SESSION.matchNet) {
      // نفس كتلة السيرفر — سماح
      return PROXY;
    }

    // كتلة مختلفة — حظر (لا نريد تغيير السيرفر في وسط المأتم)
    return BLOCK;
  }

  // ──────────────────────────────────────────────────────────
  // 🏠 LOBBY — تثبيت /32 (خانتين)
  // مثال: 2a01:9700
  // مرن أكثر من المأتم — يسمح بالتنقل داخل نفس ISP
  // ──────────────────────────────────────────────────────────
  if (isLobby) {
    var lobbyPrefix = getLobbyPrefix(ip);

    if (!SESSION.lobbyNet) {
      SESSION.lobbyNet = lobbyPrefix;
      return PROXY;
    }

    // اللوبي يُسمح له بالتنقل داخل نطاق Orange الأردني
    return PROXY;
  }

  // ── CDN — سماح التحميل ───────────────────────────────────
  if (isCDN) return PROXY;

  // ── Voice Chat ───────────────────────────────────────────
  if (isVoice) return PROXY;

  // ── Social / Push ────────────────────────────────────────
  if (isSocial) return PROXY;

  // ── أي IP أردني آخر — سماح ───────────────────────────────
  return PROXY;
}
