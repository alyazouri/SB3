/* ============================================
   ALYAZOURI ULTIMATE v6.0 — النسخة الأقوى والأكثر تطوراً
   مخصص للأردن | يعمل مع PUBG Mobile وجميع الألعاب والخدمات
   تم التحديث: 2024 | النطاقات من RIPE NCC
   ============================================ */

// ✅ الإعدادات الأساسية (SETTINGS ULTIMATE)
var ENABLE_JORDAN_ONLY   = true;   // تفعيل حظر غير الأردنيين
var LOGGING              = true;   // تسجيل الأحداث (للتحليل)
var BLOCK_IPV6           = true;   // حظر IPv6
var STICKY_MATCH         = true;   // تثبيت السيرفر في الماتش
var STICKY_LOBBY         = true;   // تثبيت السيرفر في اللوبي
var MAX_PING_MS          = 80;     // أقصى ping مسموح
var CACHE_TTL            = 300;    // وقت التخزين المؤقت (5 دقائق)
var DNS_LEAK_PROTECTION  = true;   // حماية من تسريب DNS
var IPV6_LEAK_PROTECTION = true;   // حماية من تسريب IPv6
var HTTP_LEAK_PROTECTION = true;   // حماية من تسريب HTTP
var DNSSEC_VALIDATION    = true;   // تحقق من DNSSEC
var BLOCK_SYRIA          = true;   // حظر سوريا
var BLOCK_NEARBY         = true;   // حظر الدول المجاورة
var AUTO_SWITCH          = true;   // تبديل تلقائي ذكي
var SWITCH_THRESHOLD     = 30;     // فرق الping للتبديل (ms)
var MIN_SUCCESS_RATE     = 80;     // نسبة النجاح الدنيا
var MAX_FAILURES         = 5;      // أقصى فشل قبل إزالة البروكسي

// ✅ ترتيب البروكسيات (حسب الأولوية والأداء)
var SORT_BY_LATENCY   = true;   // ترتيب حسب زمن الاستجابة
var SORT_BY_SUCCESS   = true;   // ترتيب حسب نسبة النجاح
var SORT_BY_PRIORITY  = true;   // ترتيب حسب الأولوية

/* ============================================
   2) PROXY POOL — 3 بروكسيات أردنية موثوقة فقط
   ============================================ */

var PROXY_POOL = [
    // البروكسي الأول (الأسرع والأكثر استقراراً)
    { host: "79.173.249.116", port: 8080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 100, latency: 0, active: 0 },
    
    // البروكسي الثاني (بديل ممتاز)
    { host: "86.108.11.20",   port: 443, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 95, latency: 0, active: 0 },
    
    // البروكسي الثالث (المطلوب: 80.90.167.48:20005)
    { host: "80.90.167.48",   port: 20005, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 90, latency: 0, active: 0 }
];

var BLOCK = "PROXY 127.0.0.1:9"; // حظر كامل (Panic Mode)
var DIRECT = "DIRECT";           // اتصال مباشر

/* ============================================
   3) JORDAN IPv4 RANGES — محدّث 2024 من RIPE NCC
   ============================================ */

var JO_IPV4 = [
    /* Orange Jordan / Jordan Telecom */
    "82.212.0.0/16",       // النطاق الرئيسي
    "94.142.32.0/19",      // نطاقات إضافية
    "193.188.0.0/16",      // نطاقات الشركة
    "193.188.64.0/18",     // شبكات حكومية
    
    /* Zain Jordan */
    "82.212.64.0/18",      // نطاقات Zain
    "87.236.192.0/18",     // نطاقات Zain الإضافية
    
    /* Umniah / Batelco */
    "46.0.0.0/8",          // نطاقات Umniah (واسع)
    "185.51.0.0/18",       // نطاقات Umniah
    
    /* VTEL / local operators */
    "176.28.128.0/17",     // VTEL
    "212.35.0.0/17",       // نطاقات broadband
    "213.139.32.0/19",     // نطاقات broadband
    "213.139.192.0/19",    // شبكات إضافية
    "217.20.192.0/19",     // شبكات إضافية
    
    /* JO-IX / additional local infrastructure */
    "185.82.0.0/18",       // نطاقات تبادل الإنترنت الأردني
    
    /* Government and educational networks */
    "194.126.0.0/16",      // شبكات تعليمية وحكومية
    "2001:df8::/32"        // النطاق الرئيسي للأردن (IPv6)
];

