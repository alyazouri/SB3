// ============================================================
// PUBG JORDAN ULTIMATE LOCK SCRIPT - Tier3
// Pure Jordan + All Game Modes + All Domains
// Prevents any traffic outside Jordan for PUBG
// Compatible / Old Engine Friendly
// ============================================================

// ⚠️ ضع هنا أفضل بروكسي أردني حقيقي (يجب أن يكون IP أردني)
var JORDAN_PROXY = "PROXY 194.165.133.85:443"; // استبدله بالبروكسي الأردني
var DIRECT = "DIRECT";
var BLOCK = "PROXY 127.0.0.1:1";

// ============================================================
// قائمة النطاقات الأردنية IPv6 (تحديث كامل)
// ============================================================
var JORDAN_V6_CIDRS = [
  "2a00:18d0::/32",
  "2a00:18d8::/29",
  "2a0d:3344:37c0::/43",
  "2a0d:3344:37e0::/44",
  "2a0d:3344:37f0::/46",
  "2a0d:3344:37f4::/48",
  "2a0d:3344:37f6::/47",
  "2a0d:3344:37f8::/45",
  "2a0d:3344:37c0::/42"
];

// ============================================================
// متغيرات الجلسة
// ============================================================
var SESSION = {
  lobby: "",
  match: "",
  active: false
};

// ============================================================
// دوال مساعدة
// ============================================================
function strStartsWith(s, prefix) {
  if (!s || !prefix) return false;
  return s.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase();
}

function safeLower(s) {
  if (!s) return "";
  return ("" + s).toLowerCase();
}

function isIPv6(ip) {
  return ip && ip.indexOf(":") != -1;
}

function isIPv4(ip) {
  return ip && ip.indexOf(".") != -1;
}

function expandIPv6(address) {
  if (!address || address.indexOf(":") == -1)
    return address;

  var parts = address.split("::");
  var left = [];
  var right = [];
  var full = [];
  var i, missing;

  if (parts.length == 2) {
    if (parts[0] !== "") left = parts[0].split(":");
    if (parts[1] !== "") right = parts[1].split(":");
    missing = 8 - (left.length + right.length);
    for (i = 0; i < left.length; i++) full.push(left[i]);
    for (i = 0; i < missing; i++) full.push("0000");
    for (i = 0; i < right.length; i++) full.push(right[i]);
  } else {
    full = address.split(":");
  }

  for (i = 0; i < full.length; i++) {
    if (full[i] === "") full[i] = "0000";
    while (full[i].length < 4) full[i] = "0" + full[i];
  }

  return full.join(":").toLowerCase();
}

function hexNibbleToBin(ch) {
  ch = safeLower(ch);
  if (ch == "0") return "0000";
  if (ch == "1") return "0001";
  if (ch == "2") return "0010";
  if (ch == "3") return "0011";
  if (ch == "4") return "0100";
  if (ch == "5") return "0101";
  if (ch == "6") return "0110";
  if (ch == "7") return "0111";
  if (ch == "8") return "1000";
  if (ch == "9") return "1001";
  if (ch == "a") return "1010";
  if (ch == "b") return "1011";
  if (ch == "c") return "1100";
  if (ch == "d") return "1101";
  if (ch == "e") return "1110";
  if (ch == "f") return "1111";
  return "";
}

function ipv6ToBinary(ip) {
  var full = expandIPv6(ip);
  var hex = full.split(":").join("");
  var out = "";
  for (var i = 0; i < hex.length; i++) {
    out += hexNibbleToBin(hex.charAt(i));
  }
  return out;
}

function matchIPv6CIDR(ip, cidr) {
  if (!isIPv6(ip) || !cidr) return false;
  var p = cidr.indexOf("/");
  if (p == -1) return false;

  var net = cidr.substring(0, p);
  var bits = parseInt(cidr.substring(p + 1), 10);
  if (isNaN(bits) || bits < 0 || bits > 128) return false;

  var ipBin = ipv6ToBinary(ip);
  var netBin = ipv6ToBinary(net);
  return ipBin.substring(0, bits) == netBin.substring(0, bits);
}

function isJordanIPv6(ip) {
  if (!isIPv6(ip)) return false;
  for (var i = 0; i < JORDAN_V6_CIDRS.length; i++) {
    if (matchIPv6CIDR(ip, JORDAN_V6_CIDRS[i])) return true;
  }
  return false;
}

function isClearlyForeignIPv6(ip) {
  if (!isIPv6(ip)) return false;
  if (isJordanIPv6(ip)) return false;
  ip = safeLower(ip);
  return (
    strStartsWith(ip, "240") ||
    strStartsWith(ip, "241") ||
    strStartsWith(ip, "242") ||
    strStartsWith(ip, "260") ||
    strStartsWith(ip, "280") ||
    strStartsWith(ip, "2c")
  );
}

function classifyIP(ip) {
  if (!ip || ip === "") return "UNKNOWN";
  if (isIPv6(ip)) {
    if (isJordanIPv6(ip)) return "JORDAN_HOME_V6";
    if (isClearlyForeignIPv6(ip)) return "FOREIGN_V6";
    return "OTHER_V6";
  }
  if (isIPv4(ip)) return "IPV4";
  return "UNKNOWN";
}

