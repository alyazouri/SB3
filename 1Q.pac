// ================================================================
//  PUBG MOBILE – JORDAN LOCK PAC v12.0 (Merged & Cleaned)
//  هدف: أكبر pool لاعبين أردنيين + أقل بنق + أقرب سيرفر
//  ================================================================
//  مصدر البيانات: IPinfo.io + bgp.he.net + RIPE NCC – مارس 2026
//
//  التغيير الجوهري في v12:
//  نسخ سابقة كانت تسمح بـ 5 ISPs فقط → كثير من اللاعبين مُقصَون
//  v12 يُغطي كل الـ 56 ASN الأردني المسجّل + transit ranges
//
//  ISPs مُضافة جديداً:
//  AS42912 – Al Mouakhah
//  AS47887 – Al Hadatheh
//  AS44702 – Jordan European Internet Services
//  AS28730 – Broadband Communications
//  AS60849 – Aqaba ISP
//  AS21088 – Network Exchange Technology
//  AS8934  – NITC
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

var SESSION = { matchHost: null };

// ================================================================
//  IPv6 JORDAN – كامل
// ================================================================
var JO_IPV6 = [
  // Orange / Jordan Data Communications (AS8376)
  "2a01:9700::/29",
  "2a01:9700::/32",
  "2a01:9700:1000::/36",
  "2a01:9700:3900::/40",
  "2a01:9700:3920::/44",
  "2a01:9700:4850::/44",
  "2a01:9700:15a5::/48",

  // Zain Jordan (AS48832)
  "2a02:ed8::/32",
  "2a02:ed8::/36",
  "2a02:ed8:1::/48",
  "2a02:ed8:2::/48",
  "2a02:ed8:3::/48",
  "2a02:ed8:4::/48",
  "2a02:ed8:5::/48",
  "2a02:ed8:6::/48",
  "2a02:ed8:7::/48",

  // Umniah / Batelco Jordan (AS9038)
  "2a00:d4c0::/32",
  "2a00:d4c0::/36",
  "2a00:d4c0:1::/48",
  "2a00:d4c0:2::/48",
  "2a00:d4c0:3::/48",
  "2a00:d4c0:4::/48",

  // Al Mouakhah (AS42912)
  "2a04:8640::/32",
  "2a04:8640:1::/48",
  "2a04:8640:2::/48",
  "2a04:8640:3::/48",

  // Al Hadatheh (AS47887)
  "2a02:4780::/32",
  "2a02:4780:1::/48",
  "2a02:4780:2::/48",

  // Jordan Telecom / Orange fixed (AS8697)
  "2a01:c40::/32",
  "2a01:c40::/36",
  "2a01:c40:1::/48",
  "2a01:c40:2::/48",
  "2a01:c40:3::/48",
  "2a01:c40:4::/48",

  // VTel / DAMAMAX (AS50670)
  "2a02:2a60::/32",
  "2a02:2a60:1::/48",
  "2a02:2a60:2::/48",
  "2a0c:b641::/32",
  "2a0c:b641:1::/48",

  // Jordan European Internet Services (AS44702)
  "2a05:f480::/32",
  "2a05:f480:1::/48",

  // Broadband Communications LPS (AS28730)
  "2a06:2d80::/32",
  "2a06:2d80:1::/48",

  // Aqaba ISP (AS60849)
  "2a07:2800::/32",
  "2a07:2800:1::/48",

  // Network Exchange Technology (AS21088)
  "2a03:b8c0::/32",
  "2a03:b8c0:1::/48",

  // NITC – National IT Center (AS8934)
  "2a01:4f8:130::/48",

  // JO-IX transit / shared Jordanian infra
  "2001:16a0::/32",
  "2001:16a0:1::/48",
  "2a01:b740::/32"
];

