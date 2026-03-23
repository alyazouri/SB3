// ============================================================
// PUBG MOBILE - JORDAN PAC SCRIPT v23
// IPv6-only Jordanian routing | Session-aware (Boot/Lobby/Match)
// Orange Jordan AS8376 | VTEL | Damamax | Zain | Umniah
// ============================================================

// ─── PROXY ENDPOINTS ────────────────────────────────────────
var PROXY_MATCH  = "SOCKS5 46.185.131.218:20001; PROXY 46.185.131.218:20001; SOCKS 46.185.131.218:20001";
var PROXY_LOBBY  = "PROXY 212.35.66.45:8085; SOCKS5 212.35.66.45:8085; SOCKS 212.35.66.45:8085";
var PROXY_ALT    = "HTTPS 46.185.131.218:443; PROXY 46.185.131.218:443";
var DIRECT       = "DIRECT";
var BLOCK        = "PROXY 127.0.0.1:1";

// ─── SESSION STATE ───────────────────────────────────────────
// States: BOOT | LOBBY | MATCH | IDLE | ERROR
var SESSION_STATE   = "BOOT";
var SESSION_SUBNET  = "";   // locked /48 prefix (lobby)
var SESSION_HOST    = "";   // locked /64 prefix (match)
var SESSION_HITS    = 0;
var SESSION_ERRORS  = 0;

var LOBBY_HIT_THRESHOLD = 3;   // hits before LOBBY lock
var MATCH_HIT_THRESHOLD = 5;   // hits before MATCH lock

// ─── DNS CACHE ───────────────────────────────────────────────
var HOST_CACHE = {};

// ============================================================
// JORDANIAN IPv6 CIDRs
// Source: RIPE NCC | Updated: 2026
// ============================================================

var JORDAN_V6_CIDRS = [
  // Orange Jordan (AS8376) - single /32 covers all allocations
  "2a01:9700::/32",

  // VTEL / Damamax (AS50670)
  "2a04:4540::/32",
  "2a04:4541::/32",
  "2001:16a0::/32",

  // Zain Jordan (AS9038)
  "2a01:4f8::/32",    // Hetzner-hosted Zain nodes
  "2a02:e680::/32",

  // Umniah (AS47887)
  "2a06:2840::/32",

  // Jordan Telecom / legacy
  "2a01:4f0::/32",

  // NITC / Gov (AS50466)
  "2a05:d018::/32"
];

// ─── BLOCKED REGIONS (neighboring countries) ────────────────
var BLOCKED_V6_CIDRS = [
  // Egypt (AS8452 TE-AS, AS36992 ETISALAT)
  "2a00:1200::/32",
  "2a02:ed0::/32",

  // Lebanon (AS9051 IDM, AS42020 Ogero)
  "2a02:e380::/32",
  "2001:16b0::/32",

  // Syria (AS29256)
  "2a01:9240::/32",

  // Iraq (AS199739, AS51684)
  "2a04:b000::/32",
  "2a06:1280::/32",

  // Iran (AS12880, AS44244)
  "2a00:1f00::/32",
  "2a02:f680::/32",

  // Turkey (AS9121 Turk Telekom)
  "2a00:d70::/32",

  // Saudi (AS25019 STC)
  "2a04:b880::/32",

  // Europe broad block
  "2a00::/11"
];

// ============================================================
// PUBG / TENCENT DOMAINS
// ============================================================

// CDN / patch / asset domains → DIRECT (don't break updates)
var CDN_DOMAINS = [
  ".akamaied.net",
  ".akamaihd.net",
  ".akamai.net",
  ".akamaitechnologies.com",
  ".edgesuite.net",
  ".edgekey.net",
  ".cloudfront.net",
  ".fastly.net",
  ".cdn77.org",
  ".cdnetworks.com",
  ".llnwd.net",
  ".footprint.net",
  ".steamcontent.com",
  ".steamstatic.com",
  ".xboxlive.com",
  ".windowsupdate.com",
  ".apple.com",
  ".icloud.com"
];

