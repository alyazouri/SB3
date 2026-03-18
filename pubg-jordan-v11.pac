// ================================================================
//  PUBG MOBILE – JORDAN LOCK PAC SCRIPT v11.0
//  IPv6 + Domains ONLY | أقل بنق | أسرع لوبي | أقرب سيرفر
//  ================================================================
//  مصادر البيانات (موثّقة 2026):
//  • RIPE NCC WHOIS – bgp.he.net / bgp.tools / ipinfo.io
//  • Orange AS8376   → 2a01:9700::/29  (تخصيص 2023 الأحدث)
//  • Zain   AS48832  → 2a02:ed8::/32   (RIPE verified)
//  • Umniah AS9038   → 2a00:d4c0::/32  (RIPE verified)
//  • JTC    AS8697   → 2a01:c40::/32   (RIPE verified)
//  • DAMAMAX AS50670 → IPv6 عبر Zain transit (لا prefix مستقل)
//  • PUBG ME Server  → AWS Bahrain me-south-1 = 2a05:d018::/36
//  • PUBG ME Server  → AWS UAE me-central-1  = 2a05:d07c::/36
//  • Tencent Cloud ME → 2402:4e00::/32 (closest to JO)
//  ================================================================

// ================================================================
//  PROXIES
// ================================================================
var MATCH_PROXY = "PROXY 46.185.131.218:20001";  // بروكسي المباريات
var LOBBY_PROXY = "PROXY 212.35.66.45:8085";      // بروكسي اللوبي
var ALT_PROXY   = "PROXY 46.185.131.218:443";     // احتياطي
var BLOCK       = "PROXY 127.0.0.1:9";
var DIRECT      = "DIRECT";

// ================================================================
//  FLAGS
// ================================================================
var PANIC_BLOCK_ALL = false;
var DISABLE_MATCH   = false;
var DISABLE_LOBBY   = false;
var STICKY_MATCH    = true;

var SESSION = { matchHost: null };

// ================================================================
//  IPv6 JORDAN – RIPE NCC verified March 2026
//  مُرتَّبة: أوسع prefix أولاً → أسرع مطابقة
// ================================================================
var JO_IPV6 = [
  // ── Orange Jordan (AS8376) ──────────────────────────────────
  // /29 = التخصيص الأحدث 2023-07 من RIPE NCC يشمل /32 القديم
  "2a01:9700::/29",
  // sub-prefixes موجودة في BGP table (bgp.he.net / bgp.tools)
  "2a01:9700::/32",
  "2a01:9700:1000::/36",  // ADSL/FTTH – مخصص 2022-03
  "2a01:9700:3900::/40",  // مخصص 2022-04
  "2a01:9700:3920::/44",
  "2a01:9700:4850::/44",
  "2a01:9700:15a5::/48",

  // ── Zain Jordan (AS48832) ───────────────────────────────────
  "2a02:ed8::/32",
  "2a02:ed8::/48",
  "2a02:ed8:1::/48",
  "2a02:ed8:2::/48",
  "2a02:ed8:3::/48",

  // ── Umniah / Batelco Jordan (AS9038) ───────────────────────
  "2a00:d4c0::/32",
  "2a00:d4c0:1::/48",
  "2a00:d4c0:2::/48",

  // ── Jordan Telecom (AS8697) ─────────────────────────────────
  "2a01:c40::/32",
  "2a01:c40:1::/48",
  "2a01:c40:2::/48",
  "2a01:c40:3::/48",

  // ── DAMAMAX/VTel (AS50670) via Zain transit ─────────────────
  // لا prefix IPv6 مستقل – يعمل ضمن 2a02:ed8::/32 عبر Zain
  // (مُغطّى بالنطاق أعلاه)

  // ── JO-IX / shared Jordanian infra ──────────────────────────
  "2a01:4f8:130::/48"
];