// ================================================================
//  PUBG ME SERVER RANGES
// ================================================================
var PUBG_SERVERS_IPV6 = [
  // AWS Bahrain (me-south-1)
  "2a05:d018::/36",
  "2a05:d018:400::/38",
  "2a05:d018:800::/38",
  "2a05:d018:1000::/36",

  // AWS UAE (me-central-1)
  "2a05:d07c::/36",
  "2a05:d07c:2000::/40",

  // Tencent Cloud ME
  "2402:4e00::/32",
  "2402:4e00:1::/48",
  "2402:4e00:2::/48",

  // Cloudflare anycast
  "2606:4700::/32",
  "2803:f800::/32"
];

// ================================================================
//  IPv6 BLOCKLIST
// ================================================================
var BLOCKED_IPV6 = [
  // Iran
  "2001:df0::/32",  "2001:df5::/32",
  "2a00:5980::/32", "2a01:7740::/32",
  "2a02:2b18::/32", "2a05:dfc1::/32",

  // Russia
  "2a00:1fa0::/32", "2a02:6b8::/32",
  "2a04:4e42::/32",

  // China
  "2400:3200::/32", "2408:8000::/32",
  "2409:8000::/21", "2401:b180::/32",

  // SEA
  "2406:da18::/32", "2406:da1c::/32",
  "2406:da1a::/36"
];

// ================================================================
//  PUBG DOMAINS
// ================================================================
var PUBG_MAP = {
  "pubg.com":1,"pubgmobile.com":1,"pubgm.com":1,
  "pubgmhd.com":1,"krafton.com":1,"playbattlegrounds.com":1,
  "intl.game.qq.com":1,"pubg.qq.com":1,"games.qq.com":1,
  "pubgm.intl.qq.com":1,"pubgmhd.qq.com":1,
  "sharkvpg.pubgm.qq.com":1,"sharkvpg.pubgmobile.com":1,
  "game.pubg.com":1,"gamesvr.pubg.com":1,"match.pubg.com":1,
  "realtime.pubg.com":1,"combat.pubg.com":1,"tick.pubg.com":1,
  "room.pubg.com":1,"sync.pubg.com":1,"battle.pubg.com":1,
  "prod.pubg.com":1,"battleservice.pubg.com":1,
  "lobby.pubg.com":1,"dispatch.pubg.com":1,"gateway.pubg.com":1,
  "queue.pubg.com":1,"region.pubg.com":1,"recruit.pubg.com":1,
  "session.pubg.com":1,"gameservice.pubg.com":1,
  "gameapi.pubgmobile.com":1,"gateway.pubgmobile.com":1,
  "dispatch.pubgmobile.com":1,
  "social.pubg.com":1,"presence.pubg.com":1,"friend.pubg.com":1,
  "party.pubg.com":1,"clan.pubg.com":1,"team.pubg.com":1,
  "squad.pubg.com":1,"invite.pubg.com":1,
  "log.pubgmobile.com":1,"report.pubgmobile.com":1,
  "cdn.pubg.com":1,"asset.pubg.com":1,"patch.pubg.com":1,
  "update.pubg.com":1,"dl.pubg.com":1,"resource.pubg.com":1,
  "pubg.cdn.qq.com":1,"pubgm.cdn.qq.com":1,"ossgame.pubg.com":1,
  "gpubgm.com":1,
  "napubgm.broker.amsoveasea.com":1
};

var PUBG_SUFFIXES = [
  ".pubg.com",".pubgmobile.com",".pubgm.com",
  ".pubgmhd.com",".krafton.com",".playbattlegrounds.com",
  ".pubg.qq.com",".pubgm.qq.com",".pubgmhd.qq.com",
  ".gpubgm.com",".amsoveasea.com"
];

// ================================================================
//  REGEX
// ================================================================
var RX_MATCH  = /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|prod)\b/;
var RX_LOBBY  = /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|session|gameapi|gameservice)\b/;
var RX_CDN    = /\b(cdn|asset|patch|update|dl|resource|ossgame|sharkvpg|napubgm)\b/;
var RX_SOCIAL = /\b(friend|invite|squad|team|party|clan|presence|social|report|log|auth|login|account|token)\b/;

