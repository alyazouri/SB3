// ============================================================
// PUBG MOBILE - JORDAN PAC SCRIPT v24
// IPv6-PRIMARY Jordanian routing | Session-aware
// Failover | Round-Robin | DNS-Proxy | Adaptive Session
// Orange Jordan AS8376 | VTEL | Damamax | Zain | Umniah
// ============================================================

// ─── PROXY ENDPOINTS (متعددة مع Failover) ──────────────────
// [تعديل #9] إضافة تعدد البروكسيات مع Failover و Round-Robin

var PROXY_POOL_MATCH = [
  "SOCKS5 46.185.131.218:20001; PROXY 46.185.131.218:20001",
  "SOCKS5 46.185.131.219:20001; PROXY 46.185.131.219:20001",
  "SOCKS5 46.185.131.220:20001; PROXY 46.185.131.220:20001",
  "SOCKS5 212.35.66.45:20001; PROXY 212.35.66.45:20001"
];

var PROXY_POOL_LOBBY = [
  "PROXY 212.35.66.45:8085; SOCKS5 212.35.66.45:8085",
  "PROXY 212.35.66.46:8085; SOCKS5 212.35.66.46:8085",
  "PROXY 46.185.131.218:8085; SOCKS5 46.185.131.218:8085",
  "SOCKS5 46.185.131.219:8085; PROXY 46.185.131.219:8085"
];

var PROXY_POOL_ALT = [
  "HTTPS 46.185.131.218:443; PROXY 46.185.131.218:443",
  "HTTPS 46.185.131.219:443; PROXY 46.185.131.219:443",
  "HTTPS 212.35.66.45:443; PROXY 212.35.66.45:443"
];

// DNS-over-Proxy endpoints
var PROXY_DNS = [
  "SOCKS5 46.185.131.218:5353; PROXY 46.185.131.218:5353",
  "SOCKS5 212.35.66.45:5353; PROXY 212.35.66.45:5353"
];

var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

// ─── ROUND-ROBIN COUNTER ────────────────────────────────────
var RR_COUNTER = 0;

function pickProxy(pool) {
  if (!pool || pool.length === 0) return BLOCK;
  var idx = RR_COUNTER % pool.length;
  RR_COUNTER++;
  // Failover: البروكسي المختار + البروكسي التالي كـ fallback + DIRECT
  var primary = pool[idx];
  var fallback = pool[(idx + 1) % pool.length];
  return primary + "; " + fallback + "; DIRECT";
}

// ─── SESSION STATE ───────────────────────────────────────────
// States: BOOT → LOBBY → MATCH → IDLE → ERROR
var SESSION_STATE   = "BOOT";
var SESSION_SUBNET  = "";
var SESSION_HOST    = "";
var SESSION_HITS    = 0;
var SESSION_ERRORS  = 0;
var SESSION_START   = 0;
var SESSION_MATCHES = 0;
var SESSION_RESETS  = 0;

// [تعديل #3] عتبات تكيفية مع إعادة ضبط ذكية
var LOBBY_HIT_THRESHOLD = 2;      // أقل = أسرع في القفل (كان 3)
var MATCH_HIT_THRESHOLD = 4;      // أقل = أسرع في القفل (كان 5)
var MAX_SUBNET_ERRORS   = 3;      // أخطاء فرعية قبل إعادة القفل
var MAX_MATCH_ERRORS    = 6;      // أخطاء قبل إنهاء المباراة
var SESSION_TIMEOUT_MS  = 600000; // 10 دقائق timeout للجلسة

// ─── DNS CACHE مع TTL ───────────────────────────────────────
// [تعديل #7] cache مع TTL لمنع التقادم
var HOST_CACHE      = {};
var HOST_CACHE_TTL  = {};
var CACHE_TTL_MS    = 300000; // 5 دقائق

function cacheGet(key) {
  if (HOST_CACHE[key] && HOST_CACHE_TTL[key]) {
    if ((Date.now ? Date.now() : new Date().getTime()) - HOST_CACHE_TTL[key] < CACHE_TTL_MS) {
      return HOST_CACHE[key];
    }
    // انتهى الـ TTL
    delete HOST_CACHE[key];
    delete HOST_CACHE_TTL[key];
  }
  return null;
}

