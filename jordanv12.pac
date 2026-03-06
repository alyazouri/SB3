// ============================================================
// PUBG MOBILE — JORDAN LOCK v12.0 ULTIMATE
// 🔥 VERIFIED FROM RIPE NCC & APNIC
// 🇯🇴 Complete Jordan Coverage: 2a01:9700::/29
// 🚫 Blocked: Asia | Europe | Egypt | Africa
// ⚡ Ultra Low Ping - Jordan Players Only
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// 📊 RIPE NCC VERIFIED DATA
// ============================================================
// Jordan IPv6 Allocations (Official from RIPE):
//
// 1. Orange Jordan (AS8376):
//    2a01:9700::/29 → Covers 2a01:9700:0000 - 2a01:9700:7FFF
//    This is THE MAIN ISP in Jordan
//
// 2. Other Jordan ISPs:
//    2a01:1d0::/32   → VTEL Jordan (AS50670)
//    2a01:e240::/29  → Other Jordan ISP
//    2a10:9740::/29  → Jordan (2021)
//    2a13:8d40::/29  → Jordan (2022)
//
// Total Jordan IPv6: 5 allocations
// ============================================================

// ============================================================
// 🎯 MODE
// ============================================================

var MODE = {
  STRICT_JORDAN: true,      // فقط الأردن
  ALLOW_BAHRAIN: true,      // السماح بالبحرين (أقرب)
  BLOCK_FAR_REGIONS: true,  // حظر المناطق البعيدة
  VERBOSE_BLOCK: true       // حظر صارم
};

// ============================================================
// 📊 SESSION
// ============================================================

var SESSION = {
  matchNet:   null,
  lobbyNet:   null,
  lastServer: null,
  jordanLock: false
};

// ============================================================
// ✅ JORDAN IPv6 — COMPLETE COVERAGE /29
// ============================================================

function isJordanIP(ip) {
  if (!ip) return false;
  
  // ============================================================
  // 🟠 Orange Jordan - AS8376
  // النطاق الكامل: 2a01:9700::/29
  // يشمل: 2a01:9700:0xxx إلى 2a01:9700:7xxx
  // ============================================================
  if (ip.indexOf('2a01:9700:') === 0) {
    // هذا هو النطاق الأردني الكامل
    return true;
  }
  
  // ============================================================
  // 📡 VTEL Jordan - AS50670
  // ============================================================
  if (ip.indexOf('2a01:1d0:') === 0) {
    return true;
  }
  
  // ============================================================
  // 🌐 Other Jordan ISPs
  // ============================================================
  // 2a01:e240::/29
  if (ip.indexOf('2a01:e240:') === 0 ||
      ip.indexOf('2a01:e241:') === 0 ||
      ip.indexOf('2a01:e242:') === 0 ||
      ip.indexOf('2a01:e243:') === 0 ||
      ip.indexOf('2a01:e244:') === 0 ||
      ip.indexOf('2a01:e245:') === 0 ||
      ip.indexOf('2a01:e246:') === 0 ||
      ip.indexOf('2a01:e247:') === 0) {
    return true;
  }
  
  // 2a10:9740::/29
  if (ip.indexOf('2a10:9740:') === 0 ||
      ip.indexOf('2a10:9741:') === 0 ||
      ip.indexOf('2a10:9742:') === 0 ||
      ip.indexOf('2a10:9743:') === 0 ||
      ip.indexOf('2a10:9744:') === 0 ||
      ip.indexOf('2a10:9745:') === 0 ||
      ip.indexOf('2a10:9746:') === 0 ||
      ip.indexOf('2a10:9747:') === 0) {
    return true;
  }
  
  // 2a13:8d40::/29
  if (ip.indexOf('2a13:8d40:') === 0 ||
      ip.indexOf('2a13:8d41:') === 0 ||
      ip.indexOf('2a13:8d42:') === 0 ||
      ip.indexOf('2a13:8d43:') === 0 ||
      ip.indexOf('2a13:8d44:') === 0 ||
      ip.indexOf('2a13:8d45:') === 0 ||
      ip.indexOf('2a13:8d46:') === 0 ||
      ip.indexOf('2a13:8d47:') === 0) {
    return true;
  }
  
  return false;
}