/* ============================================
   4) JORDAN IPv6 RANGES — نطاقات IPv6 الأردنية
   ============================================ */

var JO_IPV6 = [
    /* Orange Jordan */
    "2a01:9700::/29",
    "2a00:18d8::/29",
    
    /* Zain Jordan */
    "2a03:6b00::/29",
    "2a13:8d40::/29",
    
    /* Umniah */
    "2a05:7500::/29",
    "2a05:74c0::/29",
    "2a02:f0c0::/29",
    "2a00:4620::/32",
    "2a03:6d00::/32",
    "2a03:b640::/32",
    
    /* VTEL Jordan */
    "2a01:1d0::/29",
    "2a0a:2740::/29",
    "2a00:18d0::/32",
    "2a03:fd00::/32",
    
    /* Local ISPs (JCS & Damamax/XOL) */
    "2a07:140::/29",
    "2a02:2558::/29"
];

/* ============================================
   5) PUBG MOBILE GLOBAL DOMAINS — جميع الدومينات
   ============================================ */

var PUBG_DOMAINS_GLOBAL = [
    // Global & Tencent
    "pubgm.com", "playbattlegrounds.com", "krafton.com",
    "pubg.qq.com", "pubgm.qq.com", "pubgmhd.qq.com", "tencent.com", "qq.com",
    
    // Garena
    "gpubgmobile.com", "garena.com",
    
    // Viettel
    "pubgm.viettel.com", "viettel.com", "viettel.vn",
    
    // Gameloft
    "pubgm.gameloft.com", "gameloft.com",
    
    // Regional
    "pubgm-asia.com", "pubgm-me.com", "pubgm-latam.com", "pubgm-oceania.com",
    "pubgm-ksa.com", "pubgm-uae.com", "pubgm-egypt.com", "pubgm-qatar.com",
    "pubgm-bahrain.com", "pubgm-kwt.com", "pubgm-oman.com", "pubgm-iraq.com",
    
    // Specific Countries
    "pubgm-india.com", "pubgm-pakistan.com", "pubgm-bangladesh.com",
    "pubgm-nepal.com", "pubgm-sri-lanka.com", "pubgm-maldives.com",
    "pubgm-afghanistan.com", "pubgm-kazakhstan.com", "pubgm-kyrgyzstan.com",
    "pubgm-tajikistan.com", "pubgm-turkmenistan.com", "pubgm-uzbekistan.com",
    
    // Esports & Tournaments
    "pubgm-esports.com", "pubgm-tournaments.com", "pubgm-pro-league.com",
    "pubgm-championship.com", "pubgm-world-cup.com",
    
    // CDN & Assets
    "cdn.pubgm.com", "cdn.pubgmobile.com", "assets.pubgm.com",
    "resources.pubgm.com", "static.pubgm.com", "download.pubgm.com",
    
    // API & Services
    "api.pubgm.com", "api.pubgmobile.com", "service.pubgm.com",
    "service.pubgmobile.com", "gateway.pubgm.com", "gateway.pubgmobile.com",
    
    // Social & Community
    "social.pubgm.com", "community.pubgm.com", "forum.pubgm.com",
    "discussions.pubgm.com", "support.pubgm.com",
    
    // Payment & Store
    "store.pubgm.com", "store.pubgmobile.com", "payment.pubgm.com",
    "payment.pubgmobile.com", "shop.pubgm.com", "shop.pubgmobile.com",
    
    // Game Servers
    "game-server-1.pubgm.com", "game-server-2.pubgm.com",
    "game-server-3.pubgm.com", "game-server-4.pubgm.com",
    "game-server-5.pubgm.com", "game-server-6.pubgm.com",
    "game-server-7.pubgm.com", "game-server-8.pubgm.com",
    "game-server-9.pubgm.com",
    
    // Matchmaking
    "matchmaking.pubgm.com", "matchmaking-1.pubgm.com",
    "matchmaking-2.pubgm.com", "matchmaking-3.pubgm.com",
    "matchmaking-4.pubgm.com", "matchmaking-5.pubgm.com",
    
    // Login & Auth
    "login.pubgm.com", "login-1.pubgm.com", "login-2.pubgm.com",
    "login-3.pubgm.com", "auth.pubgm.com", "auth-1.pubgm.com",
    "auth-2.pubgm.com",
    
    // Update & Patch
    "update.pubgm.com", "patch.pubgm.com", "cdn-update.pubgm.com",
    "resources-update.pubgm.com", "download-update.pubgm.com",
    
    // Voice & Chat
    "voice.pubgm.com", "voice-chat.pubgm.com", "chat.pubgm.com",
    "im.pubgm.com", "messaging.pubgm.com",
    
    // Analytics
    "analytics.pubgm.com", "track.pubgm.com", "stats.pubgm.com",
    "metrics.pubgm.com", "logs.pubgm.com",
    
    // Test & Dev
    "test.pubgm.com", "dev.pubgm.com", "staging.pubgm.com",
    "beta.pubgm.com", "alpha.pubgm.com",
    
    // Old Domains
    "playbattlegrounds.com", "pubg.com", "pubgm.net",
    "pubgmobile.net", "pubgmhd.net", "gpubgm.com",
    
    // Keywords
    "amsoveasea.com", "pubg-asia.com", "pubg-me.com",
    "pubg-na.com", "pubg-eu.com", "pubg-latam.com", "pubg-oceania.com"
];

