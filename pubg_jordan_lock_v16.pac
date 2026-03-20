// ================================================================
//  PUBG MOBILE – JORDAN LOCK PAC v16.0
//  أردنيين فقط - IPv6 فقط - لا تسريب
//  ================================================================
//  التحسينات في v16:
//  [1] إلغاء IPv4 تماماً - IPv6 فقط
//  [2] حظر أي IP ليس أردني (بما في ذلك سيرفرات PUBG)
//  [3] LOBBY + MATCH عبر البروكسي فقط
//  [4] لا DIRECT لأي شيء متعلق باللعبة خارج الأردن
//  ================================================================
//  منطق صارم:
//  - IP أردني (IPv6) → يمر
//  - أي IP آخر → BLOCK
//  - لا استثناءات لسيرفرات PUBG أو AWS
//  ================================================================

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
//  IPv6 JORDAN ONLY - RIPE NCC March 2026
//  هذي القائمة الوحيدة المسموحة - أي شي خارجها = BLOCK
// ================================================================
var JO_IPV6 = [
  // ── ORANGE JORDAN (AS8376) ─────────────────────────────────
  "2a01:9700::/29",      // Orange Main
  "2a01:9700::/32",
  "2a01:9700:1000::/36",
  "2a01:9700:3900::/40",
  "2a01:9700:3920::/44",
  "2a01:9700:4850::/44",
  "2a01:9700:15a5::/48",
  "2a01:9700::/30",      // Orange Extended
  
  // ── ZAIN JORDAN (AS48832) ──────────────────────────────────
  "2a02:ed8::/32",       // Zain Main
  "2a02:ed8::/36",
  "2a02:ed8:1::/48",
  "2a02:ed8:2::/48",
  "2a02:ed8:3::/48",
  "2a02:ed8:4::/48",
  "2a02:ed8:5::/48",
  "2a02:ed8:6::/48",
  "2a02:ed8:7::/48",
  "2a02:ed8::/31",       // Zain Extended
  
  // ─ـ UMNIAH / BATELCO JORDAN (AS9038) ───────────────────────
  "2a00:d4c0::/32",      // Umniah Main
  "2a00:d4c0::/36",
  "2a00:d4c0:1::/48",
  "2a00:d4c0:2::/48",
  "2a00:d4c0:3::/48",
  "2a00:d4c0:4::/48",
  "2a00:d4c0::/31",      // Umniah Extended
  
  // ── AL MOUAKHAH / MADA (AS42912) ───────────────────────────
  "2a04:8640::/32",      // Mada Main
  "2a04:8640:1::/48",
  "2a04:8640:2::/48",
  "2a04:8640:3::/48",
  "2a04:8640::/31",      // Mada Extended
  
  // ─ـ AL HADATHEH (AS47887) ──────────────────────────────────
  "2a02:4780::/32",      // Hadatheh Main
  "2a02:4780:1::/48",
  "2a02:4780:2::/48",
  
  // ─ـ JORDAN TELECOM / ORANGE FIXED (AS8697) ────────────────
  "2a01:c40::/32",       // JT Main
  "2a01:c40::/36",
  "2a01:c40:1::/48",
  "2a01:c40:2::/48",
  "2a01:c40:3::/48",
  "2a01:c40:4::/48",
  "2a01:c40::/31",       // JT Extended
  
  // ─ـ VTEL / DAMAMAX (AS50670) ───────────────────────────────
  "2a02:2a60::/32",      // VTel Main
  "2a02:2a60:1::/48",
  "2a02:2a60:2::/48",
  "2a0c:b641::/32",      // DAMAMAX
  "2a0c:b641:1::/48",
  
  // ─ـ JORDAN EUROPEAN INTERNET / LINK (AS44702) ─────────────
  "2a05:f480::/32",      // Link Main
  "2a05:f480:1::/48",
  
  // ─ـ BROADBAND COMMUNICATIONS (AS28730) ─────────────────────
  "2a06:2d80::/32",      // Broadband Main
  "2a06:2d80:1::/48",
  
  // ─ـ AQABA ISP (AS60849) ────────────────────────────────────
  "2a07:2800::/32",      // Aqaba Main
  "2a07:2800:1::/48",
  
  // ─ـ NETWORK EXCHANGE TECHNOLOGY (AS21088) ─────────────────
  "2a03:b8c0::/32",      // Nexus Main
  "2a03:b8c0:1::/48",
  
  // ─ـ NITC / UNIVERSITIES (AS8934) ───────────────────────────
  "2a01:4f8:130::/48",   // Academic
  
  // ─ـ JO-IX / INTERNET EXCHANGE ──────────────────────────────
  "2001:16a0::/32",      // JO-IX
  "2001:16a0:1::/48",
  "2a01:b740::/32"
];

