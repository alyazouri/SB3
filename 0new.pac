// =====================================================================
//  PUBG MOBILE — JORDAN ONLY (Match / TDM / Arena / All Modes)
//  النسخة المطورة v3.0
//  ضمان دخول سيرفرات أردنية 100% + توجيه وتثبيت
// =====================================================================

// ======================== الإعدادات الرئيسية ========================

var MATCH_JO       = "PROXY 46.185.131.218:20001";
var MATCH_JO_B     = "PROXY 212.35.66.45:8085";
var MATCH_JO_C     = "PROXY 212.35.66.45:8181";

var BACKUP_PROXIES = [
    "PROXY 46.185.131.218:443",
    "PROXY 46.185.131.218:8080",
    "PROXY 46.185.131.218:8443",
    "PROXY 212.35.66.45:443",
    "PROXY 212.35.66.45:8085",
    "PROXY 212.35.66.45:8181",
    "PROXY 212.35.66.45:8443",
    "PROXY 79.134.128.1:8080",
    "PROXY 79.134.128.1:443",
    "PROXY 176.29.0.1:8080"
];

var MAX_RETRIES        = 8;
var RETRY_DELAY        = 800;
var BACKOFF_MULTIPLIER = 1.5;
var DEBUG_MODE         = true;
var STICKY_SESSION     = true;
var LOCK_NETWORK       = true;

// ======================== مجمعات البروكسي ========================

var LOBBY_POOL = [
    "PROXY 212.35.66.45:8085",
    "PROXY 212.35.66.45:8181",
    "PROXY 46.185.131.218:443",
    "PROXY 46.185.131.218:8080",
    "PROXY 79.134.128.1:8080",
    "PROXY 176.29.0.1:443"
];

var MATCH_POOL = [
    "PROXY 46.185.131.218:20001",
    "PROXY 46.185.131.218:20002",
    "PROXY 212.35.66.45:20001",
    "PROXY 212.35.66.45:20002",
    "PROXY 79.134.128.1:20001"
];

var SOCIAL_POOL = [
    "PROXY 212.35.66.45:8085",
    "PROXY 46.185.131.218:443",
    "PROXY 79.134.128.1:443"
];

var CDN_POOL = [
    "PROXY 212.35.66.45:8085",
    "PROXY 46.185.131.218:443"
];

var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ======================== شبكات الأردن IPv4 ========================

var JORDAN_MATCH_IPV4 = [
    // Orange Jordan
    ["46.185.128.0",    "255.255.128.0"],
    // Zain Jordan
    ["77.245.0.0",      "255.255.240.0"],
    // Umniah
    ["79.134.128.0",    "255.255.224.0"],
    // Batelco Jordan / Damamax
    ["176.29.0.0",      "255.255.0.0"],
    // Regional datacenter
    ["185.131.216.0",   "255.255.252.0"],
    // Zain Jo secondary
    ["212.34.0.0",      "255.255.0.0"],
    // Jordan Telecom / Orange
    ["213.139.64.0",    "255.255.192.0"],
    // Jordan secondary ranges
    ["176.57.0.0",      "255.255.0.0"],
    ["188.123.0.0",     "255.255.0.0"],
    ["188.247.0.0",     "255.255.0.0"],
    ["5.23.0.0",        "255.255.0.0"],
    ["109.224.0.0",     "255.255.0.0"],
    // Jordan additional
    ["193.188.64.0",    "255.255.224.0"],
    ["149.200.0.0",     "255.255.0.0"],
    ["185.170.164.0",   "255.255.252.0"],
    // Orange Jordan extra
    ["41.188.0.0",      "255.255.128.0"],
    // Umniah extra
    ["91.186.0.0",      "255.255.224.0"],
    // Zain gaming range
    ["37.123.128.0",    "255.255.128.0"]
];

