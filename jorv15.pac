// ================================================================
//  PUBG Mobile Jordan Lock — v15.0
//  تاريخ: مارس 2026
//  Boot=DIRECT | Lobby=STRICT | Match=STRICT
//  أردنيين فقط — BLOCK لأي مسار خارج الأردن
// ================================================================

var MATCH_PROXY = "PROXY 46.185.131.218:20001";
var LOBBY_PROXY = "PROXY 212.35.66.45:8085";
var ALT_PROXY   = "PROXY 46.185.131.218:443";
var BLOCK       = "PROXY 127.0.0.1:9";
var DIRECT      = "DIRECT";

var PANIC_BLOCK_ALL = false;
var DISABLE_MATCH   = false;
var DISABLE_LOBBY   = false;
var STICKY_MATCH    = true;

// ---- Session lock state ----
var SESSION = { matchPrefix48: null };

// ================================================================
//  IPv6 JORDAN — RIPE NCC / ScaniteX محدَّث مارس 2026
//
//  المنطق: كل /29 يغطي كل /32 و/48 تحته تلقائياً
//  لا حاجة لتعداد /48 يدوية — نطاقات مضغوطة وشاملة
// ================================================================
var JO_IPV6 = [
  // ── Orange / Jordan Data Communications (AS8376) ──────────────
  // 2a01:9700::/29 يغطي: /32 /36 /40 /44 /48 كلها
  "2a01:9700::/29",

  // ── Jordan Telecom / Orange Fixed (AS8697) ─────────────────────
  "2a01:c40::/32",

  // ── Jordan Telecom Group aggregate ────────────────────────────
  "2a01:1d0::/29",

  // ── Zain Jordan (AS48832) ──────────────────────────────────────
  "2a02:ed8::/32",

  // ── Umniah / Batelco Jordan (AS9038) ──────────────────────────
  "2a00:d4c0::/32",

  // ── Al Mouakhah (AS42912) ─────────────────────────────────────
  "2a04:8640::/32",

  // ── Al Hadatheh (AS47887) ─────────────────────────────────────
  "2a02:4780::/32",

  // ── VTel / DAMAMAX (AS50670) ──────────────────────────────────
  "2a02:2a60::/32",
  "2a0c:b641::/32",

  // ── Broadband Communications (AS28730) ────────────────────────
  "2a06:2d80::/32",

  // ── Jordan European Internet Services (AS44702) ───────────────
  "2a05:f480::/32",

  // ── Network Exchange Technology (AS21088) ─────────────────────
  "2a03:b8c0::/32",

  // ── Aqaba ISP (AS60849) ───────────────────────────────────────
  "2a07:2800::/32",

  // ── NITC / Universities (AS8934) ──────────────────────────────
  "2a01:4f8:130::/48",

  // ── JO-IX / IXP peering ───────────────────────────────────────
  "2001:16a0::/32",
  "2a01:b740::/32",

  // ── ScaniteX-verified aggregates (مارس 2026) ──────────────────
  "2001:32c0::/29",
  "2a00:18d0::/32",
  "2a00:18d8::/29",
  "2a00:4620::/32",
  "2a00:76e0::/32",
  "2a00:b860::/32",
  "2a00:caa0::/32",
  "2a01:e240::/29",
  "2a01:ee40::/29",
  "2a02:9c0::/29",
  "2a02:2558::/29",
  "2a02:25d8::/32",
  "2a02:5b60::/32",
  "2a02:c040::/29",
  "2a02:e680::/29",
  "2a02:f0c0::/29",
  "2a03:6b00::/29",
  "2a03:6d00::/32"
];

// ================================================================
//  PUBG ME SERVERS — AWS Bahrain / UAE / Tencent ME
// ================================================================
var PUBG_SERVERS_IPV6 = [
  "2a05:d018::/36",
  "2a05:d018:400::/38",
  "2a05:d018:800::/38",
  "2a05:d018:1000::/36",
  "2a05:d07c::/36",
  "2a05:d07c:2000::/40",
  "2402:4e00::/32",
  "2606:4700::/32",
  "2803:f800::/32"
];

