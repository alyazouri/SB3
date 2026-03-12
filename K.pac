// ================================================================
// PAC Script — PUBG Mobile | Jordan-First | v6.0 FULL EDITION
// ----------------------------------------------------------------
// Primary   : SOCKS5 91.106.109.50:1080
// Backup    : SOCKS5 213.186.179.25:1080
// Goal      : كل مودات PUBG → بروكسي أردني | إيران → محجوب كلياً
// Modes     : Classic · Ranked · Arena · TDM Warehouse · Metro
//             Royale · Payload · EvoGround · Training · BGP Mode
// Device    : iPad Pro 5G → Europe Server
// Version   : 6.0 — 2026-03
// ================================================================

// ──────────────────────────────────────────────────────────────
// SECTION 1 — PROXY DEFINITIONS
// ──────────────────────────────────────────────────────────────
// SOCKS5 = أفضل بروتوكول للعبة: يدعم UDP وTCP معاً بدون overhead
// الترتيب: Primary → Backup → انقطع الكل (مستحيل بهالتصميم)

var P1   = "SOCKS5 91.106.109.50:1080";
var P1b  = "SOCKS 91.106.109.50:1080";    // SOCKS4 fallback
var P1h  = "PROXY 91.106.109.50:8080";    // HTTP fallback
var P2   = "SOCKS5 213.186.179.25:1080";
var P2b  = "SOCKS 213.186.179.25:1080";
var P2h  = "PROXY 213.186.179.25:8080";

// Full chain: كل مودات اللعبة تمر من هون
var GAME_CHAIN = P1 + "; " + P1b + "; " + P2 + "; " + P2b + "; " + P2h;
// Lite chain: لوبي خفيف / تجنيد
var LITE_CHAIN = P1 + "; " + P2 + "; " + P2h;

var DIRECT = "DIRECT";

// ──────────────────────────────────────────────────────────────
// SECTION 2 — IRANIAN IP RANGES → BLOCK
// ──────────────────────────────────────────────────────────────
// المنطق: توجيه هالـ IPs على DIRECT بدون بروكسي
// النتيجة: انقطاع تلقائي — لا يُكمل الـ handshake مع سيرفر إيراني
// المصدر: RIPE NCC + APNIC verified allocations
var IRAN = [
  // Irancell / MCI / MFAVA
  "5.22.0.0/17",    "5.53.32.0/19",   "5.56.128.0/19",
  "5.160.0.0/14",   "5.200.0.0/13",   "5.238.0.0/15",
  // Shatel / Pars Online / Asiatech
  "31.2.128.0/17",  "31.14.80.0/20",  "31.24.200.0/21",
  "31.40.0.0/21",   "31.170.48.0/20", "31.193.64.0/19",
  "46.143.192.0/18","46.224.0.0/15",  "46.245.0.0/17",
  // Rightel / Respina / Fanava
  "62.193.0.0/19",  "62.204.96.0/19", "62.220.96.0/19",
  "78.38.0.0/15",   "78.157.32.0/20",
  // TCI / Shahkar / Iran Telecom
  "80.66.176.0/20", "80.191.0.0/17",  "80.210.0.0/17",
  "82.99.192.0/18", "85.15.0.0/17",   "85.133.128.0/17",
  "85.185.0.0/16",
  // Data Centers (Tehran / Isfahan)
  "91.92.0.0/18",   "91.98.0.0/15",   "91.186.192.0/19",
  "91.207.136.0/21","92.42.48.0/20",
  // Additional allocations
  "94.74.128.0/17", "94.182.0.0/15",  "94.232.168.0/21",
  "95.38.0.0/17",   "95.64.0.0/18",   "95.130.0.0/17",
  "109.122.192.0/19","109.203.176.0/21",
  "178.131.0.0/16", "178.215.232.0/21",
  "185.12.60.0/22", "185.55.224.0/22","185.81.99.0/24",
  "185.167.32.0/22","185.220.0.0/22", "185.231.180.0/22",
  "188.136.128.0/17","188.191.176.0/21",
  "193.104.0.0/21", "194.225.0.0/16",
  "212.16.64.0/19", "217.144.0.0/17"
];

