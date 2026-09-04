// =====================================================================
//  PUBG MOBILE — Jordan Only (Match / TDM / Arena / All Modes)
//  يثبّت كل حركة الماتش على سيرفرات أردنية + بروكسي أردني
// =====================================================================

// ================= PROXIES =================
var MATCH_JO = "PROXY 46.185.131.218:20001";   // بروكسي الماتش الأردني

var LOBBY_POOL = [
  "PROXY 212.35.66.45:8085",
  "PROXY 212.35.66.45:8181",
  "PROXY 46.185.131.218:443"
];

var BLOCK  = "PROXY 127.0.0.1:9";  // تجاهل/حجب (ثقب أسود)
var DIRECT = "DIRECT";

// ================= JORDAN MATCH (STRONG - IN-GAME) =================
var JORDAN_MATCH_IPV4 = [
  ["46.185.128.0", "255.255.128.0"],
  ["77.245.0.0",   "255.255.240.0"],
  ["79.134.128.0", "255.255.224.0"],
  ["79.173.192.0", "255.255.192.0"],
  ["80.90.160.0",  "255.255.240.0"],
  ["149.200.128.0","255.255.128.0"],
  ["185.131.216.0","255.255.252.0"],
  ["5.23.0.0",     "255.255.0.0"]
];

// ================= JORDAN WIDE (LOBBY / SOCIAL) =================
var JORDAN_WIDE_IPV4 = [
  // Zain Jordan
  ["46.32.0.0", "255.224.0.0"], ["79.134.128.0", "255.255.128.0"],
  ["176.29.0.0", "255.255.0.0"], ["77.245.0.0", "255.255.0.0"],
  ["178.77.0.0", "255.255.0.0"], ["185.86.0.0", "255.255.0.0"],

  // Orange Jordan
  ["62.72.0.0", "255.255.0.0"], ["37.202.0.0", "255.255.0.0"],
  ["85.159.0.0", "255.255.0.0"], ["93.93.0.0", "255.255.0.0"],
  ["93.95.0.0", "255.255.0.0"], ["37.252.0.0", "255.255.0.0"],
  ["94.127.0.0", "255.255.0.0"], ["31.14.0.0", "255.255.0.0"],
  ["195.94.0.0", "255.255.0.0"],

  // Umniah
  ["212.34.0.0", "255.255.0.0"], ["213.139.64.0", "255.255.192.0"],
  ["176.57.0.0", "255.255.0.0"], ["188.123.0.0", "255.255.0.0"],
  ["188.247.0.0", "255.255.0.0"], ["5.23.0.0", "255.255.0.0"],
  ["109.224.0.0", "255.255.0.0"],

  // Jordan Data / Hosting
  ["193.188.64.0", "255.255.224.0"], ["149.200.0.0", "255.255.0.0"],
  ["185.131.216.0", "255.255.252.0"], ["185.170.164.0", "255.255.252.0"]
];

// ================= BLACKLIST =================
var GEO_BLACKLIST = [
  ["5.136.0.0", "255.248.0.0"], ["31.128.0.0", "255.192.0.0"],
  ["46.16.0.0", "255.240.0.0"], ["95.24.0.0", "255.248.0.0"],
  ["178.64.0.0", "255.192.0.0"], ["36.0.0.0", "255.0.0.0"],
  ["39.0.0.0", "255.0.0.0"], ["42.0.0.0", "255.0.0.0"],
  ["49.0.0.0", "255.0.0.0"], ["58.0.0.0", "255.0.0.0"],
  ["59.0.0.0", "255.0.0.0"], ["60.0.0.0", "255.0.0.0"],
  ["1.0.0.0", "255.255.255.0"], ["14.0.0.0", "255.0.0.0"],
  ["27.0.0.0", "255.0.0.0"]
];

// ================= SESSION =================
var SESSION = {
  matchNet: null,     // شبكة /24 المثبّتة للماتش
  dnsCache: {}
};

