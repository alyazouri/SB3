// PUBG Jordan Matchmaking PAC Script — Minimal Build
// Proxy: 46.185.131.218:20001 (Match/Lobby)
// Purpose: Route PUBG/Tencent traffic through Jordanian IP only

function FindProxyForURL(url, host) {

    var PROXY_JO = "PROXY 46.185.131.218:20001";

    // --- CDN & Patch traffic: bypass proxy to avoid breaking downloads ---
    var directHosts = [
        "cdnos.battlegrounds.qq.com",
        "dtcenter.qq.com",
        "patch.pubgmobile.com",
        "autopatch.groundbattles.com",
        "appstore.com",
        "apple.com",
        "icloud.com"
    ];

    for (var i = 0; i < directHosts.length; i++) {
        if (dnsDomainIs(host, directHosts[i]) || shExpMatch(host, "*." + directHosts[i])) {
            return "DIRECT";
        }
    }

    // --- PUBG Mobile & Tencent game domains: force through Jordanian proxy ---
    var proxyDomains = [
        "pubgmobile.com",
        "groundbattles.com",
        "battlegrounds.qq.com",
        "sgamess.com",
        "proxym.qq.com",
        "tencent.com",
        "tencentgames.com",
        "hipubg.com"
    ];

    for (var i = 0; i < proxyDomains.length; i++) {
        if (dnsDomainIs(host, proxyDomains[i]) || shExpMatch(host, "*." + proxyDomains[i])) {
            return PROXY_JO;
        }
    }

    // --- All other traffic: direct ---
    return "DIRECT";
}
