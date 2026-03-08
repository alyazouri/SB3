// ============================================================
//  PUBG Mobile Jordan PAC Script — v3.0
//  Proxy: SOCKS5 91.106.109.50:1080
//  Goal: Route PUBG traffic + Jordan ISPs via proxy,
//        block irrelevant regions, pass CDN/patches direct
// ============================================================

var PROXY  = "SOCKS5 91.106.109.50:1080";
var DIRECT = "DIRECT";

// ── Fast hostname check ──────────────────────────────────────
function isLocal(host) {
    return isPlainHostName(host) ||
           host === "localhost"  ||
           host.indexOf("192.168.") === 0 ||
           host.indexOf("10.")     === 0  ||
           host.indexOf("172.16.") === 0;
}

// ── PUBG / Tencent domains ───────────────────────────────────
function isPubgDomain(host) {
    return dnsDomainIs(host, ".pubgmobile.com")      ||
           dnsDomainIs(host, ".pubg.com")            ||
           dnsDomainIs(host, ".igamecj.com")         ||
           dnsDomainIs(host, ".proximabeta.com")     ||
           dnsDomainIs(host, ".tencent.com")         ||
           dnsDomainIs(host, ".qcloud.com")          ||
           dnsDomainIs(host, ".tencent-cloud.net")   ||
           dnsDomainIs(host, ".gcloud.qq.com")       ||
           dnsDomainIs(host, ".myqcloud.com")        ||
           dnsDomainIs(host, ".tencentcs.com");
}

// ── Game server host patterns ────────────────────────────────
function isGameServer(host) {
    return shExpMatch(host, "*gamesvr*")    ||
           shExpMatch(host, "*realtime*")   ||
           shExpMatch(host, "*relay*")      ||
           shExpMatch(host, "*gs-relay*")   ||
           shExpMatch(host, "*edge*")       ||
           shExpMatch(host, "*battle*")     ||
           shExpMatch(host, "*classic*")    ||
           shExpMatch(host, "*arena*")      ||
           shExpMatch(host, "*royale*")     ||
           shExpMatch(host, "*lobby*")      ||
           shExpMatch(host, "*matchmak*")   ||
           shExpMatch(host, "*queue*")      ||
           shExpMatch(host, "*login*")      ||
           shExpMatch(host, "*gateway*")    ||
           shExpMatch(host, "*session*")    ||
           shExpMatch(host, "*profile*")    ||
           shExpMatch(host, "*turn.*")      ||
           shExpMatch(host, "*stun.*")      ||
           shExpMatch(host, "*udprelay*");
}

// ── CDN / patch — let these go DIRECT to avoid extra latency ─
function isCdn(host) {
    return dnsDomainIs(host, ".akamaied.net")    ||
           dnsDomainIs(host, ".akamaihd.net")    ||
           dnsDomainIs(host, ".cloudfront.net")  ||
           dnsDomainIs(host, ".fastly.net")      ||
           dnsDomainIs(host, ".edgesuite.net")   ||
           dnsDomainIs(host, ".llnwd.net");
}

// ── IP helpers ───────────────────────────────────────────────
function isBlockedRegion(ip) {
    // Africa / unrelated APAC blocs — avoid bad routing
    return isInNet(ip, "41.0.0.0",  "255.0.0.0") ||   // Africa
           isInNet(ip, "102.0.0.0", "255.0.0.0") ||   // Africa
           isInNet(ip, "5.0.0.0",   "255.0.0.0") ||   // RIPE (Europe noise)
           isInNet(ip, "39.0.0.0",  "255.0.0.0");     // APAC noise
}

function isTencentIP(ip) {
    return isInNet(ip, "43.154.0.0",  "255.254.0.0") ||  // HK/SG
           isInNet(ip, "43.156.0.0",  "255.255.0.0") ||  // SG
           isInNet(ip, "49.51.0.0",   "255.255.0.0") ||
           isInNet(ip, "49.52.0.0",   "255.254.0.0") ||
           isInNet(ip, "129.204.0.0", "255.255.0.0") ||
           isInNet(ip, "129.211.0.0", "255.255.0.0") ||
           isInNet(ip, "129.226.0.0", "255.255.0.0") ||
           isInNet(ip, "150.109.0.0", "255.255.0.0") ||
           isInNet(ip, "170.106.0.0", "255.255.0.0") ||
           isInNet(ip, "170.107.0.0", "255.255.0.0") ||
           isInNet(ip, "162.62.0.0",  "255.255.0.0") ||  // Tencent Cloud
           isInNet(ip, "175.27.0.0",  "255.255.0.0");    // Tencent Beijing
}