// ================================================================
//  PUBG DOMAINS - للتعرف على طلبات اللعبة
// ================================================================
var PUBG_MAP = {
  // Main domains
  "pubg.com": 1, "pubgmobile.com": 1, "pubgm.com": 1,
  "pubgmhd.com": 1, "krafton.com": 1, "playbattlegrounds.com": 1,
  "gpubgm.com": 1, "napubgm.broker.amsoveasea.com": 1,
  "intl.game.qq.com": 1, "pubg.qq.com": 1, "games.qq.com": 1,
  "pubgm.intl.qq.com": 1, "pubgmhd.qq.com": 1,
  "sharkvpg.pubgm.qq.com": 1, "sharkvpg.pubgmobile.com": 1,
  
  // Match servers
  "game.pubg.com": 1, "gamesvr.pubg.com": 1, "match.pubg.com": 1,
  "realtime.pubg.com": 1, "combat.pubg.com": 1, "tick.pubg.com": 1,
  "room.pubg.com": 1, "sync.pubg.com": 1, "battle.pubg.com": 1,
  "prod.pubg.com": 1, "battleservice.pubg.com": 1,
  
  // Lobby servers
  "lobby.pubg.com": 1, "dispatch.pubg.com": 1, "gateway.pubg.com": 1,
  "queue.pubg.com": 1, "region.pubg.com": 1, "recruit.pubg.com": 1,
  "session.pubg.com": 1, "gameservice.pubg.com": 1,
  "gameapi.pubgmobile.com": 1, "gateway.pubgmobile.com": 1,
  "dispatch.pubgmobile.com": 1,
  
  // Boot / social / CDN
  "social.pubg.com": 1, "presence.pubg.com": 1, "friend.pubg.com": 1,
  "party.pubg.com": 1, "clan.pubg.com": 1, "team.pubg.com": 1,
  "squad.pubg.com": 1, "invite.pubg.com": 1,
  "log.pubgmobile.com": 1, "report.pubgmobile.com": 1,
  "cdn.pubg.com": 1, "asset.pubg.com": 1, "patch.pubg.com": 1,
  "update.pubg.com": 1, "dl.pubg.com": 1, "resource.pubg.com": 1,
  "pubg.cdn.qq.com": 1, "pubgm.cdn.qq.com": 1, "ossgame.pubg.com": 1,
  
  // Additional
  "puzzle.pubg.com": 1, "api.pubg.com": 1,
  "account.pubg.com": 1, "auth.pubg.com": 1, "login.pubg.com": 1
};

var PUBG_SUFFIXES = [
  ".pubg.com", ".pubgmobile.com", ".pubgm.com",
  ".pubgmhd.com", ".krafton.com", ".playbattlegrounds.com",
  ".pubg.qq.com", ".pubgm.qq.com", ".pubgmhd.qq.com",
  ".gpubgm.com", ".amsoveasea.com"
];