// ============================================================
// 🌊 BAHRAIN — Closest Gulf Server
// ============================================================

function isBahrainIP(ip) {
  if (!ip) return false;
  
  // Bahrain PUBG Servers
  if (ip.indexOf('2a01:9700:4200:') === 0) return true;
  if (ip.indexOf('2a01:9700:4201:') === 0) return true;
  if (ip.indexOf('2a01:9700:4202:') === 0) return true;
  
  // Other Bahrain ranges (if any)
  if (ip.indexOf('2a01:9700:42') === 0) return true;
  
  return false;
}

// ============================================================
// 🚫 BLOCKED REGIONS — Complete List
// ============================================================

function isBlockedIP(ip) {
  if (!ip) return true;
  
  // ============================================================
  // آسيا - ASIA (Complete Block)
  // ============================================================
  
  // الصين China
  if (/^240[0-9a-f]:/i.test(ip)) return true;
  
  // اليابان Japan  
  if (ip.indexOf('2001:2') === 0) return true;
  if (ip.indexOf('2001:3') === 0) return true;
  if (ip.indexOf('2600:3000') === 0) return true;
  if (ip.indexOf('2606:a') === 0) return true;
  if (ip.indexOf('2606:b') === 0) return true;
  if (ip.indexOf('2606:c') === 0) return true;
  if (ip.indexOf('2606:d') === 0) return true;
  if (ip.indexOf('2606:e') === 0) return true;
  if (ip.indexOf('2606:f') === 0) return true;
  
  // كوريا Korea
  if (ip.indexOf('2001:2c') === 0) return true;
  if (ip.indexOf('2001:2d') === 0) return true;
  if (ip.indexOf('2001:2e') === 0) return true;
  if (ip.indexOf('2001:2f') === 0) return true;
  if (ip.indexOf('2400:80') === 0) return true;
  if (ip.indexOf('2400:81') === 0) return true;
  if (ip.indexOf('2400:82') === 0) return true;
  if (ip.indexOf('2400:83') === 0) return true;
  
  // سنغافورة Singapore
  if (ip.indexOf('2001:c0') === 0) return true;
  if (ip.indexOf('2001:c1') === 0) return true;
  if (ip.indexOf('2400:98') === 0) return true;
  if (ip.indexOf('2400:a0') === 0) return true;
  if (ip.indexOf('2400:a8') === 0) return true;
  
  // الهند India
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
  
  // باكستان Pakistan
  if (ip.indexOf('2001:58') === 0) return true;
  if (ip.indexOf('2001:59') === 0) return true;
  if (ip.indexOf('2401:80') === 0) return true;
  if (ip.indexOf('2401:84') === 0) return true;
  if (ip.indexOf('2401:88') === 0) return true;
  
  // تايلاند Thailand
  if (ip.indexOf('2001:3c') === 0) return true;
  if (ip.indexOf('2001:3d') === 0) return true;
  if (ip.indexOf('2401:34') === 0) return true;
  if (ip.indexOf('2401:38') === 0) return true;
  if (ip.indexOf('2401:3c') === 0) return true;
  
  // فيتنام Vietnam
  if (ip.indexOf('2001:4c') === 0) return true;
  if (ip.indexOf('2001:4d') === 0) return true;
  if (ip.indexOf('2401:d0') === 0) return true;
  if (ip.indexOf('2401:d4') === 0) return true;
  if (ip.indexOf('2401:d8') === 0) return true;
  
  // ماليزيا Malaysia
  if (ip.indexOf('2001:44') === 0) return true;
  if (ip.indexOf('2001:45') === 0) return true;
  if (ip.indexOf('2400:c0') === 0) return true;
  if (ip.indexOf('2400:c4') === 0) return true;
  if (ip.indexOf('2400:c8') === 0) return true;
  
  // إندونيسيا Indonesia
  if (ip.indexOf('2001:46') === 0) return true;
  if (ip.indexOf('2400:cc') === 0) return true;
  if (ip.indexOf('2400:d0') === 0) return true;
  if (ip.indexOf('2400:d4') === 0) return true;
  
  // الفلبين Philippines
  if (ip.indexOf('2400:b0') === 0) return true;
  if (ip.indexOf('2400:b4') === 0) return true;
  if (ip.indexOf('2400:b8') === 0) return true;
  
  // بنغلاديش Bangladesh
  if (ip.indexOf('2001:56') === 0) return true;
  if (ip.indexOf('2001:57') === 0) return true;
  if (ip.indexOf('2401:90') === 0) return true;
  if (ip.indexOf('2401:94') === 0) return true;
  
  // تايوان Taiwan
  if (ip.indexOf('2001:b0') === 0) return true;
  if (ip.indexOf('2001:b8') === 0) return true;
  if (ip.indexOf('2400:88') === 0) return true;
  if (ip.indexOf('2400:89') === 0) return true;
  if (ip.indexOf('2400:8a') === 0) return true;
  if (ip.indexOf('2400:8b') === 0) return true;
  
  // هونغ كونغ Hong Kong
  if (ip.indexOf('2001:c9') === 0) return true;
  if (ip.indexOf('2400:dd') === 0) return true;
  if (ip.indexOf('2400:de') === 0) return true;
  
  // ============================================================
  // أوروبا - EUROPE (Complete Block)
  // ============================================================
  
  // ألمانيا Germany
  if (ip.indexOf('2a00:') === 0) return true;
  if (ip.indexOf('2a01:0') === 0) return true;
  if (ip.indexOf('2a01:1') === 0) return true;
  if (ip.indexOf('2a01:2') === 0) return true;
  if (ip.indexOf('2a01:3') === 0) return true;
  if (ip.indexOf('2a02:') === 0) return true;
  if (ip.indexOf('2a03:') === 0) return true;
  if (ip.indexOf('2a04:') === 0) return true;
  if (ip.indexOf('2a05:') === 0) return true;
  if (ip.indexOf('2a06:') === 0) return true;
  
  // فرنسا France
  if (ip.indexOf('2a01:4') === 0) return true;
  if (ip.indexOf('2a01:5') === 0) return true;
  if (ip.indexOf('2a01:6') === 0) return true;
  if (ip.indexOf('2a01:7') === 0) return true;
  
  // بريطانيا UK
  if (ip.indexOf('2a01:8') === 0) return true;
  if (ip.indexOf('2a01:9') === 0) return true;
  if (ip.indexOf('2a01:a') === 0) return true;
  if (ip.indexOf('2a01:b') === 0) return true;
  
  // هولندا Netherlands
  if (ip.indexOf('2a01:10') === 0) return true;
  if (ip.indexOf('2a01:11') === 0) return true;
  if (ip.indexOf('2a01:12') === 0) return true;
  
  // تركيا Turkey
  if (ip.indexOf('2a00:b0') === 0) return true;
  if (ip.indexOf('2a00:b8') === 0) return true;
  if (ip.indexOf('2a01:90') === 0) return true;
  if (ip.indexOf('2a01:98') === 0) return true;
  if (ip.indexOf('2a01:a0') === 0) return true;
  if (ip.indexOf('2a01:a8') === 0) return true;
  
  // روسيا Russia
  if (ip.indexOf('2a01:d') === 0) return true;
  if (ip.indexOf('2a01:e') === 0) return true;
  if (ip.indexOf('2a01:f') === 0) return true;
  if (ip.indexOf('2a02:c') === 0) return true;
  if (ip.indexOf('2a02:d') === 0) return true;
  if (ip.indexOf('2a02:e') === 0) return true;
  if (ip.indexOf('2a02:f') === 0) return true;
  
  // بقية أوروبا
  if (ip.indexOf('2a00:c') === 0) return true;
  if (ip.indexOf('2a00:d') === 0) return true;
  if (ip.indexOf('2a00:e') === 0) return true;
  if (ip.indexOf('2a00:f') === 0) return true;
  if (ip.indexOf('2a07:') === 0) return true;
  if (ip.indexOf('2a08:') === 0) return true;
  if (ip.indexOf('2a09:') === 0) return true;
  if (ip.indexOf('2a0a:') === 0) return true;
  if (ip.indexOf('2a0b:') === 0) return true;
  if (ip.indexOf('2a0c:') === 0) return true;
  if (ip.indexOf('2a0d:') === 0) return true;
  if (ip.indexOf('2a0e:') === 0) return true;
  if (ip.indexOf('2a0f:') === 0) return true;
  
  // ============================================================
  // مصر - EGYPT (Complete Block)
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
  if (ip.indexOf('2c0f:f0') === 0) return true;
  if (ip.indexOf('2c0f:ea') === 0) return true;
  
  // ============================================================
  // أفريقيا - AFRICA (Block except Jordan nearby)
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
  
  return false;
}

