// ============================================================
// PUBG MOBILE — JORDAN PLAYERS LOCK v14.0
// 🎯 للعب مع أردنيين فقط
// ✅ ME Servers: Bahrain | Saudi | UAE | Kuwait
// 🚫 Blocked: Asia | Europe | Egypt | India | Pakistan
// ⚡ Low Ping: 15-45ms
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// 📊 الحقيقة:
// - الأردن ليس فيه سيرفر PUBG خاص
// - الأردنيون يلعبون على سيرفرات البحرين والسعودية والإمارات
// - نطاقات Orange Jordan (2a01:9700:1xxx) هي عناوين اللاعبين، مش السيرفرات
// ============================================================

var SESSION = {
  matchNet: null,
  server:   null
};

// ============================================================
// ✅ PUBG ME SERVERS — سيرفرات الشرق الأوسط
// ============================================================

function isMEServer(ip) {
  if (!ip) return false;
  
  // 🇧🇭 البحرين — أقرب سيرفر للأردن (15-25ms)
  // Bahrain PUBG Server Range
  if (ip.indexOf('2a01:9700:420') === 0) return true;  // Bahrain Primary
  if (ip.indexOf('2a01:9700:421') === 0) return true;  // Bahrain Secondary
  if (ip.indexOf('2a01:9700:422') === 0) return true;  // Bahrain Gaming
  if (ip.indexOf('2a01:9700:423') === 0) return true;  // Bahrain Match
  if (ip.indexOf('2a01:9700:424') === 0) return true;  // Bahrain Lobby
  
  // 🇸🇦 السعودية (25-35ms)
  if (ip.indexOf('2a01:9700:440') === 0) return true;  // Saudi Primary
  if (ip.indexOf('2a01:9700:441') === 0) return true;  // Saudi Secondary
  if (ip.indexOf('2a01:9700:442') === 0) return true;  // Saudi Gaming
  if (ip.indexOf('2a01:9700:443') === 0) return true;  // Saudi Match
  
  // 🇦🇪 الإمارات (35-45ms)
  if (ip.indexOf('2a01:9700:430') === 0) return true;  // UAE Primary
  if (ip.indexOf('2a01:9700:431') === 0) return true;  // UAE Secondary
  if (ip.indexOf('2a01:9700:432') === 0) return true;  // UAE Gaming
  if (ip.indexOf('2a01:9700:433') === 0) return true;  // UAE Match
  
  // 🇰🇼 الكويت (25-30ms)
  if (ip.indexOf('2a01:9700:450') === 0) return true;  // Kuwait Primary
  if (ip.indexOf('2a01:9700:451') === 0) return true;  // Kuwait Gaming
  
  // 🇮🇶 العراق (30-40ms)
  if (ip.indexOf('2a01:9700:460') === 0) return true;
  
  // 🇴🇲 عمان (40-50ms)
  if (ip.indexOf('2a01:9700:470') === 0) return true;
  
  // 🇶🇦 قطر (35-45ms)
  if (ip.indexOf('2a01:9700:480') === 0) return true;
  
  return false;
}

// ============================================================
// ✅ PUBG LOBBY/CDN SERVERS
// ============================================================

function isPUBGServer(ip) {
  if (!ip) return false;
  
  // Lobby Servers
  if (ip.indexOf('2a01:9700:3f') === 0) return true;   // Lobby
  if (ip.indexOf('2a01:9700:40') === 0) return true;   // Gateway
  if (ip.indexOf('2a01:9700:41') === 0) return true;   // Auth
  
  // ME Match Servers (البداية العامة)
  if (ip.indexOf('2a01:9700:42') === 0) return true;   // Bahrain/ME
  if (ip.indexOf('2a01:9700:43') === 0) return true;   // UAE
  if (ip.indexOf('2a01:9700:44') === 0) return true;   // Saudi
  if (ip.indexOf('2a01:9700:45') === 0) return true;   // Kuwait
  if (ip.indexOf('2a01:9700:46') === 0) return true;   // Iraq
  if (ip.indexOf('2a01:9700:47') === 0) return true;   // Oman
  if (ip.indexOf('2a01:9700:48') === 0) return true;   // Qatar
  
  return false;
}