// ================================================================
//  BLOCKED IPv6 — منع تسريب المسارات خارج الأردن
//  الأردن يحاذر: مصر / لبنان / سوريا / العراق / السعودية /
//  إيران / روسيا / الصين / تركيا / إمارات / الكويت / قطر /
//  أوروبا الغربية / أمريكا / جنوب شرق آسيا
// ================================================================
var BLOCKED_IPV6 = [

  // ── مصر ───────────────────────────────────────────────────────
  "2001:4200::/23",
  "2c0f::/16",
  "2a02:4540::/32",
  "2a02:7580::/32",
  "2a02:8080::/32",
  "2a04:c540::/32",
  "2a02:f680::/32",
  "2a06:f080::/32",
  "2a0d:5a80::/32",

  // ── لبنان ─────────────────────────────────────────────────────
  "2a05:b480::/32",
  "2a06:2200::/32",
  "2a05:6c80::/32",
  "2a06:d400::/32",
  "2a0d:1a80::/32",

  // ── سوريا ─────────────────────────────────────────────────────
  "2a05:ee40::/32",
  "2a0d:5600::/32",

  // ── العراق ───────────────────────────────────────────────────
  "2a06:2bc0::/32",
  "2a09:1680::/32",
  "2a06:2140::/32",
  "2a0d:3600::/32",
  "2a04:bec0::/32",
  "2a0d:5ec0::/29",
  "2a0d:6c00::/29",

  // ── السعودية ─────────────────────────────────────────────────
  "2a06:d380::/32",
  "2a04:8e40::/32",
  "2a06:8200::/32",
  "2a0d:2c80::/32",
  "2a0f:6680::/32",

  // ── الإمارات ─────────────────────────────────────────────────
  "2a0d:f500::/32",
  "2a04:2b80::/32",
  "2a0d:ec00::/32",

  // ── الكويت / قطر / البحرين ─────────────────────────────────
  "2a05:6c40::/32",
  "2a0d:c480::/29",

  // ── إيران ─────────────────────────────────────────────────────
  "2001:df0::/32",
  "2001:df5::/32",
  "2a00:5980::/32",
  "2a01:7740::/32",
  "2a02:2b18::/32",
  "2a05:dfc1::/32",
  "2a0b:5500::/32",

  // ── تركيا ─────────────────────────────────────────────────────
  "2a00:d880::/32",
  "2a02:4e8::/32",
  "2a04:2a00::/29",
  "2a05:8b80::/32",

  // ── روسيا ─────────────────────────────────────────────────────
  "2a00:1fa0::/32",
  "2a02:6b8::/32",
  "2a04:4e42::/32",
  "2001:678::/29",

  // ── الصين ─────────────────────────────────────────────────────
  "2400:3200::/32",
  "2408:8000::/32",
  "2409:8000::/21",
  "2401:b180::/32",
  "240e::/16",

  // ── جنوب شرق آسيا ────────────────────────────────────────────
  "2406:da18::/32",
  "2406:da1c::/32",
  "2406:da1a::/36",

  // ── أوروبا الغربية (كتل كبيرة) ───────────────────────────────
  // نمنع cloudflare/akamai/amazon eu لتفادي انزياح المسار
  "2a06:98c0::/29",    // Cloudflare EU
  "2606:4700::/32",    // Cloudflare Global (مسموح فقط كـ PUBG server)
  "2a00:1450::/32",    // Google EU
  "2a03:2880::/32",    // Facebook EU

  // ── أمريكا الشمالية ──────────────────────────────────────────
  "2600::/12",         // Amazon US (كتلة كبيرة)
  "2607:f8b0::/32",    // Google US
  "2001:4860::/32"     // Google
];