// ================= HELPERS =================
function norm(h){
  if (!h) return "";
  h = String(h).toLowerCase();
  // IPv6 بين قوسين
  if (h.charAt(0) === "[") {
    var j = h.indexOf("]");
    if (j > -1) h = h.substring(1, j);
  } else {
    // شيل البورت
    var i = h.indexOf(":");
    if (i > -1) h = h.substring(0, i);
  }
  return h;
}

function isInList(ip, list){
  if (!ip || ip.indexOf(":") > -1) return false; // نتجاهل IPv6
  for (var i = 0; i < list.length; i++){
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}

function resolvePinned(host){
  if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
  var ip = null;
  // بعض المحركات بتدعم dnsResolveEx (بترجع كل الـ IPs)
  try {
    if (typeof dnsResolveEx === "function") {
      var arr = dnsResolveEx(host);
      if (arr && arr.length) ip = arr[0];
    }
  } catch (e) {}
  if (!ip) { try { ip = dnsResolve(host); } catch (e) {} }
  if (ip) SESSION.dnsCache[host] = ip;
  return ip;
}

function pickLobbyProxy(host){
  var h = 0;
  for (var i = 0; i < host.length; i++)
    h = (h + host.charCodeAt(i)) % LOBBY_POOL.length;
  return LOBBY_POOL[h];
}

// ================= UNIVERSAL PUBG DETECTION =================
function isPUBG(h){
  return /pubg|bgmi|tencent|krafton|bluehole|levelinfinite|lightspeed|igamecj|yuanlin|anticheatexpert|gtimg|idqqimg|qcloud|myqcloud|gcloud|wegame/i.test(h);
}

// ================= TRAFFIC CLASSIFICATION =================
// مهم جداً: استخدمنا \b عشان:
//  1) كلمة "match" ما تلتقط "matchmaking" (كانت تتبلّع كأنها ماتش وتنحجب)
//  2) كلمة "game" ما تلتقط "igamecj" (كان كل دومين igamecj يتحسب ماتش)
function isMatch(u,h){
  return /\bmatch\b|\bbattle\b|\bgame\b|combat|realtime|sync|tick|\broom\b|gameplay|\barena\b|\btdm\b|erangel|miramar|sanhok|vikendi|karakin|livik|nusa|ronta|alien|payload|udp/i.test(u + h);
}

function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|login|auth|season|event|shop|store|inventory|loadout|mission|task|rank|recruit/i.test(u + h);
}

function isSocial(u,h){
  return /friend|invite|squad|team|party|clan|presence|social|voice|chat|mic|audio/i.test(u + h);
}

function isCDN(u,h){
  return /cdn|asset|resource|patch|update|media|content|download|hotfix|res|skin|model|texture|sound/i.test(u + h);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {
  host = norm(host);

  // غير ببجي → مباشر
  if (!isPUBG(host)) return DIRECT;

  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":") > -1) return BLOCK;

  // حجب جغرافي صارم
  if (isInList(ip, GEO_BLACKLIST)) return BLOCK;

  // حركة الماتش (كل المودات: كلاسيك / TDM / أرينا / بايلود ...)
  if (isMatch(url, host)) {
    if (!isInList(ip, JORDAN_MATCH_IPV4)) return BLOCK;

    var p = ip.split(".");
    var net24 = p[0] + "." + p[1] + "." + p[2] + ".0";

    // أول اتصال ماتش يثبّت الشبكة، وكل اللي بعده لازم يكون منها
    if (!SESSION.matchNet) SESSION.matchNet = net24;
    if (net24 !== SESSION.matchNet) return BLOCK;

    return MATCH_JO;
  }

  // (اختياري) فك التثبيت عند بداية طابور جديد — فعّله بس إذا حسّيت إنه
  // الملف معلّقك على سيرفر فاضي وما عم تلاقي ماتش
  // if (/matchmaking|queue|recruit/i.test(url + host)) SESSION.matchNet = null;

  // اللوبي والسوشال والـ CDN
  if (isLobby(url, host) || isSocial(url, host) || isCDN(url, host)) {
    if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
    return pickLobbyProxy(host);
  }

  // أي شيء ثاني تابع لببجي
  return pickLobbyProxy(host);
}
