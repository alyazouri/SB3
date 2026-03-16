// ================================================================
//  PUBG MOBILE – JORDAN LOCK PAC SCRIPT v8.0
//  استراتيجية: اللوبي DIRECT (أسرع) + المباريات عبر بروكسي أردني
//  يدعم: Classic / TDM / Payload / Metro Royale / Arena / Bluehole
//  يدعم: Android / iOS / HarmonyOS / Emulators (Windows/Mac)
//  ISPs: Orange AS8376 · Zain AS48832 · Umniah AS9038
//        Jordan Telecom AS8697 · DAMAMAX AS50670
//  آخر تحديث: مارس 2026 – RIPE NCC verified
// ================================================================

// ================================================================
//  PROXIES
//  MATCH_PROXY  : بروكسي المباريات – يحدد الخادم الأردني
//  LOBBY_PROXY  : بروكسي احتياطي لللوبي عند فشل DIRECT فقط
//  ALT_PROXY    : بروكسي طوارئ أخير قبل الحجب
// ================================================================
var MATCH_PROXY = "PROXY 46.185.131.218:20001";
var LOBBY_PROXY = "PROXY 212.35.66.45:8085";
var ALT_PROXY   = "PROXY 46.185.131.218:443";
var BLOCK       = "PROXY 127.0.0.1:9";
var DIRECT      = "DIRECT";

// ================================================================
//  CONTROL FLAGS
// ================================================================
var PANIC_BLOCK_ALL  = false;  // true = يحجب كل شيء (طوارئ)
var DISABLE_MATCH    = false;  // true = يوقف توجيه المباريات
var DISABLE_LOBBY    = false;  // true = يوقف توجيه اللوبي
var FAST_LOBBY       = true;   // true = اللوبي يمر DIRECT (أسرع)
var STICKY_MATCH     = true;   // يثبت خادم المباراة بعد أول اتصال
var STICKY_LOBBY     = false;  // تثبيت خادم اللوبي (اتركه false)

// ================================================================
//  SESSION – يُثبّت خادم المباراة بمجرد أول اتصال
// ================================================================
var SESSION = { matchHost: null, lobbyHost: null };

// ================================================================
//  IPv4 JORDAN RANGES – RIPE NCC verified
// ================================================================
var JO_IPV4 = [
  // Orange Jordan (AS8376)
  "46.185.128.0/17",  "46.185.131.0/24",
  "212.35.64.0/19",   "212.35.66.0/23",
  "212.35.68.0/22",   "195.0.192.0/22",
  "195.0.196.0/23",   "62.68.128.0/18",

  // Zain Jordan (AS48832)
  "37.98.96.0/19",    "37.98.120.0/22",
  "176.29.0.0/17",    "176.29.128.0/18",
  "178.159.192.0/18", "5.0.0.0/22",
  "5.32.0.0/19",

  // Umniah (AS9038)
  "85.159.192.0/18",  "85.159.240.0/20",
  "91.183.160.0/19",  "91.183.192.0/18",
  "188.247.128.0/17", "188.247.192.0/18",

  // Jordan Telecom / Orange fixed (AS8697)
  "82.212.64.0/18",   "82.212.128.0/17",
  "109.224.0.0/15",   "109.226.0.0/16",
  "193.188.128.0/20", "193.188.144.0/21",
  "84.228.0.0/15",

  // DAMAMAX / VTel (AS50670)
  "31.9.40.0/21",     "31.9.48.0/20",
  "92.242.192.0/20",  "5.103.192.0/20",
  "89.200.0.0/19",

  // JO-IX shared
  "217.144.64.0/19",  "217.144.80.0/20",
  "195.229.0.0/18",

  // Palestinian via JO-IX
  "194.76.0.0/18",    "37.75.128.0/18"
];