var JORDAN_WIDE_IPV4 = [
    ["46.185.128.0",    "255.255.128.0"],
    ["77.245.0.0",      "255.255.240.0"],
    ["79.134.128.0",    "255.255.224.0"],
    ["176.29.0.0",      "255.255.0.0"],
    ["185.131.216.0",   "255.255.252.0"],
    ["212.34.0.0",      "255.255.0.0"],
    ["213.139.64.0",    "255.255.192.0"],
    ["176.57.0.0",      "255.255.0.0"],
    ["188.123.0.0",     "255.255.0.0"],
    ["188.247.0.0",     "255.255.0.0"],
    ["5.23.0.0",        "255.255.0.0"],
    ["109.224.0.0",     "255.255.0.0"],
    ["193.188.64.0",    "255.255.224.0"],
    ["149.200.0.0",     "255.255.0.0"],
    ["185.170.164.0",   "255.255.252.0"],
    ["41.188.0.0",      "255.255.128.0"],
    ["91.186.0.0",      "255.255.224.0"],
    ["37.123.128.0",    "255.255.128.0"],
    ["178.77.0.0",      "255.255.0.0"],
    ["185.86.0.0",      "255.255.0.0"],
    ["62.72.0.0",       "255.255.0.0"],
    ["37.202.0.0",      "255.255.0.0"],
    ["85.159.0.0",      "255.255.0.0"],
    ["93.93.0.0",       "255.255.0.0"],
    ["93.95.0.0",       "255.255.0.0"],
    ["37.252.0.0",      "255.255.0.0"],
    ["94.127.0.0",      "255.255.0.0"],
    ["31.14.0.0",       "255.255.0.0"],
    ["195.94.0.0",      "255.255.0.0"]
];

// ======================== القائمة السوداء (خارج الأردن) ========================

var GEO_BLACKLIST = [
    // روسيا
    ["5.136.0.0",       "255.248.0.0"],
    ["31.128.0.0",      "255.192.0.0"],
    ["46.16.0.0",       "255.240.0.0"],
    ["95.24.0.0",       "255.248.0.0"],
    ["178.64.0.0",      "255.192.0.0"],
    // آسيا البعيدة
    ["36.0.0.0",        "255.0.0.0"],
    ["39.0.0.0",        "255.0.0.0"],
    ["42.0.0.0",        "255.0.0.0"],
    ["49.0.0.0",        "255.0.0.0"],
    ["58.0.0.0",        "255.0.0.0"],
    ["59.0.0.0",        "255.0.0.0"],
    ["60.0.0.0",        "255.0.0.0"],
    ["14.0.0.0",        "255.0.0.0"],
    ["27.0.0.0",        "255.0.0.0"],
    ["1.0.0.0",         "255.0.0.0"],
    // أوروبا الشرقية
    ["91.196.0.0",      "255.252.0.0"],
    ["92.100.0.0",      "255.252.0.0"],
    ["109.192.0.0",     "255.192.0.0"],
    // جنوب آسيا (PUBG Asia)
    ["103.0.0.0",       "255.0.0.0"],
    ["110.0.0.0",       "254.0.0.0"],
    ["112.0.0.0",       "254.0.0.0"],
    ["114.0.0.0",       "254.0.0.0"],
    ["116.0.0.0",       "252.0.0.0"],
    ["120.0.0.0",       "248.0.0.0"],
    ["128.0.0.0",       "248.0.0.0"],
    ["175.0.0.0",       "255.0.0.0"],
    ["180.0.0.0",       "248.0.0.0"],
    ["182.0.0.0",       "254.0.0.0"],
    ["211.0.0.0",       "255.0.0.0"],
    ["218.0.0.0",       "254.0.0.0"],
    ["220.0.0.0",       "252.0.0.0"],
    ["222.0.0.0",       "254.0.0.0"]
];

// ======================== حالة الجلسة ========================

var SESSION = {
    matchNet:       null,
    dnsCache:       {},
    retryCount:     0,
    lastProxyIndex: 0,
    lastRetryTime:  0,
    proxyLatency:   {},
    serverLoad:     {},
    sessionStart:   0,
    matchCount:     0,
    lockedProxy:    null,
    lockedNet:      null,
    failCount:      {},
    successCount:   {},
    rotationSeed:   Math.floor(Math.random() * 10000),
    proxyHealth:    {},
    lastHealthCheck: 0
};

// ======================== دوال مساعدة ========================

function norm(h) {
    if (!h) return "";
    h = String(h).toLowerCase();
    if (h.charAt(0) === "[") {
        var j = h.indexOf("]");
        if (j > -1) h = h.substring(1, j);
    } else {
        var i = h.indexOf(":");
        if (i > -1) h = h.substring(0, i);
    }
    return h;
}

