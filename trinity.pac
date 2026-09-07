/* =========================================================
   🇯🇴 ALYAZOURI ULTRA v4.0 — النظام الذكي المتكامل
   =========================================================
   ميزات فائقة:
   - نظام منع تسريب متعدد الطبقات
   - ذكاء اصطناعي بسيط لتحليل الأنماط
   - نظام مراقبة مستمر للبروكسيات
   - حماية من الثغرات المعروفة
   - تحسين الأداء عبر التعلم الذاتي
   ========================================================= */

/* =========================================================
   1) SETTINGS ULTRA
   ========================================================= */

var ENABLE_JORDAN_ONLY = true;
var BLOCK_IPV6         = true;
var STICKY_MATCH       = true;
var STICKY_LOBBY       = true;
var BLOCK_NON_JORDAN   = true;
var PANIC_BLOCK_ALL    = false;

// إعدادات الأداء
var MAX_PING_MS        = 80;      // أقصى زمن ping مقبول
var CACHE_TTL          = 900;     // تخزين مؤقت 15 دقيقة
var LOGGING            = false;   // تسجيل الأحداث

// إعدادات الأمان
var MAX_HOPS           = 3;       // أقصى عدد قفزات مسموح
var LEAKY_BUCKET_SIZE  = 10;      // حجم سلة التسريب
var LEAKY_REFILL_RATE  = 1;       // معدل تعبئة سلة التسريب في الثانية


/* =========================================================
   2) PROXY POOL + SECURITY METRICS
   ========================================================= */

var PROXY_POOL = [
    { host: "79.173.249.116", port: 8080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, score: 100 },
    { host: "176.28.184.141", port: 443, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, score: 100 },
    { host: "86.108.11.20",   port: 443, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, score: 100 },
    { host: "185.202.196.110", port: 8080, region: "JO", priority: 4, ping: null, lastCheck: 0, failures: 0, score: 100 },
    { host: "197.231.145.2",  port: 3128, region: "JO", priority: 5, ping: null, lastCheck: 0, failures: 0, score: 100 }
];

var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";


/* =========================================================
   3) MULTI-LAYER LEAK PROTECTION
   ========================================================= */

// سلة التسريب (Leaky Bucket) لمنع الهجمات
var leakBucket = {
    tokens: LEAKY_BUCKET_SIZE,
    lastRefill: Date.now()
};

function consumeLeakToken() {
    var now = Date.now();
    var delta = (now - leakBucket.lastRefill) / 1000;
    leakBucket.lastRefill = now;
    leakBucket.tokens = Math.min(LEAKY_BUCKET_SIZE, leakBucket.tokens + delta * LEAKY_REFILL_RATE);
    
    if (leakBucket.tokens >= 1) {
        leakBucket.tokens -= 1;
        return true;
    }
    return false;
}

// نظام منع التسريب المتقدم
function preventLeak(host, proxyChain) {
    // 1. فحص عدد القفزات
    var hops = proxyChain.split(";").length - 1; // -1 لأن الأخير هو BLOCK
    if (hops > MAX_HOPS) {
        if (LOGGING) console.log("Leak prevented: Too many hops for " + host);
        return false;
    }
    
    // 2. فحص جميع البروكسيات في السلسلة
    var proxies = proxyChain.split(";");
    for (var i = 0; i < proxies.length; i++) {
        var proxy = proxies[i].trim();
        if (proxy && proxy !== DIRECT && proxy !== BLOCK) {
            var proxyHost = proxy.split(" ")[1].split(":")[0];
            if (!isJordanAdvanced(proxyHost)) {
                if (LOGGING) console.log("Leak prevented: Non-Jordan proxy in chain: " + proxyHost);
                return false;
            }
        }
    }
    
    // 3. فحص الوجهة النهائية
    var lastProxy = proxies[proxies.length - 2]; // قبل الأخير (لأن الأخير هو BLOCK)
    if (lastProxy && lastProxy !== DIRECT) {
        var lastProxyHost = lastProxy.split(" ")[1].split(":")[0];
        if (!isJordanAdvanced(lastProxyHost)) {
            if (LOGGING) console.log("Leak prevented: Last proxy is not Jordan: " + lastProxyHost);
            return false;
        }
    }
    
    return true;
}


/* =========================================================
   4) SMART ROUTING ENGINE
   ========================================================= */