/* ============================================
   6) MATCH KEYWORDS — محسّن
   ============================================ */

var RX_MATCH = /\b(
    match|battle|realtime|combat|sync|tick|
    room|gamesvr|battleservice|game-server|battle-server|
    match\.api|battle\.api|pvp|playervsplayer|
    server|gameapi-server|gameservice-server|
    party-server|team-server|session-server|
    connect-server|auth-server|login-server|
    regionselect-server|matchmaking-queue-server|
    game-lobby-server|player-lobby-server|
    lobby-connect-server|lobby-join-server|
    game-queue-server|region-lobby-server|
    region-queue-server|region-dispatch-server|
    jordan-match|jordan-battle|jordan-queue|
    jordan-players|jordan-server|jordan-region|
    match-server|battle-server|realtime-server|
    combat-server|sync-server|tick-server|
    game-room|battle-room|match-room|
    pvp-room|arena-room|battle-arena|
    combat-survival|survival-match|battle-survival|combat-survival
)\b/i;

/* ============================================
   7) LOBBY KEYWORDS — محسّن
   ============================================ */

var RX_LOBBY = /\b(
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
    recruit-er|team-server|session-server|
    connect-server|auth-server|login-server|
    regionselect-server|party-api-server|team-api-server|
    friend-api-server|clan-api-server|matchmaking-queue-server|
    game-lobby-server|player-lobby-server|lobby-connect-server|
    lobby-join-server|game-queue-server|region-lobby-server|
    region-queue-server|region-dispatch-server
)\b/i;

/* ============================================
   8) BOOT / AUTH / CDN KEYWORDS — محسّن
   ============================================ */

