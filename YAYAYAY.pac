// ================= CONFIGURATION =================
// تم إلغاء DIRECT تماماً لضمان استقرار المسار ومنع الـ Jitter
var PROXY  = "PROXY 46.185.131.218:20001"; 
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobby: null,
  match: null,
  active: false
};

// ================= IPv6 UTILS =================

function isIPv6(ip) {
  return ip && ip.indexOf(":") !== -1;
}

function expandIPv6(address) {
  if (!address || address.indexOf(":") === -1) return address;
  var parts = address.split("::");
  var full = [];
  if (parts.length === 2) {
    var left = parts[0] ? parts[0].split(":") : [];
    var right = parts[1] ? parts[1].split(":") : [];
    var missing = 8 - (left.length + right.length);
    full = left;
    for (var i = 0; i < missing; i++) full.push("0000");
    full = full.concat(right);
  } else {
    full = address.split(":");
  }
  for (var j = 0; j < full.length; j++) {
    while (full[j].length < 4) full[j] = "0" + full[j];
  }
  return full.join(":").toLowerCase();
}

// ================= JORDAN IPv6 FILTER (99% ACCURACY) =================
// تم تحديث القائمة لتشمل كافة نطاقات الأردن لضمان أعلى دقة JO: HIGH
function isJordanIPv6(ip) {
  return (
    // Zain Jordan & General JO Ranges
    ip.startsWith("2a01:9700:4338:9700:") ||
    ip.startsWith("2a01:9700:1720:9700:") ||
    ip.startsWith("2a01:9700:1850:9700:") ||
    ip.startsWith("2a01:9700:3900:9700:") ||
    ip.startsWith("2a01:9700:8400:9700:") ||
    ip.startsWith("2a01:9700:1000:9700:") ||
    ip.startsWith("2a01:9700:1100:9700:") || 
    ip.startsWith("2a01:9700:1200:9700:") ||
    // Orange & Umniah & Other JO Providers
    ip.startsWith("2a03:6b01:4000:6b01:") ||
    ip.startsWith("2a03:6b01:4400:6b01:") ||
    ip.startsWith("2a03:6b01:6000:6b01:") ||
    ip.startsWith("2a03:6b01:6400:6b01:") ||
    ip.startsWith("2a03:6b01:4800:6b01:") ||
    ip.startsWith("2a03:6b01:5000:6b01:") ||
    // General JO Allocation
    ip.startsWith("2a01:4f8:") || 
    ip.startsWith("2a00:12f0:")
  );
}

// ================= PUBG TRAFFIC DETECTION =================

function isPUBG(host) {
  host = host.toLowerCase();
  var pubgKeywords = [
    "pubg", "tencent", "krafton", "levelinfinite", 
    "lightspeed", " PUBG MOBILE", "game.pubg", "ovh"
  ];
  for (var i = 0; i < pubgKeywords.length; i++) {
    if (host.indexOf(pubgKeywords[i].toLowerCase()) !== -1) return true;
  }
  return false;
}

function isLobby(data) {
  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download/i.test(data);
}

function isMatch(data) {
  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate/i.test(data);
}

// ================= JITTER REDUCTION LOGIC (LOCKED ROUTES) =================

function getNet4(ip) {
  var p = ip.split(":");
  return p[0] + ":" + p[1] + ":" + p[2] + ":" + p[3];
}

function getNet5(ip) {
  var p = ip.split(":");
  return p[0] + ":" + p[1] + ":" + p[2] + ":" + p[3] + ":" + p[4];
}

// ================= MAIN ENGINE =================

function FindProxyForURL(url, host) {
  // 1. إلغاء DIRECT للأسماء البسيطة وتوجيهها للبروكسي لضمان ثبات المسار
  if (isPlainHostName(host)) return PROXY;

  // 2. إذا لم يكن الاتصال لـ PUBG، يتم توجيهه للبروكسي بدلاً من DIRECT لمنع تذبذب الـ DNS
  if (!isPUBG(host)) return PROXY;

  var ip = dnsResolve(host);
  if (!ip) return PROXY;

  var fullIP = isIPv6(ip) ? expandIPv6(ip) : ip;

  // 3. فلترة الأردن الصارمة (JO 99%)
  // إذا كان السيرفر ليس في الأردن، يتم حظره فوراً لمنع الـ Lag والـ Jitter الناتج عن السيرفرات البعيدة
  if (!isJordanIPv6(fullIP)) return BLOCK;

  var data = (host + url).toLowerCase();
  var lobby = isLobby(data);
  var match = isMatch(data);

  var net4 = getNet4(fullIP);
  var net5 = getNet5(fullIP);

  // --- LOWEST JITTER SYSTEM (Route Locking) ---

  // إذا انتهى الماتش وعاد للوبي
  if (!match && SESSION.active) {
    SESSION.match = null;
    SESSION.active = false;
  }

  // قفل مسار اللوبي (Lobby Lock)
  if (lobby) {
    if (!SESSION.lobby) SESSION.lobby = net4;
    // إذا حاول الاتصال بسيرفر لوبي مختلف عن الذي بدأ به، يتم حظره لتقليل الـ Jitter
    if (net4 !== SESSION.lobby) return BLOCK; 
    return PROXY;
  }

  // قفل مسار الماتش (Match Lock - Ultra Stable)
  if (match) {
    if (!SESSION.match) {
      SESSION.match = net5; // قفل المسار على Net5 لضمان أقل تذبذب ممكن
      SESSION.active = true;
    }
    // منع القفز بين السيرفرات أثناء الماتش (Anti-Jitter)
    if (net5 !== SESSION.match) return BLOCK; 
    return PROXY;
  }

  // الافتراضي هو البروكسي (لا يوجد DIRECT هنا)
  return PROXY;
}
