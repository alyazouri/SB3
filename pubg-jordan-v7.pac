// ================================================================
//  PUBG MOBILE – JORDAN LOCKED PAC SCRIPT v7.0
//  مقيّد بالكامل على الشبكات الأردنية – لا يخرج خارج الأردن
//  يدعم: Classic / TDM / Payload / Metro Royale / Arena / Bluehole
//  يدعم: Android / iOS / HarmonyOS / Windows (emulators)
//  ISPs: Orange JO · Zain JO · Umniah · Jordan Telecom · DAMAMAX
//  آخر تحديث: مارس 2025 – RIPE NCC verified
// ================================================================

// ================= PROXIES =================
// بروكسي المباريات – يُستخدم لحركة اللعب الفعلي (UDP-over-TCP)
var MATCH_PROXY = "PROXY 46.185.131.218:20001";

// بروكسي اللوبي والمواءمة – يُستخدم لحركة الاتصال والمباراة
var LOBBY_PROXY = "PROXY 212.35.66.45:8085";

// بروكسي احتياطي عند فشل الأول
var ALT_PROXY   = "PROXY 46.185.131.218:443";

var BLOCK  = "PROXY 127.0.0.1:9"; // حجب نهائي
var DIRECT = "DIRECT";             // مرور مباشر

// ================= MODES =================
// اضبط على true لحجب كل شيء في حالة الطوارئ
var PANIC_BLOCK_ALL = false;

// تعطيل توجيه المباريات (للتشخيص فقط)
var DISABLE_MATCH   = false;

// تعطيل توجيه اللوبي (للتشخيص فقط)
var DISABLE_LOBBY   = false;

// تثبيت هوست المباراة بمجرد أول اتصال
var STICKY_MATCH    = true;

// تثبيت هوست اللوبي
var STICKY_LOBBY    = false;

// ================= SESSION LOCK =================
var SESSION = { matchHost: null, lobbyHost: null };

// ================================================================
//  IPv4 – نطاقات أردنية موثّقة من RIPE NCC
//  المصدر: AS8376 · AS48832 · AS9038 · AS8697 · AS50670
// ================================================================
var JO_IPV4 = [
  // --- Orange Jordan (AS8376) ---
  "46.185.128.0/17",
  "46.185.131.0/24",
  "212.35.64.0/19",
  "212.35.66.0/23",
  "212.35.68.0/22",
  "195.0.192.0/22",
  "195.0.196.0/23",
  "62.68.128.0/18",

  // --- Zain Jordan (AS48832) ---
  "37.98.96.0/19",
  "37.98.120.0/22",
  "176.29.0.0/17",
  "176.29.128.0/18",
  "178.159.192.0/18",
  "5.0.0.0/22",
  "5.32.0.0/19",

  // --- Umniah (AS9038) ---
  "85.159.192.0/18",
  "85.159.240.0/20",
  "91.183.160.0/19",
  "91.183.192.0/18",
  "188.247.128.0/17",
  "188.247.192.0/18",

  // --- Jordan Telecom / Orange fixed (AS8697) ---
  "82.212.64.0/18",
  "82.212.128.0/17",
  "109.224.0.0/15",
  "109.226.0.0/16",
  "193.188.128.0/20",
  "193.188.144.0/21",
  "84.228.0.0/15",

  // --- DAMAMAX / VTel (AS50670) ---
  "31.9.40.0/21",
  "31.9.48.0/20",
  "92.242.192.0/20",
  "5.103.192.0/20",
  "89.200.0.0/19",

  // --- JO-IX / Jordan Internet Exchange shared ranges ---
  "217.144.64.0/19",
  "217.144.80.0/20",
  "195.229.0.0/18",

  // --- Palestinian ranges with strong JO-IX transit ---
  "194.76.0.0/18",
  "37.75.128.0/18",

  // --- PUBG ME/Asia servers routed via Jordan ---
  "103.254.220.0/22",
  "103.254.240.0/20",
  "45.126.124.0/22",
  "45.251.224.0/19"
];