// ================================================================
//  IPv4 PUBG SERVER RANGES (Krafton / Tencent ME)
//  هذه النطاقات خاصة بخوادم PUBG وتُوجَّه دائماً عبر بروكسي المباريات
// ================================================================
var PUBG_SERVER_IPV4 = [
  // Krafton / PUBG Corp
  "103.254.220.0/22", "103.254.224.0/20",
  "103.254.240.0/20", "45.126.124.0/22",
  "45.251.224.0/19",  "103.72.200.0/21",

  // Tencent ME game servers
  "43.132.0.0/16",    "43.155.0.0/16",
  "43.156.0.0/15",    "43.135.0.0/16",
  "49.51.0.0/16",     "49.233.0.0/16",
  "111.230.0.0/16",   "118.89.0.0/16",
  "119.29.0.0/16",    "123.207.0.0/16",
  "140.210.0.0/15",   "150.109.0.0/16",
  "162.14.0.0/15",    "175.24.0.0/15",

  // Akamai ME (CDN)
  "23.67.0.0/16",     "104.64.0.0/14",
  "184.26.0.0/15",

  // Cloudflare (auth)
  "104.16.0.0/13",    "104.24.0.0/14",
  "172.64.0.0/13",    "131.0.72.0/22"
];

// ================================================================
//  IPv6 JORDAN RANGES
// ================================================================
var JO_IPV6 = [
  "2a01:9700::/32",  "2a01:9700::/48",
  "2a01:9700:1::/48","2a01:9700:2::/48",   // Orange
  "2a02:ed8::/32",   "2a02:ed8:0::/48",
  "2a02:ed8:1::/48",                        // Zain
  "2a01:4f8:130::/48","2a00:d4c0::/32",
  "2a00:d4c0:1::/48",                       // Umniah
  "2a01:c40::/32",   "2a01:c40:1::/48",
  "2a01:c40:2::/48",                        // Jordan Telecom
  "2a02:2a60::/32",  "2a02:2a60:1::/48",   // DAMAMAX
  "2402:4e00::/32",  "2402:4e00:1::/48"    // PUBG ME servers
];

// ================================================================
//  BLOCKED RANGES – Iran / Russia / China / SEA
//  أي اتصال بهذه النطاقات يُحجب فوراً بغض النظر عن النوع
// ================================================================
var BLOCKED_IPV4 = [
  // ---- Iran ----
  "5.160.0.0/14",    "5.200.0.0/13",
  "31.2.128.0/17",   "31.14.64.0/18",
  "31.24.0.0/14",    "37.255.0.0/16",
  "78.38.0.0/16",    "78.157.0.0/17",
  "80.191.0.0/17",   "82.99.192.0/19",
  "82.138.128.0/17", "85.15.0.0/17",
  "85.133.128.0/18", "91.98.0.0/15",
  "91.186.192.0/19", "94.74.64.0/18",
  "94.182.0.0/15",   "95.38.0.0/15",
  "2.144.0.0/13",    "2.176.0.0/12",
  "2.188.0.0/14",    "176.65.192.0/18",
  "178.131.0.0/17",  "185.15.224.0/22",
  "185.55.224.0/21", "188.158.0.0/15",
  "195.146.32.0/19", "195.181.0.0/17",
  "213.109.240.0/21","213.176.0.0/15",

  // ---- Russia ----
  "5.8.0.0/13",      "5.45.192.0/18",
  "46.0.0.0/12",     "77.37.0.0/16",
  "79.98.0.0/15",    "95.108.0.0/15",
  "185.30.96.0/22",  "195.82.0.0/17",

  // ---- China ----
  "1.180.0.0/14",    "36.0.0.0/11",
  "58.0.0.0/13",     "101.0.0.0/10",
  "110.0.0.0/7",     "112.0.0.0/9",
  "116.0.0.0/9",     "121.0.0.0/10",
  "125.0.0.0/8",     "163.177.0.0/16",

  // ---- SEA (Singapore AWS) ----
  "13.229.0.0/16",   "52.76.0.0/15",
  "54.169.0.0/16"
];