function isJordanIP(ip) {
    // ── Orange Jordan (AS8376) ──
    return isInNet(ip, "82.212.64.0",  "255.255.224.0") ||  // /19
           isInNet(ip, "82.212.96.0",  "255.255.224.0") ||  // /19
           isInNet(ip, "176.29.0.0",   "255.255.0.0")   ||  // /16
           isInNet(ip, "185.100.64.0", "255.255.192.0") ||  // /18
    // ── Zain Jordan (AS48832) ──
           isInNet(ip, "91.106.96.0",  "255.255.224.0") ||  // /19
           isInNet(ip, "91.106.128.0", "255.255.128.0") ||  // /17
           isInNet(ip, "188.247.0.0",  "255.255.128.0") ||  // /17
           isInNet(ip, "46.32.0.0",    "255.255.192.0") ||  // /18
    // ── Umniah (AS9038) ──
           isInNet(ip, "213.6.0.0",    "255.255.0.0")   ||  // /16
           isInNet(ip, "212.34.0.0",   "255.255.0.0")   ||  // /16
           isInNet(ip, "85.159.192.0", "255.255.192.0") ||  // /18
    // ── Jordan Telecom / JTC (AS8697) ──
           isInNet(ip, "37.98.192.0",  "255.255.192.0") ||  // /18
           isInNet(ip, "193.188.0.0",  "255.255.128.0") ||  // /17
           isInNet(ip, "37.205.32.0",  "255.255.224.0") ||  // /19
    // ── DAMAMAX / VTel (AS47887) ──
           isInNet(ip, "217.144.176.0","255.255.240.0") ||  // /20
           isInNet(ip, "195.123.224.0","255.255.224.0");    // /19
}

function isMiddleEastIP(ip) {
    return isInNet(ip, "15.184.0.0",  "255.248.0.0") ||   // AWS ME-SOUTH
           isInNet(ip, "15.185.0.0",  "255.255.0.0") ||
           isInNet(ip, "157.175.0.0", "255.255.0.0") ||   // AWS ME-SOUTH
           isInNet(ip, "3.28.0.0",    "255.255.0.0") ||   // AWS UAE
           isInNet(ip, "51.16.0.0",   "255.255.0.0");     // AWS IL (low latency to JO)
}

// ════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════
function FindProxyForURL(url, host) {

    // 1. Local / intranet → direct
    if (isLocal(host)) return DIRECT;

    // 2. CDN / patch servers → direct (no benefit from proxy)
    if (isCdn(host)) return DIRECT;

    // 3. PUBG / Tencent domains → proxy
    if (isPubgDomain(host)) return PROXY;

    // 4. Game-server host patterns → proxy
    if (isGameServer(host)) return PROXY;

    // 5. Known PUBG UDP ports → proxy
    if (shExpMatch(url, "*:10010*") || shExpMatch(url, "*:10012*") ||
        shExpMatch(url, "*:10013*") || shExpMatch(url, "*:17000*") ||
        shExpMatch(url, "*:17500*") || shExpMatch(url, "*:20000*") ||
        shExpMatch(url, "*:20001*") || shExpMatch(url, "*:20002*")) {
        return PROXY;
    }

    // 6. IP-based rules (resolve once)
    var ip = dnsResolve(host);
    if (ip) {
        if (isBlockedRegion(ip)) return DIRECT;   // avoid bad paths
        if (isTencentIP(ip))     return PROXY;
        if (isJordanIP(ip))      return PROXY;
        if (isMiddleEastIP(ip))  return PROXY;
    }

    // 7. Default — route via proxy (safe for unknown PUBG endpoints)
    return PROXY;
}