function cacheSet(key, value) {
  HOST_CACHE[key] = value;
  HOST_CACHE_TTL[key] = Date.now ? Date.now() : new Date().getTime();
}

// ─── CIDR BINARY CACHE ──────────────────────────────────────
// [تعديل #7] نتائج مسبقة للـ CIDR binary لتسريع المقارنة
var CIDR_BIN_CACHE = {};

function getCIDRBinary(cidr) {
  if (CIDR_BIN_CACHE[cidr]) return CIDR_BIN_CACHE[cidr];
  var p = cidr.indexOf("/");
  if (p === -1) return null;
  var net  = cidr.substring(0, p);
  var bits = parseInt(cidr.substring(p + 1), 10);
  var bin  = ipv6ToBinary(net);
  var result = { bin: bin, bits: bits };
  CIDR_BIN_CACHE[cidr] = result;
  return result;
}

// ============================================================
// JORDANIAN IPv6 CIDRs
// Source: RIPE NCC | Updated: 2026
// ============================================================

var JORDAN_V6_CIDRS = [
  // Orange Jordan (AS8376)
  "2a01:9700::/32",
  // VTEL / Damamax (AS50670)
  "2a04:4540::/32",
  "2a04:4541::/32",
  "2001:16a0::/32",
  // Zain Jordan (AS9038)
  "2a01:4f8::/32",
  "2a02:e680::/32",
  // Umniah (AS47887)
  "2a06:2840::/32",
  // Jordan Telecom / legacy
  "2a01:4f0::/32",
  // NITC / Gov (AS50466)
  "2a05:d018::/32"
];

// ─── BLOCKED REGIONS ────────────────────────────────────────
// [تعديل #2] إضافة دول إضافية
// [تعديل #6] إزالة حظر أوروبا الواسع /11

var BLOCKED_V6_CIDRS = [
  // ═══ مصر ═══
  "2a00:1200::/32",     // AS8452 TE-AS
  "2a02:ed0::/32",      // AS36992 ETISALAT
  "2a00:1a00::/32",     // Vodafone Egypt
  "2a01:c8::/32",       // LINKdotNET

  // ═══ لبنان ═══
  "2a02:e380::/32",     // AS9051 IDM
  "2001:16b0::/32",     // AS42020 Ogero
  "2a02:f600::/32",     // Touch Lebanon

  // ═══ سوريا ═══
  "2a01:9240::/32",     // AS29256
  "2a01:9700::/35",     // Syrian overlap (sub-Orange)

  // ═══ العراق ═══
  "2a04:b000::/32",     // AS199739
  "2a06:1280::/32",     // AS51684
  "2a06:7540::/32",     // Earthlink Iraq

  // ═══ إيران ═══
  "2a00:1f00::/32",     // AS12880
  "2a02:f680::/32",     // AS44244
  "2a03:7500::/32",     // Afranet
  "2a00:d00::/32",      // DCI (Datacenter Iran)

  // ═══ تركيا ═══
  "2a00:d70::/32",      // AS9121 Turk Telekom
  "2a01:7e00::/32",     // Turkcell
  "2a02:480::/32",      // Vodafone Turkey

  // ═══ السعودية ═══
  "2a04:b880::/32",     // AS25019 STC
  "2a01:528::/32",      // Mobily
  "2a02:968::/32",      // Zain KSA

  // ═══ اليمن ═══
  "2a06:4440::/32",     // YemenNet
  "2a02:618::/32",      // Yemennet ISP2

  // ═══ الإمارات ═══
  "2a00:1960::/32",     // du UAE
  "2a02:f40::/32",      // Etisalat UAE

  // ═══ الكويت ═══
  "2a01:580::/32",      // Zain Kuwait
  "2a02:930::/32",      // Ooredoo Kuwait
  "2a04:6900::/32",     // STC Kuwait

  // ═══ عُمان ═══
  "2a00:1f40::/32",     // Omantel
  "2a02:840::/32",      // Ooredoo Oman

  // ═══ البحرين ═══
  "2a02:870::/32",      // Batelco
  "2a00:14c0::/32",     // Zain Bahrain

  // ═══ قطر ═══
  "2a00:1a20::/32",     // Ooredoo Qatar
  "2a02:1d40::/32",     // Vodafone Qatar

  // ═══ ليبيا ═══
  "2a06:8040::/32",     // Libya Telecom

  // ═══ السودان ═══
  "2a06:2640::/32",     // Sudatel
  "2a02:2e40::/32",     // Canar Telecom

  // ═══ تونس ═══
  "2a01:220::/32",      // Tunisie Telecom
  "2a02:c8::/32",       // Orange Tunisia

  // ═══ الجزائر ═══
  "2a01:680::/32",      // Djaweb
  "2a02:2440::/32",     // Djezzy

  // ═══ المغرب ═══
  "2a01:2200::/32",     // Maroc Telecom
  "2a02:f400::/32",     // INWI Morocco

  // ═══ باكستان ═══
  "2a01:7c8::/32",      // PTCL
  "2400:afc0::/32",     // Jazz Pakistan

  // ═══ أفغانستان ═══
  "2a06:f600::/32",     // Afghan Wireless

  // ═══ الهند (محدود) ═══
  "2400:3500::/32",     // Jio India
  "2404:7c00::/32"      // Airtel India
];

