// ============================================================
// PUBG MOBILE — JORDAN ONLY v15.0
// 🇯🇴 للتواصل مع أردنيين فقط
// ✅ Orange Jordan IPv6: 2a01:9700::/29
// ✅ VTEL Jordan: 2a01:1d0::/32
// 🚫 كل شيء خارج الأردن = محظور
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// 🇯🇴 JORDAN IPv6 — ALL ALLOCATIONS
// ============================================================
// من RIPE NCC - موثقة 100%
//
// Orange Jordan (AS8376): 2a01:9700::/29
// هذا يشمل: 2a01:9700:0000 - 2a01:9700:7FFF
// كل هيدا أردني!
//
// VTEL Jordan (AS50670): 2a01:1d0::/32
//
// Other Jordan: 2a01:e240::/29
//               2a10:9740::/29
//               2a13:8d40::/29
// ============================================================

// ============================================================
// 🔍 فحص IP أردني
// ============================================================

function isJordanIP(ip) {
  if (!ip) return false;
  
  // 🟠 Orange Jordan - AS8376
  // النطاق الكامل: 2a01:9700::/29
  // يشمل كل شي يبدأ بـ 2a01:9700:0xxx إلى 2a01:9700:7xxx
  if (ip.indexOf('2a01:9700:') === 0) {
    return true;
  }
  
  // 📡 VTEL Jordan - AS50670
  if (ip.indexOf('2a01:1d0:') === 0) {
    return true;
  }
  
  // 🌐 Other Jordan ISPs
  // 2a01:e240::/29
  if (ip.indexOf('2a01:e240:') === 0) return true;
  if (ip.indexOf('2a01:e241:') === 0) return true;
  if (ip.indexOf('2a01:e242:') === 0) return true;
  if (ip.indexOf('2a01:e243:') === 0) return true;
  if (ip.indexOf('2a01:e244:') === 0) return true;
  if (ip.indexOf('2a01:e245:') === 0) return true;
  if (ip.indexOf('2a01:e246:') === 0) return true;
  if (ip.indexOf('2a01:e247:') === 0) return true;
  
  // 2a10:9740::/29
  if (ip.indexOf('2a10:9740:') === 0) return true;
  if (ip.indexOf('2a10:9741:') === 0) return true;
  if (ip.indexOf('2a10:9742:') === 0) return true;
  if (ip.indexOf('2a10:9743:') === 0) return true;
  if (ip.indexOf('2a10:9744:') === 0) return true;
  if (ip.indexOf('2a10:9745:') === 0) return true;
  if (ip.indexOf('2a10:9746:') === 0) return true;
  if (ip.indexOf('2a10:9747:') === 0) return true;
  
  // 2a13:8d40::/29
  if (ip.indexOf('2a13:8d40:') === 0) return true;
  if (ip.indexOf('2a13:8d41:') === 0) return true;
  if (ip.indexOf('2a13:8d42:') === 0) return true;
  if (ip.indexOf('2a13:8d43:') === 0) return true;
  if (ip.indexOf('2a13:8d44:') === 0) return true;
  if (ip.indexOf('2a13:8d45:') === 0) return true;
  if (ip.indexOf('2a13:8d46:') === 0) return true;
  if (ip.indexOf('2a13:8d47:') === 0) return true;
  
  return false;
}

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
  // 🇯🇴 JORDAN ONLY — أردني فقط
  // ============================================================
  if (isJordanIP(ip)) {
    return PROXY;
  }
  
  // ============================================================
  // 🚫 كل شيء غير أردني = محظور
  // ============================================================
  return BLOCK;
}
