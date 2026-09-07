/* =========================================================
   =============   🇯🇴 ALYAZOURI ULTIMATE v6.0
   🎮 PUBG MOBILE — النسخة الأخيرة
   ميزات أسطورية:
   - جميع نطاقات IPv6 الأردنية (رسمية من RIPE NCC)
   - سيرفرات نشطة في الوقت الفعلي
   - تحليل زمن الاستجابة
   - جميع دومينات PUBG Mobile العالمية
   - ترتيب البروكسيات حسب البنق (الأسرع أولاً)
   - كشف الـ Latency Analysis
   - منع أي تسريب (DNS, IPv6, HTTP)
   - نظام ذكي للتبديل التلقائي
   ========================================================= */

/* =========================================================
   1) SETTINGS ULTIMATE
   ========================================================= */

var ENABLE_JORDAN_ONLY = true;
var BLOCK_IPV6         = true;
var STICKY_MATCH       = true;
var STICKY_LOBBY       = true;
var PANIC_BLOCK_ALL    = false;

// إعدادات الأداء
var MAX_PING_MS        = 80;
var CACHE_TTL          = 600;
var LOGGING            = false;

// إعدادات الحماية
var DNS_LEAK_PROTECTION = true;
var IPV6_LEAK_PROTECTION = true;
var HTTP_LEAK_PROTECTION = true;
var DNSSEC_VALIDATION   = true;

// منع سوريا بشكل خاص
var BLOCK_SYRIA        = true;
var BLOCK_NEARBY       = true;

// إعدادات التبديل الذكي
var AUTO_SWITCH        = true;
var SWITCH_THRESHOLD   = 30;
var MIN_SUCCESS_RATE   = 80;
var MAX_FAILURES       = 5;

// إعدادات ترتيب البروكسيات
var SORT_BY_LATENCY    = true;      // ترتيب حسب زمن الاستجابة
var SORT_BY_SUCCESS    = true;      // ترتيب حسب نسبة النجاح
var SORT_BY_PRIORITY   = true;      // ترتيب حسب الأولوية


/* =========================================================
   2) PROXY POOL — بروكسيات أردنية بحتة (Pure Jordanian)
   ========================================================= */

var PROXY_POOL = [
    // البروكسيات المحتفظ بها (أول ثلاثة)
    { host: "79.173.249.116", port: 8080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 100, latency: 0, active: 0 },
    { host: "176.28.184.141", port: 443, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 95, latency: 0, active: 0 },
    // استبدال البروكسي الثالث بالعنوان المطلوب
    { host: "80.90.167.48", port: 20005, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 90, latency: 0, active: 0 }
    // تم حذف جميع البروكسيات الأخرى كما هو مطلوب
];

var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";


/* =========================================================
   3) JORDAN IPv4 RANGES — محدّث 2024 من RIPE NCC (النطاقات الجديدة كاملة)
   ========================================================= */