var BLOCKED_IPV6 = [
  "2001:df0::/32",   "2001:df5::/32",    // Iran
  "2a00:5980::/32",  "2a01:7740::/32",   // Iran
  "2a00:1fa0::/32",  "2a02:6b8::/32",    // Russia
  "2400:3200::/32",  "2408:8000::/32",   // China
  "2409:8000::/21"                        // China
];

// ================================================================
//  PUBG DOMAINS – جميع دومينات اللعبة الرسمية
// ================================================================
var PUBG_EXACT = [
  // Core
  "pubg.com", "pubgmobile.com", "pubgm.com", "pubgmhd.com",
  "krafton.com", "playbattlegrounds.com",

  // Tencent
  "intl.game.qq.com", "pubg.qq.com", "games.qq.com",
  "pubgm.intl.qq.com", "pubgmhd.qq.com",

  // Match servers
  "game.pubg.com",     "gamesvr.pubg.com",   "match.pubg.com",
  "realtime.pubg.com", "combat.pubg.com",    "tick.pubg.com",
  "room.pubg.com",     "sync.pubg.com",      "battle.pubg.com",
  "prod.pubg.com",     "battleservice.pubg.com",

  // Lobby / matchmaking
  "lobby.pubg.com",    "dispatch.pubg.com",  "gateway.pubg.com",
  "queue.pubg.com",    "region.pubg.com",    "recruit.pubg.com",
  "session.pubg.com",  "gameservice.pubg.com",
  "gameapi.pubgmobile.com", "gateway.pubgmobile.com",
  "dispatch.pubgmobile.com",

  // Social / auth
  "social.pubg.com",   "presence.pubg.com",  "friend.pubg.com",
  "party.pubg.com",    "clan.pubg.com",       "team.pubg.com",
  "squad.pubg.com",    "invite.pubg.com",
  "log.pubgmobile.com","report.pubgmobile.com",

  // CDN / patches
  "cdn.pubg.com",      "asset.pubg.com",     "patch.pubg.com",
  "update.pubg.com",   "dl.pubg.com",        "resource.pubg.com",
  "pubg.cdn.qq.com",   "pubgm.cdn.qq.com",   "ossgame.pubg.com",
  "sharkvpg.pubgm.qq.com", "sharkvpg.pubgmobile.com"
];

var PUBG_SUFFIXES = [
  ".pubg.com",      ".pubgmobile.com",  ".pubgm.com",
  ".pubgmhd.com",   ".krafton.com",     ".playbattlegrounds.com",
  ".pubg.qq.com",   ".pubgm.qq.com",    ".pubgmhd.qq.com"
];

// ================================================================
//  HELPERS – IPv4
// ================================================================
function ipToLong(ip) {
  var p = ip.split(".");
  if (p.length !== 4) return -1;
  var n = 0;
  for (var i = 0; i < 4; i++) {
    var b = parseInt(p[i], 10);
    if (isNaN(b) || b < 0 || b > 255) return -1;
    n = (n * 256 + b) >>> 0;
  }
  return n;
}

function isIPv4Literal(h) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(h);
}

function matchCIDR4(ip, cidr) {
  var p    = cidr.split("/");
  var base = ipToLong(p[0]);
  var bits = p.length > 1 ? parseInt(p[1], 10) : 32;
  if (base < 0 || bits < 0 || bits > 32) return false;
  var mask = bits === 0 ? 0 : ((0xFFFFFFFF << (32 - bits)) >>> 0);
  return (ipToLong(ip) & mask) === (base & mask);
}

function inList4(ip, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].indexOf("/") !== -1) {
      if (matchCIDR4(ip, list[i])) return true;
    } else if (ip === list[i]) return true;
  }
  return false;
}

// ================================================================
//  HELPERS – IPv6
// ================================================================
function isIPv6Literal(h) {
  return h.indexOf(":") !== -1 && /^[0-9a-f:.\[\]]+$/i.test(h);
}

function cleanIP6(h) {
  return h.replace(/^\[/, "").replace(/\]$/, "");
}

function isPrivateIP6(ip) {
  return ip === "::1" || /^fe80:/i.test(ip) || /^fc/i.test(ip) || /^fd/i.test(ip);
}