// ================================================================
//  PUBG DOMAINS
// ================================================================
var PUBG_MAP = {
  // Core
  "pubg.com":1, "pubgmobile.com":1, "pubgm.com":1,
  "pubgmhd.com":1, "krafton.com":1, "playbattlegrounds.com":1,
  "gpubgm.com":1, "napubgm.broker.amsoveasea.com":1,
  "intl.game.qq.com":1, "pubg.qq.com":1, "games.qq.com":1,
  "pubgm.intl.qq.com":1, "pubgmhd.qq.com":1,
  "sharkvpg.pubgm.qq.com":1, "sharkvpg.pubgmobile.com":1,
  // Match
  "game.pubg.com":1, "gamesvr.pubg.com":1, "match.pubg.com":1,
  "realtime.pubg.com":1, "combat.pubg.com":1, "tick.pubg.com":1,
  "room.pubg.com":1, "sync.pubg.com":1, "battle.pubg.com":1,
  "prod.pubg.com":1, "battleservice.pubg.com":1,
  // Lobby
  "lobby.pubg.com":1, "dispatch.pubg.com":1, "gateway.pubg.com":1,
  "queue.pubg.com":1, "region.pubg.com":1, "recruit.pubg.com":1,
  "session.pubg.com":1, "gameservice.pubg.com":1,
  "gameapi.pubgmobile.com":1, "gateway.pubgmobile.com":1,
  "dispatch.pubgmobile.com":1,
  // Boot / CDN / Social — DIRECT
  "social.pubg.com":1, "presence.pubg.com":1, "friend.pubg.com":1,
  "party.pubg.com":1, "clan.pubg.com":1, "team.pubg.com":1,
  "squad.pubg.com":1, "invite.pubg.com":1,
  "log.pubgmobile.com":1, "report.pubgmobile.com":1,
  "cdn.pubg.com":1, "asset.pubg.com":1, "patch.pubg.com":1,
  "update.pubg.com":1, "dl.pubg.com":1, "resource.pubg.com":1,
  "pubg.cdn.qq.com":1, "pubgm.cdn.qq.com":1, "ossgame.pubg.com":1
};

var PUBG_SUFFIXES = [
  ".pubg.com", ".pubgmobile.com", ".pubgm.com",
  ".pubgmhd.com", ".krafton.com", ".playbattlegrounds.com",
  ".pubg.qq.com", ".pubgm.qq.com", ".pubgmhd.qq.com",
  ".gpubgm.com", ".amsoveasea.com"
];

// ================================================================
//  REGEX — تصنيف نوع الاتصال
// ================================================================
var RX_MATCH = /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|prod)\b/;
var RX_LOBBY = /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|gameapi|gameservice)\b/;
var RX_BOOT  = /\b(cdn|asset|patch|update|dl|resource|ossgame|login|auth|account|token|session|social|friend|party|clan|invite|presence|report|log|sharkvpg|napubgm)\b/;