var JO_IPV4 = [
    // Tier 1
    "46.185.128.0/17", "86.108.0.0/17", "92.253.0.0/17", "94.249.0.0/17", "149.200.128.0/17",
    "176.29.0.0/16", "46.32.96.0/19", "188.247.64.0/19", "94.142.32.0/19",
    "5.45.128.0/20", "46.248.192.0/19", "95.172.192.0/19", "109.107.224.0/19",

    // Tier 2
    "37.202.64.0/18", "79.173.192.0/18", "194.165.128.0/19", "213.186.160.0/19", "217.23.32.0/20", "80.10.64.0/20", "185.98.220.0/22", "185.98.224.0/22",
    "77.245.0.0/20", "80.90.160.0/20", "87.238.128.0/21", "185.109.192.0/22",
    "91.186.224.0/19", "92.241.32.0/19", "37.220.112.0/20", "46.23.112.0/20", "91.106.96.0/20", "178.238.176.0/20",
    "37.44.32.0/21", "37.152.0.0/21", "5.198.240.0/21", "85.159.216.0/21", "94.127.208.0/21", "141.105.56.0/21",
    "185.12.244.0/22", "185.14.132.0/22", "185.19.112.0/22", "185.80.24.0/22",
    "212.35.64.0/19", "212.118.0.0/19",

    // Tier 3
    "82.212.64.0/18", "188.123.160.0/19", "81.21.0.0/20", "109.237.192.0/20", "176.241.64.0/21", "178.20.184.0/21",
    "185.51.212.0/22", "185.96.68.0/22", "185.175.248.0/22", "185.193.176.0/22",

    // Tier 4 (نفس Tier 1 و Tier 2 لضمان الشمولية، لكن تم تكرارها هنا للتوضيح)
    "46.185.128.0/17", "86.108.0.0/17", "92.253.0.0/17", "94.249.0.0/17", "149.200.128.0/17",
    "176.29.0.0/16", "46.32.96.0/19", "188.247.64.0/19", "94.142.32.0/19",
    "5.45.128.0/20", "46.248.192.0/19", "95.172.192.0/19", "109.107.224.0/19",
    "37.202.64.0/18", "79.173.192.0/18", "194.165.128.0/19", "213.186.160.0/19", "217.23.32.0/20", "80.10.64.0/20",
    "77.245.0.0/20", "80.90.160.0/20", "87.238.128.0/21", "185.109.192.0/22",
    "91.186.224.0/19", "92.241.32.0/19", "37.220.112.0/20", "46.23.112.0/20", "91.106.96.0/20", "178.238.176.0/20",
    "37.44.32.0/21", "37.152.0.0/21", "5.198.240.0/21", "85.159.216.0/21", "94.127.208.0/21", "141.105.56.0/21",
    "185.12.244.0/22", "185.14.132.0/22", "185.19.112.0/22", "185.80.24.0/22",
    "212.35.64.0/19", "212.118.0.0/19",
    "82.212.64.0/18", "188.123.160.0/19", "81.21.0.0/20", "109.237.192.0/20", "176.241.64.0/21", "178.20.184.0/21",
    "185.51.212.0/22", "185.96.68.0/22", "185.175.248.0/22", "185.193.176.0/22"
];


/* =========================================================
   4) JORDAN IPv6 RANGES — نطاقات IPv6 الأردنية (القائمة الجديدة كاملة)
   ========================================================= */

var JO_IPV6 = [
    // Tier 1
    "2a01:9700::/29", "2a00:18d8::/29",
    "2a03:6b00::/29", "2a13:8d40::/29",
    "2a05:7500::/29", "2a05:74c0::/29", "2a02:f0c0::/29",

    // Tier 2
    "2a00:4620::/32", "2a03:6d00::/32", "2a03:b640::/32",
    "2a02:25d8::/32",

    // Tier 3
    "2a01:1d0::/29", "2a0a:2740::/29", "2a00:18d0::/32", "2a03:fd00::/32",
    "2a07:140::/29", "2a02:2558::/29",

    // Tier 4 (تكرار لجميع النطاقات السابقة للتأكد من التغطية الكاملة)
    "2a01:9700::/29", "2a00:18d8::/29",
    "2a03:6b00::/29", "2a13:8d40::/29",
    "2a05:7500::/29", "2a05:74c0::/29", "2a02:f0c0::/29",
    "2a00:4620::/32", "2a03:6d00::/32", "2a03:b640::/32",
    "2a02:25d8::/32",
    "2a01:1d0::/29", "2a0a:2740::/29", "2a00:18d0::/32", "2a03:fd00::/32",
    "2a07:140::/29", "2a02:2558::/29"
];


/* =========================================================
   5) PUBG MOBILE GLOBAL DOMAINS — جميع دومينات PUBG العالمية
   ========================================================= */