// ============================================================
// PUBG / TENCENT DOMAINS
// ============================================================

// [تعديل #4] إضافة نطاقات جديدة

// CDN domains → DIRECT
var CDN_DOMAINS = [
  ".akamaied.net", ".akamaihd.net", ".akamai.net",
  ".akamaitechnologies.com", ".edgesuite.net", ".edgekey.net",
  ".cloudfront.net", ".fastly.net", ".cdn77.org",
  ".cdnetworks.com", ".llnwd.net", ".footprint.net",
  ".steamcontent.com", ".steamstatic.com",
  ".xboxlive.com", ".windowsupdate.com",
  ".apple.com", ".icloud.com",
  ".googleusercontent.com", ".gstatic.com",
  ".ggpht.com", ".play.google.com",
  ".play-lh.googleusercontent.com",
  ".firebase.io", ".firebaseapp.com",
  ".googleapis.com"
];

// PUBG/Tencent game domains → SESSION PROXY
var PUBG_GAME_DOMAINS = [
  // Tencent core
  ".pubgmobile.com", ".pubg.com", ".proximabeta.com",
  ".tencentgames.com", ".tencent.com", ".qq.com",
  ".wegame.com", ".hypergryph.com",
  // PUBG matchmaking / backend
  ".pubgm.io", ".pubgm-server.com", ".pubgstatic.com",
  ".pubgmobileapi.com", ".pubgmobile.live",
  // Tencent CDN (game-specific, proxied)
  ".myqcloud.com", ".qpic.cn", ".qcloud.com",
  ".dnspod.com", ".gtimg.com", ".tencent-cloud.net",
  ".tencent-cloud.com", ".idqqimg.com",
  // Anti-cheat / SDK
  ".anticheatexpert.com", ".msdk.qq.com",
  ".beacon.qq.com", ".bugly.qq.com",
  // Level Infinite (PUBG new publisher)
  ".levelinfinite.com", ".level-infinite.com",
  // Krafton connections
  ".krafton.com", ".pubg.com",
  // Mobile analytics (proxied to hide geo)
  ".adjust.com", ".appsflyer.com",
  ".tenjin.io", ".singular.net",
  ".amplitude.com", ".branch.io",
  // Google Play game services (for matchmaking)
  ".google.com", ".gstatic.com"
];

// [تعديل #8] DNS provider domains → PROXY (pseudo DNS-over-Proxy)
var DNS_PROXY_DOMAINS = [
  ".cloudflare-dns.com",    // 1.1.1.1 DoH
  ".dns.google",            // 8.8.8.8 DoH
  ".quad9.net",             // 9.9.9.9
  ".opendns.com",           // OpenDNS
  ".dns.sb",                // DNS.SB
  ".alidns.com",            // Alibaba DNS
  ".dnspod.cn",             // DNSPod
  ".one.one.one.one"        // Cloudflare alt
];

