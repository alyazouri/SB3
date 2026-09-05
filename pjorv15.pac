/* =========================================================
   🇯🇴 ALYAZOURI — JORDAN PLAYER PRIORITY PAC v20
   🎮 PUBG MOBILE
   =========================================================
   الهدف:
   - إعطاء أولوية قصوى للمسارات الأردنية
   - تقليل الخروج إلى دول/مناطق غير مرغوبة
   - تثبيت Match Host
   - فصل BOOT / LOBBY / MATCH
   - منع IPv6 إذا كان الهدف IPv4 Jordan-only
   - عدم استخدام CloudFront/AWS كـ PUBG تلقائياً
   - لا يوجد DIRECT لـ PUBG Match/Lobby
   ========================================================= */


/* =========================================================
   1) SETTINGS
   ========================================================= */

var ENABLE_JORDAN_ONLY = true;
var BLOCK_IPV6         = true;

var STICKY_MATCH       = true;
var STICKY_LOBBY       = true;

var BLOCK_NON_JORDAN   = true;
var PANIC_BLOCK_ALL    = false;


/* =========================================================
   2) PROXY POOL
   =========================================================
   ضع هنا البروكسيات التي فحصتها أنت.

   الأول = Primary
   الثاني = Backup
   الثالث = Emergency
   ========================================================= */

var JO_PROXY_1 = "PROXY 176.28.184.141:80";
var JO_PROXY_2 = "PROXY 176.28.184.141:443";
var JO_PROXY_3 = "PROXY 212.35.66.45:20001";


/* =========================================================
   3) FAIL CLOSED
   ========================================================= */

var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";


/* =========================================================
   4) SESSION STATE
   ========================================================= */

var SESSION = {
    matchHost: null,
    lobbyHost: null
};


/* =========================================================
   5) JORDAN ASN / NETWORK RANGES
   =========================================================
   هذه القوائم يجب تحديثها دوريًا من بيانات RIR/BGP.
   لا تعتبر القائمة وحدها إثباتًا أن كل IP "سكني".
   ========================================================= */

var JO_IPV4 = [

    /* Orange Jordan / Jordan Telecom */
    "82.212.0.0/16",
    "94.142.32.0/19",
    "193.188.0.0/16",

    /* Zain Jordan */
    "82.212.64.0/18",
    "87.236.192.0/18",

    /* Umniah / Batelco */
    "46.23.112.0/20",
    "37.202.64.0/18",

    /* Mada */
    "185.51.0.0/18",

    /* VTEL / local operators */
    "176.28.128.0/17",

    /* Jordan broadband ranges */
    "212.35.0.0/17",
    "213.139.32.0/19",

    /* JO-IX / additional local infrastructure */
    "185.82.0.0/18"

];


/* =========================================================
   6) PUBG DOMAINS
   ========================================================= */

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


/* =========================================================
   7) PUBG MATCH KEYWORDS
   ========================================================= */

var RX_MATCH =
    /\b(match|battle|realtime|combat|sync|tick|room|gamesvr|battleservice|game-server|battle-server)\b/i;


/* =========================================================
   8) PUBG LOBBY KEYWORDS
   ========================================================= */

var RX_LOBBY =
    /\b(lobby|matchmaking|queue|dispatch|gateway|join|region|recruit|gameapi|gameservice|party|team)\b/i;


/* =========================================================
   9) BOOT / AUTH / CDN
   ========================================================= */

var RX_BOOT =
    /\b(cdn|asset|patch|update|download|resource|ossgame|login|auth|account|token|session|social|friend|clan|invite|presence|report|api|config)\b/i;


/* =========================================================
   10) PRIVATE IPv4
   ========================================================= */

function isPrivate4(ip) {

    return (
        isInNet(ip, "10.0.0.0", "255.0.0.0") ||
        isInNet(ip, "172.16.0.0", "255.240.0.0") ||
        isInNet(ip, "192.168.0.0", "255.255.0.0") ||
        isInNet(ip, "127.0.0.0", "255.0.0.0") ||
        isInNet(ip, "169.254.0.0", "255.255.0.0")
    );

}


/* =========================================================
   11) JORDAN IPv4 TEST
   ========================================================= */

function isJordan4(ip) {

    for (var i = 0; i < JO_IPV4.length; i++) {

        var parts = JO_IPV4[i].split("/");
        var base  = parts[0];
        var bits  = parseInt(parts[1], 10);

        var mask =
            bits === 0 ? 0 :
            (0xFFFFFFFF << (32 - bits)) >>> 0;

        var ipNum =
            ((parseInt(ip.split(".")[0],10) << 24) |
             (parseInt(ip.split(".")[1],10) << 16) |
             (parseInt(ip.split(".")[2],10) << 8) |
              parseInt(ip.split(".")[3],10)) >>> 0;

        var baseNum =
            ((parseInt(base.split(".")[0],10) << 24) |
             (parseInt(base.split(".")[1],10) << 16) |
             (parseInt(base.split(".")[2],10) << 8) |
              parseInt(base.split(".")[3],10)) >>> 0;

        if ((ipNum & mask) === (baseNum & mask)) {
            return true;
        }

    }

    return false;

}


/* =========================================================
   12) IPV4 DETECTION
   ========================================================= */