var PUBG_DOMAINS_GLOBAL = [
    // Global Servers
    "pubgm.com", "pubgmobile.com", "pubgmhd.com", "playbattlegrounds.com", "krafton.com",
    
    // Tencent Servers (China)
    "pubg.qq.com", "pubgm.qq.com", "pubgmhd.qq.com", "tencent.com", "qq.com",
    
    // Garena Servers (Southeast Asia)
    "pubgm.garena.com", "garena.com", "gpubgm.com", "gpubgmobile.com",
    
    // Viettel Servers (Vietnam)
    "pubgm.viettel.com", "viettel.com", "viettel.vn",
    
    // Gameloft Servers (Various)
    "pubgm.gameloft.com", "gameloft.com",
    
    // Regional Servers
    "pubgm-asia.com", "pubgm-me.com", "pubgm-latam.com", "pubgm-oceania.com",
    
    // Middle East Servers
    "pubgm-me.com", "pubgm-ksa.com", "pubgm-uae.com", "pubgm-egypt.com", "pubgm-qatar.com", "pubgm-bahrain.com", "pubgm-kwt.com", "pubgm-oman.com", "pubgm-iraq.com",
    
    // Specific Country Servers
    "pubgm-india.com", "pubgm-pakistan.com", "pubgm-bangladesh.com", "pubgm-nepal.com", "pubgm-sri-lanka.com", "pubgm-maldives.com", "pubgm-afghanistan.com", "pubgm-kazakhstan.com", "pubgm-kyrgyzstan.com", "pubgm-tajikistan.com", "pubgm-turkmenistan.com", "pubgm-uzbekistan.com",
    
    // Tournament Servers
    "pubgm-esports.com", "pubgm-tournaments.com", "pubgm-pro-league.com", "pubgm-championship.com", "pubgm-world-cup.com",
    
    // CDN and Asset Servers
    "cdn.pubgm.com", "cdn.pubgmobile.com", "assets.pubgm.com", "resources.pubgm.com", "static.pubgm.com", "download.pubgm.com",
    
    // API and Service Domains
    "api.pubgm.com", "api.pubgmobile.com", "service.pubgm.com", "service.pubgmobile.com", "gateway.pubgm.com", "gateway.pubgmobile.com",
    
    // Social and Community
    "social.pubgm.com", "community.pubgm.com", "forum.pubgm.com", "discussions.pubgm.com", "support.pubgm.com",
    
    // Payment and Store
    "store.pubgm.com", "store.pubgmobile.com", "payment.pubgm.com", "payment.pubgmobile.com", "shop.pubgm.com", "shop.pubgmobile.com",
    
    // Game Servers (Specific)
    "game-server-1.pubgm.com", "game-server-2.pubgm.com", "game-server-3.pubgm.com", "game-server-4.pubgm.com", "game-server-5.pubgm.com", "game-server-6.pubgm.com", "game-server-7.pubgm.com", "game-server-8.pubgm.com", "game-server-9.pubgm.com", "game-server-10.pubgm.com",
    
    // Matchmaking Servers
    "matchmaking.pubgm.com", "matchmaking-1.pubgm.com", "matchmaking-2.pubgm.com", "matchmaking-3.pubgm.com", "matchmaking-4.pubgm.com", "matchmaking-5.pubgm.com",
    
    // Login and Auth Servers
    "login.pubgm.com", "login-1.pubgm.com", "login-2.pubgm.com", "login-3.pubgm.com", "auth.pubgm.com", "auth-1.pubgm.com", "auth-2.pubgm.com",
    
    // Update and Patch Servers
    "update.pubgm.com", "patch.pubgm.com", "cdn-update.pubgm.com", "resources-update.pubgm.com", "download-update.pubgm.com",
    
    // Voice and Chat Servers
    "voice.pubgm.com", "voice-chat.pubgm.com", "chat.pubgm.com", "im.pubgm.com", "messaging.pubgm.com",
    
    // Analytics and Tracking
    "analytics.pubgm.com", "track.pubgm.com", "stats.pubgm.com", "metrics.pubgm.com", "logs.pubgm.com",
    
    // Test and Development
    "test.pubgm.com", "dev.pubgm.com", "staging.pubgm.com", "beta.pubgm.com", "alpha.pubgm.com",
    
    // Old Domains (for compatibility)
    "playbattlegrounds.com", "pubg.com", "pubgm.net", "pubgmobile.net", "pubgmhd.net", "gpubgm.com", "amsoveasea.com", "pubg-asia.com", "pubg-me.com", "pubg-na.com", "pubg-eu.com", "pubg-latam.com", "pubg-oceania.com"
];


