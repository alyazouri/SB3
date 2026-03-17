// ================================================================
//  PUBG MOBILE – JORDAN LOCK PAC SCRIPT v9.0
//  IPv6 + Domains ONLY – بدون نطاقات IPv4
//  استراتيجية v7: المباريات عبر بروكسي صارم، اللوبي سلسلة احتياطية
//  يدعم: Classic / TDM / Payload 2.0 / Metro Royale / Arena / Bluehole
//  يدعم: Android / iOS / HarmonyOS / Emulators
//  ISPs: Orange AS8376 · Zain AS48832 · Umniah AS9038
//        Jordan Telecom AS8697 · DAMAMAX AS50670
//  RIPE NCC verified – مارس 2026
// ================================================================

// ================================================================
//  PROXIES
// ================================================================
var MATCH_PROXY = "PROXY 46.185.131.218:20001";
var LOBBY_PROXY = "PROXY 212.35.66.45:8085";
var ALT_PROXY   = "PROXY 46.185.131.218:443";
var BLOCK       = "PROXY 127.0.0.1:9";
var DIRECT      = "DIRECT";

// ================================================================
//  CONTROL FLAGS
// ================================================================
var PANIC_BLOCK_ALL = false;   // true = يحجب كل شيء (وضع الطوارئ)
var DISABLE_MATCH   = false;   // true = يوقف توجيه المباريات
var DISABLE_LOBBY   = false;   // true = يوقف توجيه اللوبي
var STICKY_MATCH    = true;    // يثبّت خادم المباراة بعد أول اتصال
var STICKY_LOBBY    = false;   // تثبيت خادم اللوبي (يُفضَّل false)

// ================================================================
//  SESSION LOCK
// ================================================================
var SESSION = { matchHost: null, lobbyHost: null };

// ================================================================
//  IPv6 JORDAN RANGES – RIPE NCC verified
//  جميع النطاقات مؤكدة من قاعدة بيانات RIPE NCC
// ================================================================
var JO_IPV6 = [
  // Orange Jordan (AS8376)
  "2a01:9700::/32",
  "2a01:9700::/48",
  "2a01:9700:1::/48",
  "2a01:9700:2::/48",
  "2a01:9700:3::/48",
  "2a01:9700:4::/48",

  // Zain Jordan (AS48832)
  "2a02:ed8::/32",
  "2a02:ed8:0::/48",
  "2a02:ed8:1::/48",
  "2a02:ed8:2::/48",

  // Umniah (AS9038)
  "2a00:d4c0::/32",
  "2a00:d4c0:1::/48",
  "2a00:d4c0:2::/48",
  "2a01:4f8:130::/48",

  // Jordan Telecom / Orange fixed (AS8697)
  "2a01:c40::/32",
  "2a01:c40:1::/48",
  "2a01:c40:2::/48",
  "2a01:c40:3::/48",

  // DAMAMAX / VTel (AS50670)
  "2a02:2a60::/32",
  "2a02:2a60:1::/48",
  "2a02:2a60:2::/48",

  // PUBG ME / Krafton game servers (IPv6)
  "2402:4e00::/32",
  "2402:4e00:1::/48",
  "2402:4e00:2::/48"
];

// ================================================================
//  IPv6 BLOCKLIST – إيران / روسيا / الصين
//  يُحجب فوراً أي اتصال بهذه النطاقات بغض النظر عن نوع الحركة
// ================================================================
var BLOCKED_IPV6 = [
  // Iran
  "2001:df0::/32",
  "2001:df5::/32",
  "2a00:5980::/32",
  "2a01:7740::/32",
  "2a02:2b18::/32",
  "2a05:dfc1::/32",

  // Russia
  "2a00:1fa0::/32",
  "2a02:6b8::/32",
  "2a04:4e42::/32",

  // China
  "2400:3200::/32",
  "2408:8000::/32",
  "2409:8000::/21",
  "2401:b180::/32",

  // SEA / Singapore
  "2406:da18::/32",
  "2406:da1c::/32"
];