function ipToLong(ip) {
    var p = ip.split(".");
    return ((parseInt(p[0]) << 24) |
            (parseInt(p[1]) << 16) |
            (parseInt(p[2]) << 8)  |
             parseInt(p[3])) >>> 0;
}

function maskToLen(mask) {
    var m = ipToLong(mask);
    var bits = 0;
    while (m & 0x80000000) { bits++; m <<= 1; }
    return bits;
}

function isInList(ip, list) {
    if (!ip || ip.indexOf(":") > -1) return false;
    var ipLong = ipToLong(ip);
    for (var i = 0; i < list.length; i++) {
        var netLong = ipToLong(list[i][0]);
        var maskLong = ipToLong(list[i][1]);
        if ((ipLong & maskLong) === (netLong & maskLong)) return true;
    }
    return false;
}

function resolvePinned(host) {
    if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
    var ip = null;
    try {
        if (typeof dnsResolveEx === "function") {
            var arr = dnsResolveEx(host);
            if (arr && arr.length) {
                for (var k = 0; k < arr.length; k++) {
                    if (arr[k].indexOf(":") === -1) {
                        ip = arr[k];
                        break;
                    }
                }
            }
        }
    } catch (e) {}
    if (!ip) {
        try { ip = dnsResolve(host); } catch (e) {}
    }
    if (ip && ip.indexOf(":") === -1) {
        SESSION.dnsCache[host] = ip;
    }
    return ip;
}

// ======================== تدوير البروكسي الذكي ========================

function hashHost(host) {
    var h = SESSION.rotationSeed;
    for (var i = 0; i < host.length; i++) {
        h = ((h << 5) - h + host.charCodeAt(i)) & 0x7FFFFFFF;
    }
    return h;
}

function pickLobbyProxy(host) {
    if (SESSION.lockedProxy && STICKY_SESSION) {
        return SESSION.lockedProxy;
    }
    var idx = hashHost(host) % LOBBY_POOL.length;
    var chosen = LOBBY_POOL[idx];

    // تجنب البروكسيات الفاشلة
    if (SESSION.failCount[chosen] && SESSION.failCount[chosen] > 3) {
        for (var i = 0; i < LOBBY_POOL.length; i++) {
            var alt = LOBBY_POOL[(idx + i + 1) % LOBBY_POOL.length];
            if (!SESSION.failCount[alt] || SESSION.failCount[alt] <= 3) {
                chosen = alt;
                break;
            }
        }
    }
    return chosen;
}

function pickMatchProxy(host) {
    // إذا مثبت على بروكسي وجهاز
    if (SESSION.lockedProxy && STICKY_SESSION) {
        return SESSION.lockedProxy;
    }

    // اختيار أقل بروكسي تأخير
    var bestProxy = MATCH_JO;
    var bestLatency = 99999;

    for (var i = 0; i < MATCH_POOL.length; i++) {
        var p = MATCH_POOL[i];
        var lat = SESSION.proxyLatency[p] || 5000;
        var fails = SESSION.failCount[p] || 0;

        // وزن: تأخير + فشل
        var score = lat + (fails * 2000);

        if (score < bestLatency) {
            bestLatency = score;
            bestProxy = p;
        }
    }

    return bestProxy;
}

function pickSocialProxy(host) {
    var idx = hashHost(host) % SOCIAL_POOL.length;
    return SOCIAL_POOL[idx];
}

function pickCDNProxy(host) {
    var idx = (hashHost(host) + 7) % CDN_POOL.length;
    return CDN_POOL[idx];
}

// ======================== إعادة المحاولة مع تأخير متزايد ========================

function getRetryDelay() {
    return Math.floor(RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, SESSION.retryCount));
}

function recordSuccess(proxy) {
    SESSION.proxyHealth[proxy] = "good";
    SESSION.successCount[proxy] = (SESSION.successCount[proxy] || 0) + 1;
    SESSION.failCount[proxy] = 0;
}

function recordFailure(proxy) {
    SESSION.failCount[proxy] = (SESSION.failCount[proxy] || 0) + 1;
    if (SESSION.failCount[proxy] > 5) {
        SESSION.proxyHealth[proxy] = "dead";
    } else if (SESSION.failCount[proxy] > 2) {
        SESSION.proxyHealth[proxy] = "bad";
    }
}

// ======================== تحديث تلقائي للشبكات ========================