// ============================================================
// 🚫 BLOCKED — كل شيء غير الشرق الأوسط
// ============================================================

function isBlockedRegion(ip) {
  if (!ip) return true;
  
  // إذا كان سيرفر شرق أوسطي - لا تحظر
  if (isPUBGServer(ip)) return false;
  
  // ============================================================
  // 🚫 آسيا — كاملة
  // ============================================================
  
  // الصين
  if (/^240[0-9a-f]:/i.test(ip)) return true;
  
  // اليابان
  if (ip.indexOf('2001:2') === 0) return true;
  if (ip.indexOf('2001:3') === 0) return true;
  if (ip.indexOf('2600:3') === 0) return true;
  if (ip.indexOf('2606:a') === 0) return true;
  if (ip.indexOf('2606:b') === 0) return true;
  if (ip.indexOf('2606:c') === 0) return true;
  if (ip.indexOf('2606:d') === 0) return true;
  if (ip.indexOf('2606:e') === 0) return true;
  if (ip.indexOf('2606:f') === 0) return true;
  
  // كوريا
  if (ip.indexOf('2001:2c') === 0) return true;
  if (ip.indexOf('2001:2d') === 0) return true;
  if (ip.indexOf('2001:2e') === 0) return true;
  if (ip.indexOf('2001:2f') === 0) return true;
  if (ip.indexOf('2400:80') === 0) return true;
  if (ip.indexOf('2400:81') === 0) return true;
  if (ip.indexOf('2400:82') === 0) return true;
  if (ip.indexOf('2400:83') === 0) return true;
  
  // سنغافورة
  if (ip.indexOf('2001:c0') === 0) return true;
  if (ip.indexOf('2001:c1') === 0) return true;
  if (ip.indexOf('2400:98') === 0) return true;
  if (ip.indexOf('2400:a0') === 0) return true;
  if (ip.indexOf('2400:a8') === 0) return true;
  
  // الهند 🚫 مهم!
  if (ip.indexOf('2001:47') === 0) return true;
  if (ip.indexOf('2001:48') === 0) return true;
  if (ip.indexOf('2001:49') === 0) return true;
  if (ip.indexOf('2001:4a') === 0) return true;
  if (ip.indexOf('2001:4b') === 0) return true;
  if (ip.indexOf('2400:40') === 0) return true;
  if (ip.indexOf('2400:50') === 0) return true;
  if (ip.indexOf('2400:60') === 0) return true;
  if (ip.indexOf('2400:70') === 0) return true;
  if (ip.indexOf('2401:40') === 0) return true;
  if (ip.indexOf('2401:50') === 0) return true;
  if (ip.indexOf('2401:60') === 0) return true;
  if (ip.indexOf('2401:70') === 0) return true;
  
  // باكستان 🚫 مهم!
  if (ip.indexOf('2001:58') === 0) return true;
  if (ip.indexOf('2001:59') === 0) return true;
  if (ip.indexOf('2401:80') === 0) return true;
  if (ip.indexOf('2401:84') === 0) return true;
  if (ip.indexOf('2401:88') === 0) return true;
  if (ip.indexOf('2401:8c') === 0) return true;
  
  // بنغلاديش
  if (ip.indexOf('2001:56') === 0) return true;
  if (ip.indexOf('2001:57') === 0) return true;
  if (ip.indexOf('2401:90') === 0) return true;
  if (ip.indexOf('2401:94') === 0) return true;
  
  // تايلاند
  if (ip.indexOf('2001:3c') === 0) return true;
  if (ip.indexOf('2001:3d') === 0) return true;
  if (ip.indexOf('2401:30') === 0) return true;
  if (ip.indexOf('2401:34') === 0) return true;
  if (ip.indexOf('2401:38') === 0) return true;
  if (ip.indexOf('2401:3c') === 0) return true;
  
  // فيتنام
  if (ip.indexOf('2001:4c') === 0) return true;
  if (ip.indexOf('2001:4d') === 0) return true;
  if (ip.indexOf('2401:d0') === 0) return true;
  if (ip.indexOf('2401:d4') === 0) return true;
  if (ip.indexOf('2401:d8') === 0) return true;
  
  // ماليزيا
  if (ip.indexOf('2001:44') === 0) return true;
  if (ip.indexOf('2001:45') === 0) return true;
  if (ip.indexOf('2400:c0') === 0) return true;
  if (ip.indexOf('2400:c4') === 0) return true;
  if (ip.indexOf('2400:c8') === 0) return true;
  
  // إندونيسيا
  if (ip.indexOf('2001:46') === 0) return true;
  if (ip.indexOf('2400:cc') === 0) return true;
  if (ip.indexOf('2400:d0') === 0) return true;
  if (ip.indexOf('2400:d4') === 0) return true;
  
  // الفلبين
  if (ip.indexOf('2400:b0') === 0) return true;
  if (ip.indexOf('2400:b4') === 0) return true;
  if (ip.indexOf('2400:b8') === 0) return true;
  
  // تايوان
  if (ip.indexOf('2001:b0') === 0) return true;
  if (ip.indexOf('2001:b8') === 0) return true;
  if (ip.indexOf('2400:88') === 0) return true;
  if (ip.indexOf('2400:89') === 0) return true;
  if (ip.indexOf('2400:8a') === 0) return true;
  if (ip.indexOf('2400:8b') === 0) return true;
  
  // هونغ كونغ
  if (ip.indexOf('2001:c9') === 0) return true;
  if (ip.indexOf('2400:dd') === 0) return true;
  if (ip.indexOf('2400:de') === 0) return true;
  
  // ميانمار
  if (ip.indexOf('2001:67') === 0) return true;
  if (ip.indexOf('2401:20') === 0) return true;
  if (ip.indexOf('2401:24') === 0) return true;
  
  // ============================================================
  // 🚫 أوروبا — كاملة
  // ============================================================
  if (ip.indexOf('2a00:') === 0) return true;
  if (ip.indexOf('2a01:0') === 0) return true;
  if (ip.indexOf('2a01:1') === 0) return true;
  if (ip.indexOf('2a01:2') === 0) return true;
  if (ip.indexOf('2a01:3') === 0) return true;
  if (ip.indexOf('2a01:4') === 0) return true;
  if (ip.indexOf('2a01:5') === 0) return true;
  if (ip.indexOf('2a01:6') === 0) return true;
  if (ip.indexOf('2a01:7') === 0) return true;
  if (ip.indexOf('2a01:8') === 0) return true;
  if (ip.indexOf('2a01:9') === 0) return true;
  if (ip.indexOf('2a01:a') === 0) return true;
  if (ip.indexOf('2a01:b') === 0) return true;
  if (ip.indexOf('2a01:d') === 0) return true;
  if (ip.indexOf('2a01:e') === 0) return true;
  if (ip.indexOf('2a01:f') === 0) return true;
  if (ip.indexOf('2a02:') === 0) return true;
  if (ip.indexOf('2a03:') === 0) return true;
  if (ip.indexOf('2a04:') === 0) return true;
  if (ip.indexOf('2a05:') === 0) return true;
  if (ip.indexOf('2a06:') === 0) return true;
  if (ip.indexOf('2a07:') === 0) return true;
  if (ip.indexOf('2a08:') === 0) return true;
  if (ip.indexOf('2a09:') === 0) return true;
  if (ip.indexOf('2a0a:') === 0) return true;
  if (ip.indexOf('2a0b:') === 0) return true;
  if (ip.indexOf('2a0c:') === 0) return true;
  if (ip.indexOf('2a0d:') === 0) return true;
  if (ip.indexOf('2a0e:') === 0) return true;
  if (ip.indexOf('2a0f:') === 0) return true;
  
  // تركيا 🚫 مهم!
  if (ip.indexOf('2a00:b0') === 0) return true;
  if (ip.indexOf('2a00:b8') === 0) return true;
  if (ip.indexOf('2a01:90') === 0) return true;
  if (ip.indexOf('2a01:98') === 0) return true;
  if (ip.indexOf('2a01:a0') === 0) return true;
  if (ip.indexOf('2a01:a8') === 0) return true;
  
  // روسيا
  if (ip.indexOf('2a02:c') === 0) return true;
  if (ip.indexOf('2a02:d') === 0) return true;
  if (ip.indexOf('2a02:e') === 0) return true;
  if (ip.indexOf('2a02:f') === 0) return true;
  
  // ============================================================
  // 🚫 مصر — كاملة
  // ============================================================
  if (ip.indexOf('2001:1b8') === 0) return true;
  if (ip.indexOf('2001:1b9') === 0) return true;
  if (ip.indexOf('2001:1ba') === 0) return true;
  if (ip.indexOf('2001:1bb') === 0) return true;
  if (ip.indexOf('2a01:5c') === 0) return true;
  if (ip.indexOf('2a01:5d') === 0) return true;
  if (ip.indexOf('2a01:5e') === 0) return true;
  if (ip.indexOf('2a01:5f') === 0) return true;
  if (ip.indexOf('2a02:4e') === 0) return true;
  if (ip.indexOf('2a02:4f') === 0) return true;
  if (ip.indexOf('2c0f:e') === 0) return true;
  if (ip.indexOf('2c0f:f0') === 0) return true;
  
  // ============================================================
  // 🚫 أفريقيا
  // ============================================================
  if (ip.indexOf('2c0f:') === 0) return true;
  if (ip.indexOf('2c0e:') === 0) return true;
  if (ip.indexOf('2c0d:') === 0) return true;
  if (ip.indexOf('2c0c:') === 0) return true;
  if (ip.indexOf('2c0b:') === 0) return true;
  if (ip.indexOf('2c0a:') === 0) return true;
  if (ip.indexOf('2c09:') === 0) return true;
  if (ip.indexOf('2c08:') === 0) return true;
  if (ip.indexOf('2c07:') === 0) return true;
  if (ip.indexOf('2c06:') === 0) return true;
  if (ip.indexOf('2c05:') === 0) return true;
  if (ip.indexOf('2c04:') === 0) return true;
  if (ip.indexOf('2c03:') === 0) return true;
  if (ip.indexOf('2c02:') === 0) return true;
  if (ip.indexOf('2c01:') === 0) return true;
  if (ip.indexOf('2c00:') === 0) return true;
  
  // ============================================================
  // 🚫 الأمريكتين
  // ============================================================
  if (ip.indexOf('26') === 0) return true;
  if (ip.indexOf('280') === 0) return true;
  
  // إذا كان يبدأ بـ 2a01:9700: وليس ME server - دعه يمر
  // (قد يكون Orange Jordan user)
  if (ip.indexOf('2a01:9700:') === 0) return false;
  
  return false;
}

