// ============================================================
// PAC Script - PUBG Mobile Jordan IPv6 Only
// Ultra Low Latency Edition - No Proxy
// ============================================================

// ── DNS Cache محلي لتقليل عمليات الـ resolve ───────────────
var _cache = {};

// ── نطاقات IPv6 الأردنية (RIPE NCC verified) ───────────────
var JORDAN = [
    "2a019700",  // Orange Jordan  AS8376
    "2a068ec0",  // Zain           AS47887
    "20010df4",  // Zain           AS47887
    "2a020ed0",  // Umniah         AS50670
    "200116a0",  // VTEL/Damamax   AS42346
    "2a05b480",  // JTC            AS8697
    "2a0102e0",  // Batelco        AS39756
];

// ── المنافذ المصنّفة مسبقاً كـ lookup table ────────────────
var PORT_TYPE = {
    443:   "lobby",
    8080:  "lobby",
    8085:  "lobby",
    8443:  "lobby",
    9000:  "lobby",
    9443:  "lobby",
    10000: "lobby",
    10001: "lobby",
    10011: "lobby",
    7086:  "match",
    10012: "match",
    17000: "match",
    17001: "match",
    17002: "match",
    17003: "match",
    17500: "match",
    20001: "match",
    30000: "match",
    30001: "match",
};

// ── نطاقات PUBG/Tencent ────────────────────────────────────
var PUBG = {
    "pubgmobile.com":1, "pubg.com":1,
    "proxima.beta.p1.pubgm.com":1,
    "sgp-prod-matchmaking.pubgmobile.com":1,
    "sgp-prod-mission.pubgmobile.com":1,
    "mi.gamesafe.qq.com":1, "yshield.qq.com":1,
    "msdkglobal.weixin.com":1, "msdk.qq.com":1,
    "hwossglobal.game.qq.com":1,
    "ossglobal.game.qq.com":1,
    "qos.pubgmobile.com":1,
};

// ── CDN → DIRECT دائماً ────────────────────────────────────
var CDN = {
    "akamai.net":1, "akamaiedge.net":1, "akamaihd.net":1,
    "cloudfront.net":1, "fastly.net":1,
    "cdn.qq.com":1, "dlied5.qq.com":1, "imtt.dd.qq.com":1,
};

var BLOCK = "PROXY 127.0.0.1:1";

// ===========================================================
// دوال مساعدة — مُحسَّنة للسرعة
// ===========================================================

// object lookup بدل حلقة for → أسرع بكثير
function domainMatch(host, map) {
    var h = host.toLowerCase();
    if (map[h]) return true;
    var dot = h.indexOf(".");
    while (dot !== -1) {
        var parent = h.slice(dot + 1);
        if (map[parent]) return true;
        dot = h.indexOf(".", dot + 1);
    }
    return false;
}

function isJordan(host) {
    if (host.charAt(0) !== "[") return false;
    var raw = host.slice(1, host.lastIndexOf("]"))
                  .toLowerCase()
                  .replace(/:/g, "");
    // early-exit: أول 4 chars تكفي لفلترة 90% من الحالات
    var head = raw.slice(0, 4);
    for (var i = 0; i < JORDAN.length; i++) {
        if (JORDAN[i].slice(0, 4) === head &&
            raw.indexOf(JORDAN[i]) === 0) return true;
    }
    return false;
}

function getPort(url) {
    var m = url.match(/:(\d{2,5})(\/|$)/);
    return m ? parseInt(m[1], 10) : 0;
}

// ===========================================================
// الدالة الرئيسية
// ===========================================================

function FindProxyForURL(url, host) {

    // ── Cache hit → قرار فوري بدون أي حسابات ──────────────
    if (_cache[host]) return _cache[host];

    var port    = getPort(url);
    var portCat = PORT_TYPE[port];   // "match" | "lobby" | undefined

    // 1) CDN / Patch
    if (domainMatch(host, CDN)) {
        _cache[host] = "DIRECT";
        return "DIRECT";
    }

    // 2) IPv4 → BLOCK فوري (IPv6-only policy)
    if (host.charCodeAt(0) >= 48 && host.charCodeAt(0) <= 57) {
        return BLOCK;   // لا نُخزّن IPs في الكاش لتوفير الذاكرة
    }

    // 3) Localhost / LAN
    if (isPlainHostName(host) || host === "localhost") {
        _cache[host] = "DIRECT";
        return "DIRECT";
    }

    // 4) IPv6 literal — المسار الأساسي للعبة
    if (host.charAt(0) === "[") {
        if (!isJordan(host)) return BLOCK;
        if (!portCat)        return BLOCK;  // منفذ غير معروف → BLOCK
        return "DIRECT";
        // IPv6 literals لا تُخزَّن — تتغير مع كل session
    }

    // 5) PUBG domains بالاسم
    if (domainMatch(host, PUBG)) {
        if (!portCat) return BLOCK;
        _cache[host] = "DIRECT";
        return "DIRECT";
    }

    // 6) Fail-closed
    return BLOCK;
}