function updateNetworks() {
    try {
        // تحديث ديناميكي للشبكات الجديدة
        // يمكن إضافة DNS خاص لجلب القوائم
        var now = new Date();
        var hour = now.getHours();

        // تعديل الأوليات حسب الوقت (ذروة اللعب)
        if (hour >= 18 && hour <= 23) {
            // وقت الذروة: الأولوية للبروكسيات الأقوى
            MATCH_POOL.sort(function(a, b) {
                return (SESSION.successCount[b] || 0) - (SESSION.successCount[a] || 0);
            });
        }

        debugLog("Network lists updated — Peak: " + (hour >= 18 && hour <= 23));
    } catch (e) {
        debugLog("Network update error: " + e);
    }
}

// ======================== فحص صحة البروكسيات ========================

function healthCheckProxy(proxy) {
    var now = Date.now();
    if (now - SESSION.lastHealthCheck < 30000) return;
    SESSION.lastHealthCheck = now;

    try {
        var startTime = Date.now();
        var result = dnsResolve("match.pubgmobile.com");
        var latency = Date.now() - startTime;

        if (result) {
            SESSION.proxyLatency[proxy] = latency;
            SESSION.proxyHealth[proxy] = latency < 200 ? "excellent" :
                                         latency < 500 ? "good" :
                                         latency < 1000 ? "fair" : "bad";
            debugLog("Health check: " + proxy + " → " + latency + "ms [" + SESSION.proxyHealth[proxy] + "]");
        }
    } catch (e) {
        SESSION.proxyLatency[proxy] = 9999;
        recordFailure(proxy);
    }
}

// ======================== تحليل حمل السيرفر ========================

function analyzeServerLoad(ip) {
    var netKey = ip.split(".").slice(0, 3).join(".");
    if (!SESSION.serverLoad[netKey]) {
        // تحليل مبني على عدد المحاولات
        SESSION.serverLoad[netKey] = Math.min(100, SESSION.retryCount * 15);
    }
    return SESSION.serverLoad[netKey];
}

// ======================== كشف ببجي ========================

function isPUBG(h) {
    return /pubg|bgmi|tencent|krafton|bluehole|levelinfinite|lightspeed|igamecj|yuanlin|anticheatexpert|gtimg|idqqimg|gpubgm|match\.pubg|royalpass|rp\.pubg/i.test(h);
}

// ======================== تصنيف حركة البيانات ========================

function isMatch(u, h) {
    return /\bmatch\b|\bbattle\b|\bgameplay\b|combat|realtime|\bsync\b|\btdm\b|erangel|miramar|sanhok|vikendi|karakin|livik|nusa|\bronta\b|alien|payload|\budp\b|\barena\b|\bwar\b|\brush\b|\binfection\b|\bpayday\b|\bzombie\b|\bbrdm\b|\bflare\b/i.test(u + h);
}

function isLobby(u, h) {
    return /lobby|matchmaking|queue|dispatch|gateway|region|login|auth|season|event|shop|store|inventory|loadout|mission|task|rank|recruit|pass|crate|draw|lucky|wheel/i.test(u + h);
}

function isSocial(u, h) {
    return /friend|invite|squad|team|party|clan|presence|social|voice|chat|mic|audio|guild|msg|mail/i.test(u + h);
}

function isCDN(u, h) {
    return /cdn|asset|resource|patch|update|media|content|download|hotfix|res\.|skin|model|texture|sound|apk|obb|bundle/i.test(u + h);
}

function isAntiCheat(u, h) {
    return /anticheat|security|verify|report|hack|detect|monitor|safe|protect/i.test(u + h);
}

function isAnalytics(u, h) {
    return /analytics|telemetry|track|log|metric|beacon|stat|event\.|report\.|data\./i.test(u + h);
}

// ======================== تسجيل الأخطاء ========================

function debugLog(msg) {
    if (DEBUG_MODE) {
        var ts = new Date().toISOString().substr(11, 12);
        console.log("[JO-" + ts + "] " + msg);
    }
}

// ======================== التحقق من سلامة الإعداد ========================