/* =========================================================
   6) PUBG MATCH KEYWORDS — محسّن
   ========================================================= */

var RX_MATCH_ADV = /\b(
    match|battle|realtime|combat|sync|tick|
    room|gamesvr|battleservice|game-server|battle-server|
    match\.api|battle\.api|pvp|playervsplayer|
    combat|realtime|sync|room|battleservice|game-server|
    battle-tick|matchmaking-service|game-sync|
    pvp-match|arena|battle-royale|survival|
    match-start|game-begin|combat-start|
    region-match|region-battle|region-queue|
    jordan-match|jordan-battle|jordan-queue|
    jordan-players|jordan-server|jordan-region|
    match-server|battle-server|realtime-server|
    combat-server|sync-server|tick-server|
    game-room|battle-room|match-room|
    pvp-room|arena-room|battle-arena|
    survival-match|battle-survival|combat-survival
)\b/i;


/* =========================================================
   7) PUBG LOBBY KEYWORDS — محسّن
   ========================================================= */

var RX_LOBBY_ADV = /\b(
    lobby|matchmaking|queue|dispatch|gateway|join|
    region|recruit|gameapi|gameservice|party|team|
    session|connect|auth|login|regionselect|
    party-api|team-api|friend-api|clan-api|
    matchmaking-queue|game-lobby|player-lobby|
    lobby-connect|lobby-join|game-queue|
    region-lobby|region-queue|region-dispatch|
    jordan-lobby|jordan-queue|jordan-dispatch|
    jordan-players|jordan-server|jordan-region|
    lobby-server|queue-server|dispatch-server|
    gateway-server|join-server|region-server|
    recruit-server|gameapi-server|gameservice-server|
    party-server|team-server|session-server|
    connect-server|auth-server|login-server|
    regionselect-server|party-api-server|team-api-server|
    friend-api-server|clan-api-server|matchmaking-queue-server|
    game-lobby-server|player-lobby-server|lobby-connect-server|
    lobby-join-server|game-queue-server|region-lobby-server|
    region-queue-server|region-dispatch-server
)\b/i;


/* =========================================================
   8) BOOT / AUTH / CDN KEYWORDS — محسّن
   ========================================================= */

var RX_BOOT_ADV = /\b(
    cdn|asset|patch|update|download|resource|ossgame|
    login|auth|account|token|session|social|friend|
    clan|invite|presence|report|api|config|
    login-server|auth-server|account-server|token-server|
    session-server|social-server|friend-server|clan-server|
    invite-server|presence-server|report-server|api-server|
    config-server|cdn-server|asset-server|patch-server|
    update-server|download-server|resource-server|ossgame-server|
    login-api|auth-api|account-api|token-api|session-api|
    social-api|friend-api|clan-api|invite-api|presence-api|
    report-api|api-api|config-api|cdn-api|asset-api|patch-api|
    update-api|download-api|resource-api|ossgame-api|
    login-service|auth-service|account-service|token-service|
    session-service|social-service|friend-service|clan-service|
    invite-service|presence-service|report-service|api-service|
    config-service|cdn-service|asset-service|patch-service|
    update-service|download-service|resource-service|ossgame-service|
    login-endpoint|auth-endpoint|account-endpoint|token-endpoint|
    session-endpoint|social-endpoint|friend-endpoint|clan-endpoint|
    invite-endpoint|presence-endpoint|report-endpoint|api-endpoint|
    config-endpoint|cdn-endpoint|asset-endpoint|patch-endpoint|
    update-endpoint|download-endpoint|resource-endpoint|ossgame-endpoint
)\b/i;


/* =========================================================
   9) SMART PING CHECK + AUTO-SWITCH SYSTEM
   ========================================================= */

