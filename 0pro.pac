/* =========================================================
   PUBG Jordan PAC — v2 (مصحّح ومقوّى)
   ---------------------------------------------------------
   ⚠️ حدود صريحة:
   1) PAC يتحكم فقط بـ HTTP/HTTPS (TCP). حزم اللعب UDP
      لن تمر عبر هذا البروكسي — تثبيت Match Host هنا يعني
      تثبيت خوادم التحكم/API فقط.
   2) حالة SESSION قد لا تستمر بين الاستدعاءات في بعض
      التطبيقات، لذا الـ Sticky غير مضمون 100%.
   3) حجب IPv6 عبر PAC غير فعّال لأن PAC يستقبل أسماء
      النطاقات لا العناوين المحلولة.
   ========================================================= */

/* ---------- 1) SETTINGS ---------- */
var ENABLE_JORDAN_ONLY = true;   // فعّل منطق الأردن
var BLOCK_IPV6         = true;   // احجب IPv6 (لأهداف IPv4)
var STICKY_MATCH       = true;   // ثبّت نفس خادم الماتش
var STICKY_LOBBY       = true;   // ثبّت نفس خادم اللوبي
var BLOCK_NON_JORDAN   = false;  // ⚠️ true = يقطع كل IPv4 غير الأردني (يكسر الإنترنت)
var PANIC_BLOCK_ALL    = false;  // قطع كل شيء
var AUTH_VIA_PROXY     = true;   // login/auth عبر البروكسي (يؤثر على منطقة الحساب)

/* ---------- 2) PROXY POOL (بروكسياتك — تحقق من حيويتها دورياً) ---------- */
var JO_PROXY_1 = "PROXY 176.28.184.141:80";
var JO_PROXY_2 = "PROXY 176.28.184.141:443";
var JO_PROXY_3 = "PROXY 212.35.66.45:20001";

/* ---------- 3) FAIL CLOSED / DIRECT ---------- */
var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

/* ---------- 4) SESSION STATE ---------- */
var SESSION = { matchHost: null, lobbyHost: null };

/* ---------- 5) JORDAN CIDR ----------
   أعد توليد هذه القائمة من بيانات RIPE/BGP دورياً.
   - 176.28.128.0/17 = Zain / AS48832 (مؤكد)
   - 193.188.0.0/16 حُذفت: ليست أردنية بالكامل (متعددة الدول)
   - الباقي بحاجة تحقق من RIPE قبل الاعتماد عليه
------------------------------------ */
var JO_IPV4 = [
    "82.212.0.0/16",      // تحقق
    "94.142.32.0/19",     // تحقق
    "87.236.192.0/18",    // تحقق
    "46.23.112.0/20",     // تحقق
    "37.202.64.0/18",     // تحقق
    "185.51.0.0/18",      // تحقق
    "176.28.128.0/17",    // Zain / AS48832 (مؤكد)
    "212.35.0.0/17",      // تحقق
    "213.139.32.0/19",    // تحقق
    "185.82.0.0/18"       // تحقق
];

/* ---------- 6) PUBG DOMAINS ---------- */
var PUBG_DOMAINS = [
    "pubg.com",
    "pubgmobile.com",
    "pubgm.com",
    "pubgmhd.com",
    "krafton.com",
    "playbattlegrounds.com",
    "pubg.qq.com",
    "pubgm.qq.com",
    "pubgmhd.qq.com",
    "gpubgm.com",
    "amsoveasea.com"
];

/* ---------- 7) CLASSIFICATION ---------- */
var RX_MATCH = /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|game-server|battle-server|gameserver)\b/i;
var RX_LOBBY = /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|gameapi|gameservice|party|team)\b/i;
var RX_CDN   = /\b(cdn|asset|patch|update|download|resource|ossgame|static|file|img|media)\b/i;
var RX_AUTH  = /\b(login|auth|account|token|session|social|friend|clan|invite|presence|report|config|user|profile|passport)\b/i;

/* ---------- 8) IP HELPERS ---------- */
function ipToNum(ip) {
    var o = ip.split(".");
    return (
        ((parseInt(o[0], 10) & 0xFF) << 24) |
        ((parseInt(o[1], 10) & 0xFF) << 16) |
        ((parseInt(o[2], 10) & 0xFF) << 8)  |
         (parseInt(o[3], 10) & 0xFF)
    ) >>> 0;
}