function isIPv4(host) {

    return /^\d+\.\d+\.\d+\.\d+$/.test(host);

}


/* =========================================================
   13) IPV6 DETECTION
   ========================================================= */

function isIPv6(host) {

    return host.indexOf(":") !== -1;

}


/* =========================================================
   14) PUBG DOMAIN CHECK
   ========================================================= */

function isPUBGDomain(host) {

    host = host.toLowerCase();

    for (var i = 0; i < PUBG_DOMAINS.length; i++) {

        if (
            host === PUBG_DOMAINS[i] ||
            dnsDomainIs(host, "." + PUBG_DOMAINS[i])
        ) {
            return true;
        }

    }

    return false;

}


/* =========================================================
   15) MATCH CLASSIFICATION
   ========================================================= */

function isMatch(host) {

    return RX_MATCH.test(host);

}


/* =========================================================
   16) LOBBY CLASSIFICATION
   ========================================================= */

function isLobby(host) {

    return RX_LOBBY.test(host);

}


/* =========================================================
   17) BOOT CLASSIFICATION
   ========================================================= */

function isBoot(host) {

    return RX_BOOT.test(host);

}


/* =========================================================
   18) PROXY CHAINS
   ========================================================= */

function matchChain() {

    return (
        JO_PROXY_1 +
        "; " +
        JO_PROXY_2 +
        "; " +
        JO_PROXY_3 +
        "; " +
        BLOCK
    );

}


function lobbyChain() {

    return (
        JO_PROXY_3 +
        "; " +
        JO_PROXY_1 +
        "; " +
        JO_PROXY_2 +
        "; " +
        BLOCK
    );

}


/* =========================================================
   19) STICKY MATCH
   ========================================================= */

function lockMatch(host) {

    if (!STICKY_MATCH) {
        return true;
    }

    if (SESSION.matchHost === null) {

        SESSION.matchHost = host;
        return true;

    }

    return SESSION.matchHost === host;

}


/* =========================================================
   20) STICKY LOBBY
   ========================================================= */

function lockLobby(host) {

    if (!STICKY_LOBBY) {
        return true;
    }

    if (SESSION.lobbyHost === null) {

        SESSION.lobbyHost = host;
        return true;

    }

    return SESSION.lobbyHost === host;

}


/* =========================================================
   21) MAIN PAC ENGINE
   ========================================================= */

function FindProxyForURL(url, host) {

    host = host.toLowerCase();


    /* -----------------------------------------------------
       PANIC
       ----------------------------------------------------- */

    if (PANIC_BLOCK_ALL) {
        return BLOCK;
    }


    /* -----------------------------------------------------
       LOCAL NETWORK
       ----------------------------------------------------- */

    if (
        isPlainHostName(host) ||
        isPrivate4(host)
    ) {
        return DIRECT;
    }


    /* =====================================================
       IPV6
       ===================================================== */

    if (isIPv6(host)) {

        /*
         * الهدف هنا إجبار PUBG على IPv4.
         */

        if (BLOCK_IPV6) {

            if (isPUBGDomain(host)) {
                return BLOCK;
            }

        }

        return DIRECT;

    }


    /* =====================================================
       LITERAL IPv4
       ===================================================== */

    if (isIPv4(host)) {

        if (isPrivate4(host)) {
            return DIRECT;
        }


        /* ---------------------------------------------
           PUBG IP
           --------------------------------------------- */

        if (isPUBGDomain(host)) {

            if (isMatch(host)) {

                if (!lockMatch(host)) {
                    return BLOCK;
                }

                return matchChain();

            }

            if (isLobby(host)) {

                if (!lockLobby(host)) {
                    return BLOCK;
                }

                return lobbyChain();

            }

            if (isBoot(host)) {

                /*
                 * Boot لا يحتاج إجبار Jordan Proxy
                 * حتى لا نزيد زمن Login/CDN.
                 */

                return DIRECT;

            }

            return lobbyChain();

        }


        /* ---------------------------------------------
           Jordan IPv4
           --------------------------------------------- */

        if (isJordan4(host)) {

            return DIRECT;

        }


        /* ---------------------------------------------
           Unknown / non-Jordan
           --------------------------------------------- */

        if (ENABLE_JORDAN_ONLY && BLOCK_NON_JORDAN) {

            return BLOCK;

        }

        return DIRECT;

    }


    /* =====================================================
       DOMAIN TRAFFIC
       ===================================================== */

    if (isPUBGDomain(host)) {


        /* ---------------------------------------------
           BOOT
           --------------------------------------------- */

        if (isBoot(host)) {

            return DIRECT;

        }


        /* ---------------------------------------------
           MATCH
           --------------------------------------------- */

        if (isMatch(host)) {

            if (!lockMatch(host)) {
                return BLOCK;
            }

            return matchChain();

        }


        /* ---------------------------------------------
           LOBBY
           --------------------------------------------- */

        if (isLobby(host)) {

            if (!lockLobby(host)) {
                return BLOCK;
            }

            return lobbyChain();

        }


        /* ---------------------------------------------
           UNKNOWN PUBG
           --------------------------------------------- */

        return lobbyChain();

    }


    /* =====================================================
       NON-PUBG
       ===================================================== */

    return DIRECT;

}