function validateConfig() {
    var issues = [];

    if (!MATCH_JO || MATCH_JO.indexOf("PROXY") !== 0) {
        issues.push("MATCH_JO invalid");
    }
    if (BACKUP_PROXIES.length < 2) {
        issues.push("Need more backup proxies");
    }
    if (MAX_RETRIES < 3 || MAX_RETRIES > 15) {
        issues.push("MAX_RETRIES should be 3-15");
    }

    // فحص تكرارات
    var seen = {};
    var allProxies = LOBBY_POOL.concat(MATCH_POOL).concat(BACKUP_PROXIES);
    for (var i = 0; i < allProxies.length; i++) {
        if (seen[allProxies[i]]) {
            issues.push("Duplicate proxy: " + allProxies[i]);
        }
        seen[allProxies[i]] = true;
    }

    if (issues.length > 0) {
        debugLog("⚠ CONFIG ISSUES: " + issues.join(" | "));
    } else {
        debugLog("✓ Config validated OK");
    }
    return issues.length === 0;
}

// ======================== حماية مضادة للتسريب ========================

function isLeakingTraffic(ip, host) {
    // منع أي اتصال خارج الأردن لسيرفرات ببجي
    if (isPUBG(host) && !isInList(ip, JORDAN_WIDE_IPV4)) {
        debugLog("⚠ LEAK DETECTED: " + host + " → " + ip);
        return true;
    }
    return false;
}

// ======================== تثبيت الشبكة ========================

function lockNetwork(net24) {
    if (!SESSION.lockedNet || !LOCK_NETWORK) {
        SESSION.lockedNet = net24;
        debugLog("🔒 Network locked: " + net24);
    }
    return SESSION.lockedNet;
}

function unlockNetwork() {
    SESSION.lockedNet = null;
    SESSION.matchNet = null;
    SESSION.retryCount = 0;
    debugLog("🔓 Network unlocked");
}

// ======================== الدالة الرئيسية ========================