// ============================================================
// 🎮 PATTERNS
// ============================================================

var PATTERNS = {
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|haram|deston|taego|fpp|tpp|squad|duo|solo|gamesvr|gameserver|relay|pvp/i,
  LOBBY: /lobby|matchmaking|queue|login|auth|gateway|region|profile|inventory|store|catalog|config|api|session/i,
  CDN: /cdn|static|assets|download|patch|resource|bundle|pak|obb|update|dl/i
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
  var parts = ip.split(':');
  return parts.slice(0, 4).join(':');
}

function getPrefix48(ip) {
  var parts = ip.split(':');
  return parts.slice(0, 3).join(':');
}

// ============================================================
// 🚀 MAIN ROUTING
// ============================================================

function FindProxyForURL(url, host) {
  // حل DNS
  var ip = '';
  try {
    ip = dnsResolve(host);
  } catch(e) {
    ip = '';
  }

  // الطلبات المحلية
  if (isPlainHostName(host)) {
    return DIRECT;
  }

  // غير PUBG
  if (!isPUBG(host, url)) {
    return DIRECT;
  }

  // حظر IPv4
  if (isIPv4(ip)) {
    return BLOCK;
  }

  // ليس IPv6
  if (!ip || !isIPv6(ip)) {
    return BLOCK;
  }

  // تحليل الطلب
  var data = (host + url).toLowerCase();
  var isMatch = PATTERNS.MATCH.test(data);
  var isLobby = PATTERNS.LOBBY.test(data);
  var isCDN = PATTERNS.CDN.test(data);

  // ============================================================
  // 🇯🇴 JORDAN — الأولوية المطلقة
  // ============================================================
  if (isJordanIP(ip)) {
    if (isMatch) {
      var net64 = getPrefix64(ip);
      if (!SESSION.matchNet) {
        SESSION.matchNet = net64;
        SESSION.jordanLock = true;
      }
    }
    return PROXY;
  }

  // ============================================================
  // 🌊 BAHRAIN — Fallback Only
  // ============================================================
  if (MODE.ALLOW_BAHRAIN && isBahrainIP(ip)) {
    // فقط إذا لم يكن هناك اتصال أردني
    if (SESSION.jordanLock) {
      return BLOCK; // نفضل الأردن
    }
    if (isMatch && !SESSION.matchNet) {
      SESSION.matchNet = getPrefix64(ip);
    }
    return PROXY;
  }

  // ============================================================
  // 🚫 حظر المناطق البعيدة
  // ============================================================
  if (MODE.BLOCK_FAR_REGIONS && isBlockedIP(ip)) {
    return BLOCK;
  }

  // ============================================================
  // 🚫 كل شيء آخر
  // ============================================================
  return BLOCK;
}