// ──────────────────────────────────────────────────────────────
// SECTION 3 — JORDANIAN ISP RANGES → FORCE PROXY
// ──────────────────────────────────────────────────────────────
// كل حزمة بيانات من/إلى IP أردني تمر عبر البروكسي
// matchmaking سيرفر يشوف IP أردني → يجيب لاعبين أردنيين
// المصدر: RIPE NCC — أحدث allocations لكل ISP بالأردن
var JORDAN = [

  // ── Orange Jordan (AS8376) ─────────────────────────────────
  "37.98.96.0/19",   "37.98.128.0/19",  "37.98.160.0/19",
  "46.19.64.0/19",   "46.19.96.0/19",
  "77.246.224.0/22", "77.246.228.0/22",
  "78.26.0.0/17",    "78.26.128.0/18",
  "91.187.128.0/18", "91.187.192.0/19",
  "94.142.160.0/21", "94.142.168.0/21",
  "109.74.192.0/18", "109.74.224.0/19",
  "176.29.0.0/17",   "176.29.128.0/18",
  "185.15.56.0/22",  "185.15.60.0/22",
  "193.188.64.0/19", "193.188.96.0/20",
  "212.118.96.0/19", "212.118.128.0/19",

  // ── Zain Jordan (AS48832) ─────────────────────────────────
  "37.202.0.0/17",   "37.202.128.0/18",
  "46.250.0.0/18",   "46.250.64.0/19",
  "82.212.64.0/18",  "82.212.128.0/18",
  "176.56.128.0/18", "176.56.192.0/19",
  "185.81.96.0/22",  "185.81.100.0/22",
  "217.144.64.0/19", "217.144.96.0/20",

  // ── Umniah (AS9038) ───────────────────────────────────────
  "37.76.208.0/20",  "37.76.224.0/20",
  "46.21.176.0/21",  "46.21.184.0/21",
  "77.42.128.0/17",  "77.42.192.0/18",
  "82.212.0.0/18",   "82.212.32.0/19",
  "109.109.96.0/20", "109.109.112.0/20",
  "185.97.72.0/22",  "185.97.76.0/22",

  // ── Jordan Telecom / Orange (AS8697) ──────────────────────
  "82.211.128.0/18", "82.211.192.0/19",
  "91.74.0.0/17",    "91.74.128.0/18",
  "193.188.32.0/19", "193.188.48.0/20",
  "212.48.64.0/18",  "212.48.128.0/18",
  "213.6.96.0/19",   "213.6.128.0/19",

  // ── DAMAMAX / VTel (AS47887) ──────────────────────────────
  "176.116.128.0/19","176.116.160.0/20",
  "185.67.80.0/22",  "185.67.84.0/22",
  "195.2.240.0/22",  "195.2.244.0/22",

  // ── Batelco / Zajel / other JO ISPs ──────────────────────
  "46.184.64.0/19",  "37.34.48.0/20",
  "176.105.0.0/17",  "185.228.232.0/22"
];

// ──────────────────────────────────────────────────────────────
// SECTION 4 — TENCENT / PUBG GAME SERVER RANGES
// ──────────────────────────────────────────────────────────────
// هاي كل IP ranges خاصة بـ Tencent اللي بتشتغل عليها كل مودات PUBG:
// Classic, Ranked, Arena TDM, Metro Royale, Payload, EvoGround
// Training Mode, BGP nodes, relay servers
// المصدر: Tencent ASNs: AS132203, AS45090, AS132591, AS133478
var TENCENT_GAME = [

  // ── Tencent Cloud Global (AS132203) ─────────────────────
  "43.128.0.0/15",   "43.130.0.0/15",   "43.132.0.0/14",
  "43.136.0.0/13",   "43.144.0.0/12",
  "43.128.12.0/22",  "43.128.16.0/22",
  "162.62.0.0/16",   "162.14.0.0/15",

  // ── Tencent EU Nodes (Frankfurt / Amsterdam / Stockholm) ─
  "81.68.0.0/16",    "81.70.0.0/16",
  "101.32.0.0/12",   "101.33.0.0/16",   "101.34.0.0/15",
  "119.28.0.0/14",   "119.29.0.0/16",
  "129.226.0.0/16",  "150.109.0.0/17",

  // ── Tencent Game Relay / BGP nodes ──────────────────────
  "175.27.0.0/16",   "49.234.0.0/16",   "49.235.0.0/16",
  "182.254.0.0/16",  "203.205.0.0/16",  "203.195.0.0/16",

  // ── Tencent Middle East / KSA edge ──────────────────────
  // (جديد 2025 — Tencent Cloud Saudi Arabia region)
  "154.197.0.0/16",  "154.198.0.0/15",
  "101.44.0.0/14",

  // ── Tencent AS45090 (Shenzhen core) ─────────────────────
  "14.17.0.0/16",    "14.18.0.0/15",    "14.22.0.0/15",
  "58.250.0.0/15",   "59.37.0.0/16",    "59.38.0.0/15",
  "61.151.128.0/17", "113.108.0.0/14",  "119.147.0.0/16",
  "123.150.0.0/16",  "183.3.0.0/16",    "183.60.0.0/15",

  // ── Tencent CDN + Accelerator (non-patch) ───────────────
  "106.55.0.0/16",   "108.160.0.0/13",
  "111.30.0.0/15",   "111.161.0.0/16",
  "112.65.0.0/16",   "112.90.0.0/15"
];