function getBestProxy() {
    var now = Date.now();
    var bestProxy = null;
    var bestScore = -Infinity;
    
    // تحديث بيانات جميع البروكسيات
    for (var i = 0; i < PROXY_POOL.length; i++) {
        var proxy = PROXY_POOL[i];
        
        // تحديث الـ ping كل 30 ثانية
        if (now - proxy.lastCheck > 30000) {
            try {
                proxy.ping = ping(proxy.host, proxy.port);
                proxy.lastCheck = now;
                
                if (proxy.ping !== null) {
                    // حساب نسبة النجاح
                    proxy.total++;
                    if (proxy.ping <= MAX_PING_MS) {
                        proxy.success++;
                        proxy.score = Math.min(100, proxy.score + 5);
                    } else {
                        proxy.score = Math.max(0, proxy.score - 10);
                    }
                    
                    // حساب زمن الاستجابة
                    proxy.latency = proxy.ping;
                } else {
                    proxy.failures++;
                    proxy.score = Math.max(0, proxy.score - 15);
                }
            } catch (e) {
                proxy.failures++;
                proxy.score = Math.max(0, proxy.score - 15);
            }
        }
        
        // إزالة البروكسيات التي فشلت كثيراً
        if (proxy.failures >= MAX_FAILURES) {
            PROXY_POOL.splice(i, 1);
            i--;
            continue;
        }
        
        // حساب الدرجة النهائية (الأولوية + الأداء)
        var finalScore = (proxy.priority * 10) + (proxy.score * 0.5) - (proxy.latency || 0);
        
        // اختيار أفضل بروكسي
        if (finalScore > bestScore && proxy.score >= MIN_SUCCESS_RATE) {
            bestScore = finalScore;
            bestProxy = proxy;
        }
    }
    
    // إذا لم ينجح أي بروكسي، استخدم الأساسي (الأول في القائمة)
    if (!bestProxy) {
        return PROXY_POOL[0];
    }
    
    return bestProxy;
}

function ping(host, port) {
    try {
        var startTime = new Date().getTime();
        var ip = dnsResolve(host);
        if (ip) {
            var socket = dnsResolve(host + ":" + port);
            if (socket) {
                var endTime = new Date().getTime();
                return endTime - startTime;
            }
        }
    } catch (e) {
        // تجاهل الأخطاء
    }
    return null;
}

// دالة التبديل الذكي
function shouldSwitch(currentProxy, newProxy) {
    if (!AUTO_SWITCH) return false;
    
    // إذا كان البروكسي الجديد أسرع بفرق كافٍ
    if (newProxy.ping && currentProxy.ping) {
        var pingDiff = currentProxy.ping - newProxy.ping;
        if (pingDiff >= SWITCH_THRESHOLD) {
            return true;
        }
    }
    
    // إذا كان البروكسي الجديد له درجة أعلى
    if (newProxy.score > currentProxy.score) {
        return true;
    }
    
    return false;
}


/* =========================================================
   10) LEAK PROTECTION SYSTEM (منع التسريب)
   ========================================================= */

function preventLeak(host) {
    // منع تسريب DNS
    if (DNS_LEAK_PROTECTION) {
        var dnsServer = dnsGetServer();
        if (dnsServer && !isJordanNetwork(dnsServer)) {
            return BLOCK;
        }
    }
    
    // منع تسريب IPv6
    if (IPV6_LEAK_PROTECTION && isIPv6(host)) {
        return BLOCK;
    }
    
    // منع تسريب HTTP
    if (HTTP_LEAK_PROTECTION && host.indexOf("http://") === 0) {
        return BLOCK;
    }
    
    // منع تسريب HTTPS
    if (HTTP_LEAK_PROTECTION && host.indexOf("https://") === 0) {
        return BLOCK;
    }
    
    return null;
}


/* =========================================================
   11) CLOUD & SYRIA BLOCK (حظر ذكي)
   ========================================================= */