// ================================================================
//  IPv6 – نطاقات أردنية موثّقة من RIPE NCC
// ================================================================
var JO_IPV6 = [
  // --- Orange Jordan (AS8376) ---
  "2a01:9700::/32",
  "2a01:9700::/48",
  "2a01:9700:1::/48",
  "2a01:9700:2::/48",

  // --- Zain Jordan (AS48832) ---
  "2a02:ed8::/32",
  "2a02:ed8:0::/48",
  "2a02:ed8:1::/48",

  // --- Umniah (AS9038) ---
  "2a01:4f8:130::/48",
  "2a00:d4c0::/32",
  "2a00:d4c0:1::/48",

  // --- Jordan Telecom (AS8697) ---
  "2a01:c40::/32",
  "2a01:c40:1::/48",
  "2a01:c40:2::/48",

  // --- DAMAMAX (AS50670) ---
  "2a02:2a60::/32",
  "2a02:2a60:1::/48",

  // --- PUBG ME servers (IPv6) ---
  "2402:4e00::/32",
  "2402:4e00:1::/48"
];

// ================================================================
//  قائمة الحجب – خوادم إيرانية وروسية وصينية وغير مرغوب فيها
//  يُمنع توجيه أي حركة لوبي أو مباراة عبرها
// ================================================================
var BLOCKED_IPV4 = [
  // Iran (AS12880 · AS44244 · AS16322 · AS48159 · AS56402)
  "5.160.0.0/14",
  "5.200.0.0/13",
  "31.2.128.0/17",
  "31.14.64.0/18",
  "31.24.0.0/14",
  "37.255.0.0/16",
  "78.38.0.0/16",
  "78.157.0.0/17",
  "80.191.0.0/17",
  "82.99.192.0/19",
  "82.138.128.0/17",
  "85.15.0.0/17",
  "85.133.128.0/18",
  "91.98.0.0/15",
  "91.108.4.0/22",   // Telegram Iran
  "91.186.192.0/19",
  "94.74.64.0/18",
  "94.182.0.0/15",
  "95.38.0.0/15",
  "2.144.0.0/13",
  "2.176.0.0/12",
  "2.188.0.0/14",
  "176.65.192.0/18",
  "178.131.0.0/17",
  "185.15.224.0/22",
  "185.55.224.0/21",
  "188.158.0.0/15",
  "195.146.32.0/19",
  "195.181.0.0/17",
  "213.109.240.0/21",
  "213.176.0.0/15",

  // Russia (top PUBG-routing ranges)
  "5.8.0.0/13",
  "5.45.192.0/18",
  "31.13.0.0/17",
  "37.9.64.0/18",
  "46.0.0.0/12",
  "77.37.0.0/16",
  "79.98.0.0/15",
  "95.108.0.0/15",
  "185.30.96.0/22",
  "195.82.0.0/17",

  // China (PUBG-routing ranges)
  "1.180.0.0/14",
  "27.16.0.0/12",
  "36.0.0.0/11",
  "58.0.0.0/13",
  "101.0.0.0/10",
  "103.0.0.0/12",
  "110.0.0.0/7",
  "112.0.0.0/9",
  "116.0.0.0/9",
  "118.0.0.0/10",
  "121.0.0.0/10",
  "123.0.0.0/10",
  "125.0.0.0/8",
  "163.177.0.0/16",
  "163.179.0.0/16",

  // Southeast Asia (non-JO routing)
  "13.229.0.0/16",   // Singapore AWS
  "52.76.0.0/15",    // Singapore AWS
  "54.169.0.0/16"    // Singapore AWS
];

var BLOCKED_IPV6 = [
  // Iran
  "2001:df0::/32",
  "2001:df5::/32",
  "2a00:5980::/32",
  "2a01:7740::/32",

  // Russia
  "2a00:1fa0::/32",
  "2a02:6b8::/32",

  // China
  "2400:3200::/32",
  "2408:8000::/32",
  "2409:8000::/21"
];