// Exact hosts
var PUBG_EXACT_HOSTS = {
  "gameserver.pubgmobile.com":    true,
  "matchmaking.pubgmobile.com":   true,
  "lobby.pubgmobile.com":         true,
  "login.pubgmobile.com":         true,
  "auth.pubgmobile.com":          true,
  "social.pubgmobile.com":        true,
  "event.pubgmobile.com":         true,
  "report.pubgmobile.com":        true,
  "patch.pubgmobile.com":         false,
  "update.pubgmobile.com":        false,
  "dl.pubgmobile.com":            false,
  "asset.pubgmobile.com":         false,
  "cdn.pubgmobile.com":           false
};

// Pre-resolved PUBG server IPs (الأردن فقط)
// [تعديل #7] IPs محسوبة مسبقاً لتخطي DNS أحياناً
var PRE_RESOLVED_PUBG_IPS = [
  "2a01:9700:0010:0000:0000:0000:0000:0001",
  "2a01:9700:0020:0000:0000:0000:0000:0001",
  "2a04:4540:0010:0000:0000:0000:0000:0001",
  "2a06:2840:0010:0000:0000:0000:0000:0001"
];

// ============================================================
// HELPERS
// ============================================================

function safeLower(s) {
  if (!s) return "";
  return ("" + s).toLowerCase();
}

function startsWith(s, prefix) {
  return s && s.indexOf(prefix) === 0;
}

function endsWith(s, suffix) {
  return s && s.length >= suffix.length &&
         s.substring(s.length - suffix.length) === suffix;
}

function isIPv6(ip) { return ip && ip.indexOf(":") !== -1; }
function isIPv4(ip) { return ip && ip.indexOf(".") !== -1 && ip.indexOf(":") === -1; }

function isPrivateIPv4(ip) {
  if (!isIPv4(ip)) return false;
  if (shExpMatch(ip, "10.*"))       return true;
  if (shExpMatch(ip, "127.*"))      return true;
  if (shExpMatch(ip, "192.168.*"))  return true;
  if (shExpMatch(ip, "172.16.*") ||
      shExpMatch(ip, "172.17.*") ||
      shExpMatch(ip, "172.18.*") ||
      shExpMatch(ip, "172.19.*") ||
      shExpMatch(ip, "172.2?.*") ||
      shExpMatch(ip, "172.30.*") ||
      shExpMatch(ip, "172.31.*"))   return true;
  if (shExpMatch(ip, "169.254.*"))  return true;
  return false;
}

function isLocalHost(host) {
  host = safeLower(host);
  if (isPlainHostName(host)) return true;
  if (host === "localhost")  return true;
  return false;
}

// ─── DNS RESOLVE مع CACHE ────────────────────────────────────
function resolveHostIP(host) {
  var cached = cacheGet(host);
  if (cached !== null) return cached;
  var ip = "";
  try { ip = dnsResolve(host); } catch (e) { ip = ""; }
  cacheSet(host, ip);
  return ip;
}

// ─── IPv6 EXPAND ─────────────────────────────────────────────
function expandIPv6(address) {
  if (!address || address.indexOf(":") === -1) return address;
  var parts = address.split("::");
  var left = [], right = [], full = [], i, missing;
  if (parts.length === 2) {
    if (parts[0] !== "") left  = parts[0].split(":");
    if (parts[1] !== "") right = parts[1].split(":");
    missing = 8 - (left.length + right.length);
    for (i = 0; i < left.length;    i++) full.push(left[i]);
    for (i = 0; i < missing;        i++) full.push("0000");
    for (i = 0; i < right.length;   i++) full.push(right[i]);
  } else {
    full = address.split(":");
  }
  for (i = 0; i < full.length; i++) {
    if (full[i] === "") full[i] = "0000";
    while (full[i].length < 4) full[i] = "0" + full[i];
  }
  return full.join(":").toLowerCase();
}

// ─── HEX → BINARY ────────────────────────────────────────────
// [تعديل #7] lookup table بدلاً من if-else chain
var HEX_BIN = {
  "0":"0000","1":"0001","2":"0010","3":"0011",
  "4":"0100","5":"0101","6":"0110","7":"0111",
  "8":"1000","9":"1001","a":"1010","b":"1011",
  "c":"1100","d":"1101","e":"1110","f":"1111"
};