function expandIP6(addr) {
  addr = cleanIP6(addr);
  if (addr.indexOf("::") !== -1) {
    var p = addr.split("::");
    var L = p[0] ? p[0].split(":") : [];
    var R = p[1] ? p[1].split(":") : [];
    var f = [];
    for (var i = 0; i < 8 - L.length - R.length; i++) f.push("0");
    addr = L.concat(f).concat(R).join(":");
  }
  var s = addr.split(":");
  while (s.length < 8) s.push("0");
  for (var j = 0; j < s.length; j++) s[j] = ("0000" + s[j]).slice(-4);
  return s.join(":");
}

function matchCIDR6(ip, cidr) {
  var p    = cidr.split("/");
  var base = expandIP6(p[0]);
  var bits = p.length > 1 ? parseInt(p[1], 10) : 128;
  if (bits < 0 || bits > 128) return false;
  ip = expandIP6(ip);
  var ipP  = ip.split(":");
  var bP   = base.split(":");
  var full = Math.floor(bits / 16);
  var rem  = bits % 16;
  for (var i = 0; i < full; i++) {
    if (ipP[i] !== bP[i]) return false;
  }
  if (rem > 0) {
    var mask   = ((0xFFFF << (16 - rem)) & 0xFFFF);
    if ((parseInt(ipP[full], 16) & mask) !== (parseInt(bP[full], 16) & mask)) return false;
  }
  return true;
}

function inList6(ip, list) {
  ip = cleanIP6(ip);
  if (!ip || !list || !list.length) return false;
  for (var i = 0; i < list.length; i++) {
    var r = (list[i] || "").toLowerCase();
    if (!r) continue;
    if (r.indexOf("/") !== -1) {
      if (matchCIDR6(ip, r)) return true;
    } else {
      if (expandIP6(ip) === expandIP6(r)) return true;
    }
  }
  return false;
}

// ================================================================
//  HELPERS – Domains
// ================================================================
function norm(s) { return (s || "").toLowerCase().replace(/\.$/, ""); }

function inExact(host, list) {
  host = norm(host);
  for (var i = 0; i < list.length; i++) {
    if (host === norm(list[i])) return true;
  }
  return false;
}

function inSuffix(host, list) {
  host = norm(host);
  for (var i = 0; i < list.length; i++) {
    var s = norm(list[i]);
    if (s && dnsDomainIs(host, s)) return true;
  }
  return false;
}

function isPubg(host) {
  return inExact(host, PUBG_EXACT) || inSuffix(host, PUBG_SUFFIXES);
}

function isPlainLocal(host) {
  return isPlainHostName(host) ||
         shExpMatch(host, "*.local") ||
         host === "localhost" ||
         host === "127.0.0.1" ||
         host === "::1";
}

// ================================================================
//  TRAFFIC CLASSIFICATION
//  يعتمد على كلمات مفتاحية في URL + hostname معاً
// ================================================================
function combined(url, host) { return norm(url) + " " + norm(host); }

function isMatchTraffic(url, host) {
  // حركة اللعب الفعلي: UDP-over-TCP، مزامنة، أتاك، تيك سيرفر
  return /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|prod)\b/
         .test(combined(url, host));
}

function isLobbyTraffic(url, host) {
  // التحديق، الانضمام، الطابور، الإرسال، المنطقة، البحث عن لاعبين
  return /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|session|gameapi|gameservice)\b/
         .test(combined(url, host));
}

function isSocialTraffic(url, host) {
  return /\b(friend|invite|squad|team|party|clan|presence|social|report|log)\b/
         .test(combined(url, host));
}

function isCDNTraffic(url, host) {
  // تحديثات اللعبة والأصول – تمر مباشرة دائماً
  return /\b(cdn|asset|patch|update|dl|resource|ossgame|sharkvpg)\b/
         .test(combined(url, host));
}

function isAuthTraffic(url, host) {
  return /\b(auth|login|account|token|identity)\b/
         .test(combined(url, host));
}