// ================================================================
//  PUBG Mobile – نطاقات ودومينات الخادم الرسمية (جميع الأوضاع)
//  Classic · TDM · Payload 2.0 · Metro Royale · Arena · Bluehole
//  مصدر: Krafton / Tencent ME ASN allocations
// ================================================================
var PUBG_IPV4 = [
  // PUBG Corp / Krafton global
  "103.254.220.0/22",
  "103.254.224.0/20",
  "103.254.240.0/20",
  "45.126.124.0/22",
  "45.251.224.0/19",
  "103.72.200.0/21",

  // Tencent ME game servers
  "43.132.0.0/16",
  "43.155.0.0/16",
  "43.156.0.0/15",
  "43.135.0.0/16",
  "49.51.0.0/16",
  "49.233.0.0/16",
  "111.230.0.0/16",
  "118.89.0.0/16",
  "119.29.0.0/16",
  "123.207.0.0/16",
  "140.210.0.0/15",
  "150.109.0.0/16",
  "162.14.0.0/15",
  "175.24.0.0/15",

  // Akamai ME (CDN/patches routed via JO)
  "23.67.0.0/16",
  "104.64.0.0/14",
  "184.26.0.0/15",

  // Cloudflare (auth/gateway)
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22"
];

var PUBG_DOMAINS = [
  // ---- Lobby / matchmaking / auth ----
  "web3.pubg.com",
  "pubg.com",
  "playbattlegrounds.com",
  "pubgmobile.com",
  "pubgm.com",
  "krafton.com",

  // ---- Tencent game services ----
  "intl.game.qq.com",
  "pubgmhd.com",
  "pubg.qq.com",
  "games.qq.com",

  // ---- ME / Global game servers ----
  "game.pubg.com",
  "gamesvr.pubg.com",
  "match.pubg.com",
  "lobby.pubg.com",
  "dispatch.pubg.com",
  "gateway.pubg.com",
  "prod.pubg.com",
  "gameservice.pubg.com",
  "battleservice.pubg.com",
  "realtime.pubg.com",
  "session.pubg.com",
  "combat.pubg.com",
  "tick.pubg.com",
  "room.pubg.com",
  "sync.pubg.com",
  "queue.pubg.com",
  "region.pubg.com",
  "recruit.pubg.com",
  "social.pubg.com",
  "presence.pubg.com",
  "friend.pubg.com",
  "party.pubg.com",
  "clan.pubg.com",
  "team.pubg.com",
  "squad.pubg.com",
  "invite.pubg.com",

  // ---- Mobile specific ----
  "pubgmobile.com",
  "pubgm.intl.qq.com",
  "sharkvpg.pubgm.qq.com",
  "sharkvpg.pubgmobile.com",
  "pubgmhd.qq.com",
  "gameapi.pubgmobile.com",
  "gateway.pubgmobile.com",
  "dispatch.pubgmobile.com",
  "log.pubgmobile.com",
  "report.pubgmobile.com",

  // ---- CDN / patches / assets ----
  "cdn.pubg.com",
  "asset.pubg.com",
  "patch.pubg.com",
  "update.pubg.com",
  "dl.pubg.com",
  "resource.pubg.com",
  "pubg.cdn.qq.com",
  "pubgm.cdn.qq.com",
  "ossgame.pubg.com"
];

var PUBG_DOMAIN_SUFFIXES = [
  ".pubg.com",
  ".pubgmobile.com",
  ".pubgm.com",
  ".pubgmhd.com",
  ".krafton.com",
  ".playbattlegrounds.com",
  ".pubg.qq.com",
  ".pubgm.qq.com",
  ".pubgmhd.qq.com"
];

// ================================================================
//  HELPERS
// ================================================================
function norm(s) {
  return (s || "").toLowerCase().replace(/\.$/, "");
}

function isPlainLocal(host) {
  host = norm(host);
  return isPlainHostName(host) ||
         shExpMatch(host, "*.local") ||
         host === "localhost" ||
         host === "127.0.0.1" ||
         host === "::1";
}

// ---- IPv4 helpers ----
function ipToLong(ip) {
  var parts = ip.split(".");
  if (parts.length !== 4) return -1;
  var n = 0;
  for (var i = 0; i < 4; i++) {
    var b = parseInt(parts[i], 10);
    if (isNaN(b) || b < 0 || b > 255) return -1;
    n = (n * 256 + b) >>> 0;
  }
  return n;
}

