// ============================================================
// PUBG Jordan PAC Script — v24 (Precise Lobby Domains)
// Fix: Lobby visibility — all presence/social/room TCP traffic
//      forced through single Jordanian proxy from BOOT phase
// Proxy LOBBY : 212.35.66.45:8085
// Proxy MATCH : 46.185.131.218:20001
// Proxy ALT   : 46.185.131.218:443
// ============================================================

var PROXY_LOBBY = "PROXY 212.35.66.45:8085";
var PROXY_MATCH = "PROXY 46.185.131.218:20001";
var PROXY_ALT   = "PROXY 46.185.131.218:443";
var BLOCK       = "PROXY 0.0.0.0:0";

// ── Jordanian IPv6 prefixes (RIPE NCC verified) ──────────────
var JO_PREFIXES = [
    "2a01:9700:",   // Orange Jordan  AS8376
    "2a06:8ec0:",   // Zain Jordan    AS47887
    "2a01:d40:",    // Umniah         AS9038
    "2a05:b400:",   // VTEL/Damamax   AS50670
    "2a06:8840:"    // Batelco JO     AS48832
];

// ── Blocked non-Jordanian IPv6 regions ──────────────────────
var BLOCKED_PREFIXES = [
    "2a00:",        // Europe
    "2404:", "2403:", "2400:",  // Asia-Pacific
    "2800:",        // Latin America
    "2c0f:"         // Africa
];

// ── CDN / Patch: always DIRECT ───────────────────────────────
var CDN_DOMAINS = [
    "patch.pubgmobile.com",
    "autopatch.groundbattles.com",
    "cdnos.battlegrounds.qq.com",
    "dtcenter.qq.com",
    "akamaihd.net",
    "cloudfront.net",
    "fastly.net",
    "apple.com",
    "icloud.com",
    "appstore.com"
];

// ── Lobby presence / social / room domains ───────────────────
// These control whether other players SEE YOU in the lobby
var LOBBY_DOMAINS = [
    "sdkconnector.pubgmobile.com",
    "connector.pubgmobile.com",
    "presence.pubgmobile.com",
    "lobby.pubgmobile.com",
    "social.pubgmobile.com",
    "friend.pubgmobile.com",
    "imservice.pubgmobile.com",
    "push.pubgmobile.com",
    "community.pubgmobile.com",
    "api.pubgmobile.com",
    "api2.pubgmobile.com",
    "match.pubgmobile.com",
    "region.pubgmobile.com",
    "allocator.pubgmobile.com",
    "gs.pubgmobile.com",
    "msdk.qq.com",
    "msdktest.qq.com",
    "qqconnect.qq.com",
    "openmobile.qq.com",
    "wns.qq.com",
    "wns2.qq.com"
];

// ── Match server domains ─────────────────────────────────────
var MATCH_DOMAINS = [
    "gameserver.pubgmobile.com",
    "as-gameserver.pubg.com",
    "krjp.pubg.com",
    "battlegrounds.qq.com",
    "groundbattles.com",
    "sgamess.com",
    "proxym.qq.com",
    "hipubg.com"
];

// ── General PUBG domains (fallback) ─────────────────────────
var PUBG_DOMAINS = [
    "pubgmobile.com",
    "pubg.com",
    "tencent.com",
    "tencentgames.com",
    "qq.com"
];

// ── Helper: domain match ─────────────────────────────────────
function matchesList(host, list) {
    for (var i = 0; i < list.length; i++) {
        if (dnsDomainIs(host, list[i]) || host === list[i]) return true;
    }
    return false;
}

// ── Helper: IPv6 prefix match ────────────────────────────────
function matchesPrefix(ip, list) {
    if (!ip || ip.indexOf(":") === -1) return false;
    var ipLow = ip.toLowerCase();
    for (var i = 0; i < list.length; i++) {
        if (ipLow.indexOf(list[i]) === 0) return true;
    }
    return false;
}

// ── Helper: get /48 session prefix ──────────────────────────
function prefix48(ip) {
    var parts = ip.split(":");
    return parts.slice(0, 3).join(":") + ":";
}

// ── Session state ────────────────────────────────────────────
var _session = "";

// ── Main PAC function ────────────────────────────────────────
function FindProxyForURL(url, host) {

    // 1. CDN / patch → DIRECT, never proxied
    if (matchesList(host, CDN_DOMAINS)) return "DIRECT";

    // 2. Lobby presence domains → LOBBY proxy, unconditional
    //    This is the fix: no IP check, no session lock required
    //    All players sharing this proxy appear from the same IP
    //    so the server registers them as mutually visible
    if (matchesList(host, LOBBY_DOMAINS)) return PROXY_LOBBY;

    // 3. Match server domains → resolve IP, enforce Jordan-only
    if (matchesList(host, MATCH_DOMAINS)) {
        var ip = dnsResolveEx ? dnsResolveEx(host) : dnsResolve(host);
        if (!ip) return PROXY_MATCH;

        // Block non-Jordanian regions
        if (matchesPrefix(ip, BLOCKED_PREFIXES)) return BLOCK;

        // Lock session to first Jordanian /48 seen
        if (matchesPrefix(ip, JO_PREFIXES)) {
            if (_session === "") _session = prefix48(ip);
            if (_session !== "" && ip.toLowerCase().indexOf(_session) !== 0) {
                return PROXY_ALT; // same proxy network, different entry
            }
            return PROXY_MATCH;
        }

        // Unknown IP → ALT proxy, not DIRECT
        return PROXY_ALT;
    }

    // 4. General PUBG domains → LOBBY proxy as safe default
    if (matchesList(host, PUBG_DOMAINS)) return PROXY_LOBBY;

    // 5. Everything else → DIRECT
    return "DIRECT";
}