// ================================================================
//  REGEX PATTERNS
// ================================================================
var RX_MATCH = /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|prod)\b/i;
var RX_LOBBY = /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|gameapi|gameservice)\b/i;
var RX_BOOT = /\b(cdn|asset|patch|update|dl|resource|ossgame|login|auth|account|token|session|social|friend|party|clan|invite|presence|report|log|sharkvpg|napubgm|api|puzzle)\b/i;

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
  return ip === "::1" || ip.slice(0, 5) === "fe80:" || ip.slice(0, 2) === "fc" || ip.slice(0, 2) === "fd";
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
    if ((parseInt(iP[full], 16) & mask) !== (parseInt(bP[full], 16) & mask)) return false;
  }
  return true;
}

function isJordanIP6(ip) {
  for (var i = 0; i < JO_IPV6.length; i++) {
    if (matchCIDR6(ip, JO_IPV6[i])) return true;
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
//  PROXY CHAINS - صارمة بدون DIRECT fallback
// ================================================================
function matchChain() {
  return MATCH_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
}

function lobbyChain() {
  return LOBBY_PROXY + "; " + ALT_PROXY + "; " + BLOCK;
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
//  MAIN FUNCTION - أردني فقط
// ================================================================
function FindProxyForURL(url, host) {
  host = norm(host);
  url = norm(url);

  if (PANIC_BLOCK_ALL) return BLOCK;

  // محلي - DIRECT
  if (isPlainHostName(host) || shExpMatch(host, "*.local") || host === "localhost") {
    return DIRECT;
  }

  // ── IPv4 - ممنوع تماماً ──────────────────────────────────────
  // أي IPv4_literal = BLOCK (ما عدا المحلي)
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    // السماح فقط للـ private IPs
    var parts = host.split(".");
    var first = parseInt(parts[0], 10);
    var second = parseInt(parts[1], 10);
    
    // 10.x.x.x
    if (first === 10) return DIRECT;
    // 172.16-31.x.x
    if (first === 172 && second >= 16 && second <= 31) return DIRECT;
    // 192.168.x.x
    if (first === 192 && second === 168) return DIRECT;
    // 127.x.x.x
    if (first === 127) return DIRECT;
    
    // أي IPv4 آخر = BLOCK
    return BLOCK;
  }

  // ── IPv6 LITERAL ─────────────────────────────────────────────
  if (isIP6(host)) {
    var ip6 = cleanIP6(host);
    
    // Private IPv6 - مسموح
    if (isPrivate6(ip6)) return DIRECT;
    
    // ── صارم: فقط IP أردني مسموح ─────────────────────────────
    if (!isJordanIP6(ip6)) {
      return BLOCK;  // أي IP غير أردني = BLOCK
    }

    // IP أردني - نفحص نوع الطلب
    var c = url + " " + host;

    // [1] BOOT - CDN/Auth عبر البروكسي (ما في DIRECT)
    if (RX_BOOT.test(c)) {
      return lobbyChain();  // حتى CDN يمر عبر البروكسي
    }

    // [2] MATCH
    if (RX_MATCH.test(c)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!lockMatch(host)) return BLOCK;
      return matchChain();
    }

    // [3] LOBBY
    if (DISABLE_LOBBY) return BLOCK;
    return lobbyChain();
  }

  // ── DOMAIN - PUBG فقط ───────────────────────────────────────
  if (isPubg(host)) {
    var c = url + " " + host;

    // [1] BOOT - عبر البروكسي
    if (RX_BOOT.test(c)) {
      return lobbyChain();
    }

    // [2] MATCH
    if (RX_MATCH.test(c)) {
      if (DISABLE_MATCH) return BLOCK;
      if (!lockMatch(host)) return BLOCK;
      return matchChain();
    }

    // [3] LOBBY
    if (DISABLE_LOBBY) return BLOCK;
    return lobbyChain();
  }

  // ─ـ أي domain غير PUBG ──────────────────────────────────────
  // للأمان: نرجع DIRECT للمواقع العادية
  return DIRECT;
}

// ================================================================
//  END – PUBG Mobile Jordan Lock v16.0
//  IPv6 فقط | أردنيين فقط | لا تسريب | صارم
// ================================================================