// PUBG/Tencent game servers → SESSION PROXY
var PUBG_GAME_DOMAINS = [
  // Tencent core
  ".pubgmobile.com",
  ".pubg.com",
  ".proximabeta.com",
  ".tencentgames.com",
  ".tencent.com",
  ".qq.com",
  ".wegame.com",
  ".hypergryph.com",

  // PUBG matchmaking / backend
  ".pubgm.io",
  ".pubgm-server.com",
  ".pubgstatic.com",

  // Tencent CDN (game-specific, proxied)
  ".myqcloud.com",
  ".qpic.cn",
  ".qcloud.com",
  ".dnspod.com",
  ".gtimg.com",

  // Anti-cheat / SDK
  ".anticheatexpert.com",
  ".msdk.qq.com",
  ".beacon.qq.com"
];

// Exact hosts - game servers (proxied)
var PUBG_EXACT_HOSTS = {
  "gameserver.pubgmobile.com":    true,
  "matchmaking.pubgmobile.com":   true,
  "lobby.pubgmobile.com":         true,
  "login.pubgmobile.com":         true,
  "patch.pubgmobile.com":         false,   // patch = DIRECT
  "update.pubgmobile.com":        false,
  "dl.pubgmobile.com":            false,
  "asset.pubgmobile.com":         false
};

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

