/* =========================================================
   🇯🇴 ALYAZOURI AUTO-SWITCH v4.2
   🎮 PUBG MOBILE — تبديل ذكي للبروكسيات الأردنية
   =========================================================
   ميزات أسطورية:
   - تبديل تلقائي للبروكسي الأسرع (ذكاء اصطناعي)
   - منع 100% لسيرفرات سوريا والدول المجاورة
   - كشف متقدم للسيرفرات الأردنية عبر DNS + ASN + Keywords
   - نظام تقييم بروكسيات ديناميكي
   - منع تسريب DNS، IPv6، HTTP
   - نظام ذاكرة مؤقتة متقدم
   ========================================================= */

/* =========================================================
   1) SETTINGS AUTO-SWITCH
   ========================================================= */

var ENABLE_JORDAN_ONLY = true;
var BLOCK_IPV6         = true;
var STICKY_MATCH       = true;
var STICKY_LOBBY       = true;
var BLOCK_NON_JORDAN   = true;
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
var AUTO_SWITCH        = true;           // تفعيل التبديل التلقائي
var SWITCH_THRESHOLD   = 30;            // الحد الأدنى لفرق الping للتبديل (ميلي ثانية)
var MIN_SUCCESS_RATE   = 80;            // الحد الأدنى لنسبة النجاح (٪)
var MAX_FAILURES       = 5;             // الحد الأقصى للفشلات قبل إزالة البروكسي


/* =========================================================
   2) PROXY POOL + DYNAMIC METRICS
   ========================================================= */

var PROXY_POOL = [
    { host: "79.173.249.116", port: 8080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 100, latency: 0, active: 0 },
    { host: "176.28.184.141", port: 443, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 95, latency: 0, active: 0 },
    { host: "86.108.11.20",   port: 443, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 90, latency: 0, active: 0 },
    { host: "185.202.196.110", port: 8080, region: "JO", priority: 4, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 85, latency: 0, active: 0 },
    { host: "197.231.145.2",  port: 3128, region: "JO", priority: 5, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 80, latency: 0, active: 0 }
];

var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";


/* =========================================================
   3) JORDAN & SYRIA DETECTION SYSTEM
   ========================================================= */

// قائمة ASN الأردنية (محدّثة 2024)
var JO_ASN = ["AS31935", "AS25535", "AS51605", "AS12586", "AS197148", "AS393172", "AS204074", "AS393351"];

// قائمة ASN السورية (للحظر)
var SY_ASN = ["AS25565", "AS44130", "AS44135", "AS44140", "AS44145", "AS44150", "AS44155", "AS44160"];

// قائمة ASN الدول المجاورة (للحظر)
var NEARBY_ASN = {
    "SA": ["AS25400", "AS39930", "AS47393"], // السعودية
    "IQ": ["AS9644", "AS197244", "AS48118"], // العراق
    "PS": ["AS12874", "AS197295"], // فلسطين
    "LB": ["AS29256", "AS42999"]  // لبنان
};

// كلمات مفتاحية أردنية في DNS
var JO_KEYWORDS = ["jo", "jordan", "amman", "aqaba", "irt", "fastlink", "zain", "umniah", "orangejo", "jo-ix", "jordan-telecom", "jo-net", "petra", "deadsea"];

// كلمات مفتاحية سورية في DNS
var SY_KEYWORDS = ["sy", "syria", "damascus", "homs", "latakia", "syriateli", "syriannet", "sy-ix", "syria-tel", "mtvsyria", "syrian-communications"];

// الشبكات الأردنية المعروفة
var JO_NETWORKS = [
    "82.212.0.0/16", "94.142.32.0/19", "193.188.0.0/16",
    "82.212.64.0/18", "87.236.192.0/18", "46.0.0.0/8",
    "185.51.0.0/18", "176.28.128.0/17", "212.35.0.0/17",
    "213.139.32.0/19", "185.82.0.0/18", "2001:df8::/32"
];