// ================================================================
//  PUBG DOMAINS – جميع دومينات اللعبة الرسمية (Krafton / Tencent ME)
//  تغطي: Classic · TDM · Payload · Metro Royale · Arena · Bluehole
// ================================================================
var PUBG_EXACT = [
  // Core brands
  "pubg.com",
  "pubgmobile.com",
  "pubgm.com",
  "pubgmhd.com",
  "krafton.com",
  "playbattlegrounds.com",

  // Tencent QQ game services
  "intl.game.qq.com",
  "pubg.qq.com",
  "games.qq.com",
  "pubgm.intl.qq.com",
  "pubgmhd.qq.com",
  "sharkvpg.pubgm.qq.com",
  "sharkvpg.pubgmobile.com",

  // Match / realtime servers (Classic · TDM · Payload · Metro)
  "game.pubg.com",
  "gamesvr.pubg.com",
  "match.pubg.com",
  "realtime.pubg.com",
  "combat.pubg.com",
  "tick.pubg.com",
  "room.pubg.com",
  "sync.pubg.com",
  "battle.pubg.com",
  "prod.pubg.com",
  "battleservice.pubg.com",

  // Lobby / matchmaking / routing
  "lobby.pubg.com",
  "dispatch.pubg.com",
  "gateway.pubg.com",
  "queue.pubg.com",
  "region.pubg.com",
  "recruit.pubg.com",
  "session.pubg.com",
  "gameservice.pubg.com",
  "gameapi.pubgmobile.com",
  "gateway.pubgmobile.com",
  "dispatch.pubgmobile.com",

  // Social / auth / telemetry
  "social.pubg.com",
  "presence.pubg.com",
  "friend.pubg.com",
  "party.pubg.com",
  "clan.pubg.com",
  "team.pubg.com",
  "squad.pubg.com",
  "invite.pubg.com",
  "log.pubgmobile.com",
  "report.pubgmobile.com",

  // CDN / patches / assets
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

var PUBG_SUFFIXES = [
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
//  HELPERS – General
// ================================================================
function norm(s) {
  return (s || "").toLowerCase().replace(/\.$/, "");
}

function isPlainLocal(host) {
  return isPlainHostName(host) ||
         shExpMatch(host, "*.local") ||
         host === "localhost" ||
         host === "127.0.0.1" ||
         host === "::1";
}

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

// ================================================================
//  HELPERS – IPv6
// ================================================================
function isIPv6Literal(host) {
  host = norm(host);
  return host.indexOf(":") !== -1 && /^[0-9a-f:.\[\]]+$/i.test(host);
}

function cleanIP6(host) {
  return norm(host).replace(/^\[/, "").replace(/\]$/, "");
}

function isPrivateIP6(ip) {
  return ip === "::1" ||
         /^fe80:/i.test(ip) ||
         /^fc/i.test(ip) ||
         /^fd/i.test(ip);
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
  var seg = addr.split(":");
  while (seg.length < 8) seg.push("0");
  for (var j = 0; j < seg.length; j++) {
    seg[j] = ("0000" + seg[j]).slice(-4);
  }
  return seg.join(":");
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
    var mask = ((0xFFFF << (16 - rem)) & 0xFFFF);
    if ((parseInt(ipP[full], 16) & mask) !==
        (parseInt(bP[full],  16) & mask)) return false;
  }
  return true;
}

function inList6(ip, list) {
  ip = cleanIP6(ip);
  if (!ip || !list || !list.length) return false;
  for (var i = 0; i < list.length; i++) {
    var r = norm(list[i]);
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
//  TRAFFIC CLASSIFICATION
//  يعتمد على مطابقة كلمات مفتاحية في URL + hostname مجتمعَين
// ================================================================
function ctx(url, host) {
  return norm(url) + " " + norm(host);
}

function isMatchTraffic(url, host) {
  return /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|prod)\b/
         .test(ctx(url, host));
}

function isLobbyTraffic(url, host) {
  return /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|session|gameapi|gameservice)\b/
         .test(ctx(url, host));
}

function isSocialTraffic(url, host) {
  return /\b(friend|invite|squad|team|party|clan|presence|social|report|log)\b/
         .test(ctx(url, host));
}

function isCDNTraffic(url, host) {
  return /\b(cdn|asset|patch|update|dl|resource|ossgame|sharkvpg)\b/
         .test(ctx(url, host));
}

// ================================================================
//  PROXY CHAINS
//  Match : MATCH_PROXY → ALT_PROXY → BLOCK  (صارم، لا خروج)
//  Lobby : LOBBY_PROXY → ALT_PROXY → BLOCK  (سلسلة احتياطية سريعة)
//  CDN   : DIRECT                            (تحديثات بلا تأخير)
// ================================================================
function matchChain() {
  return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

function lobbyChain() {
  return LOBBY_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

// ================================================================
//  SESSION LOCK – يثبّت الهوست بعد أول اتصال ناجح
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
//  MAIN – FindProxyForURL
// ================================================================
function FindProxyForURL(url, host) {
  host = norm(host);
  url  = norm(url);

  // [1] وضع الطوارئ – يحجب كل شيء
  if (PANIC_BLOCK_ALL) return BLOCK;

  // [2] حركة محلية – مباشرة دائماً
  if (isPlainLocal(host)) return DIRECT;

  // ================================================================
  //  [3] IPv6 LITERAL
  //  التحقق من النطاق الأردني قبل أي توجيه
  // ================================================================
  if (isIPv6Literal(host)) {
    var ip6 = cleanIP6(host);

    // عناوين خاصة – مباشرة
    if (isPrivateIP6(ip6)) return DIRECT;

    // نطاقات محجوبة (إيران / روسيا / الصين / SEA) – حجب فوري
    if (inList6(ip6, BLOCKED_IPV6)) return BLOCK;

    // ليس أردنياً ولا ضمن خوادم PUBG المعتمدة – حجب
    if (!inList6(ip6, JO_IPV6)) return BLOCK;

    // CDN / patches – مباشرة (لا تأخير في التحديثات)
    if (isCDNTraffic(url, host)) return DIRECT;

    // خادم المباراة – سلسلة صارمة
    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    // اللوبي + المواءمة + السوشيال – سلسلة سريعة
    if (DISABLE_LOBBY) return BLOCK;
    if (!stickyLock("lobby", host)) return BLOCK;
    return lobbyChain();
  }

  // ================================================================
  //  [4] DOMAIN / HOSTNAME
  //  يُطبَّق على كل دومينات PUBG المعروفة
  // ================================================================
  if (isPubg(host)) {

    // CDN / patches – مباشرة دائماً
    if (isCDNTraffic(url, host)) return DIRECT;

    // خادم المباراة
    if (isMatchTraffic(url, host)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!stickyLock("match", host)) return BLOCK;
      return matchChain();
    }

    // اللوبي + المواءمة + السوشيال + الـ auth + الافتراضي
    if (DISABLE_LOBBY) return BLOCK;
    if (!stickyLock("lobby", host)) return BLOCK;
    return lobbyChain();
  }

  // [5] أي حركة أخرى لا علاقة لها بـ PUBG – مباشرة
  return DIRECT;
}
// ================================================================
//  END OF SCRIPT – PUBG Mobile Jordan Lock v9.0
// ================================================================