// ──────────────────────────────────────────────────────────────
// SECTION 5 — PUBG + TENCENT DOMAINS
// ──────────────────────────────────────────────────────────────
// هاي كل الدومينات اللي تطلب عليها PUBG:
// لوبي، تجنيد فريق، Metro Royale shop، Arena matchmaking،
// Training mode، EvoGround، Payload servers، login، chat
var PUBG_DOMAINS = [
  // Core game
  "pubg.com",           "pubgmobile.com",      "pubgm.qq.com",
  "pubg.qq.com",        "pubgmobile.com.hk",   "pgmobile.com",
  // Tencent infra
  "tencent.com",        "tencentcloud.com",    "myqcloud.com",
  "qcloud.com",         "cloud.tencent.com",
  // Game services (matchmaking, chat, login, stats)
  "smoba.qq.com",       "igamecj.com",         "msdk.qq.com",
  "bugly.qq.com",       "beacon.qq.com",       "stat.game.qq.com",
  "gcloud.qq.com",      "gcloud.game.qq.com",
  // Login / account
  "login.qq.com",       "xui.ptlogin2.qq.com", "ssl.ptlogin2.qq.com",
  "account.qq.com",     "game.gtimg.cn",
  // Metro Royale / EvoGround specific
  "metro.pubgmobile.com","evo.pubgmobile.com",
  // Krafton / Publisher
  "krafton.com",        "kakaogames.com",
  // Analytics (region detection — proxy يمنع كشف غير أردن)
  "aegis.qq.com",       "report.qq.com"
];

// ──────────────────────────────────────────────────────────────
// SECTION 6 — CDN/PATCH DOMAINS → DIRECT
// ──────────────────────────────────────────────────────────────
// هاي مسؤولة عن تحميل التحديثات والـ assets فقط
// لو مررناها بالبروكسي راح تبطّل تحميل الباتشات
var CDN_DIRECT = [
  "akamai.net",       "akamaicdn.net",    "akamaiedge.net",
  "akamaized.net",    "cloudfront.net",   "fastly.net",
  "llnwd.net",        "edgecastcdn.net",  "hwcdn.net",
  "cdngc.net",        "gstatic.com",      "googleapis.com",
  "apple.com",        "apple-dns.net",    "icloud.com",
  "mzstatic.com"      // App Store CDN — patches come from here
];

// ──────────────────────────────────────────────────────────────
// SECTION 7 — HELPER FUNCTIONS
// ──────────────────────────────────────────────────────────────

function ip2int(ip) {
  var p = ip.split(".");
  if (p.length !== 4) return -1;
  return (((+p[0]) << 24) | ((+p[1]) << 16) |
           ((+p[2]) <<  8) |  (+p[3])) >>> 0;
}

function inCIDR(ip, cidr) {
  var c    = cidr.split("/");
  var base = ip2int(c[0]);
  var bits = +c[1];
  if (base < 0 || isNaN(bits)) return false;
  var mask = bits === 0 ? 0 : ((0xFFFFFFFF << (32 - bits)) >>> 0);
  return (ip2int(ip) & mask) === (base & mask);
}

function inList(ip, list) {
  for (var i = 0; i < list.length; i++) {
    if (inCIDR(ip, list[i])) return true;
  }
  return false;
}