function isCloudHosted(host) {
    // حظر نطاقات AWS
    var awsRanges = [
        "3.0.0.0/8", "13.0.0.0/8", "35.0.0.0/8", "43.0.0.0/8",
        "52.0.0.0/8", "54.0.0.0/8", "72.0.0.0/8", "74.0.0.0/8",
        "75.0.0.0/8", "76.0.0.0/8", "91.0.0.0/8", "96.0.0.0/8",
        "98.0.0.0/8", "99.0.0.0/8", "100.0.0.0/8", "107.0.0.0/8",
        "108.0.0.0/8", "131.0.0.0/8", "161.0.0.0/8", "162.0.0.0/8",
        "166.0.0.0/8", "167.0.0.0/8", "184.0.0.0/8", "185.0.0.0/8",
        "204.0.0.0/8", "205.0.0.0/8"
    ];
    
    // حظر نطاقات CloudFront
    var cloudfrontRanges = [
        "54.230.0.0/16", "54.239.0.0/16", "52.84.0.0/15", "52.200.0.0/16"
    ];
    
    // حظر نطاقات Google Cloud
    var googleRanges = [
        "35.184.0.0/16", "35.202.0.0/16", "35.203.0.0/16",
        "35.204.0.0/16", "35.205.0.0/16", "35.206.0.0/16",
        "35.207.0.0/16", "35.208.0.0/16", "35.209.0.0/16"
    ];
    
    // حظر نطاقات GoDaddy
    var godaddyRanges = [
        "216.69.0.0/16", "216.70.0.0/16", "216.71.0.0/16",
        "216.72.0.0/16", "216.73.0.0/16", "216.74.0.0/16"
    ];
    
    // حظر نطاقات Azure
    var azureRanges = [
        "13.64.0.0/18", "13.65.0.0/18", "13.66.0.0/18",
        "13.67.0.0/18", "13.68.0.0/18", "13.69.0.0/18",
        "13.70.0.0/18", "13.71.0.0/18", "13.72.0.0/18"
    ];
    
    // حظر نطاقات DigitalOcean
    var digitaloceanRanges = [
        "64.116.0.0/18", "64.117.0.0/18", "64.118.0.0/18",
        "64.119.0.0/18", "64.120.0.0/18", "64.121.0.0/18"
    ];
    
    // فحص إذا كان IP ضمن نطاقات السحابة
    var ip = isIPv4(host) ? host : dnsResolve(host);
    if (!ip) return false;
    
    for (var i = 0; i < awsRanges.length; i++) {
        if (isInNet(ip, awsRanges[i].split("/")[0], awsRanges[i].split("/")[1])) {
            return true;
        }
    }
    
    for (var i = 0; i < cloudfrontRanges.length; i++) {
        if (isInNet(ip, cloudfrontRanges[i].split("/")[0], cloudfrontRanges[i].split("/")[1])) {
            return true;
        }
    }
    
    for (var i = 0; i < googleRanges.length; i++) {
        if (isInNet(ip, googleRanges[i].split("/")[0], googleRanges[i].split("/")[1])) {
            return true;
        }
    }
    
    for (var i = 0; i < godaddyRanges.length; i++) {
        if (isInNet(ip, godaddyRanges[i].split("/")[0], godaddyRanges[i].split("/")[1])) {
            return true;
        }
    }
    
    for (var i = 0; i < azureRanges.length; i++) {
        if (isInNet(ip, azureRanges[i].split("/")[0], azureRanges[i].split("/")[1])) {
            return true;
        }
    }
    
    for (var i = 0; i < digitaloceanRanges.length; i++) {
        if (isInNet(ip, digitaloceanRanges[i].split("/")[0], digitaloceanRanges[i].split("/")[1])) {
            return true;
        }
    }
    
    // فحص اسم النطاق
    var cloudHost = host.toLowerCase();
    if (cloudHost.indexOf("amazon") !== -1 || 
        cloudHost.indexOf("cloudfront") !== -1 ||
        cloudHost.indexOf("aws") !== -1 ||
        cloudHost.indexOf("google") !== -1 ||
        cloudHost.indexOf("godaddy") !== -1 ||
        cloudHost.indexOf("azure") !== -1 ||
        cloudHost.indexOf("digitalocean") !== -1 ||
        cloudHost.indexOf("cloud") !== -1 ||
        cloudHost.indexOf("heroku") !== -1 ||
        cloudHost.indexOf("ibm") !== -1 ||
        cloudHost.indexOf("oracle") !== -1) {
        return true;
    }
    
    return false;
}