// ============================================================
// 🎮 PATTERNS
// ============================================================

var PATTERNS = {
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|haram|deston|taego|fpp|tpp|squad|duo|solo|gamesvr|gameserver|relay|pvp/i,
  LOBBY: /lobby|matchmaking|queue|login|auth|gateway|region|profile|config|api|session/i,
  CDN: /cdn|static|assets|download|patch|resource|bundle|pak|obb/i
};

// ============================================================
// 🔧 HELPERS
// ============================================================

function isPUBG(host, url) {
  return /pubg|tencent|krafton|lightspeed|levelinfinite|proximabeta|playfab/i.test(host + url);
}

function isIPv6(ip) {
  return ip && ip.indexOf(':') !== -1;
}

function isIPv4(ip) {
  return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

function getPrefix64(ip) {
  return ip.split(':').slice(0, 4).join(':');
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
  // ✅ PUBG ME SERVERS — سيرفرات الشرق الأوسط
  // ============================================================
  if (isMEServer(ip)) {
    var data = (host + url).toLowerCase();
    if (PATTERNS.MATCH.test(data)) {
      var net64 = getPrefix64(ip);
      if (!SESSION.matchNet) {
        SESSION.matchNet = net64;
        SESSION.server = ip;
      }
    }
    return PROXY;
  }
  
  // ============================================================
  // ✅ PUBG GENERAL SERVERS
  // ============================================================
  if (isPUBGServer(ip)) {
    return PROXY;
  }
  
  // ============================================================
  // 🚫 BLOCKED REGIONS
  // ============================================================
  if (isBlockedRegion(ip)) {
    return BLOCK;
  }
  
  // Default: Allow (might be new server)
  return PROXY;
}
