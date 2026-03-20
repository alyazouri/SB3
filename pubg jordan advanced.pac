// ============================================================
// PUBG Jordan Advanced PAC Script — v23
// Goal: Maximum Jordanian player pool + Lobby visibility fix
// Proxy MATCH  : 46.185.131.218:20001
// Proxy LOBBY  : 212.35.66.45:8085
// Proxy ALT    : 46.185.131.218:443
// ============================================================

var _state   = "BOOT";   // BOOT | LOBBY | MATCH
var _session = "";       // locked /48 prefix
var _ts      = 0;        // session timestamp

var PROXY_MATCH = "PROXY 46.185.131.218:20001";
var PROXY_LOBBY = "PROXY 212.35.66.45:8085";
var PROXY_ALT   = "PROXY 46.185.131.218:443";

// ── Jordanian IPv6 allocations (RIPE NCC verified) ──────────
// Orange Jordan  AS8376  → 2a01:9700::/32
// Zain Jordan    AS47887 → 2a06:8ec0::/32
// Umniah         AS9038  → 2a01:d40::/32
// VTEL/Damamax   AS50670 → 2a05:b400::/32
// Batelco JO     AS48832 → 2a06:8840::/32

function isJordanianIPv6(ip) {
    if (!ip || ip.indexOf(":") === -1) return false;
    var prefixes = [
        "2a01:9700:",   // Orange Jordan  AS8376
        "2a06:8ec0:",   // Zain Jordan    AS47887
        "2a01:d40:",    // Umniah         AS9038
        "2a05:b400:",   // VTEL/Damamax   AS50670
        "2a06:8840:"    // Batelco JO     AS48832
    ];
    for (var i = 0; i < prefixes.length; i++) {
        if (ip.toLowerCase().indexOf(prefixes[i]) === 0) return true;
    }
    return false;
}

// ── Prefix extraction (/48 for session lock) ────────────────
function getPrefix48(ip) {
    if (!ip || ip.indexOf(":") === -1) return "";
    var parts = ip.split(":");
    return parts.slice(0, 3).join(":") + ":";
}

// ── CDN / patch domains → always DIRECT ─────────────────────
function isCDN(host) {
    var cdn = [
        "patch.pubgmobile.com",
        "autopatch.groundbattles.com",
        "cdnos.battlegrounds.qq.com",
        "dtcenter.qq.com",
        "apple.com",
        "icloud.com",
        "appstore.com",
        "akamaihd.net",
        "cloudfront.net",
        "fastly.net"
    ];
    for (var i = 0; i < cdn.length; i++) {
        if (dnsDomainIs(host, cdn[i]) || shExpMatch(host, "*." + cdn[i])) return true;
    }
    return false;
}

// ── PUBG / Tencent game domains ──────────────────────────────
function isPUBG(host) {
    var domains = [
        "pubgmobile.com",
        "groundbattles.com",
        "battlegrounds.qq.com",
        "sgamess.com",
        "proxym.qq.com",
        "tencent.com",
        "tencentgames.com",
        "hipubg.com",
        "pubg.com",
        "krjp.pubg.com",
        "as-gameserver.pubg.com"
    ];
    for (var i = 0; i < domains.length; i++) {
        if (dnsDomainIs(host, domains[i]) || shExpMatch(host, "*." + domains[i])) return true;
    }
    return false;
}

// ── Block non-Jordanian regions (fail-closed) ────────────────
function isBlockedRegion(ip) {
    if (!ip || ip.indexOf(":") === -1) return false;
    var blocked = [
        "2a00:",        // Europe (generic)
        "2001:db8:",    // Documentation range
        "2404:",        // Asia-Pacific (non-JO)
        "2403:",        // Asia-Pacific (non-JO)
        "2400:",        // Asia-Pacific (non-JO)
        "2800:",        // Latin America
        "2c0f:"         // Africa
    ];
    var ipLow = ip.toLowerCase();
    for (var i = 0; i < blocked.length; i++) {
        if (ipLow.indexOf(blocked[i]) === 0) return true;
    }
    return false;
}

// ── Session state machine ────────────────────────────────────
function classifyHost(host) {
    if (shExpMatch(host, "*lobby*") ||
        shExpMatch(host, "*matchmak*") ||
        shExpMatch(host, "*roster*") ||
        shExpMatch(host, "*room*")) {
        return "LOBBY";
    }
    if (shExpMatch(host, "*gameserver*") ||
        shExpMatch(host, "*gs.*") ||
        shExpMatch(host, "*match*") ||
        shExpMatch(host, "*battle*")) {
        return "MATCH";
    }
    return "PUBG";
}

// ── Main PAC function ────────────────────────────────────────
function FindProxyForURL(url, host) {

    // 1. CDN / patch → DIRECT always
    if (isCDN(host)) return "DIRECT";

    // 2. Non-PUBG traffic → DIRECT
    if (!isPUBG(host)) return "DIRECT";

    // 3. Resolve host to IPv6
    var ip = dnsResolveEx ? dnsResolveEx(host) : dnsResolve(host);

    // 4. BOOT phase: allow DIRECT for initial load, then lock
    if (_state === "BOOT") {
        var phase = classifyHost(host);
        if (phase === "LOBBY") {
            _state = "LOBBY";
            if (ip) _session = getPrefix48(ip);
        }
        // During BOOT → route via LOBBY proxy to fix visibility issue
        return PROXY_LOBBY;
    }

    // 5. LOBBY phase: strict Jordanian-only routing
    if (_state === "LOBBY") {
        if (!ip) return PROXY_LOBBY; // no resolution → force JO proxy

        // Lock session to /48 prefix on first Jordanian IP seen
        if (isJordanianIPv6(ip) && _session === "") {
            _session = getPrefix48(ip);
        }

        // Enforce session lock: only allow matching /48
        if (_session !== "" && ip.indexOf(_session) !== 0) {
            return "PROXY 0.0.0.0:0"; // block non-session IPs
        }

        if (isBlockedRegion(ip)) return "PROXY 0.0.0.0:0";

        // Transition to MATCH when game server detected
        if (classifyHost(host) === "MATCH") {
            _state = "MATCH";
            return PROXY_MATCH;
        }

        return PROXY_LOBBY;
    }

    // 6. MATCH phase: locked to session prefix
    if (_state === "MATCH") {
        if (!ip) return PROXY_MATCH;

        if (_session !== "" && ip.indexOf(_session) !== 0) {
            return PROXY_ALT; // fallback alt proxy, not DIRECT
        }

        return PROXY_MATCH;
    }

    // 7. Fallback: route all PUBG traffic via MATCH proxy
    return PROXY_MATCH;
}