// ================================================================
//  PROXY CHAINS
//  Match : MATCH_PROXY → ALT_PROXY → BLOCK (صارم)
//  Lobby : DIRECT → LOBBY_PROXY → ALT_PROXY (سريع + احتياطي)
// ================================================================
function matchChain() {
  return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

function lobbyChain() {
  // إذا كان FAST_LOBBY مفعلاً: DIRECT أولاً ثم احتياطي
  if (FAST_LOBBY) {
    return DIRECT + "; " + LOBBY_PROXY + "; " + ALT_PROXY;
  }
  return LOBBY_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

// ================================================================
//  SESSION LOCK
// ================================================================
function stickyLock(kind, host) {
  host = norm(host);
  if (kind === "match") {
    if (!STICKY_MATCH) return true;
    if (!SESSION.matchHost) { SESSION.matchHost = host; return true; }
    return SESSION.matchHost === host;
  }
  if (kind === "lobby") {
    if (!STICKY_LOBBY) return true;
    if (!SESSION.lobbyHost) { SESSION.lobbyHost = host; return true; }
    return SESSION.lobbyHost === host;
  }
  return false;
}

// ================================================================
//  IP VALIDATION – يتحقق أن IP أردني وغير محجوب
// ================================================================
function isValidJO4(ip) {
  if (inList4(ip, BLOCKED_IPV4)) return false;
  return inList4(ip, JO_IPV4) || inList4(ip, PUBG_SERVER_IPV4);
}

function isValidJO6(ip) {
  if (inList6(ip, BLOCKED_IPV6)) return false;
  return inList6(ip, JO_IPV6);
}

// ================================================================
//  MAIN – FindProxyForURL
// ================================================================
function FindProxyForURL(url, host) {
  host = norm(host);
  url  = norm(url);

  // [1] طوارئ
  if (PANIC_BLOCK_ALL) return BLOCK;

  // [2] حركة محلية – مباشرة دائماً
  if (isPlainLocal(host)) return DIRECT;

  // ================================================================
  //  [3] IPv4 LITERAL
  // ================================================================
  if (isIPv4Literal(host)) {
    if (inList4(host, BLOCKED_IPV4)) return BLOCK;   // إيران / روسيا / الصين
    if (!isValidJO4(host))           return BLOCK;   // ليس أردنياً

    if (isCDNTraffic(url, host)) return DIRECT;       // CDN مباشر

    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    // اللوبي والسوشيال والـ auth – سريع
    if (DISABLE_LOBBY) return BLOCK;
    if (!stickyLock("lobby", host)) return BLOCK;
    return lobbyChain();
  }

  // ================================================================
  //  [4] IPv6 LITERAL
  // ================================================================
  if (isIPv6Literal(host)) {
    var ip6 = cleanIP6(host);
    if (isPrivateIP6(ip6))          return DIRECT;
    if (inList6(ip6, BLOCKED_IPV6)) return BLOCK;
    if (!isValidJO6(ip6))           return BLOCK;

    if (isCDNTraffic(url, host)) return DIRECT;

    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    if (DISABLE_LOBBY) return BLOCK;
    if (!stickyLock("lobby", host)) return BLOCK;
    return lobbyChain();
  }

  // ================================================================
  //  [5] DOMAIN / HOSTNAME
  // ================================================================
  if (isPubg(host)) {

    // CDN / patches – مباشرة دائماً (لا تبطئ التحديثات)
    if (isCDNTraffic(url, host)) return DIRECT;

    // خادم المباراة
    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    // اللوبي + المواءمة + السوشيال + الـ auth
    if (DISABLE_LOBBY) return BLOCK;
    if (!stickyLock("lobby", host)) return BLOCK;
    return lobbyChain();
  }

  // [6] أي حركة أخرى – مباشرة (لا علاقة بـ PUBG)
  return DIRECT;
}
// ================================================================
//  END OF SCRIPT – PUBG Mobile Jordan Lock v8.0
// ================================================================
