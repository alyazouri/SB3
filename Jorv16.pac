// ============================================================
// PUBG MOBILE — JORDAN LOCK v16.0 FINAL
// 🇯🇴 للعب مع أردنيين فقط
// ============================================================
// Orange Jordan (AS8376) - 2a01:9700::/29
// 
// توزيع النطاقات:
// ┌────────────────────────────────────────────────────┐
// │ MATCH:  أول 3 خانات ثابتة /48                      │
// │         2a01:9700:4xxx                             │
// │                                                    │
// │ LOBBY:  أول خانتين ثابتتين /32                     │
// │         2a01:9700                                  │
// └────────────────────────────────────────────────────┘
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// 📊 SESSION
// ============================================================

var SESSION = {
  matchNet:  null,    // /48 للـ Match
  lobbyNet:  null,    // /32 للـ Lobby
  startTime: Date.now()
};

// ============================================================
// 🎯 MODES
// ============================================================

var MODE = {
  STRICT_JORDAN: true,     // أردني صارم
  ALLOW_MOBILE: true,      // السماح لـ 4G/5G
  LOCK_MATCH: true,        // تثبيت الـ Match
  LOCK_LOBBY: true         // تثبيت الـ Lobby
};

// ============================================================
// 🇯🇴 JORDAN IPv6 — Orange Jordan AS8376
// ============================================================

// النطاق الكامل: 2a01:9700::/29
// هذا يشمل كل عناوين Orange Jordan

function isJordanIP(ip) {
  if (!ip) return false;
  
  // 🟠 Orange Jordan - AS8376
  // النطاق الكامل /29
  // من 2a01:9700:0000:: إلى 2a01:9700:7fff::
  if (ip.indexOf('2a01:9700:') === 0) {
    return true;
  }
  
  // 📡 VTEL Jordan
  if (ip.indexOf('2a01:1d0:') === 0) {
    return true;
  }
  
  // 🌐 Other Jordan
  if (ip.indexOf('2a01:e24') === 0) return true;
  if (ip.indexOf('2a10:974') === 0) return true;
  if (ip.indexOf('2a13:8d4') === 0) return true;
  
  return false;
}

// ============================================================
// 🎮 PATTERNS — كل أنواع الاتصالات
// ============================================================

var PATTERNS = {
  // Match Servers - اللعب
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|haram|deston|taego|fpp|tpp|squad|duo|solo|gamesvr|gameserver|relay|pvp|ingame|playfab|multiplayer/i,
  
  // Lobby Servers - اللوبي
  LOBBY: /lobby|matchmaking|queue|login|auth|gateway|region|profile|inventory|store|catalog|patch|update|config|api|session|account|social|friend|chat|guild|clan|event|reward|pass|shop|market/i,
  
  // CDN - التحميل
  CDN: /cdn|static|assets|download|patch|resource|bundle|pak|obb|update|dl|mirror|akamai|cloudfront|fastly/i,
  
  // Voice Chat
  VOICE: /voice|voip|chat|talk|mic|audio|webrtc|rtc|turn|stun/i,
  
  // Social
  SOCIAL: /push|notify|fcm|gcm|apns|firebase|xmpp|mqtt|websocket|realtime/i
};

// ============================================================
// 🔧 HELPERS
// ============================================================

function isPUBG(host, url) {
  var data = (host + url).toLowerCase();
  return /pubg|tencent|krafton|lightspeed|levelinfinite|proximabeta|playfab/i.test(data);
}

function isIPv6(ip) {
  return ip && ip.indexOf(':') !== -1;
}

function isIPv4(ip) {
  return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

// استخراج أول 3 خانات /48 للـ Match
function getMatchPrefix(ip) {
  var parts = ip.split(':');
  return parts.slice(0, 3).join(':');  // مثال: 2a01:9700:4000
}

// استخراج أول خانتين /32 للـ Lobby
function getLobbyPrefix(ip) {
  var parts = ip.split(':');
  return parts.slice(0, 2).join(':');  // مثال: 2a01:9700
}

// ============================================================
// 🚀 MAIN
// ============================================================

function FindProxyForURL(url, host) {
  // DNS
  var ip = '';
  try { ip = dnsResolve(host); } catch(e) {}
  
  // Local
  if (isPlainHostName(host)) return DIRECT;
  
  // Non-PUBG
  if (!isPUBG(host, url)) return DIRECT;
  
  // Block IPv4
  if (isIPv4(ip)) return BLOCK;
  
  // No IP
  if (!ip || !isIPv6(ip)) return BLOCK;
  
  // ============================================================
  // 🚫 غير أردني = محظور
  // ============================================================
  if (!isJordanIP(ip)) {
    return BLOCK;
  }
  
  // ============================================================
  // تحليل نوع الطلب
  // ============================================================
  var data = (host + url).toLowerCase();
  var isMatch = PATTERNS.MATCH.test(data);
  var isLobby = PATTERNS.LOBBY.test(data);
  var isCDN   = PATTERNS.CDN.test(data);
  var isVoice = PATTERNS.VOICE.test(data);
  var isSocial = PATTERNS.SOCIAL.test(data);
  
  // ============================================================
  // 🎮 MATCH SERVERS — تثبيت /48
  // ============================================================
  if (isMatch) {
    var matchPrefix = getMatchPrefix(ip);  // أول 3 خانات
    
    // جلسة جديدة - سجل النطاق
    if (!SESSION.matchNet) {
      SESSION.matchNet = matchPrefix;
      return PROXY;
    }
    
    // نفس النطاق = سماح
    if (matchPrefix === SESSION.matchNet) {
      return PROXY;
    }
    
    // نطاق مختلف = حظر (تثبيت على نفس السيرفر)
    return BLOCK;
  }
  
  // ============================================================
  // 🏠 LOBBY SERVERS — تثبيت /32
  // ============================================================
  if (isLobby) {
    var lobbyPrefix = getLobbyPrefix(ip);  // أول خانتين
    
    // جلسة جديدة
    if (!SESSION.lobbyNet) {
      SESSION.lobbyNet = lobbyPrefix;
      return PROXY;
    }
    
    // نفس النطاق أو أي نطاق أردني = سماح
    // (اللوبي يمكن أن يتغير داخل الأردن)
    return PROXY;
  }
  
  // ============================================================
  // 📦 CDN — سماح للتحميل
  // ============================================================
  if (isCDN) {
    return PROXY;
  }
  
  // ============================================================
  // 🎤 VOICE CHAT — مهم للتواصل
  // ============================================================
  if (isVoice) {
    return PROXY;
  }
  
  // ============================================================
  // 📱 SOCIAL — الإشعارات
  // ============================================================
  if (isSocial) {
    return PROXY;
  }
  
  // ============================================================
  // ✅ أي IP أردني آخر = سماح
  // ============================================================
  return PROXY;
}