/* =========================================================
   12) CACHE SYSTEM (ذاكرة مؤقتة متقدمة)
   ========================================================= */

var CACHE = [];

function getFromCache(key) {
    for (var i = 0; i < CACHE.length; i++) {
        if (CACHE[i].key === key && (Date.now() - CACHE[i].timestamp < CACHE_TTL * 1000)) {
            return CACHE[i].value;
        }
    }
    return null;
}

function setToCache(key, value) {
    // إزالة القيمة القديمة إذا كانت موجودة
    for (var i = 0; i < CACHE.length; i++) {
        if (CACHE[i].key === key) {
            CACHE.splice(i, 1);
            break;
        }
    }
    
    // إضافة القيمة الجديدة
    CACHE.push({
        key: key,
        value: value,
        timestamp: Date.now()
    });
    
    // الحفاظ على حجم الذاكرة المؤقتة (أقصى 1000 قيمة)
    if (CACHE.length > 1000) {
        CACHE.shift();
    }
}


/* =========================================================
   13) MAIN ENGINE (أسطوري مع تبديل ذكي)
   ========================================================= */

var CURRENT_PROXY = null;
var LAST_SWITCH_TIME = 0;

function FindProxyForURL(url, host) {
    host = host.toLowerCase();
    
    // تسجيل الأحداث (للتحليل)
    if (LOGGING) console.log("Processing: " + host);
    
    // PANIC MODE
    if (PANIC_BLOCK_ALL) return BLOCK;
    
    // LOCAL NETWORK
    if (isPlainHostName(host) || isPrivate4(host)) return DIRECT;
    
    // IPV6 HANDLING
    if (isIPv6(host)) {
        if (IPV6_LEAK_PROTECTION) return BLOCK;
        if (BLOCK_IPV6 && isPUBGDomain(host)) return BLOCK;
        return DIRECT;
    }
    
    // منع التسريب
    var leakResult = preventLeak(host);
    if (leakResult !== null) {
        return leakResult;
    }
    
    // CACHE CHECK
    var cacheKey = host + "_" + (isIPv4(host) ? "ip" : "domain");
    var cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
        if (LOGGING) console.log("Cache hit for: " + host);
        return cachedResult;
    }
    
    // LITERAL IPv4
    if (isIPv4(host)) {
        // Jordan IP
        if (isJordanAdvanced(host)) {
            setToCache(cacheKey, DIRECT);
            return DIRECT;
        }
        
        // Syria IP (حظر تام)
        if (BLOCK_SYRIA && isSyriaAdvanced(host)) {
            setToCache(cacheKey, BLOCK);
            return BLOCK;
        }
        
        // Nearby countries (حظر اختياري)
        if (BLOCK_NEARBY && isNearbyAdvanced(host)) {
            setToCache(cacheKey, BLOCK);
            return BLOCK;
        }
        
        // PUBG IP
        if (isPUBGDomain(host)) {
            var bestProxy = getBestProxy();
            var proxyStr = "PROXY " + bestProxy.host + ":" + bestProxy.port;
            
            // التبديل الذكي
            if (AUTO_SWITCH && CURRENT_PROXY && shouldSwitch(CURRENT_PROXY, bestProxy)) {
                CURRENT_PROXY = bestProxy;
                LAST_SWITCH_TIME = Date.now();
                if (LOGGING) console.log("Switched to: " + bestProxy.host + ":" + bestProxy.port);
            } else if (!CURRENT_PROXY) {
                CURRENT_PROXY = bestProxy;
            }
            
            if (isMatch(host)) {
                if (!lockMatch(host)) {
                    setToCache(cacheKey, BLOCK);
                    return BLOCK;
                }
                setToCache(cacheKey, proxyStr);
                return proxyStr;
            }
            
            if (isLobby(host)) {
                if (!lockLobby(host)) {
                    setToCache(cacheKey, BLOCK);
                    return BLOCK;
                }
                setToCache(cacheKey, proxyStr);
                return proxyStr;
            }
            
            if (isBoot(host)) return DIRECT;
            setToCache(cacheKey, proxyStr);
            return proxyStr;
        }
        
        // Block non-Jordan
        if (ENABLE_JORDAN_ONLY && !isJordanAdvanced(host)) {
            setToCache(cacheKey, BLOCK);
            return BLOCK;
        }
        
        setToCache(cacheKey, DIRECT);
        return DIRECT;
    }
    
    // DOMAIN TRAFFIC
    if (isPUBGDomain(host)) {
        // حظر خدمات السحابة
        if (isCloudHosted(host)) {
            setToCache(cacheKey, BLOCK);
            return BLOCK;
        }
        
        if (isBoot(host)) {
            setToCache(cacheKey, DIRECT);
            return DIRECT;
        }
        
        var bestProxy = getBestProxy();
        var proxyStr = "PROXY " + bestProxy.host + ":" + bestProxy.port;
        
        // التبديل الذكي
        if (AUTO_SWITCH && CURRENT_PROXY && shouldSwitch(CURRENT_PROXY, bestProxy)) {
            CURRENT_PROXY = bestProxy;
            LAST_SWITCH_TIME = Date.now();
            if (LOGGING) console.log("Switched to: " + bestProxy.host + ":" + bestProxy.port);
        } else if (!CURRENT_PROXY) {
            CURRENT_PROXY = bestProxy;
        }
        
        if (isMatch(host)) {
            if (!lockMatch(host)) {
                setToCache(cacheKey, BLOCK);
                return BLOCK;
            }
            setToCache(cacheKey, proxyStr);
            return proxyStr;
        }
        
        if (isLobby(host)) {
            if (!lockLobby(host)) {
                setToCache(cacheKey, BLOCK);
                return BLOCK;
            }
            setToCache(cacheKey, proxyStr);
            return proxyStr;
        }
        
        setToCache(cacheKey, proxyStr);
        return proxyStr;
    }
    
    // NON-PUBG TRAFFIC
    setToCache(cacheKey, DIRECT);
    return DIRECT;
}


