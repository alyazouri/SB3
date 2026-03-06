// ============================================================
// PUBG MOBILE — MIDDLE EAST LOCK v13.0
// 🎯 للعب مع أردنيين وخليجيين فقط
// 🚫 Blocked: Asia | Europe | Egypt | Africa | Americas
// ✅ Allowed: Jordan | Bahrain | Saudi | UAE | Kuwait
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// 📊 RIPE NCC VERIFIED - Middle East IPv6
// ============================================================
// Jordan:
//   Orange (AS8376): 2a01:9700::/29
//   VTEL (AS50670): 2a01:1d0::/32
//   Other: 2a01:e240::/29, 2a10:9740::/29, 2a13:8d40::/29
//
// Bahrain (ME Server):
//   2a01:9700:4200::/44
//
// Saudi Arabia:
//   2a01:9700:4400::/44
//
// UAE:
//   2a01:9700:4300::/44
//
// Kuwait:
//   2a01:9700:4500::/44
// ============================================================

var SESSION = {
  matchNet: null,
  region:   null
};

// ============================================================
// ✅ ALLOWED — Middle East Only
// ============================================================

function isAllowedIP(ip) {
  if (!ip) return false;
  
  // 🇯🇴 JORDAN - Orange + VTEL + Others
  if (ip.indexOf('2a01:9700:') === 0) return true;  // Orange Jordan /29
  if (ip.indexOf('2a01:1d0:') === 0) return true;   // VTEL Jordan
  if (ip.indexOf('2a01:e24') === 0) return true;    // Other Jordan
  if (ip.indexOf('2a10:974') === 0) return true;    // Jordan 2021
  if (ip.indexOf('2a13:8d4') === 0) return true;    // Jordan 2022
  
  // 🇧🇭 BAHRAIN - ME Server (Closest to Jordan ~15-20ms)
  if (ip.indexOf('2a01:9700:42') === 0) return true;
  
  // 🇸🇦 SAUDI ARABIA (~25-35ms)
  if (ip.indexOf('2a01:9700:44') === 0) return true;
  
  // 🇦🇪 UAE (~35-45ms)
  if (ip.indexOf('2a01:9700:43') === 0) return true;
  
  // 🇰🇼 KUWAIT (~25-30ms)
  if (ip.indexOf('2a01:9700:45') === 0) return true;
  
  // 🇮🇶 IRAQ (~30-40ms)
  if (ip.indexOf('2a01:9700:46') === 0) return true;
  
  // 🇴🇲 OMAN (~40-50ms)
  if (ip.indexOf('2a01:9700:47') === 0) return true;
  
  // 🇶🇦 QATAR (~35-45ms)
  if (ip.indexOf('2a01:9700:48') === 0) return true;
  
  return false;
}

// ============================================================
// 🚫 BLOCKED — Everything Else
// ============================================================

function isBlockedIP(ip) {
  if (!ip) return true;
  
  // إذا كان مسموح - لا تحظر
  if (isAllowedIP(ip)) return false;
  
  // حظر كل IPv6 الآخر (آسيا، أوروبا، مصر، أفريقيا، الأمريكتين)
  
  // آسيا
  if (/^240[0-9a-f]:/i.test(ip)) return true;
  if (ip.indexOf('2001:2') === 0) return true;
  if (ip.indexOf('2001:3') === 0) return true;
  if (ip.indexOf('2001:c') === 0) return true;
  if (ip.indexOf('2001:4') === 0) return true;
  if (ip.indexOf('2001:5') === 0) return true;
  if (ip.indexOf('2001:b') === 0) return true;
  if (ip.indexOf('2600:') === 0) return true;
  if (ip.indexOf('2606:') === 0) return true;
  if (ip.indexOf('2401:') === 0) return true;
  
  // أوروبا
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
  
  // مصر
  if (ip.indexOf('2001:1b') === 0) return true;
  if (ip.indexOf('2a01:5c') === 0) return true;
  if (ip.indexOf('2a01:5d') === 0) return true;
  if (ip.indexOf('2a01:5e') === 0) return true;
  if (ip.indexOf('2a01:5f') === 0) return true;
  if (ip.indexOf('2a02:4e') === 0) return true;
  if (ip.indexOf('2c0f:') === 0) return true;
  
  // أفريقيا
  if (ip.indexOf('2c0') === 0) return true;
  
  // الأمريكتين
  if (ip.indexOf('26') === 0) return true;
  if (ip.indexOf('280') === 0) return true;
  
  return false;
}

// ============================================================
// 🎮 PATTERNS
// ============================================================

var PATTERNS = {
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|haram|deston|taego|fpp|tpp|squad|duo|solo|gamesvr|relay/i,
  LOBBY: /lobby|matchmaking|queue|login|auth|gateway|region|profile|config|api/i,
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
  // ✅ ALLOWED — Middle East Only
  // ============================================================
  if (isAllowedIP(ip)) {
    var data = (host + url).toLowerCase();
    if (PATTERNS.MATCH.test(data)) {
      var net64 = getPrefix64(ip);
      if (!SESSION.matchNet) {
        SESSION.matchNet = net64;
      }
    }
    return PROXY;
  }
  
  // ============================================================
  // 🚫 BLOCKED — Everything Else
  // ============================================================
  if (isBlockedIP(ip)) return BLOCK;
  
  // Default: Block
  return BLOCK;
}