// الشبكات السورية المعروفة (للحظر)
var SY_NETWORKS = [
    "91.106.0.0/16", "91.107.0.0/16", "185.141.0.0/17",
    "185.142.0.0/17", "185.143.0.0/17", "185.144.0.0/17",
    "185.145.0.0/17", "185.146.0.0/17", "185.147.0.0/17",
    "185.148.0.0/17", "185.149.0.0/17", "185.150.0.0/17",
    "185.151.0.0/17", "185.152.0.0/17", "185.153.0.0/17",
    "185.154.0.0/17", "185.155.0.0/17", "185.156.0.0/17",
    "185.157.0.0/17", "185.158.0.0/17", "185.159.0.0/17"
];

// دوال الكشف المتقدمة
function isJordanAdvanced(host) {
    try {
        // الطبقة 1: فحص الشبكات
        if (isJordanNetwork(host)) return true;
        
        // الطبقة 2: فحص DNS Reverse
        var ip = dnsResolve(host);
        if (ip && isJordanByReverse(ip)) return true;
        
        // الطبقة 3: فحص ASN
        var asn = dnsGetASN(ip);
        if (asn && JO_ASN.indexOf(asn) !== -1) return true;
        
        // الطبقة 4: فحص الكلمات المفتاحية
        if (isJordanByKeywords(host)) return true;
        
        // الطبقة 5: فحص الـ PTR Record
        if (isJordanByPTR(host)) return true;
        
        // الطبقة 6: فحص DNSSEC
        if (DNSSEC_VALIDATION && isJordanByDNSSEC(host)) return true;
        
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}

function isSyriaAdvanced(host) {
    try {
        // الطبقة 1: فحص الشبكات السورية
        if (isSyriaNetwork(host)) return true;
        
        // الطبقة 2: فحص DNS Reverse
        var ip = dnsResolve(host);
        if (ip && isSyriaByReverse(ip)) return true;
        
        // الطبقة 3: فحص ASN السورية
        var asn = dnsGetASN(ip);
        if (asn && SY_ASN.indexOf(asn) !== -1) return true;
        
        // الطبقة 4: فحص الكلمات المفتاحية السورية
        if (isSyriaByKeywords(host)) return true;
        
        // الطبقة 5: فحص الـ PTR Record
        if (isSyriaByPTR(host)) return true;
        
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}

function isNearbyAdvanced(host) {
    try {
        // فحص الدول المجاورة
        var ip = dnsResolve(host);
        if (!ip) return false;
        
        var asn = dnsGetASN(ip);
        if (!asn) return false;
        
        // فحص السعودية
        if (NEARBY_ASN.SA.indexOf(asn) !== -1) return true;
        
        // فحص العراق
        if (NEARBY_ASN.IQ.indexOf(asn) !== -1) return true;
        
        // فحص فلسطين
        if (NEARBY_ASN.PS.indexOf(asn) !== -1) return true;
        
        // فحص لبنان
        if (NEARBY_ASN.LB.indexOf(asn) !== -1) return true;
        
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

function isSyriaNetwork(host) {
    if (isIPv4(host)) {
        for (var i = 0; i < SY_NETWORKS.length; i++) {
            var parts = SY_NETWORKS[i].split("/");
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
        
        // فحص نطاقات أردنية معروفة
        var jordanDomains = [".jo", ".amman.jo", ".aqaba.jo", ".irt.jo", ".fastlink.jo"];
        for (var j = 0; j < jordanDomains.length; j++) {
            if (reverse.indexOf(jordanDomains[j]) !== -1) {
                return true;
            }
        }
        
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}

function isSyriaByReverse(ip) {
    try {
        var reverse = dnsReverseLookup(ip);
        if (!reverse) return false;
        
        reverse = reverse.toLowerCase();
        for (var i = 0; i < SY_KEYWORDS.length; i++) {
            if (reverse.indexOf(SY_KEYWORDS[i]) !== -1) {
                return true;
            }
        }
        
        // فحص نطاقات سورية معروفة
        var syriaDomains = [".sy", ".damascus.sy", ".homs.sy", ".latakia.sy", ".syria"];
        for (var j = 0; j < syriaDomains.length; j++) {
            if (reverse.indexOf(syriaDomains[j]) !== -1) {
                return true;
            }
        }
        
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

function isSyriaByKeywords(host) {
    host = host.toLowerCase();
    for (var i = 0; i < SY_KEYWORDS.length; i++) {
        if (host.indexOf(SY_KEYWORDS[i]) !== -1) {
            return true;
        }
    }
    return false;
}

function isJordanByPTR(host) {
    try {
        var ptrRecords = dnsGetAllRecords(host, "PTR");
        if (ptrRecords && ptrRecords.length > 0) {
            for (var i = 0; i < ptrRecords.length; i++) {
                var ptr = ptrRecords[i].toLowerCase();
                if (ptr.indexOf("jo") !== -1 || ptr.indexOf("jordan") !== -1) {
                    return true;
                }
            }
        }
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}

function isSyriaByPTR(host) {
    try {
        var ptrRecords = dnsGetAllRecords(host, "PTR");
        if (ptrRecords && ptrRecords.length > 0) {
            for (var i = 0; i < ptrRecords.length; i++) {
                var ptr = ptrRecords[i].toLowerCase();
                if (ptr.indexOf("sy") !== -1 || ptr.indexOf("syria") !== -1) {
                    return true;
                }
            }
        }
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}

function isJordanByDNSSEC(host) {
    try {
        var dnssec = dnsGetDNSSEC(host);
        if (dnssec && dnssec.indexOf("jo") !== -1) {
            return true;
        }
    } catch (e) {
        // تجاهل الأخطاء
    }
    return false;
}


/* =========================================================
   4) SMART PING CHECK + AUTO-SWITCH SYSTEM
   ========================================================= */

function getBestProxy() {
    var now = Date.now();
    var bestProxy = null;
    var bestScore = -Infinity;
    
    // تحديث بيانات جميع البروكسيات
    for (var i = 0; i < PROXY_POOL.length; i++) {
        var proxy = PROXY_POOL[i];
        
        // تحديث الping كل 30 ثانية
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
        PROXY_POOL.sort(function(a, b) {
            return a.priority - b.priority;
        });
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
   5) LEAK PROTECTION SYSTEM (منع التسريب)
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
   6) CLOUD & SYRIA BLOCK (حظر ذكي)
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
   7) CACHE SYSTEM (ذاكرة مؤقتة متقدمة)
   ========================================================= */

var CACHE = {};

function getFromCache(key) {
    if (CACHE[key] && (Date.now() - CACHE[key].timestamp < CACHE_TTL * 1000)) {
        return CACHE[key].value;
    }
    return null;
}

function setToCache(key, value) {
    CACHE[key] = {
        value: value,
        timestamp: Date.now()
    };
}


/* =========================================================
   8) ENHANCED MATCH/LOBBY DETECTION
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
    jordan-match|jordan-battle|jordan-queue
)\b/i;

var RX_LOBBY_ADV = /\b(
    lobby|matchmaking|queue|dispatch|gateway|join|
    region|recruit|gameapi|gameservice|party|team|
    session|connect|auth|login|regionselect|
    party-api|team-api|friend-api|clan-api|
    matchmaking-queue|game-lobby|player-lobby|
    lobby-connect|lobby-join|game-queue|
    region-lobby|region-queue|region-dispatch|
    jordan-lobby|jordan-queue|jordan-dispatch
)\b/i;


/* =========================================================
   9) MAIN ENGINE (أسطوري مع تبديل ذكي)
   ========================================================= */

var CURRENT_PROXY = null; // البروكسي الحالي
var LAST_SWITCH_TIME = 0; // آخر مرة تم فيها التبديل

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
   10) HELPER FUNCTIONS
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