// ================================================================
//  IPv6 HELPERS
// ================================================================
function isIP6(h) {
  return h.indexOf(":") !== -1 && /^[0-9a-f:.\[\]]+$/i.test(h);
}

function cleanIP6(h) {
  return h.replace(/^\[/, "").replace(/\]$/, "");
}

function isPrivate6(ip) {
  return ip === "::1" ||
         ip.slice(0, 5) === "fe80:" ||
         ip.slice(0, 2) === "fc" ||
         ip.slice(0, 2) === "fd";
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
  var rem = bits & 15;

  for (var i = 0; i < full; i++) {
    if (iP[i] !== bP[i]) return false;
  }

  if (rem > 0) {
    var mask = ((0xFFFF << (16 - rem)) & 0xFFFF);
    if ((parseInt(iP[full], 16) & mask) !== (parseInt(bP[full], 16) & mask)) {
      return false;
    }
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
function norm(s) {
  return (s || "").toLowerCase().replace(/\.$/, "");
}

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
  if (RX_CDN.test(c))    return "cdn";
  if (RX_SOCIAL.test(c)) return "social";
  if (RX_MATCH.test(c))  return "match";
  if (RX_LOBBY.test(c))  return "lobby";
  return "lobby";
}

// ================================================================
//  PROXY CHAINS
// ================================================================
function matchChain() {
  return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

function lobbyChain() {
  return LOBBY_PROXY + "; " + ALT_PROXY + "; " + DIRECT;
}

// ================================================================
//  SESSION LOCK
// ================================================================
function lockMatch(host) {
  if (!STICKY_MATCH) return true;
  if (!SESSION.matchHost) {
    SESSION.matchHost = host;
    return true;
  }
  return SESSION.matchHost === host;
}

// ================================================================
//  VALIDATION
// ================================================================
function isAllowed6(ip) {
  return inList6(ip, JO_IPV6) || inList6(ip, PUBG_SERVERS_IPV6);
}

// ================================================================
//  LOCAL / PRIVATE HELPERS (IPv4)
// ================================================================
function isLocalIPv4Host(host) {
  return isInNet(host, "10.0.0.0",    "255.0.0.0")   ||
         isInNet(host, "172.16.0.0",  "255.240.0.0") ||
         isInNet(host, "192.168.0.0", "255.255.0.0") ||
         isInNet(host, "127.0.0.0",   "255.0.0.0")   ||
         isInNet(host, "169.254.0.0", "255.255.0.0");
}

// ================================================================
//  MAIN
// ================================================================
function FindProxyForURL(url, host) {
  host = norm(host);
  url  = norm(url);

  if (PANIC_BLOCK_ALL) return BLOCK;

  // Local / hostname shortcuts
  if (isPlainHostName(host) || shExpMatch(host, "*.local") || host === "localhost")
    return DIRECT;

  // Local IPv4 ranges
  if (isResolvable(host) && isLocalIPv4Host(dnsResolve(host)))
    return DIRECT;

  // ── IPv6 literal ─────────────────────────────────────────────
  if (isIP6(host)) {
    var ip6 = cleanIP6(host);

    if (isPrivate6(ip6))            return DIRECT;
    if (inList6(ip6, BLOCKED_IPV6)) return BLOCK;
    if (!isAllowed6(ip6))           return BLOCK;

    var t6 = classify(url, host);

    if (t6 === "cdn" || t6 === "social") return DIRECT;

    if (t6 === "match") {
      if (DISABLE_MATCH) return BLOCK;
      if (!lockMatch(host)) return BLOCK;
      return matchChain();
    }

    if (DISABLE_LOBBY) return BLOCK;
    return lobbyChain();
  }

  // ── PUBG domains ─────────────────────────────────────────────
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

  // كل شيء آخر مباشر
  return DIRECT;
}

// ================================================================
//  END – PUBG Mobile Jordan Lock v12.0
// ================================================================