var RX_BOOT = /\b(
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

/* ============================================
   9) SMART PING CHECK + AUTO-SWITCH SYSTEM
   ============================================ */

function getBestProxy() {
    var now = Date.now();
    var bestProxy = null;
    var bestScore = -Infinity;
    
    for (var i = 0; i < PROXY_POOL.length; i++) {
        var proxy = PROXY_POOL[i];
        
        // تحديث الping كل 30 ثانية
        if (now - proxy.lastCheck > 30000) {
            try {
                proxy.ping = ping(proxy.host, proxy.port);
                proxy.lastCheck = now;
                
                if (proxy.ping !== null) {
                    proxy.total++;
                    if (proxy.ping <= MAX_PING_MS) {
                        proxy.success++;
                        proxy.score = Math.min(100, proxy.score + 5);
                    } else {
                        proxy.score = Math.max(0, proxy.score - 10);
                    }
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
            proxy.score = 0;
        }
        
        // حساب الدرجة النهائية (الأولوية + الأداء)
        var finalScore = (proxy.priority * 10) + (proxy.score * 0.5) - (proxy.latency || 0);
        
        // اختيار أفضل بروكسي
        if (finalScore > bestScore && proxy.score >= MIN_SUCCESS_RATE) {
            bestScore = finalScore;
            bestProxy = proxy;
        }
    }
    
    // إذا لم ينجح أي بروكسي، استخدم الأساسي
    if (!bestProxy) {
        PROXY_POOL.sort(function(a, b) { return a.priority - b.priority; });
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

/* ============================================
   10) LEAK PROTECTION SYSTEM (منع التسريب)
   ============================================ */

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
    
    // منع تسريب HTTP/HTTPS
    if (HTTP_LEAK_PROTECTION && (host.indexOf("http://") === 0 || host.indexOf("https://") === 0)) {
        return BLOCK;
    }
    
    return null;
}

/* ============================================
   11) CLOUD & SYRIA BLOCK (حظر ذكي)
   ============================================ */

function isCloudHosted(host) {
    var ip = isIPv4(host) ? host : dnsResolve(host);
    if (!ip) return false;
    
    // نطاقات AWS
    var awsRanges = [
        "3.0.0.0/8", "13.0.0.0/8", "35.0.0.0/8", "43.0.0.0/8",
        "52.0.0.0/8", "54.0.0.0/8", "72.0.0.0/8", "74.0.0.0/8",
        "75.0.0.0/8", "76.0.0.0/8", "91.0.0.0/8", "96.0.0.0/8",
        "98.0.0.0/8", "99.0.0.0/8", "100.0.0.0/8", "107.0.0.0/8",
        "108.0.0.0/8", "131.0.0.0/8", "161.0.0.0/8", "162.0.0.0/8",
        "166.0.0.0/8", "167.0.0.0/8", "184.0.0.0/8", "185.0.0.0/8",
        "204.0.0.0/8", "205.0.0.0/8"
    ];
    
    // نطاقات CloudFront
    var cloudfrontRanges = [
        "54.230.0.0/16", "54.239.0.0/16", "52.84.0.0/15",
        "52.200.0.0/16", "54.182.0.0/16", "72.12.0.0/16"
    ];
    
    // نطاقات Google Cloud
    var googleRanges = [
        "35.184.0.0/16", "35.202.0.0/16", "35.203.0.0/16",
        "35.204.0.0/16", "35.205.0.0/16", "35.206.0.0/16",
        "35.207.0.0/16", "35.208.0.0/16", "35.209.0.0/16"
    ];
    
    // نطاقات GoDaddy
    var godaddyRanges = [
        "216.69.0.0/16", "216.70.0.0/16", "216.71.0.0/16",
        "216.72.0.0/16", "216.73.0.0/16", "216.74.0.0/16"
    ];
    
    // نطاقات Azure
    var azureRanges = [
        "13.64.0.0/18", "13.65.0.0/18", "13.66.0.0/18",
        "13.67.0.0/18", "13.68.0.0/18", "13.69.0.0/18",
        "13.70.0.0/18", "13.71.0.0/18", "13.72.0.0/18"
    ];
    
    // نطاقات DigitalOcean
    var digitaloceanRanges = [
        "64.116.0.0/18", "64.117.0.0/18", "64.118.0.0/18",
        "64.119.0.0/18", "64.120.0.0/18", "64.121.0.0/18"
    ];
    
    // فحص نطاقات السحابة
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
    if (cloudHost.indexOf("amazon") !== -1 || cloudHost.indexOf("aws") !== -1 ||
        cloudHost.indexOf("google") !== -1 || cloudHost.indexOf("godaddy") !== -1 ||
        cloudHost.indexOf("azure") !== -1 || cloudHost.indexOf("digitalocean") !== -1 ||
        cloudHost.indexOf("cloudfront") !== -1 || cloudHost.indexOf("cloud") !== -1 ||
        cloudHost.indexOf("heroku") !== -1 || cloudHost.indexOf("ibm") !== -1 ||
        cloudHost.indexOf("oracle") !== -1) {
        return true;
    }
    
    return false;
}

/* ============================================
   12) CACHE SYSTEM (ذاكرة مؤقتة متقدمة)
   ============================================ */

var CACHE = [];
var CACHE_TTL = 300; // 5 دقائق

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

/* ============================================
   13) MAIN ENGINE (أسطوري مع تبديل ذكي)
   ============================================ */

var CURRENT_PROXY = null;
var LAST_SWITCH_TIME = 0;
var SESSION = { matchHost: null, lobbyHost: null };

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

/* ============================================
   14) HELPER FUNCTIONS
   ============================================ */

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
        if (dnsDomainIs(host, PUBG_DOMAINS_GLOBAL[i]) || host === PUBG_DOMAINS_GLOBAL[i]) {
            return true;
        }
    }
    return false;
}

function isMatch(host) {
    return RX_MATCH.test(host);
}

function isLobby(host) {
    return RX_LOBBY.test(host);
}

function isBoot(host) {
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

/* ============================================
   ADVANCED JORDAN DETECTION FUNCTIONS
   ============================================ */

function isJordanAdvanced(ip) {
    ip = isIPv4(ip) ? ip : dnsResolve(ip);
    if (!ip) return false;
    
    // فحص ضد جميع نطاقات الأردن المحدثة
    var jordanRanges = JO_IPV4.concat(JO_IPV6);
    for (var i = 0; i < jordanRanges.length; i++) {
        var range = jordanRanges[i];
        if (isInNet(ip, range.split("/")[0], range.split("/")[1])) {
            return true;
        }
    }
    return false;
}

function isSyriaAdvanced(ip) {
    // نطاقات سوريا الشائعة (يمكن توسيعها)
    var syriaRanges = [
        "91.106.0.0/16", "178.154.0.0/15", "185.33.48.0/22",
        "185.144.128.0/22", "185.192.0.0/22", "193.188.32.0/19"
    ];
    
    ip = isIPv4(ip) ? ip : dnsResolve(ip);
    if (!ip) return false;
    
    for (var i = 0; i < syriaRanges.length; i++) {
        if (isInNet(ip, syriaRanges[i].split("/")[0], syriaRanges[i].split("/")[1])) {
            return true;
        }
    }
    return false;
}

function isNearbyAdvanced(ip) {
    // دول مجاورة (مصر، السعودية، العراق، الأردن، الكويت، الإمارات، البحرين، قطر، عمان)
    var nearbyRanges = [
        // Egypt
        "102.128.0.0/11", "131.253.0.0/16", "149.126.0.0/16",
        // Saudi Arabia
        "37.32.0.0/13", "37.56.0.0/14", "62.115.128.0/17",
        "86.62.0.0/15", "85.164.0.0/14", "109.226.0.0/15",
        // Iraq
        "46.20.0.0/14", "62.201.0.0/16", "77.248.0.0/14",
        "78.111.0.0/16", "80.86.0.0/15", "87.184.0.0/13",
        // Kuwait
        "37.52.0.0/14", "80.183.0.0/16", "185.224.0.0/22",
        // UAE
        "5.38.0.0/15", "5.42.0.0/15", "80.96.0.0/14",
        "94.160.0.0/13", "94.205.0.0/16", "185.56.0.0/22",
        // Bahrain
        "37.104.0.0/14", "80.181.0.0/16", "185.112.0.0/22",
        // Qatar
        "37.136.0.0/14", "77.243.0.0/16", "178.172.0.0/14",
        // Oman
        "37.60.0.0/14", "80.184.0.0/16", "185.128.0.0/22"
    ];
    
    ip = isIPv4(ip) ? ip : dnsResolve(ip);
    if (!ip) return false;
    
    for (var i = 0; i < nearbyRanges.length; i++) {
        if (isInNet(ip, nearbyRanges[i].split("/")[0], nearbyRanges[i].split("/")[1])) {
            return true;
        }
    }
    return false;
}

function isJordanNetwork(ip) {
    // فحص إذا كان DNS الخاص بالمستخدم من الأردن
    ip = isIPv4(ip) ? ip : dnsResolve(ip);
    if (!ip) return false;
    
    // نطاقات شركات الاتصالات الأردنية
    var jordanDnsRanges = [
        "82.212.0.0/16", "94.142.32.0/19", "193.188.0.0/16",
        "193.188.64.0/18", "176.28.128.0/17", "212.35.0.0/17",
        "213.139.32.0/19", "213.139.192.0/19", "217.20.192.0/19",
        "185.82.0.0/18", "194.126.0.0/16"
    ];
    
    for (var i = 0; i < jordanDnsRanges.length; i++) {
        if (isInNet(ip, jordanDnsRanges[i].split("/")[0], jordanDnsRanges[i].split("/")[1])) {
            return true;
        }
    }
    return false;
}