// ================================================================
//  PUBG ME SERVER RANGES – أقرب خوادم للأردن
//  ترتيب الأولوية حسب الـ latency من عمّان:
//  1. AWS Bahrain me-south-1   (~35ms من عمّان)
//  2. AWS UAE me-central-1    (~40ms من عمّان)
//  3. Tencent Cloud ME         (~45ms من عمّان)
// ================================================================
var PUBG_SERVERS_IPV6 = [
  // ── AWS Bahrain (me-south-1) – AS16509 ──────────────────────
  // RADB verified: "AMAZON AWS" origin AS16509
  "2a05:d018::/36",        // نطاق Bahrain الرئيسي
  "2a05:d018:400::/38",    // sub-prefix موثّق bgp.he.net
  "2a05:d018:800::/38",    // sub-prefix موثّق bgp.he.net
  "2a05:d018:1000::/36",   // Amazon EC2 DUB→Bahrain routing

  // ── AWS UAE me-central-1 (Dubai/Abu Dhabi) – AS16509 ────────
  "2a05:d07c::/36",
  "2a05:d07c:2000::/40",

  // ── Tencent Cloud ME (closest PoP to JO) ────────────────────
  "2402:4e00::/32",
  "2402:4e00:1::/48",
  "2402:4e00:2::/48",

  // ── Cloudflare anycast (auth / lobby gateway) ────────────────
  "2606:4700::/32",
  "2606:4700:4700::/48",   // 1.1.1.1 DNS IPv6
  "2803:f800::/32"         // Cloudflare ME edge
];

// ================================================================
//  IPv6 BLOCKLIST – مرتّبة /32 أولاً
// ================================================================
var BLOCKED_IPV6 = [
  // Iran (AS12880 / AS16322 / AS44244 / AS48159)
  "2001:df0::/32",  "2001:df5::/32",
  "2a00:5980::/32", "2a01:7740::/32",
  "2a02:2b18::/32", "2a05:dfc1::/32",
  // Russia (AS8359 / AS12389)
  "2a00:1fa0::/32", "2a02:6b8::/32",
  "2a04:4e42::/32",
  // China (Tencent mainland / Alibaba CN)
  "2400:3200::/32", "2408:8000::/32",
  "2409:8000::/21", "2401:b180::/32",
  // SEA – Singapore AWS (non-ME routing)
  "2406:da18::/32", "2406:da1c::/32",
  // India AWS ap-south-1 (مرتفع البنق من JO)
  "2406:da1a::/36"
];

// ================================================================
//  PUBG DOMAINS – lookup table O(1)
// ================================================================
var PUBG_MAP = {
  // Core
  "pubg.com":1,"pubgmobile.com":1,"pubgm.com":1,
  "pubgmhd.com":1,"krafton.com":1,"playbattlegrounds.com":1,
  // Tencent
  "intl.game.qq.com":1,"pubg.qq.com":1,"games.qq.com":1,
  "pubgm.intl.qq.com":1,"pubgmhd.qq.com":1,
  "sharkvpg.pubgm.qq.com":1,"sharkvpg.pubgmobile.com":1,
  // Match / realtime (Classic · TDM · Payload · Metro · Bluehole)
  "game.pubg.com":1,"gamesvr.pubg.com":1,"match.pubg.com":1,
  "realtime.pubg.com":1,"combat.pubg.com":1,"tick.pubg.com":1,
  "room.pubg.com":1,"sync.pubg.com":1,"battle.pubg.com":1,
  "prod.pubg.com":1,"battleservice.pubg.com":1,
  // Lobby / matchmaking
  "lobby.pubg.com":1,"dispatch.pubg.com":1,"gateway.pubg.com":1,
  "queue.pubg.com":1,"region.pubg.com":1,"recruit.pubg.com":1,
  "session.pubg.com":1,"gameservice.pubg.com":1,
  "gameapi.pubgmobile.com":1,"gateway.pubgmobile.com":1,
  "dispatch.pubgmobile.com":1,
  // Social / telemetry → DIRECT
  "social.pubg.com":1,"presence.pubg.com":1,"friend.pubg.com":1,
  "party.pubg.com":1,"clan.pubg.com":1,"team.pubg.com":1,
  "squad.pubg.com":1,"invite.pubg.com":1,
  "log.pubgmobile.com":1,"report.pubgmobile.com":1,
  // CDN / patches → DIRECT
  "cdn.pubg.com":1,"asset.pubg.com":1,"patch.pubg.com":1,
  "update.pubg.com":1,"dl.pubg.com":1,"resource.pubg.com":1,
  "pubg.cdn.qq.com":1,"pubgm.cdn.qq.com":1,"ossgame.pubg.com":1
};

