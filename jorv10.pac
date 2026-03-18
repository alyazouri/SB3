// ================================================================
//  PUBG MOBILE – JORDAN LOCK PAC SCRIPT v10.0
//  هدف: أقل بنق · أسرع لوبي · أسرع جلب لاعبين
//  IPv6 + Domains ONLY – بدون نطاقات IPv4
//  ================================================================
//  تحسينات الأداء في v10.0:
//  1. lookup table بدلاً من حلقات (O(1) vs O(n))
//  2. اللوبي والمواءمة على بروكسي مستقل ومخصص
//  3. CDN و auth مباشر بدون بروكسي
//  4. ترتيب الفحوصات من الأكثر شيوعاً للأقل
//  5. تجميع نطاقات IPv6 في /32 أولاً قبل /48 (تقليل iterations)
//  6. حذف sticky lock من اللوبي لتسريع المواءمة
// ================================================================

var MATCH_PROXY = "PROXY 46.185.131.218:20001";
var LOBBY_PROXY = "PROXY 212.35.66.45:8085";
var ALT_PROXY   = "PROXY 46.185.131.218:443";
var BLOCK       = "PROXY 127.0.0.1:9";
var DIRECT      = "DIRECT";

// ================================================================
//  CONTROL FLAGS
// ================================================================
var PANIC_BLOCK_ALL = false;
var DISABLE_MATCH   = false;
var DISABLE_LOBBY   = false;
var STICKY_MATCH    = true;   // يثبّت خادم المباراة فقط
// sticky lobby = false دائماً في v10 لتسريع المواءمة

// ================================================================
//  SESSION
// ================================================================
var SESSION = { matchHost: null };

// ================================================================
//  DOMAIN LOOKUP TABLE – O(1)
//  بدلاً من حلقة for على القائمة في كل طلب
// ================================================================
var PUBG_DOMAIN_MAP = {
  // Core
  "pubg.com":1, "pubgmobile.com":1, "pubgm.com":1,
  "pubgmhd.com":1, "krafton.com":1, "playbattlegrounds.com":1,
  // Tencent
  "intl.game.qq.com":1, "pubg.qq.com":1, "games.qq.com":1,
  "pubgm.intl.qq.com":1, "pubgmhd.qq.com":1,
  "sharkvpg.pubgm.qq.com":1, "sharkvpg.pubgmobile.com":1,
  // Match servers
  "game.pubg.com":1, "gamesvr.pubg.com":1, "match.pubg.com":1,
  "realtime.pubg.com":1, "combat.pubg.com":1, "tick.pubg.com":1,
  "room.pubg.com":1, "sync.pubg.com":1, "battle.pubg.com":1,
  "prod.pubg.com":1, "battleservice.pubg.com":1,
  // Lobby / matchmaking
  "lobby.pubg.com":1, "dispatch.pubg.com":1, "gateway.pubg.com":1,
  "queue.pubg.com":1, "region.pubg.com":1, "recruit.pubg.com":1,
  "session.pubg.com":1, "gameservice.pubg.com":1,
  "gameapi.pubgmobile.com":1, "gateway.pubgmobile.com":1,
  "dispatch.pubgmobile.com":1,
  // Social / auth / telemetry – DIRECT في v10
  "social.pubg.com":1, "presence.pubg.com":1, "friend.pubg.com":1,
  "party.pubg.com":1, "clan.pubg.com":1, "team.pubg.com":1,
  "squad.pubg.com":1, "invite.pubg.com":1,
  "log.pubgmobile.com":1, "report.pubgmobile.com":1,
  // CDN / patches – DIRECT
  "cdn.pubg.com":1, "asset.pubg.com":1, "patch.pubg.com":1,
  "update.pubg.com":1, "dl.pubg.com":1, "resource.pubg.com":1,
  "pubg.cdn.qq.com":1, "pubgm.cdn.qq.com":1, "ossgame.pubg.com":1
};

// سوفت-ماتش على الـ suffixes (للسابدومينات الديناميكية)
var PUBG_SUFFIXES = [
  ".pubg.com", ".pubgmobile.com", ".pubgm.com",
  ".pubgmhd.com", ".krafton.com", ".playbattlegrounds.com",
  ".pubg.qq.com", ".pubgm.qq.com", ".pubgmhd.qq.com"
];

// ================================================================
//  IPv6 JORDAN – مرتّبة: /32 أولاً لتسريع المطابقة
// ================================================================
var JO_IPV6 = [
  // /32 blocks أولاً (أوسع – تُطابق بسرعة أكبر)
  "2a01:9700::/32",   // Orange Jordan  (AS8376)
  "2a02:ed8::/32",    // Zain Jordan    (AS48832)
  "2a00:d4c0::/32",   // Umniah         (AS9038)
  "2a01:c40::/32",    // Jordan Telecom (AS8697)
  "2a02:2a60::/32",   // DAMAMAX        (AS50670)
  "2402:4e00::/32",   // PUBG ME servers

  // /48 blocks (تفاصيل إضافية لكل مزود)
  "2a01:9700:1::/48", "2a01:9700:2::/48",
  "2a01:9700:3::/48", "2a01:9700:4::/48",
  "2a02:ed8:1::/48",  "2a02:ed8:2::/48",
  "2a00:d4c0:1::/48", "2a00:d4c0:2::/48",
  "2a01:4f8:130::/48",
  "2a01:c40:1::/48",  "2a01:c40:2::/48",
  "2a01:c40:3::/48",
  "2a02:2a60:1::/48", "2a02:2a60:2::/48",
  "2402:4e00:1::/48", "2402:4e00:2::/48"
];