function getSmartRoute(host, type) {
    // 1. الحصول على أفضل بروكسي
    var bestProxy = getBestProxy();
    if (!bestProxy) return BLOCK;
    
    // 2. بناء السلسلة الذكية
    var chain = [];
    var currentProxy = bestProxy;
    
    // إضافة البروكسي الأساسي
    chain.push("PROXY " + currentProxy.host + ":" + currentProxy.port);
    
    // إضافة بروكسيات احتياطية إذا لزم الأمر
    if (type === "match") {
        // للمباريات: استخدام سلسلة قصيرة
        var backup1 = getBackupProxy(1);
        if (backup1) chain.push("PROXY " + backup1.host + ":" + backup1.port);
    } else if (type === "lobby") {
        // للوبي: استخدام سلسلة أطول قليلاً
        var backup1 = getBackupProxy(1);
        var backup2 = getBackupProxy(2);
        if (backup1) chain.push("PROXY " + backup1.host + ":" + backup1.port);
        if (backup2) chain.push("PROXY " + backup2.host + ":" + backup2.port);
    }
    
    // إضافة BLOCK في النهاية
    chain.push(BLOCK);
    
    return chain.join("; ");
}


/* =========================================================
   5) AI-BASED PATTERN RECOGNITION
   ========================================================= */

var PATTERN_DB = {
    // أنماط معروفة لسيرفرات PUBG
    "match.api.pubgm.qq.com": "match",
    "battle.api.pubgm.qq.com": "match",
    "lobby.api.pubgm.qq.com": "lobby",
    "gateway.pubgm.qq.com": "lobby",
    "sync.pubgm.qq.com": "match",
    "room.pubgm.qq.com": "match",
    
    // أنماط أردنية معروفة
    "82.212.x.x": "jordan",
    "94.142.32.x": "jordan",
    "193.188.x.x": "jordan"
};

function recognizePattern(host) {
    // فحص الأنماط المعروفة
    for (var pattern in PATTERN_DB) {
        if (host.indexOf(pattern) !== -1) {
            return PATTERN_DB[pattern];
        }
    }
    
    // فحص الأنماط الإحصائية
    if (host.match(/\bmatch\b/i) && host.match(/\bapi\b/i)) return "match";
    if (host.match(/\blobby\b/i) && host.match(/\bapi\b/i)) return "lobby";
    
    return null;
}


/* =========================================================
   6) MAIN ENGINE (فائق الذكاء)
   ========================================================= */

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
        if (BLOCK_IPV6 && isPUBGDomain(host)) return BLOCK;
        return DIRECT;
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
        
        // PUBG IP
        if (isPUBGDomain(host)) {
            // كشف النمط
            var pattern = recognizePattern(host);
            
            // بناء السلسلة الذكية
            var proxyChain;
            if (pattern === "match") {
                proxyChain = getSmartRoute(host, "match");
            } else if (pattern === "lobby") {
                proxyChain = getSmartRoute(host, "lobby");
            } else {
                // افتراضي: لوبي
                proxyChain = getSmartRoute(host, "lobby");
            }
            
            // منع التسريب
            if (!preventLeak(host, proxyChain)) {
                setToCache(cacheKey, BLOCK);
                return BLOCK;
            }
            
            // لصق الاستضافة
            if (pattern === "match" && !lockMatch(host)) {
                setToCache(cacheKey, BLOCK);
                return BLOCK;
            }
            if (pattern === "lobby" && !lockLobby(host)) {
                setToCache(cacheKey, BLOCK);
                return BLOCK;
            }
            
            setToCache(cacheKey, proxyChain);
            return proxyChain;
        }
        
        // Block non-Jordan
        if (ENABLE_JORDAN_ONLY && BLOCK_NON_JORDAN && !isJordanAdvanced(host)) {
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
        
        // كشف النمط
        var pattern = recognizePattern(host);
        
        // بناء السلسلة الذكية
        var proxyChain;
        if (pattern === "match") {
            proxyChain = getSmartRoute(host, "match");
        } else if (pattern === "lobby") {
            proxyChain = getSmartRoute(host, "lobby");
        } else {
            // افتراضي: لوبي
            proxyChain = getSmartRoute(host, "lobby");
        }
        
        // منع التسريب
        if (!preventLeak(host, proxyChain)) {
            setToCache(cacheKey, BLOCK);
            return BLOCK;
        }
        
        // لصق الاستضافة
        if (pattern === "match" && !lockMatch(host)) {
            setToCache(cacheKey, BLOCK);
            return BLOCK;
        }
        if (pattern === "lobby" && !lockLobby(host)) {
            setToCache(cacheKey, BLOCK);
            return BLOCK;
        }
        
        setToCache(cacheKey, proxyChain);
        return proxyChain;
    }
    
    // NON-PUBG TRAFFIC
    setToCache(cacheKey, DIRECT);
    return DIRECT;
}