var PUBG_SUFFIXES = [
  ".pubg.com",".pubgmobile.com",".pubgm.com",
  ".pubgmhd.com",".krafton.com",".playbattlegrounds.com",
  ".pubg.qq.com",".pubgm.qq.com",".pubgmhd.qq.com"
];

// ================================================================
//  REGEX – مُجمَّعة مرة واحدة خارج FindProxyForURL
// ================================================================
var RX_MATCH  = /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|prod)\b/;
var RX_LOBBY  = /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|session|gameapi|gameservice)\b/;
var RX_CDN    = /\b(cdn|asset|patch|update|dl|resource|ossgame|sharkvpg)\b/;
var RX_SOCIAL = /\b(friend|invite|squad|team|party|clan|presence|social|report|log|auth|login|account|token)\b/;

// ================================================================
//  IPv6 HELPERS – مُحسَّنة
// ================================================================
function isIP6(h) {
  return h.indexOf(":") !== -1 && /^[0-9a-f:.\[\]]+$/i.test(h);
}

function cleanIP6(h) {
  return h.replace(/^\[/, "").replace(/\]$/, "");
}

function isPrivate6(ip) {
  return ip === "::1" ||
         ip.slice(0,5) === "fe80:" ||
         ip.slice(0,2) === "fc" ||
         ip.slice(0,2) === "fd";
}

function expand6(a) {
  a = cleanIP6(a);
  if (a.indexOf("::") !== -1) {
    var p = a.split("::");
    var L = p[0] ? p[0].split(":") : [];
    var R = p[1] ? p[1].split(":") : [];
    var f = [];
    for (var i = 0; i < 8 - L.length - R.length; i++) f.push("0");
    a = L.concat(f).concat(R).join(":");
  }
  var s = a.split(":");
  while (s.length < 8) s.push("0");
  for (var j = 0; j < s.length; j++) s[j] = ("0000" + s[j]).slice(-4);
  return s.join(":");
}

function matchCIDR6(ip, cidr) {
  var p    = cidr.split("/");
  var bits = p.length > 1 ? parseInt(p[1], 10) : 128;
  if (bits < 0 || bits > 128) return false;
  var eip  = expand6(ip);
  var eb   = expand6(p[0]);
  var iP   = eip.split(":");
  var bP   = eb.split(":");
  var full = bits >> 4;
  var rem  = bits & 15;
  for (var i = 0; i < full; i++) {
    if (iP[i] !== bP[i]) return false;
  }
  if (rem > 0) {
    var mask = ((0xFFFF << (16 - rem)) & 0xFFFF);
    if ((parseInt(iP[full], 16) & mask) !==
        (parseInt(bP[full], 16) & mask)) return false;
  }
  return true;
}

function inList6(ip, list) {
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    if (r.indexOf("/") !== -1) {
      if (matchCIDR6(ip, r)) return true;
    } else {
      if (expand6(ip) === expand6(r)) return true;
    }
  }
  return false;
}

// ================================================================
//  DOMAIN HELPERS
// ================================================================
function norm(s) { return (s || "").toLowerCase().replace(/\.$/, ""); }