// ================================================================
//  IPv6 HELPERS
// ================================================================
function isIP6(h) {
  return h.indexOf(":") !== -1 && /^[0-9a-f:.\[\]]+$/i.test(h);
}
function cleanIP6(h) { return h.replace(/^\[/, "").replace(/\]$/, ""); }
function isPrivate6(ip) {
  return ip === "::1" || ip.slice(0, 5) === "fe80:" ||
         ip.slice(0, 2) === "fc" || ip.slice(0, 2) === "fd";
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
  var p = cidr.split("/");
  var bits = p.length > 1 ? parseInt(p[1], 10) : 128;
  if (bits < 0 || bits > 128) return false;
  var iP = expand6(ip).split(":");
  var bP = expand6(p[0]).split(":");
  var full = bits >> 4;
  var rem  = bits & 15;
  for (var i = 0; i < full; i++) { if (iP[i] !== bP[i]) return false; }
  if (rem > 0) {
    var mask = ((0xFFFF << (16 - rem)) & 0xFFFF);
    if ((parseInt(iP[full], 16) & mask) !== (parseInt(bP[full], 16) & mask))
      return false;
  }
  return true;
}
function inList6(ip, list) {
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    if (r.indexOf("/") !== -1) { if (matchCIDR6(ip, r)) return true; }
    else { if (expand6(ip) === expand6(r)) return true; }
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
//  IPv6 PREFIX /48 — لاستخدام SESSION LOCK الدقيق
// ================================================================
function prefix48(ip) {
  var e = expand6(ip).split(":");
  // أول 3 groups = /48
  return e[0] + ":" + e[1] + ":" + e[2];
}

// ================================================================
//  ALLOWED CHECK
//  مسموح فقط: أردني أو PUBG ME server معروف
// ================================================================
function isAllowed6(ip) {
  if (inList6(ip, BLOCKED_IPV6)) return false;      // مرفوض صريح
  if (inList6(ip, JO_IPV6)) return true;            // أردني ✓
  if (inList6(ip, PUBG_SERVERS_IPV6)) return true;  // PUBG ME server ✓
  return false;                                      // غير معروف = مرفوض
}

// ================================================================
//  PROXY CHAINS
// ================================================================
function matchChain() { return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK; }
function lobbyChain() { return LOBBY_PROXY + "; " + ALT_PROXY + "; " + BLOCK; }

// ================================================================
//  SESSION LOCK — مبني على /48 prefix لا على hostname
//  يمنع الانتقال إلى server مختلف داخل نفس الجلسة
// ================================================================
function lockMatch48(ip) {
  if (!STICKY_MATCH) return true;
  var pfx = prefix48(ip);
  if (!SESSION.matchPrefix48) { SESSION.matchPrefix48 = pfx; return true; }
  return SESSION.matchPrefix48 === pfx;
}

// ================================================================
//  MAIN — FindProxyForURL
// ================================================================
function FindProxyForURL(url, host) {
  host = norm(host);
  url  = norm(url);

  // ── طوارئ ────────────────────────────────────────────────────
  if (PANIC_BLOCK_ALL) return BLOCK;

  // ── محلي / LAN ───────────────────────────────────────────────
  if (isPlainHostName(host) || shExpMatch(host, "*.local") || host === "localhost")
    return DIRECT;

  // ── IPv6 LITERAL ─────────────────────────────────────────────
  if (isIP6(host)) {
    var ip6 = cleanIP6(host);

    // 1) private always DIRECT
    if (isPrivate6(ip6)) return DIRECT;

    // 2) صراحة مرفوض (BLOCKED_IPV6)
    if (inList6(ip6, BLOCKED_IPV6)) return BLOCK;

    // 3) غير مسموح (لا أردني ولا PUBG ME)
    if (!isAllowed6(ip6)) return BLOCK;

    var ctx = url + " " + host;

    // 4) BOOT — DIRECT لسرعة التحميل
    if (RX_BOOT.test(ctx)) return DIRECT;

    // 5) MATCH
    if (RX_MATCH.test(ctx)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!lockMatch48(ip6)) return BLOCK;
      return matchChain();
    }

    // 6) LOBBY
    if (DISABLE_LOBBY) return BLOCK;
    return lobbyChain();
  }

  // ── DOMAIN ───────────────────────────────────────────────────
  if (isPubg(host)) {
    var c = url + " " + host;

    // 1) BOOT — DIRECT
    if (RX_BOOT.test(c)) return DIRECT;

    // 2) MATCH
    if (RX_MATCH.test(c)) {
      if (DISABLE_MATCH) return BLOCK;
      // Domain-based match: lock بـ hostname (لا ip متاح)
      if (STICKY_MATCH) {
        if (!SESSION.matchPrefix48) { SESSION.matchPrefix48 = host; }
        else if (SESSION.matchPrefix48 !== host) return BLOCK;
      }
      return matchChain();
    }

    // 3) LOBBY
    if (RX_LOBBY.test(c)) {
      if (DISABLE_LOBBY) return BLOCK;
      return lobbyChain();
    }

    // 4) أي PUBG domain غير محدد الهوية = BLOCK
    //    (لا DIRECT fallback — منع تسريب)
    return BLOCK;
  }

  // ── كل حركة أخرى = DIRECT (غير PUBG) ─────────────────────────
  return DIRECT;
}

// ================================================================
//  END — PUBG Mobile Jordan Lock v15.0
//  Boot=DIRECT | Lobby=STRICT | Match=STRICT
//  Session Lock=/48 prefix | أردنيين فقط | لا تسريب
// ================================================================