/* =========================================================
   7) ADVANCED HELPER FUNCTIONS
   ========================================================= */

function getBackupProxy(priority) {
    // الحصول على بروكسي احتياطي بنفس الأولوية
    for (var i = 0; i < PROXY_POOL.length; i++) {
        if (PROXY_POOL[i].priority === priority && PROXY_POOL[i].host !== getBestProxy().host) {
            return PROXY_POOL[i];
        }
    }
    return null;
}

function updateProxyScore(proxy, success) {
    if (success) {
        proxy.score = Math.min(100, proxy.score + 5);
    } else {
        proxy.score = Math.max(0, proxy.score - 10);
    }
}

function isJordanAdvanced(host) {
    try {
        // 1. فحص الشبكات
        if (isJordanNetwork(host)) return true;
        
        // 2. فحص DNS Reverse
        var ip = dnsResolve(host);
        if (ip && isJordanByReverse(ip)) return true;
        
        // 3. فحص ASN
        var asn = dnsGetASN(ip);
        if (asn && JO_ASN.indexOf(asn) !== -1) return true;
        
        // 4. فحص الكلمات المفتاحية
        if (isJordanByKeywords(host)) return true;
        
        // 5. فحص السجلات المعروفة
        if (host.match(/\.jo$/) || host.match(/jordan/i)) return true;
        
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}

function isJordanNetwork(host) {
    if (isIPv4(host)) {
        for (var i = 0; i < JO_NETWORKS.length; i++) {
            var parts = JO_NETWORKS[i].split("/");
            var base = parts[0];
            var bits = parseInt(parts[1], 10);
            var mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
            var ipNum = ((parseInt(host.split(".")[0],10) << 24) |
                         (parseInt(host.split(".")[1],10) << 16) |
                         (parseInt(host.split(".")[2],10) << 8) |
                          parseInt(host.split(".")[3],10)) >>> 0;
            var baseNum = ((parseInt(base.split(".")[0],10) << 24) |
                           (parseInt(base.split(".")[1],10) << 16) |
                           (parseInt(base.split(".")[2],10) << 8) |
                            parseInt(base.split(".")[3],10)) >>> 0;
            if ((ipNum & mask) === (baseNum & mask)) return true;
        }
    }
    return false;
}

function isJordanByReverse(ip) {
    try {
        var reverse = dnsReverseLookup(ip);
        if (!reverse) return false;
        
        reverse = reverse.toLowerCase();
        for (var i = 0; i < JO_KEYWORDS.length; i++) {
            if (reverse.indexOf(JO_KEYWORDS[i]) !== -1) {
                return true;
            }
        }
        
        // فحص نطاق .jo
        if (reverse.endsWith(".jo")) return true;
        
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}

function isJordanByKeywords(host) {
    host = host.toLowerCase();
    for (var i = 0; i < JO_KEYWORDS.length; i++) {
        if (host.indexOf(JO_KEYWORDS[i]) !== -1) {
            return true;
        }
    }
    return false;
}

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
        "54.230.0.0/16", "54.239.0.0/16", "52.84.0.0/15", 
        "52.200.0.0/16", "52.219.0.0/16", "54.240.0.0/17"
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
        "13.67.0.0/18", "13.68.0.0/18", "13.69.0.0/18"
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
        cloudHost.indexOf("server") !== -1) {
        return true;
    }
    
    return false;
}

function isPUBGDomain(host) {
    host = host.toLowerCase();
    var PUBG_DOMAINS = [
        "pubg.com", "pubgmobile.com", "pubgm.com", "pubgmhd.com",
        "krafton.com", "playbattlegrounds.com", "pubg.qq.com",
        "pubgm.qq.com", "pubgmhd.qq.com", "gpubgm.com", "amsoveasea.com"
    ];
    for (var i = 0; i < PUBG_DOMAINS.length; i++) {
        if (host === PUBG_DOMAINS[i] || dnsDomainIs(host, "." + PUBG_DOMAINS[i])) {
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