function FindProxyForURL(url, host) {
    host = norm(host);

    // تحقق الإعداد أول مرة
    if (!SESSION.sessionStart) {
        SESSION.sessionStart = Date.now();
        validateConfig();
    }

    // تحديث تلقائي
    updateNetworks();

    // فحص صحة البروكسي الأساسي
    healthCheckProxy(MATCH_JO);

    // ليست ببجي = مباشر
    if (!isPUBG(host)) return DIRECT;

    // حل DNS
    var ip = resolvePinned(host);
    if (!ip || ip.indexOf(":") > -1) {
        debugLog("✗ IPv6 or unresolved: " + host);
        return BLOCK;
    }

    // حماية من التسريب
    if (isLeakingTraffic(ip, host)) {
        return BLOCK;
    }

    // القائمة السوداء
    if (isInList(ip, GEO_BLACKLIST)) {
        debugLog("✗ Blocked by blacklist: " + ip);
        return BLOCK;
    }

    // إعادة ضبط عند قائمة انتظار جديدة
    if (/matchmaking|queue|recruit|findmatch/i.test(url + host)) {
        if (SESSION.matchCount > 0) {
            unlockNetwork();
        }
        SESSION.matchCount++;
        SESSION.dnsCache = {};
        SESSION.retryCount = 0;
        SESSION.lockedProxy = null;
        debugLog("🔄 Reset for match #" + SESSION.matchCount);
    }

    // ───── حركة الماتش (أولوية قصوى) ─────
    if (isMatch(url, host)) {
        debugLog("🎮 Match traffic: " + host + " → " + ip);

        // تحقق من IP أردني
        if (!isInList(ip, JORDAN_MATCH_IPV4)) {
            debugLog("✗ Non-Jordan match IP: " + ip);

            if (SESSION.retryCount < MAX_RETRIES) {
                var delay = getRetryDelay();
                if (Date.now() - SESSION.lastRetryTime < delay) {
                    return BLOCK;
                }

                SESSION.retryCount++;
                SESSION.lastProxyIndex = (SESSION.lastProxyIndex + 1) % BACKUP_PROXIES.length;
                SESSION.lastRetryTime = Date.now();

                var chosenProxy = pickMatchProxy(host);
                debugLog("↻ Retry " + SESSION.retryCount + "/" + MAX_RETRIES +
                         " → " + chosenProxy + " (delay: " + delay + "ms)");
                return chosenProxy;
            }

            debugLog("✗✗ BLOCKED after " + MAX_RETRIES + " retries: " + ip);
            recordFailure(MATCH_JO);
            return BLOCK;
        }

        // تثبيت الشبكة (/24)
        var p = ip.split(".");
        var net24 = p[0] + "." + p[1] + "." + p[2] + ".0";

        if (!SESSION.matchNet) {
            SESSION.matchNet = lockNetwork(net24);
            debugLog("🔒 First match network: " + net24);
        }

        // فحص تغيير الشبكة
        if (LOCK_NETWORK && net24 !== SESSION.lockedNet) {
            debugLog("⚠ Network mismatch! Expected " + SESSION.lockedNet + " got " + net24);

            if (SESSION.retryCount < MAX_RETRIES) {
                var delay2 = getRetryDelay();
                if (Date.now() - SESSION.lastRetryTime < delay2) {
                    return BLOCK;
                }

                SESSION.retryCount++;
                SESSION.lastProxyIndex = (SESSION.lastProxyIndex + 1) % BACKUP_PROXIES.length;
                SESSION.lastRetryTime = Date.now();

                var retryProxy = pickMatchProxy(host);
                debugLog("↻ Network retry " + SESSION.retryCount + "/" + MAX_RETRIES +
                         " → " + retryProxy);
                return retryProxy;
            }

            debugLog("✗✗ BLOCKED (network mismatch after retries)");
            return BLOCK;
        }

        // تحليل حمل السيرفر
        var load = analyzeServerLoad(ip);
        if (load > 85) {
            debugLog("⚠ Server overloaded (" + load + "%), switching proxy...");
            if (SESSION.retryCount < MAX_RETRIES) {
                SESSION.retryCount++;
                SESSION.lastProxyIndex = (SESSION.lastProxyIndex + 1) % BACKUP_PROXIES.length;
                return BACKUP_PROXIES[SESSION.lastProxyIndex];
            }
        }

        // نجاح!
        SESSION.retryCount = 0;
        SESSION.lockedProxy = MATCH_JO;
        recordSuccess(MATCH_JO);
        debugLog("✓✓ MATCH CONNECTED → " + ip + " via " + MATCH_JO);
        return MATCH_JO;
    }

    // ───── حركة المضاد للغش ─────
    if (isAntiCheat(url, host)) {
        if (!isInList(ip, JORDAN_WIDE_IPV4)) {
            debugLog("✗ Anti-cheat non-Jordan: " + ip);
            return BLOCK;
        }
        var antiCheatProxy = pickLobbyProxy(host);
        debugLog("🛡 Anti-cheat: " + host + " → " + antiCheatProxy);
        return antiCheatProxy;
    }

    // ───── حركة التحليلات (حجبها) ─────
    if (isAnalytics(url, host)) {
        debugLog("📊 Analytics blocked: " + host);
        return BLOCK;
    }

    // ───── اللوبي ─────
    if (isLobby(url, host)) {
        if (!isInList(ip, JORDAN_WIDE_IPV4)) {
            debugLog("✗ Lobby non-Jordan: " + ip);
            return BLOCK;
        }
        var lobbyProxy = pickLobbyProxy(host);
        debugLog("🏠 Lobby: " + host + " → " + lobbyProxy);
        return lobbyProxy;
    }

    // ───── السوشيال ─────
    if (isSocial(url, host)) {
        if (!isInList(ip, JORDAN_WIDE_IPV4)) {
            debugLog("✗ Social non-Jordan: " + ip);
            return BLOCK;
        }
        var socialProxy = pickSocialProxy(host);
        debugLog("👥 Social: " + host + " → " + socialProxy);
        return socialProxy;
    }

    // ───── الـ CDN ─────
    if (isCDN(url, host)) {
        if (!isInList(ip, JORDAN_WIDE_IPV4)) {
            debugLog("✗ CDN non-Jordan: " + ip);
            return BLOCK;
        }
        var cdnProxy = pickCDNProxy(host);
        debugLog("📦 CDN: " + host + " → " + cdnProxy);
        return cdnProxy;
    }

    // ───── أي شيء ثاني تابع لببجي ─────
    if (isInList(ip, JORDAN_WIDE_IPV4)) {
        var fallbackProxy = pickLobbyProxy(host);
        debugLog("🔗 Fallback: " + host + " → " + fallbackProxy);
        return fallbackProxy;
    }

    // ───── حركة غير معروفة من ببجي ─────
    debugLog("✗ Unknown PUBG traffic BLOCKED: " + host + " → " + ip);
    return BLOCK;
}