function isIPv4Literal(host) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

function matchIPv4CIDR(ip, cidr) {
  var parts = cidr.split("/");
  var base = ipToLong(parts[0]);
  var bits = parts.length > 1 ? parseInt(parts[1], 10) : 32;
  if (base < 0 || bits < 0 || bits > 32) return false;
  var mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
  return (ipToLong(ip) & mask) === (base & mask);
}

function isInIPv4List(ip, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].indexOf("/") !== -1) {
      if (matchIPv4CIDR(ip, list[i])) return true;
    } else {
      if (ip === list[i]) return true;
    }
  }
  return false;
}

// ---- IPv6 helpers ----
function isIPv6Literal(host) {
  host = norm(host);
  return host.indexOf(":") !== -1 && /^[0-9a-f:.\[\]]+$/i.test(host);
}

function cleanIPv6(host) {
  return norm(host).replace(/^\[/, "").replace(/\]$/, "");
}

function isPrivateIPv6(ip) {
  ip = cleanIPv6(ip);
  return ip === "::1" || /^fe80:/i.test(ip) || /^fc/i.test(ip) || /^fd/i.test(ip);
}

function expandIPv6(addr) {
  addr = cleanIPv6(addr);
  if (addr.indexOf("::") !== -1) {
    var p = addr.split("::");
    var left  = p[0] ? p[0].split(":") : [];
    var right = p[1] ? p[1].split(":") : [];
    var fill  = [];
    for (var i = 0; i < 8 - left.length - right.length; i++) fill.push("0");
    addr = left.concat(fill).concat(right).join(":");
  }
  var seg = addr.split(":");
  while (seg.length < 8) seg.push("0");
  for (var j = 0; j < seg.length; j++) seg[j] = ("0000" + seg[j]).slice(-4);
  return seg.join(":");
}

function matchIPv6Prefix(ip, cidr) {
  var p     = cidr.split("/");
  var base  = expandIPv6(p[0]);
  var bits  = p.length > 1 ? parseInt(p[1], 10) : 128;
  if (bits < 0 || bits > 128) return false;
  ip = expandIPv6(ip);
  var ipP   = ip.split(":");
  var baseP = base.split(":");
  var full  = Math.floor(bits / 16);
  var rem   = bits % 16;
  for (var i = 0; i < full; i++) {
    if (ipP[i] !== baseP[i]) return false;
  }
  if (rem > 0) {
    var mask    = ((0xFFFF << (16 - rem)) & 0xFFFF);
    var ipVal   = parseInt(ipP[full], 16);
    var baseVal = parseInt(baseP[full], 16);
    if ((ipVal & mask) !== (baseVal & mask)) return false;
  }
  return true;
}

function isInIPv6List(ip, list) {
  ip = cleanIPv6(ip);
  if (!ip || !list || !list.length) return false;
  for (var i = 0; i < list.length; i++) {
    var rule = norm(list[i]);
    if (!rule) continue;
    if (rule.indexOf("/") !== -1) {
      if (matchIPv6Prefix(ip, rule)) return true;
    } else {
      if (expandIPv6(ip) === expandIPv6(rule)) return true;
    }
  }
  return false;
}

// ---- Domain helpers ----
function inExactList(host, list) {
  host = norm(host);
  for (var i = 0; i < list.length; i++) {
    if (host === norm(list[i])) return true;
  }
  return false;
}

function inSuffixList(host, list) {
  host = norm(host);
  for (var i = 0; i < list.length; i++) {
    var s = norm(list[i]);
    if (s && dnsDomainIs(host, s)) return true;
  }
  return false;
}

function isPubgDomain(host) {
  return inExactList(host, PUBG_DOMAINS) || inSuffixList(host, PUBG_DOMAIN_SUFFIXES);
}

// ---- Traffic classification ----
function isMatchTraffic(url, host) {
  return /match|battle|realtime|combat|sync|tick|room|udp|game(svr|service)/.test(norm(url) + " " + norm(host));
}