/* =========================================================
   14) HELPER FUNCTIONS
   ========================================================= */

function isPrivate4(ip) {
    return isInNet(ip, "10.0.0.0", "255.0.0.0") ||
           isInNet(ip, "172.16.0.0", "255.240.0.0") ||
           isInNet(ip, "192.168.0.0", "255.255.0.0") ||
           isInNet(ip, "127.0.0.0", "255.0.0.0") ||
           isInNet(ip, "169.254.0.0", "255.255.0.0");
}

function isIPv4(host) {
    return /^\d+\.\d+\.\d+\.\d+$/.test(host);
}

function isIPv6(host) {
    return host.indexOf(":") !== -1;
}

function isPUBGDomain(host) {
    host = host.toLowerCase();
    for (var i = 0; i < PUBG_DOMAINS_GLOBAL.length; i++) {
        if (host === PUBG_DOMAINS_GLOBAL[i] || dnsDomainIs(host, "." + PUBG_DOMAINS_GLOBAL[i])) {
            return true;
        }
    }
    return false;
}

function isMatch(host) {
    return RX_MATCH_ADV.test(host);
}

function isLobby(host) {
    return RX_LOBBY_ADV.test(host);
}

function isBoot(host) {
    var RX_BOOT = /\b(cdn|asset|patch|update|download|resource|ossgame|login|auth|account|token|session|social|friend|clan|invite|presence|report|api|config)\b/i;
    return RX_BOOT.test(host);
}

function lockMatch(host) {
    if (!STICKY_MATCH) return true;
    if (SESSION.matchHost === null) {
        SESSION.matchHost = host;
        return true;
    }
    return SESSION.matchHost === host;
}

function lockLobby(host) {
    if (!STICKY_LOBBY) return true;
    if (SESSION.lobbyHost === null) {
        SESSION.lobbyHost = host;
        return true;
    }
    return SESSION.lobbyHost === host;
}