// ============================================================
// كشف دومينات PUBG الشامل (يشمل جميع المودات والخدمات)
// ============================================================
function isPUBG(host) {
  host = safeLower(host);
  var keywords = [
    "pubg", "pubgm", "battlegrounds", "bgmi", "krafton",
    "tencent", "levelinfinite", "lightspeed", "cros", "ies",
    "gcloud", "qcloud", "anticheatexpert", "tpns", "tgpa",
    "intlgame", "ace", "mihoyo", "global", "kr", "jp",
    "na", "eu", "samsung", "galaxy", "garena", "vng"
  ];
  for (var i = 0; i < keywords.length; i++) {
    if (host.indexOf(keywords[i]) != -1) return true;
  }
  // نطاقات صريحة لألعاب PUBG
  if (host.indexOf("pubg.com") != -1) return true;
  if (host.indexOf("pubgmobile.com") != -1) return true;
  if (host.indexOf("battlegroundsmobile.com") != -1) return true;
  if (host.indexOf("bgmi.com") != -1) return true;
  if (host.indexOf("krafton.com") != -1) return true;
  if (host.indexOf("tencentgames.com") != -1) return true;
  if (host.indexOf("levelinfinite.com") != -1) return true;
  if (host.indexOf("lightspeed.com") != -1) return true;
  if (host.indexOf("intlgame.com") != -1) return true;
  if (host.indexOf("gcloud.com") != -1) return true;
  if (host.indexOf("qcloud.com") != -1) return true;
  if (host.indexOf("anticheatexpert.com") != -1) return true;
  if (host.indexOf("tpns.com") != -1) return true;
  if (host.indexOf("tgpa.com") != -1) return true;
  if (host.indexOf("ace.com") != -1) return true;
  return false;
}

// ============================================================
// كشف اللوبي والماتش مع كل المودات
// ============================================================
function isLobby(data) {
  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download|news|notice|maintenance|account|user|avatar|badge|season|pass|rank|tier|score|reward|gift|mail|chat|clan|clanwar|competition|tournament|leaderboard|activity|daily|weekly|achievement|title|frame|skin|emote|spray|outfit|parachute|backpack|helmet|vest|weapon|attachment|consumable|crate|lucky|spin|lottery|exchange|redeem|invite|social|facebook|google|twitter|line|vk|qq|wechat|apple|gamecenter|steam|epic|discord|twitch|youtube/i.test(data);
}

function isMatch(data) {
  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|survival|spectate|training|practice|custom|room|quick|sniper|rush|assault|domination|infection|vs|team|deathmatch|gun|game|play|start|join|create|enter|loading|ingame|gamesvr|relay|combat|field|drop|plane|parachute|zone|circle|bluezone|redzone|airdrop|flare|revive|respawn|knock|kill|win|lose|result|summary|replay|highlight|killcam|deathcam|reconnect|host|migration|server|net|ping|lag|sync|replication|physics|animation|sound|voice|chat|party|squad|duo|solo|auto|fill|invite|friend|clan/i.test(data);
}

// ============================================================
// تقسيم الشبكة
// ============================================================
function getNet4(ip) {
  if (!isIPv6(ip)) return "";
  return ip.split(":").slice(0, 3).join(":");
}

function getNet5(ip) {
  if (!isIPv6(ip)) return "";
  return ip.split(":").slice(0, 4).join(":");
}

// ============================================================
// التحكم بالجلسة
// ============================================================
function resetMatchSession() {
  SESSION.match = "";
  SESSION.active = false;
}

function rememberLobby(net4) {
  if (SESSION.lobby === "") SESSION.lobby = net4;
}

function rememberMatch(net5) {
  if (SESSION.match === "") {
    SESSION.match = net5;
    SESSION.active = true;
  }
}

// ============================================================
// المحرك الرئيسي
// ============================================================
function FindProxyForURL(url, host) {
  var ip = "";
  var fullIP = "";
  var cls = "";
  var data = "";
  var lobby = false;
  var match = false;
  var net4 = "";
  var net5 = "";

  // تجاهل الأسماء المحلية
  if (isPlainHostName(host)) return DIRECT;

  // إذا لم يكن دومين PUBG -> DIRECT (لا نتدخل في بقية النت)
  if (!isPUBG(host)) return DIRECT;

  // حل الـ DNS
  try {
    ip = dnsResolve(host);
  } catch (e) {
    ip = "";
  }

  // فشل DNS -> حجب
  if (!ip || ip === "") return BLOCK;

  fullIP = ip;
  if (isIPv6(ip)) fullIP = expandIPv6(ip);

  cls = classifyIP(fullIP);

  // ===== قفل صارم: فقط IPv6 أردني منزلي =====
  if (cls == "FOREIGN_V6") return BLOCK;
  if (cls == "OTHER_V6") return BLOCK;
  if (cls == "IPV4") return BLOCK;   // IPv4 ممنوع نهائياً لمنع التسريب
  if (cls == "UNKNOWN") return BLOCK;

  // من هنا: العنوان Jordan Home IPv6
  data = safeLower(host + url);
  lobby = isLobby(data);
  match = isMatch(data);

  net4 = getNet4(fullIP);
  net5 = getNet5(fullIP);

  // إعادة تعيين قفل الماتش إذا انتهى
  if (!match && SESSION.active) resetMatchSession();

  // قفل اللوبي على /48
  if (lobby) {
    rememberLobby(net4);
    if (SESSION.lobby !== "" && net4 != SESSION.lobby) return BLOCK;
    return JORDAN_PROXY;
  }

  // قفل الماتش على /64
  if (match) {
    rememberMatch(net5);
    if (SESSION.match !== "" && net5 != SESSION.match) return BLOCK;
    return JORDAN_PROXY;
  }

  // أي حركة PUBG أخرى (خدمات، تحديثات، إلخ) تمر عبر البروكسي الأردني
  return JORDAN_PROXY;
}