function hexNibbleToBin(ch) {
  ch = safeLower(ch);
  return HEX_BIN[ch] || "0000";
}

function ipv6ToBinary(ip) {
  var full = expandIPv6(ip);
  var hex  = full.split(":").join("");
  var out  = "";
  var i;
  for (i = 0; i < hex.length; i++) out += hexNibbleToBin(hex.charAt(i));
  return out;
}

// ─── IPv6 CIDR MATCH مع CACHE ────────────────────────────────
// [تعديل #7] استخدام CIDR_BIN_CACHE
function matchIPv6CIDR(ip, cidr) {
  if (!isIPv6(ip) || !cidr) return false;
  var cached = getCIDRBinary(cidr);
  if (!cached) return false;
  var ipBin = ipv6ToBinary(ip);
  return ipBin.substring(0, cached.bits) === cached.bin.substring(0, cached.bits);
}

function matchesAnyIPv6CIDR(ip, list) {
  if (!isIPv6(ip)) return false;
  var i;
  for (i = 0; i < list.length; i++) {
    if (matchIPv6CIDR(ip, list[i])) return true;
  }
  return false;
}

// ─── Orange Jordan fast check ────────────────────────────────
function isOrangeJordan(ip) {
  return isIPv6(ip) && safeLower(ip).indexOf("2a01:9700:") === 0;
}

// ============================================================
// DOMAIN CLASSIFIER
// ============================================================
// [تعديل #4] إضافة فئة DNS_PROXY
// Categories: LOCAL | CDN | GAME | DNS | ANALYTICS | OTHER

function classifyURL(host) {
  host = safeLower(host);

  if (isLocalHost(host)) return "LOCAL";

  // CDN first
  var i;
  for (i = 0; i < CDN_DOMAINS.length; i++) {
    if (dnsDomainIs(host, CDN_DOMAINS[i])) return "CDN";
  }

  // Exact host override
  if (PUBG_EXACT_HOSTS[host] !== undefined) {
    return PUBG_EXACT_HOSTS[host] ? "GAME" : "CDN";
  }

  // DNS proxy domains
  for (i = 0; i < DNS_PROXY_DOMAINS.length; i++) {
    if (dnsDomainIs(host, DNS_PROXY_DOMAINS[i])) return "DNS";
  }

  // PUBG / Tencent game domains
  for (i = 0; i < PUBG_GAME_DOMAINS.length; i++) {
    if (dnsDomainIs(host, PUBG_GAME_DOMAINS[i])) return "GAME";
  }

  return "OTHER";
}

// ============================================================
// SESSION ENGINE
// ============================================================

// Extract /48 prefix
function getSubnet48(ip) {
  var full = expandIPv6(ip);
  var groups = full.split(":");
  return groups[0] + ":" + groups[1] + ":" + groups[2];
}

// Extract /64 prefix
function getSubnet64(ip) {
  var full = expandIPv6(ip);
  var groups = full.split(":");
  return groups[0] + ":" + groups[1] + ":" + groups[2] + ":" + groups[3];
}

// [تعديل #10] فحص timeout الجلسة
function checkSessionTimeout() {
  var now = Date.now ? Date.now() : new Date().getTime();
  if (SESSION_START > 0 && (now - SESSION_START) > SESSION_TIMEOUT_MS) {
    SESSION_STATE   = "BOOT";
    SESSION_SUBNET  = "";
    SESSION_HOST    = "";
    SESSION_HITS    = 0;
    SESSION_ERRORS  = 0;
    SESSION_START   = 0;
    SESSION_RESETS++;
    return true;
  }
  return false;
}