/* تُحسب مرة واحدة عند التحميل */
var JO_NETS = (function () {
    var out = [];
    for (var i = 0; i < JO_IPV4.length; i++) {
        var p = JO_IPV4[i].split("/");
        var bits = parseInt(p[1], 10);
        var mask = bits === 0 ? 0 : ((0xFFFFFFFF << (32 - bits)) >>> 0);
        out.push({ base: ipToNum(p[0]), mask: mask });
    }
    return out;
})();

function isJordan4(ip) {
    var n = ipToNum(ip);
    for (var i = 0; i < JO_NETS.length; i++) {
        if ((n & JO_NETS[i].mask) === (JO_NETS[i].base & JO_NETS[i].mask)) {
            return true;
        }
    }
    return false;
}

function isIPv4(host) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

function isIPv6(host) {
    return host.indexOf(":") !== -1;
}

/* تُستدعى فقط على عناوين IPv4 حرفية (لا تسبب DNS) */
function isPrivate4(ip) {
    return (
        isInNet(ip, "10.0.0.0", "255.0.0.0") ||
        isInNet(ip, "172.16.0.0", "255.240.0.0") ||
        isInNet(ip, "192.168.0.0", "255.255.0.0") ||
        isInNet(ip, "127.0.0.0", "255.0.0.0") ||
        isInNet(ip, "169.254.0.0", "255.255.0.0")
    );
}

/* ---------- 9) DOMAIN HELPERS ---------- */
function isPUBGDomain(host) {
    host = host.toLowerCase();
    for (var i = 0; i < PUBG_DOMAINS.length; i++) {
        if (host === PUBG_DOMAINS[i] || dnsDomainIs(host, "." + PUBG_DOMAINS[i])) {
            return true;
        }
    }
    return false;
}

function isMatch(host) { return RX_MATCH.test(host); }
function isLobby(host) { return RX_LOBBY.test(host); }
function isCDN(host)   { return RX_CDN.test(host); }
function isAuth(host)  { return RX_AUTH.test(host); }

/* ---------- 10) CHAINS ---------- */
function matchChain() {
    return JO_PROXY_1 + "; " + JO_PROXY_2 + "; " + JO_PROXY_3 + "; " + BLOCK;
}
function lobbyChain() {
    return JO_PROXY_3 + "; " + JO_PROXY_1 + "; " + JO_PROXY_2 + "; " + BLOCK;
}

/* ---------- 11) STICKY ---------- */
function lockMatch(host) {
    if (!STICKY_MATCH) return true;
    if (SESSION.matchHost === null) { SESSION.matchHost = host; return true; }
    return SESSION.matchHost === host;
}
function lockLobby(host) {
    if (!STICKY_LOBBY) return true;
    if (SESSION.lobbyHost === null) { SESSION.lobbyHost = host; return true; }
    return SESSION.lobbyHost === host;
}

/* ---------- 12) MAIN ENGINE ---------- */
function FindProxyForURL(url, host) {
    host = host.toLowerCase();

    if (PANIC_BLOCK_ALL) return BLOCK;

    if (isPlainHostName(host)) return DIRECT;

    /* IPv6 literal — نادراً ما يصل هنا لأن PAC يستقبل أسماء نطاقات */
    if (isIPv6(host)) {
        if (BLOCK_IPV6 && isPUBGDomain(host)) return BLOCK;
        return DIRECT;
    }

    /* IPv4 literal */
    if (isIPv4(host)) {
        if (isPrivate4(host)) return DIRECT;
        if (isJordan4(host)) return DIRECT;
        if (ENABLE_JORDAN_ONLY && BLOCK_NON_JORDAN) return BLOCK;
        return DIRECT;
    }

    /* Domain traffic — غير PUBG → مباشر دائماً (لا نكسر الإنترنت) */
    if (!isPUBGDomain(host)) return DIRECT;

    /* PUBG: MATCH أولاً (الأهم) */
    if (isMatch(host)) {
        if (!lockMatch(host)) return BLOCK;
        return matchChain();
    }

    /* PUBG: LOBBY */
    if (isLobby(host)) {
        if (!lockLobby(host)) return BLOCK;
        return lobbyChain();
    }

    /* PUBG: CDN/تحديثات → مباشر (سرعة، لا علاقة له بالمنطقة) */
    if (isCDN(host)) return DIRECT;

    /* PUBG: تسجيل دخول/تحكم حساس للمنطقة → بروكسي
       (لو تريد سرعة دخول أعلى اجعل AUTH_VIA_PROXY = false) */
    if (isAuth(host)) {
        if (AUTH_VIA_PROXY) return lobbyChain();
        return DIRECT;
    }

    /* PUBG غير معروف → الأكثر أماناً: بروكسي */
    return lobbyChain();
}