// ─── DNS RESOLVE W/ CACHE ────────────────────────────────────
function resolveHostIP(host) {
  if (HOST_CACHE[host]) return HOST_CACHE[host];
  var ip = "";
  try { ip = dnsResolve(host); } catch (e) { ip = ""; }
  HOST_CACHE[host] = ip;
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
function hexNibbleToBin(ch) {
  ch = safeLower(ch);
  if (ch==="0") return "0000"; if (ch==="1") return "0001";
  if (ch==="2") return "0010"; if (ch==="3") return "0011";
  if (ch==="4") return "0100"; if (ch==="5") return "0101";
  if (ch==="6") return "0110"; if (ch==="7") return "0111";
  if (ch==="8") return "1000"; if (ch==="9") return "1001";
  if (ch==="a") return "1010"; if (ch==="b") return "1011";
  if (ch==="c") return "1100"; if (ch==="d") return "1101";
  if (ch==="e") return "1110"; if (ch==="f") return "1111";
  return "0000";
}

function ipv6ToBinary(ip) {
  var full = expandIPv6(ip);
  var hex  = full.split(":").join("");
  var out  = "";
  var i;
  for (i = 0; i < hex.length; i++) out += hexNibbleToBin(hex.charAt(i));
  return out;
}

// ─── IPv6 CIDR MATCH ─────────────────────────────────────────
function matchIPv6CIDR(ip, cidr) {
  if (!isIPv6(ip) || !cidr) return false;
  var p = cidr.indexOf("/");
  if (p === -1) return false;
  var net  = cidr.substring(0, p);
  var bits = parseInt(cidr.substring(p + 1), 10);
  if (isNaN(bits) || bits < 0 || bits > 128) return false;
  var ipBin  = ipv6ToBinary(ip);
  var netBin = ipv6ToBinary(net);
  return ipBin.substring(0, bits) === netBin.substring(0, bits);
}

function matchesAnyIPv6CIDR(ip, list) {
  if (!isIPv6(ip)) return false;
  var i;
  for (i = 0; i < list.length; i++) {
    if (matchIPv6CIDR(ip, list[i])) return true;
  }
  return false;
}

// ─── ORANGE JORDAN FAST CHECK ────────────────────────────────
// AS8376 entire /32 → prefix "2a01:9700:"
function isOrangeJordan(ip) {
  return isIPv6(ip) && safeLower(ip).indexOf("2a01:9700:") === 0;
}

// ============================================================
// DOMAIN CLASSIFIER
// ============================================================

function classifyURL(host) {
  host = safeLower(host);

  if (isLocalHost(host)) return "LOCAL";

  // Check CDN first (bypass before game check)
  var i;
  for (i = 0; i < CDN_DOMAINS.length; i++) {
    if (dnsDomainIs(host, CDN_DOMAINS[i])) return "CDN";
  }

  // Exact host override
  if (PUBG_EXACT_HOSTS[host] !== undefined) {
    return PUBG_EXACT_HOSTS[host] ? "GAME" : "CDN";
  }

  // PUBG / Tencent game domain
  for (i = 0; i < PUBG_GAME_DOMAINS.length; i++) {
    if (dnsDomainIs(host, PUBG_GAME_DOMAINS[i])) return "GAME";
  }

  return "OTHER";
}

// ============================================================
// SESSION ENGINE
// ============================================================

// Extract /48 prefix (first 3 groups of IPv6)
function getSubnet48(ip) {
  var full = expandIPv6(ip);
  var groups = full.split(":");
  return groups[0]+":"+groups[1]+":"+groups[2];
}

// Extract /64 prefix (first 4 groups of IPv6)
function getSubnet64(ip) {
  var full = expandIPv6(ip);
  var groups = full.split(":");
  return groups[0]+":"+groups[1]+":"+groups[2]+":"+groups[3];
}

function advanceSession(ip) {
  if (!isIPv6(ip)) return;

  var subnet48 = getSubnet48(ip);
  var subnet64  = getSubnet64(ip);

  if (SESSION_STATE === "BOOT") {
    SESSION_HITS++;
    if (SESSION_HITS >= LOBBY_HIT_THRESHOLD) {
      SESSION_STATE  = "LOBBY";
      SESSION_SUBNET = subnet48;
    }
    return;
  }

  if (SESSION_STATE === "LOBBY") {
    if (subnet48 !== SESSION_SUBNET) {
      SESSION_ERRORS++;
      if (SESSION_ERRORS > 2) {
        // subnet shifted, re-lock
        SESSION_SUBNET = subnet48;
        SESSION_ERRORS = 0;
      }
      return;
    }
    SESSION_HITS++;
    if (SESSION_HITS >= MATCH_HIT_THRESHOLD) {
      SESSION_STATE = "MATCH";
      SESSION_HOST  = subnet64;
      SESSION_HITS  = 0;
    }
    return;
  }

  if (SESSION_STATE === "MATCH") {
    if (subnet64 !== SESSION_HOST) {
      SESSION_ERRORS++;
      if (SESSION_ERRORS > 5) {
        // match ended, fall back to LOBBY
        SESSION_STATE  = "LOBBY";
        SESSION_HOST   = "";
        SESSION_SUBNET = subnet48;
        SESSION_ERRORS = 0;
      }
    }
  }
}

function sessionProxy() {
  if (SESSION_STATE === "MATCH")  return PROXY_MATCH;
  if (SESSION_STATE === "LOBBY")  return PROXY_LOBBY;
  if (SESSION_STATE === "BOOT")   return PROXY_LOBBY;   // safe default during boot
  return PROXY_ALT;
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

  if (kind === "LOCAL")  return DIRECT;
  if (kind === "CDN")    return DIRECT;
  if (kind === "OTHER")  return DIRECT;    // non-PUBG traffic = DIRECT

  // ── 4. GAME traffic: resolve IP ──────────────────────────
  ip = resolveHostIP(hostL);

  if (!ip || ip === "") {
    // DNS failed → fail-closed: use session proxy anyway
    return sessionProxy();
  }

  fullIP = isIPv6(ip) ? expandIPv6(ip) : ip;

  // ── 5. IPv4 game traffic: block (IPv6-only policy) ───────
  if (isIPv4(fullIP)) return BLOCK;

  // ── 6. Check Jordan membership ───────────────────────────
  var isJordan = isOrangeJordan(fullIP) ||
                 matchesAnyIPv6CIDR(fullIP, JORDAN_V6_CIDRS);

  // ── 7. Check blocked regions ─────────────────────────────
  var isBlocked = matchesAnyIPv6CIDR(fullIP, BLOCKED_V6_CIDRS);

  if (isBlocked && !isJordan) return BLOCK;

  if (!isJordan) return BLOCK;   // strict: non-Jordan PUBG IPs = blocked

  // ── 8. Advance session state ─────────────────────────────
  advanceSession(fullIP);

  // ── 9. Route via session proxy ───────────────────────────
  return sessionProxy();
}