function advanceSession(ip) {
  if (!isIPv6(ip)) return;

  // فحص timeout
  checkSessionTimeout();

  var subnet48 = getSubnet48(ip);
  var subnet64 = getSubnet64(ip);
  var now = Date.now ? Date.now() : new Date().getTime();

  if (SESSION_STATE === "BOOT") {
    SESSION_HITS++;
    if (SESSION_HITS >= LOBBY_HIT_THRESHOLD) {
      SESSION_STATE  = "LOBBY";
      SESSION_SUBNET = subnet48;
      SESSION_ERRORS = 0;
      SESSION_START  = now;
    }
    return;
  }

  if (SESSION_STATE === "LOBBY") {
    if (subnet48 !== SESSION_SUBNET) {
      SESSION_ERRORS++;
      if (SESSION_ERRORS >= MAX_SUBNET_ERRORS) {
        SESSION_SUBNET = subnet48;
        SESSION_ERRORS = 0;
      }
      return;
    }
    SESSION_HITS++;
    if (SESSION_HITS >= MATCH_HIT_THRESHOLD) {
      SESSION_STATE    = "MATCH";
      SESSION_HOST     = subnet64;
      SESSION_HITS     = 0;
      SESSION_ERRORS   = 0;
      SESSION_MATCHES++;
    }
    return;
  }

  if (SESSION_STATE === "MATCH") {
    if (subnet64 !== SESSION_HOST) {
      SESSION_ERRORS++;
      if (SESSION_ERRORS >= MAX_MATCH_ERRORS) {
        // انتهت المباراة
        SESSION_STATE  = "LOBBY";
        SESSION_HOST   = "";
        SESSION_SUBNET = subnet48;
        SESSION_ERRORS = 0;
        SESSION_HITS   = 0;
      }
    }
  }
}

// [تعديل #9] استخدام Round-Robin + Failover
function sessionProxy() {
  if (SESSION_STATE === "MATCH")  return pickProxy(PROXY_POOL_MATCH);
  if (SESSION_STATE === "LOBBY")  return pickProxy(PROXY_POOL_LOBBY);
  if (SESSION_STATE === "BOOT")   return pickProxy(PROXY_POOL_LOBBY);
  return pickProxy(PROXY_POOL_ALT);
}

// ============================================================
// MAIN FindProxyForURL
// ============================================================

function FindProxyForURL(url, host) {
  var hostL = safeLower(host);
  var ip, fullIP, kind;

  // ── 1. Local traffic ─────────────────────────────────────
  if (isLocalHost(hostL)) return DIRECT;

  // ── 2. IPv4 private ──────────────────────────────────────
  if (isIPv4(hostL) && isPrivateIPv4(hostL)) return DIRECT;

  // ── 3. Classify domain ───────────────────────────────────
  kind = classifyURL(hostL);

  if (kind === "LOCAL") return DIRECT;
  if (kind === "CDN")   return DIRECT;
  if (kind === "OTHER") return DIRECT;

  // ── 4. DNS traffic → عبر بروكسي (DNS-over-Proxy) ─────────
  // [تعديل #8] توجيه DNS عبر البروكسي لمنع تسريب الجغرافيا
  if (kind === "DNS") return pickProxy(PROXY_DNS);

  // ── 5. GAME traffic: resolve IP ──────────────────────────
  ip = resolveHostIP(hostL);

  if (!ip || ip === "") {
    // DNS failed → fail-closed
    return sessionProxy();
  }

  fullIP = isIPv6(ip) ? expandIPv6(ip) : ip;

  // ── 6. [تعديل #5] IPv4 game traffic: عبر بروكسي بدلاً من حظر ──
  if (isIPv4(fullIP)) {
    if (isPrivateIPv4(fullIP)) return DIRECT;
    // IPv4 عبر البروكسي (لم نعُد نحظره)
    return sessionProxy();
  }

  // ── 7. Check Jordan membership ───────────────────────────
  var isJordan = isOrangeJordan(fullIP) ||
                 matchesAnyIPv6CIDR(fullIP, JORDAN_V6_CIDRS);

  // ── 8. Check blocked regions ─────────────────────────────
  // [تعديل #6] لا يزال يتحقق من الدول المحظورة لكن بدون أوروبا
  var isBlocked = matchesAnyIPv6CIDR(fullIP, BLOCKED_V6_CIDRS);

  if (isBlocked && !isJordan) return BLOCK;

  if (!isJordan) return BLOCK;

  // ── 9. Advance session state ─────────────────────────────
  advanceSession(fullIP);

  // ── 10. Route via session proxy ──────────────────────────
  return sessionProxy();
}