// ================================================================
//  IPv6 BLOCKLIST – مرتّبة: /32 أولاً
// ================================================================
var BLOCKED_IPV6 = [
  "2001:df0::/32",   "2001:df5::/32",    // Iran
  "2a00:5980::/32",  "2a01:7740::/32",   // Iran
  "2a02:2b18::/32",  "2a05:dfc1::/32",   // Iran
  "2a00:1fa0::/32",  "2a02:6b8::/32",    // Russia
  "2a04:4e42::/32",                       // Russia
  "2400:3200::/32",  "2408:8000::/32",   // China
  "2409:8000::/21",  "2401:b180::/32",   // China
  "2406:da18::/32",  "2406:da1c::/32"    // SEA/Singapore
];

// ================================================================
//  REGEX – مُجمَّعة مسبقاً خارج FindProxyForURL
//  يُجنَّب إعادة compile في كل طلب (أداء أفضل)
// ================================================================
var RX_MATCH  = /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|prod)\b/;
var RX_LOBBY  = /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|session|gameapi|gameservice)\b/;
var RX_CDN    = /\b(cdn|asset|patch|update|dl|resource|ossgame|sharkvpg)\b/;
var RX_SOCIAL = /\b(friend|invite|squad|team|party|clan|presence|social|report|log|auth|login|account|token)\b/;

// ================================================================
//  IPv6 HELPERS
// ================================================================
function isIPv6Literal(h) {
  return h.indexOf(":") !== -1 && /^[0-9a-f:.\[\]]+$/i.test(h);
}

function cleanIP6(h) {
  return h.replace(/^\[/, "").replace(/\]$/, "");
}

function isPrivateIP6(ip) {
  return ip === "::1" ||
         ip.indexOf("fe80:") === 0 ||
         ip.indexOf("fc")    === 0 ||
         ip.indexOf("fd")    === 0;
}

function expandIP6(a) {
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
  var base = expandIP6(p[0]);
  var bits = p.length > 1 ? parseInt(p[1], 10) : 128;
  if (bits < 0 || bits > 128) return false;
  var eip  = expandIP6(ip);
  var ipP  = eip.split(":");
  var bP   = base.split(":");
  var full = bits >> 4;           // Math.floor(bits/16)
  var rem  = bits & 15;           // bits % 16
  for (var i = 0; i < full; i++) {
    if (ipP[i] !== bP[i]) return false;
  }
  if (rem > 0) {
    var mask = ((0xFFFF << (16 - rem)) & 0xFFFF);
    if ((parseInt(ipP[full], 16) & mask) !==
        (parseInt(bP[full],  16) & mask)) return false;
  }
  return true;
}

function inList6(ip, list) {
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    if (r.indexOf("/") !== -1) {
      if (matchCIDR6(ip, r)) return true;
    } else {
      if (expandIP6(ip) === expandIP6(r)) return true;
    }
  }
  return false;
}

// ================================================================
//  DOMAIN HELPERS – O(1) lookup أولاً ثم suffix scan
// ================================================================
function isPubg(host) {
  if (PUBG_DOMAIN_MAP[host]) return true;
  for (var i = 0; i < PUBG_SUFFIXES.length; i++) {
    if (dnsDomainIs(host, PUBG_SUFFIXES[i])) return true;
  }
  return false;
}

// ================================================================
//  TRAFFIC TYPE – يعمل على النص المدمج url+host
// ================================================================
function classify(url, host) {
  var c = url + " " + host;
  if (RX_CDN.test(c))    return "cdn";
  if (RX_SOCIAL.test(c)) return "social";
  if (RX_MATCH.test(c))  return "match";
  if (RX_LOBBY.test(c))  return "lobby";
  return "lobby"; // الافتراضي لأي دومين PUBG
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
//  PROXY CHAINS
//  Match : صارم  – MATCH → ALT → BLOCK
//  Lobby : سريع  – LOBBY → ALT (بدون BLOCK نهائي لتسريع المواءمة)
//  CDN   : DIRECT
//  Social: DIRECT (لا تأثير على اللعب، تقليل حمل البروكسي)
// ================================================================
function matchChain() {
  return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

function lobbyChain() {
  // بدون BLOCK نهائي: إذا فشل LOBBY و ALT، يجرب DIRECT
  // هذا يضمن أن المواءمة لا تُوقف أبداً
  return LOBBY_PROXY + "; " + ALT_PROXY + "; " + DIRECT;
}

// ================================================================
//  MAIN
// ================================================================
function FindProxyForURL(url, host) {
  // تطبيع مرة واحدة فقط
  host = (host || "").toLowerCase().replace(/\.$/, "");
  url  = (url  || "").toLowerCase();

  if (PANIC_BLOCK_ALL) return BLOCK;

  // [1] محلي – مباشر فوري
  if (isPlainHostName(host) ||
      shExpMatch(host, "*.local") ||
      host === "localhost") return DIRECT;

  // ================================================================
  //  [2] IPv6 LITERAL
  // ================================================================
  if (isIPv6Literal(host)) {
    var ip6 = cleanIP6(host);

    if (isPrivateIP6(ip6))          return DIRECT;
    if (inList6(ip6, BLOCKED_IPV6)) return BLOCK;
    if (!inList6(ip6, JO_IPV6))     return BLOCK;

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

    // lobby (default)
    if (DISABLE_LOBBY) return BLOCK;
    return lobbyChain();
  }

  // [4] كل شيء آخر – مباشر
  return DIRECT;
}
// ================================================================
//  END – PUBG Mobile Jordan Lock v10.0
// ================================================================