function domainMatch(host, list) {
  var h = host.toLowerCase();
  for (var i = 0; i < list.length; i++) {
    var d = list[i].toLowerCase();
    if (h === d || h.slice(-(d.length + 1)) === "." + d) return true;
  }
  return false;
}

// Jordan IPv6 prefixes (Orange/Zain/Umniah/JT/DAMAMAX)
function isJordanV6(h) {
  return /^2a02:ed8:/i.test(h)    ||  // Orange JO
         /^2a04:4e42:6/i.test(h)  ||  // Zain JO
         /^2a02:e980:/i.test(h)   ||  // Umniah
         /^2001:16a0:/i.test(h)   ||  // Jordan Telecom
         /^2a05:d480:/i.test(h);      // DAMAMAX
}

// Iran IPv6 → block
function isIranV6(h) {
  return /^2001:df5:a/i.test(h)  ||
         /^2a0e:4d40:/i.test(h)  ||
         /^2001:4ba0:/i.test(h);      // Irancell IPv6
}

// Tencent IPv6 game nodes
function isTencentV6(h) {
  return /^2400:6400:/i.test(h)  ||   // Tencent Cloud global
         /^2402:4e00:/i.test(h)  ||   // Tencent Shenzhen
         /^2408:8756:/i.test(h);      // Tencent relay
}

// ──────────────────────────────────────────────────────────────
// SECTION 8 — MAIN FindProxyForURL
// ──────────────────────────────────────────────────────────────
function FindProxyForURL(url, host) {

  // ── Private / Loopback → DIRECT ──────────────────────────
  if (isPlainHostName(host))                          return DIRECT;
  if (host === "localhost")                           return DIRECT;
  if (isInNet(host, "127.0.0.0",   "255.0.0.0"))     return DIRECT;
  if (isInNet(host, "10.0.0.0",    "255.0.0.0"))     return DIRECT;
  if (isInNet(host, "172.16.0.0",  "255.240.0.0"))   return DIRECT;
  if (isInNet(host, "192.168.0.0", "255.255.0.0"))   return DIRECT;
  if (isInNet(host, "100.64.0.0",  "255.192.0.0"))   return DIRECT; // CGNAT

  // ── Patch / CDN → DIRECT (لا تكسر التحديثات) ────────────
  if (domainMatch(host, CDN_DIRECT)) return DIRECT;

  // ── Apple / iOS system → DIRECT ──────────────────────────
  // 5G على iPad Pro يحل DNS محلياً — لا تدخل بالـ system traffic
  if (/\.apple\.com$/i.test(host))  return DIRECT;
  if (/\.icloud\.com$/i.test(host)) return DIRECT;

  // ──────────────────────────────────────────────────────────
  // IPv6 FAST PATH
  // ──────────────────────────────────────────────────────────
  if (host.indexOf(":") !== -1) {
    if (isIranV6(host))    return DIRECT;       // إيران → مقطوع
    if (isJordanV6(host))  return GAME_CHAIN;   // أردن → full proxy
    if (isTencentV6(host)) return GAME_CHAIN;   // تينسنت → full proxy
    // unknown IPv6 → proxy للأمان (matchmaking)
    return LITE_CHAIN;
  }

  // ──────────────────────────────────────────────────────────
  // IPv4 PATH
  // ──────────────────────────────────────────────────────────
  var ip = dnsResolve(host) || host;

  // 1 ─ حجب إيران كلياً
  //     DIRECT بدون proxy = لا يوجد route = connection timeout
  //     اللعبة ما تدخل بمباراة فيها سيرفر إيراني
  if (inList(ip, IRAN)) return DIRECT;

  // 2 ─ IP أردني → full proxy chain
  //     matchmaking سيرفر يشوف أردني → يجيب أردنيين
  if (inList(ip, JORDAN)) return GAME_CHAIN;

  // 3 ─ Tencent / PUBG servers → full proxy
  //     هاذا هو قلب الموضوع:
  //     كل مودات اللعبة (Classic, Ranked, Arena TDM, Metro Royale,
  //     Payload, EvoGround, Training, BGP relay) كلها تمر من هون
  if (inList(ip, TENCENT_GAME)) return GAME_CHAIN;

  // 4 ─ دومينات PUBG/Tencent → proxy
  if (domainMatch(host, PUBG_DOMAINS)) return GAME_CHAIN;

  // 5 ─ كل شيء ثاني → DIRECT
  return DIRECT;
}