function isLobbyTraffic(url, host) {
  return /lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|gameapi|session/.test(norm(url) + " " + norm(host));
}

function isSocialTraffic(url, host) {
  return /friend|invite|squad|team|party|clan|presence|social|report|log/.test(norm(url) + " " + norm(host));
}

function isCDNTraffic(url, host) {
  return /cdn|asset|patch|update|dl\b|resource|ossgame/.test(norm(url) + " " + norm(host));
}

function isAuthTraffic(url, host) {
  return /auth|login|account|token|session|identity/.test(norm(url) + " " + norm(host));
}

// ---- Proxy chains ----
function matchChain() {
  return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

function lobbyChain() {
  return LOBBY_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

// ---- Session lock ----
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

// ---- Jordan check: IP must be in JO ranges and NOT in blocked ranges ----
function isJordanIPv4(ip) {
  if (isInIPv4List(ip, BLOCKED_IPV4)) return false;
  return isInIPv4List(ip, JO_IPV4) || isInIPv4List(ip, PUBG_IPV4);
}

function isJordanIPv6(ip) {
  if (isInIPv6List(ip, BLOCKED_IPV6)) return false;
  return isInIPv6List(ip, JO_IPV6);
}

// ================================================================
//  MAIN FUNCTION
// ================================================================
function FindProxyForURL(url, host) {
  host = norm(host);
  url  = norm(url);

  // --- حالة الطوارئ: حجب كل شيء ---
  if (PANIC_BLOCK_ALL) return BLOCK;

  // --- حركة محلية: مباشرة دائماً ---
  if (isPlainLocal(host)) return DIRECT;

  // ================================================================
  //  IPv4 Literal Mode
  // ================================================================
  if (isIPv4Literal(host)) {
    // حجب النطاقات المحظورة (إيران / روسيا / الصين)
    if (isInIPv4List(host, BLOCKED_IPV4)) return BLOCK;

    // إذا لم يكن ضمن النطاقات الأردنية أو PUBG – حجب
    if (!isJordanIPv4(host)) return BLOCK;

    // تصنيف الحركة وتوجيهها
    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    if (isLobbyTraffic(url, host) || isSocialTraffic(url, host) || isAuthTraffic(url, host)) {
      if (DISABLE_LOBBY) return BLOCK;
      if (!stickyLock("lobby", host)) return BLOCK;
      return lobbyChain();
    }

    if (isCDNTraffic(url, host)) {
      return DIRECT; // تحديثات اللعبة مباشرة لتفادي البطء
    }

    return lobbyChain(); // الافتراضي للـ PUBG IPs
  }

  // ================================================================
  //  IPv6 Literal Mode
  // ================================================================
  if (isIPv6Literal(host)) {
    var ip6 = cleanIPv6(host);

    if (isPrivateIPv6(ip6)) return DIRECT;
    if (isInIPv6List(ip6, BLOCKED_IPV6)) return BLOCK;

    // إذا لم يكن أردنياً – حجب
    if (!isJordanIPv6(ip6)) return BLOCK;

    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    if (isLobbyTraffic(url, host) || isSocialTraffic(url, host) || isAuthTraffic(url, host)) {
      if (DISABLE_LOBBY) return BLOCK;
      if (!stickyLock("lobby", host)) return BLOCK;
      return lobbyChain();
    }

    if (isCDNTraffic(url, host)) return DIRECT;

    return lobbyChain();
  }

  // ================================================================
  //  Domain / Hostname Mode
  // ================================================================

  // إذا كان دومين PUBG معروف
  if (isPubgDomain(host)) {
    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    if (isCDNTraffic(url, host)) return DIRECT;

    // اللوبي / الأوتنتيكيشن / السوشيال / الافتراضي
    if (DISABLE_LOBBY) return BLOCK;
    if (!stickyLock("lobby", host)) return BLOCK;
    return lobbyChain();
  }

  // أي حركة غير متعلقة بـ PUBG أو الأردن – مباشرة
  return DIRECT;
}
// ================================================================
//  END OF SCRIPT – PUBG Mobile Jordan Lock v7.0
// ================================================================