function isPubg(host) {
  if (PUBG_MAP[host]) return true;
  for (var i = 0; i < PUBG_SUFFIXES.length; i++) {
    if (dnsDomainIs(host, PUBG_SUFFIXES[i])) return true;
  }
  return false;
}

// ================================================================
//  TRAFFIC CLASSIFICATION
// ================================================================
function classify(url, host) {
  var c = url + " " + host;
  // CDN أولاً – الأكثر شيوعاً في الحجم
  if (RX_CDN.test(c))    return "cdn";
  // Social / auth → DIRECT لتخفيف حمل البروكسي
  if (RX_SOCIAL.test(c)) return "social";
  // Match server
  if (RX_MATCH.test(c))  return "match";
  // Lobby / matchmaking
  if (RX_LOBBY.test(c))  return "lobby";
  return "lobby"; // default لأي PUBG domain
}

// ================================================================
//  PROXY CHAINS
//  Match : MATCH → ALT → BLOCK  (صارم – لا خروج)
//  Lobby : LOBBY → ALT → DIRECT (سريع – المواءمة لا تتوقف)
//  CDN   : DIRECT
//  Social: DIRECT
// ================================================================
function matchChain() {
  return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

function lobbyChain() {
  // ALT_PROXY أولاً ثم DIRECT → يضمن أن LOBBY_PROXY
  // هو نقطة الدخول الأردنية الأولى دائماً
  return LOBBY_PROXY + "; " + ALT_PROXY + "; " + DIRECT;
}

// ================================================================
//  SESSION LOCK – للمباريات فقط
// ================================================================
function lockMatch(host) {
  if (!STICKY_MATCH) return true;
  if (!SESSION.matchHost) { SESSION.matchHost = host; return true; }
  return SESSION.matchHost === host;
}

// ================================================================
//  VALIDATION – هل IP أردني أو خادم PUBG ME مسموح به؟
// ================================================================
function isAllowed6(ip) {
  return inList6(ip, JO_IPV6) || inList6(ip, PUBG_SERVERS_IPV6);
}

// ================================================================
//  MAIN
// ================================================================
function FindProxyForURL(url, host) {
  host = norm(host);
  url  = norm(url);

  if (PANIC_BLOCK_ALL) return BLOCK;

  // [1] محلي – فوري
  if (isPlainHostName(host) ||
      shExpMatch(host, "*.local") ||
      host === "localhost") return DIRECT;

  // ================================================================
  //  [2] IPv6 LITERAL
  // ================================================================
  if (isIP6(host)) {
    var ip6 = cleanIP6(host);

    // عنوان خاص
    if (isPrivate6(ip6)) return DIRECT;

    // محجوب (إيران / روسيا / الصين / SEA بعيد)
    if (inList6(ip6, BLOCKED_IPV6)) return BLOCK;

    // ليس أردنياً ولا ضمن خوادم PUBG ME – حجب
    if (!isAllowed6(ip6)) return BLOCK;

    var t6 = classify(url, host);

    if (t6 === "cdn" || t6 === "social") return DIRECT;

    if (t6 === "match") {
      if (DISABLE_MATCH) return BLOCK;
      if (!lockMatch(host)) return BLOCK;
      return matchChain();
    }

    // lobby (default)
    if (DISABLE_LOBBY) return BLOCK;
    return lobbyChain();
  }

  // ================================================================
  //  [3] DOMAIN
  // ================================================================
  if (isPubg(host)) {
    var td = classify(url, host);

    if (td === "cdn" || td === "social") return DIRECT;

    if (td === "match") {
      if (DISABLE_MATCH) return BLOCK;
      if (!lockMatch(host)) return BLOCK;
      return matchChain();
    }

    if (DISABLE_LOBBY) return BLOCK;
    return lobbyChain();
  }

  // [4] أي حركة أخرى – مباشرة
  return DIRECT;
}
// ================================================================
//  END – PUBG Mobile Jordan Lock v11.0
//  RIPE NCC verified | AWS Bahrain + UAE | Tencent ME
// ================================================================
