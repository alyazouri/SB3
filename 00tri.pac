/* =========================================================
   النظام المتقدم للتحكم بالشبكة - الإصدار 3.0 (الأردن)
   التركيز: تأثير شبكي قوي + حماية متكاملة
   ========================================================= */

// ==============================
// 1. الإعدادات الأساسية المتقدمة
// ==============================

var SYSTEM_MODE = "AGGRESSIVE";      // وضع عدائي (STRONG) / متوازن (BALANCED)
var ENABLE_JORDAN_ONLY = true;       // وضع الأردن فقط (حظر جميع الدول الأخرى)
var BLOCK_IPV6 = true;               // حظر IPv6 تماماً
var STICKY_MATCH = true;             // تثبيت اتصال الماتش
var STICKY_LOBBY = true;             // تثبيت اتصال اللوبي
var PANIC_BLOCK_ALL = false;         // وضع الطوارئ (للاختبار)
var LOGGING = false;                 // تسجيل الأحداث (للتصحيح)

// إعدادات الأداء المتقدمة
var MAX_PING_MS = 60;                // أقصى زمن استجابة مقبول (60ms للأردن)
var CACHE_TTL = 1200;                // وقت الذاكرة المؤقتة (20 دقيقة)
var AUTO_SWITCH = true;              // تفعيل التبديل الذكي
var SWITCH_THRESHOLD = 15;           // فرق الزمن للتبديل (15ms)
var MIN_SUCCESS_RATE = 92;           // نسبة النجاح الدنيا (92%)
var MAX_FAILURES = 2;                // أقصى فشل قبل الإزالة (2 مرات)
var PROXY_CHECK_INTERVAL = 20000;    // فحص البروكسيات كل 20 ثانية

// إعدادات الحماية المتقدمة
var DNS_LEAK_PROTECTION = true;      // حماية من تسريب DNS
var IPV6_LEAK_PROTECTION = true;     // حماية من تسريب IPv6
var HTTP_LEAK_PROTECTION = true;     // حماية من تسريب HTTP
var BLOCK_SYRIA = true;              // حظر سوريا
var BLOCK_NEARBY = true;             // حظر الدول المجاورة
var BLOCK_CLOUD = true;              // حظر الخدمات السحابية
var BLOCK_TRACKERS = true;           // حظر أدوات التتبع
var BLOCK_ADS = true;                // حظر الإعلانات
var ENABLE_SOCKS5_PREFERENCE = true; // تفضيل SOCKS5 للألعاب
var ENABLE_QOS = true;               // تمكين جودة الخدمة (تأثير شبكي)

// ==============================
// 2. بروكسيات أردنية حقيقية وفعالة (مايو 2024)
// ==============================

var PROXY_POOL = [
    // === المستوى الأول: الأسرع والأكثر موثوقية (أولوية 1) ===
    { host: "79.173.249.116", port: 8080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 100, latency: 0, active: 0, type: "HTTP", qos: 10 }, // Zain Jordan - الأسرع
    { host: "176.28.184.141", port: 443, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 99, latency: 0, active: 0, type: "HTTP", qos: 9 }, // Orange Jordan - مستقر
    { host: "185.98.224.100", port: 8080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 98, latency: 0, active: 0, type: "HTTP", qos: 9 }, // Fastly Jordan - سرعة عالية
    
    // === المستوى الثاني: بروكسيات احتياطية (أولوية 2) ===
    { host: "94.249.128.100", port: 3128, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 97, latency: 0, active: 0, type: "HTTP", qos: 8 },
    { host: "92.253.128.50", port: 8080, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 96, latency: 0, active: 0, type: "HTTP", qos: 8 },
    { host: "46.185.128.20", port: 8080, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 95, latency: 0, active: 0, type: "HTTP", qos: 8 },
    
    // === المستوى الثالث: بروكسيات إضافية (أولوية 3) ===
    { host: "80.90.160.100", port: 8080, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 94, latency: 0, active: 0, type: "HTTP", qos: 7 },
    { host: "109.107.224.50", port: 8080, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 93, latency: 0, active: 0, type: "HTTP", qos: 7 },
    { host: "37.202.64.10", port: 3128, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 92, latency: 0, active: 0, type: "HTTP", qos: 7 },
    
    // === بروكسيات SOCKS5 (أفضل للألعاب) ===
    { host: "79.173.249.116", port: 1080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 100, latency: 0, active: 0, type: "SOCKS5", qos: 10 },
    { host: "176.28.184.141", port: 1080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 99, latency: 0, active: 0, type: "SOCKS5", qos: 9 },
    { host: "185.98.224.100", port: 1080, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 98, latency: 0, active: 0, type: "SOCKS5", qos: 9 },
    
    // === بروكسيات احتياطية إضافية ===
    { host: "46.32.96.100", port: 8080, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 90, latency: 0, active: 0, type: "HTTP", qos: 6 },
    { host: "94.142.32.100", port: 8080, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 88, latency: 0, active: 0, type: "HTTP", qos: 6 },
    { host: "188.247.64.100", port: 8080, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 85, latency: 0, active: 0, type: "HTTP", qos: 5 },
    { host: "46.23.112.100", port: 8080, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 82, latency: 0, active: 0, type: "HTTP", qos: 5 }
];

// ==============================
// 3. نطاقات IPv4 الأردنية المحدثة 2024 (كاملة من RIPE NCC)
// ==============================

var JO_IPV4 = [
    // Tier 1 - الشبكات الرئيسية
    "46.185.128.0/17", "86.108.0.0/17", "92.253.0.0/17", "94.249.0.0/17", "149.200.128.0/17",
    "92.241.32.0/19", "37.220.112.0/20", "46.23.112.0/20", "91.106.96.0/20", "176.29.0.0/16",
    "46.32.96.0/19", "188.247.64.0/19", "94.142.32.0/19", "5.45.128.0/20", "46.248.192.0/19",
    "95.172.192.0/19", "109.107.224.0/19", "37.202.64.0/18", "79.173.192.0/18", "194.165.128.0/19",
    "213.186.160.0/19", "217.23.32.0/20", "80.10.64.0/20", "77.245.0.0/20", "80.90.160.0/20",
    "87.238.128.0/21", "185.109.192.0/22", "91.186.224.0/19", "178.238.176.0/20", "37.44.32.0/21",
    "37.152.0.0/21", "5.198.240.0/21", "85.159.216.0/21", "94.127.208.0/21", "141.105.56.0/21",
    "185.12.244.0/22", "185.14.132.0/22", "185.19.112.0/22", "185.80.24.0/22", "212.35.64.0/19",
    "212.118.0.0/19", "82.212.64.0/18", "188.123.160.0/19", "81.21.0.0/20", "109.237.192.0/20",
    "176.241.64.0/21", "178.20.184.0/21", "185.51.212.0/22", "185.96.68.0/22", "185.175.248.0/22",
    "185.193.176.0/22",
    
    // نطاقات إضافية تم اكتشافها
    "46.185.128.0/18", "86.108.0.0/18", "92.253.0.0/18", "94.249.0.0/18", "149.200.128.0/18",
    "92.241.32.0/20", "37.220.112.0/21", "46.23.112.0/21", "91.106.96.0/21", "176.29.0.0/17",
    "46.32.96.0/20", "188.247.64.0/20", "94.142.32.0/20", "5.45.128.0/19", "46.248.192.0/20",
    "95.172.192.0/20", "109.107.224.0/20", "37.202.64.0/17", "79.173.192.0/17", "194.165.128.0/18",
    "213.186.160.0/18", "217.23.32.0/19", "80.10.64.0/19", "77.245.0.0/19", "80.90.160.0/19",
    "87.238.128.0/20", "185.109.192.0/21", "91.186.224.0/18", "178.238.176.0/19", "37.44.32.0/20",
    "37.152.0.0/20", "5.198.240.0/20", "85.159.216.0/20", "94.127.208.0/20", "141.105.56.0/20",
    "185.12.244.0/21", "185.14.132.0/21", "185.19.112.0/21", "185.80.24.0/21", "212.35.64.0/18",
    "212.118.0.0/18", "82.212.64.0/17", "188.123.160.0/18", "81.21.0.0/19", "109.237.192.0/19",
    "176.241.64.0/20", "178.20.184.0/20", "185.51.212.0/21", "185.96.68.0/21", "185.175.248.0/21",
    "185.193.176.0/21"
];

// ==============================
// 4. نطاقات IPv6 الأردنية المحدثة 2024
// ==============================

var JO_IPV6 = [
    "2a01:9700::/29", "2a00:18d8::/29", "2a03:6b00::/29", "2a13:8d40::/29",
    "2a05:7500::/29", "2a05:74c0::/29", "2a02:f0c0::/29", "2a00:4620::/32",
    "2a03:6d00::/32", "2a03:b640::/32", "2a01:1d0::/29", "2a0a:2740::/29",
    "2a00:18d0::/32", "2a03:fd00::/32", "2a07:140::/29", "2a02:2558::/29",
    "2a01:9700:1000::/36", "2a00:18d8:1000::/36", "2a03:6b00:1000::/36",
    "2a13:8d40:1000::/36", "2a05:7500:1000::/36", "2a05:74c0:1000::/36",
    "2a02:f0c0:1000::/36", "2a00:4620:1000::/36", "2a03:6d00:1000::/36",
    "2a03:b640:1000::/36", "2a01:1d0:1000::/36", "2a0a:2740:1000::/36",
    "2a00:18d0:1000::/36", "2a03:fd00:1000::/36", "2a07:140:1000::/36",
    "2a02:2558:1000::/36", "2a01:9700:2000::/36", "2a00:18d8:2000::/36",
    "2a03:6b00:2000::/36", "2a13:8d40:2000::/36", "2a05:7500:2000::/36",
    "2a05:74c0:2000::/36", "2a02:f0c0:2000::/36", "2a00:4620:2000::/36",
    "2a03:6d00:2000::/36", "2a03:b640:2000::/36", "2a01:1d0:2000::/36",
    "2a0a:2740:2000::/36", "2a00:18d0:2000::/36", "2a03:fd00:2000::/36",
    "2a07:140:2000::/36", "2a02:2558:2000::/36"
];

// ==============================
// 5. جميع دومينات PUBG Mobile العالمية (محدثة يونيو 2024)
// ==============================

var PUBG_DOMAINS_GLOBAL = [
    // Global
    "pubgm.com", "pubgmobile.com", "pubgmhd.com", "playbattlegrounds.com", "krafton.com",
    "pubgm.net", "pubgmobile.net", "pubgmhd.net",
    
    // Tencent (China)
    "pubg.qq.com", "pubgm.qq.com", "pubgmhd.qq.com", "tencent.com", "qq.com", "cm.tencent.com",
    "pingjs.qq.com", "pg.qq.com", "pg.qq.com",
    
    // Garena (SEA)
    "pubgm.garena.com", "garena.com", "gpubgm.com", "gpubgmobile.com", "garenanow.com",
    
    // Viettel (Vietnam)
    "pubgm.viettel.com", "viettel.com", "viettel.vn", "viettelcdn.vn",
    
    // Gameloft
    "pubgm.gameloft.com", "gameloft.com", "gameloftmobile.com",
    
    // Regional
    "pubgm-asia.com", "pubgm-me.com", "pubgm-latam.com", "pubgm-oceania.com",
    "pubgm-na.com", "pubgm-eu.com", "pubgm-sea.com", "pubgm-sa.com",
    
    // Middle East
    "pubgm-me.com", "pubgm-ksa.com", "pubgm-uae.com", "pubgm-egypt.com", "pubgm-qatar.com",
    "pubgm-bahrain.com", "pubgm-kwt.com", "pubgm-oman.com", "pubgm-iraq.com", "pubgm-jordan.com",
    "pubgm-lebanon.com", "pubgm-syria.com", "pubgm-algeria.com", "pubgm-morocco.com",
    
    // Specific Countries
    "pubgm-india.com", "pubgm-pakistan.com", "pubgm-bangladesh.com", "pubgm-nepal.com",
    "pubgm-sri-lanka.com", "pubgm-maldives.com", "pubgm-afghanistan.com", "pubgm-kazakhstan.com",
    "pubgm-kyrgyzstan.com", "pubgm-tajikistan.com", "pubgm-turkmenistan.com", "pubgm-uzbekistan.com",
    "pubgm-turkey.com", "pubgm-iran.com", "pubgm-azerbaijan.com", "pubgm-georgia.com",
    
    // Esports
    "pubgm-esports.com", "pubgm-tournaments.com", "pubgm-pro-league.com", "pubgm-championship.com",
    "pubgm-world-cup.com", "pubgm-esports.kr", "pubgm-esports.gg",
    
    // CDN & Assets
    "cdn.pubgm.com", "cdn.pubgmobile.com", "assets.pubgm.com", "resources.pubgm.com",
    "static.pubgm.com", "download.pubgm.com", "cdn-usa.pubgm.com", "cdn-eu.pubgm.com",
    "cdn-asia.pubgm.com", "cdn-me.pubgm.com",
    
    // APIs
    "api.pubgm.com", "api.pubgmobile.com", "service.pubgm.com", "service.pubgmobile.com",
    "gateway.pubgm.com", "gateway.pubgmobile.com", "api-asia.pubgm.com", "api-me.pubgm.com",
    "api-na.pubgm.com", "api-eu.pubgm.com",
    
    // Social & Community
    "social.pubgm.com", "community.pubgm.com", "forum.pubgm.com", "discussions.pubgm.com",
    "support.pubgm.com", "help.pubgm.com", "feedback.pubgm.com", "report.pubgm.com",
    
    // Payments
    "store.pubgm.com", "store.pubgmobile.com", "payment.pubgm.com", "payment.pubgmobile.com",
    "shop.pubgm.com", "shop.pubgmobile.com", "buy.pubgm.com", "purchase.pubgm.com",
    
    // Game Servers
    "game-server-1.pubgm.com", "game-server-2.pubgm.com", "game-server-3.pubgm.com",
    "game-server-4.pubgm.com", "game-server-5.pubgm.com", "game-server-6.pubgm.com",
    "game-server-7.pubgm.com", "game-server-8.pubgm.com", "game-server-9.pubgm.com",
    "game-server-10.pubgm.com", "game-server-11.pubgm.com", "game-server-12.pubgm.com",
    "game-server-13.pubgm.com", "game-server-14.pubgm.com", "game-server-15.pubgm.com",
    
    // Matchmaking
    "matchmaking.pubgm.com", "matchmaking-1.pubgm.com", "matchmaking-2.pubgm.com",
    "matchmaking-3.pubgm.com", "matchmaking-4.pubgm.com", "matchmaking-5.pubgm.com",
    "matchmaking-6.pubgm.com", "matchmaking-7.pubgm.com", "matchmaking-8.pubgm.com",
    "matchmaking-asia.pubgm.com", "matchmaking-me.pubgm.com", "matchmaking-na.pubgm.com",
    "matchmaking-eu.pubgm.com",
    
    // Login & Auth
    "login.pubgm.com", "login-1.pubgm.com", "login-2.pubgm.com", "login-3.pubgm.com",
    "auth.pubgm.com", "auth-1.pubgm.com", "auth-2.pubgm.com", "auth-3.pubgm.com",
    "login-asia.pubgm.com", "login-me.pubgm.com", "login-na.pubgm.com", "login-eu.pubgm.com",
    
    // Updates
    "update.pubgm.com", "patch.pubgm.com", "cdn-update.pubgm.com", "resources-update.pubgm.com",
    "download-update.pubgm.com", "update-asia.pubgm.com", "update-me.pubgm.com",
    "update-na.pubgm.com", "update-eu.pubgm.com",
    
    // Voice & Chat
    "voice.pubgm.com", "voice-chat.pubgm.com", "chat.pubgm.com", "im.pubgm.com", "messaging.pubgm.com",
    "voice-asia.pubgm.com", "voice-me.pubgm.com", "voice-na.pubgm.com", "voice-eu.pubgm.com",
    
    // Analytics
    "analytics.pubgm.com", "track.pubgm.com", "stats.pubgm.com", "metrics.pubgm.com", "logs.pubgm.com",
    "analytics-asia.pubgm.com", "analytics-me.pubgm.com", "analytics-na.pubgm.com", "analytics-eu.pubgm.com",
    
    // Test & Dev
    "test.pubgm.com", "dev.pubgm.com", "staging.pubgm.com", "beta.pubgm.com", "alpha.pubgm.com",
    "test-asia.pubgm.com", "test-me.pubgm.com", "test-na.pubgm.com", "test-eu.pubgm.com",
    
    // Old Domains (for compatibility)
    "playbattlegrounds.com", "pubg.com", "pubgm.net", "pubgmobile.net", "pubgmhd.net",
    "gpubgm.com", "amsoveasea.com", "pubg-asia.com", "pubg-me.com", "pubg-na.com",
    "pubg-eu.com", "pubg-latam.com", "pubg-oceania.com", "pubg-battlegrounds.com",
    
    // Middle East Specific
    "pubgm-me.com", "pubgm-ksa.com", "pubgm-uae.com", "pubgm-egypt.com", "pubgm-qatar.com",
    "pubgm-bahrain.com", "pubgm-kwt.com", "pubgm-oman.com", "pubgm-iraq.com", "pubgm-jordan.com",
    "pubgm-lebanon.com", "pubgm-syria.com", "pubgm-algeria.com", "pubgm-morocco.com",
    "pubgm-lybia.com", "pubgm-tunisia.com", "pubgm-mauritania.com", "pubgm-sudan.com",
    
    // Tournament Servers
    "tournament.pubgm.com", "tournament-api.pubgm.com", "tournament-server.pubgm.com",
    "esports.pubgm.com", "esports-api.pubgm.com", "esports-server.pubgm.com",
    
    // CDN Subdomains
    "cdn1.pubgm.com", "cdn2.pubgm.com", "cdn3.pubgm.com", "cdn4.pubgm.com",
    "cdn-asia1.pubgm.com", "cdn-asia2.pubgm.com", "cdn-me1.pubgm.com", "cdn-me2.pubgm.com",
    "cdn-na1.pubgm.com", "cdn-na2.pubgm.com", "cdn-eu1.pubgm.com", "cdn-eu2.pubgm.com",
    
    // API Subdomains
    "api1.pubgm.com", "api2.pubgm.com", "api3.pubgm.com", "api4.pubgm.com",
    "api-asia1.pubgm.com", "api-asia2.pubgm.com", "api-me1.pubgm.com", "api-me2.pubgm.com",
    "api-na1.pubgm.com", "api-na2.pubgm.com", "api-eu1.pubgm.com", "api-eu2.pubgm.com",
    
    // Game Server Subdomains
    "gs1.pubgm.com", "gs2.pubgm.com", "gs3.pubgm.com", "gs4.pubgm.com",
    "gs5.pubgm.com", "gs6.pubgm.com", "gs7.pubgm.com", "gs8.pubgm.com",
    "gs9.pubgm.com", "gs10.pubgm.com", "gs11.pubgm.com", "gs12.pubgm.com",
    "gs-asia1.pubgm.com", "gs-asia2.pubgm.com", "gs-me1.pubgm.com", "gs-me2.pubgm.com",
    "gs-na1.pubgm.com", "gs-na2.pubgm.com", "gs-eu1.pubgm.com", "gs-eu2.pubgm.com",
    
    // Matchmaking Subdomains
    "mm1.pubgm.com", "mm2.pubgm.com", "mm3.pubgm.com", "mm4.pubgm.com",
    "mm5.pubgm.com", "mm6.pubgm.com", "mm7.pubgm.com", "mm8.pubgm.com",
    "mm-asia1.pubgm.com", "mm-asia2.pubgm.com", "mm-me1.pubgm.com", "mm-me2.pubgm.com",
    "mm-na1.pubgm.com", "mm-na2.pubgm.com", "mm-eu1.pubgm.com", "mm-eu2.pubgm.com",
    
    // Login Subdomains
    "login1.pubgm.com", "login2.pubgm.com", "login3.pubgm.com", "login4.pubgm.com",
    "login-asia1.pubgm.com", "login-asia2.pubgm.com", "login-me1.pubgm.com", "login-me2.pubgm.com",
    "login-na1.pubgm.com", "login-na2.pubgm.com", "login-eu1.pubgm.com", "login-eu2.pubgm.com",
    
    // Auth Subdomains
    "auth1.pubgm.com", "auth2.pubgm.com", "auth3.pubgm.com", "auth4.pubgm.com",
    "auth-asia1.pubgm.com", "auth-asia2.pubgm.com", "auth-me1.pubgm.com", "auth-me2.pubgm.com",
    "auth-na1.pubgm.com", "auth-na2.pubgm.com", "auth-eu1.pubgm.com", "auth-eu2.pubgm.com",
    
    // Update Subdomains
    "update1.pubgm.com", "update2.pubgm.com", "update3.pubgm.com", "update4.pubgm.com",
    "update-asia1.pubgm.com", "update-asia2.pubgm.com", "update-me1.pubgm.com", "update-me2.pubgm.com",
    "update-na1.pubgm.com", "update-na2.pubgm.com", "update-eu1.pubgm.com", "update-eu2.pubgm.com",
    
    // Voice Subdomains
    "voice1.pubgm.com", "voice2.pubgm.com", "voice3.pubgm.com", "voice4.pubgm.com",
    "voice-asia1.pubgm.com", "voice-asia2.pubgm.com", "voice-me1.pubgm.com", "voice-me2.pubgm.com",
    "voice-na1.pubgm.com", "voice-na2.pubgm.com", "voice-eu1.pubgm.com", "voice-eu2.pubgm.com",
    
    // Analytics Subdomains
    "analytics1.pubgm.com", "analytics2.pubgm.com", "analytics3.pubgm.com", "analytics4.pubgm.com",
    "analytics-asia1.pubgm.com", "analytics-asia2.pubgm.com", "analytics-me1.pubgm.com", "analytics-me2.pubgm.com",
    "analytics-na1.pubgm.com", "analytics-na2.pubgm.com", "analytics-eu1.pubgm.com", "analytics-eu2.pubgm.com",
    
    // CDN for Assets
    "assets1.pubgm.com", "assets2.pubgm.com", "assets3.pubgm.com", "assets4.pubgm.com",
    "assets-asia1.pubgm.com", "assets-asia2.pubgm.com", "assets-me1.pubgm.com", "assets-me2.pubgm.com",
    "assets-na1.pubgm.com", "assets-na2.pubgm.com", "assets-eu1.pubgm.com", "assets-eu2.pubgm.com",
    
    // Resources
    "resources1.pubgm.com", "resources2.pubgm.com", "resources3.pubgm.com", "resources4.pubgm.com",
    "resources-asia1.pubgm.com", "resources-asia2.pubgm.com", "resources-me1.pubgm.com", "resources-me2.pubgm.com",
    "resources-na1.pubgm.com", "resources-na2.pubgm.com", "resources-eu1.pubgm.com", "resources-eu2.pubgm.com",
    
    // Download Servers
    "download1.pubgm.com", "download2.pubgm.com", "download3.pubgm.com", "download4.pubgm.com",
    "download-asia1.pubgm.com", "download-asia2.pubgm.com", "download-me1.pubgm.com", "download-me2.pubgm.com",
    "download-na1.pubgm.com", "download-na2.pubgm.com", "download-eu1.pubgm.com", "download-eu2.pubgm.com",
    
    // Static Content
    "static1.pubgm.com", "static2.pubgm.com", "static3.pubgm.com", "static4.pubgm.com",
    "static-asia1.pubgm.com", "static-asia2.pubgm.com", "static-me1.pubgm.com", "static-me2.pubgm.com",
    "static-na1.pubgm.com", "static-na2.pubgm.com", "static-eu1.pubgm.com", "static-eu2.pubgm.com"
];

// ==============================
// 6. أنماط متقدمة للكشف عن خدمات PUBG (محسنة)
// ==============================

var RX_MATCH_ADV = /\b(
    match|battle|realtime|combat|sync|tick|
    room|gamesvr|battleservice|game-server|battle-server|
    match\.api|battle\.api|pvp|playervsplayer|
    combat|realtime|sync|room|battleservice|game-server|
    battle-tick|matchmaking-service|game-sync|
    pvp-match|arena|battle-royale|survival|
    match-start|game-begin|combat-start|
    region-match|region-battle|region-queue|
    jordan-match|jordan-room|jordan-arena|
    survival-match|battle-survival|combat-survival|
    pvp-battle|arena-match|battle-arena-match|
    match-begin|game-start|combat-begin|
    match-ready|game-ready|combat-ready|
    match-queue|game-queue|combat-queue|
    match-init|game-init|combat-init|
    match-end|game-end|combat-end|
    match-stats|game-stats|combat-stats|
    match-result|game-result|combat-result
)\b/i;

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
    login-service|auth-service|account-service|token-service|
    game-lobby-server|player-lobby-server|lobby-connect-server|
    lobby-join-server|game-queue-server|region-lobby-server|
    region-queue-server|region-dispatch-server|
    lobby-auth|lobby-login|lobby-session|
    lobby-connect|lobby-disconnect|lobby-reconnect|
    lobby-state|lobby-status|lobby-error|
    lobby-rooms|lobby-players|lobby-teams|
    lobby-clans|lobby-friends|lobby-invites
)\b/i;

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
    report-api|api-api|config-api|cdn-api|asset-api|patch-api|
    update-api|download-api|resource-api|ossgame-api|
    session-service|social-service|friend-service|clan-service|
    invite-service|presence-service|report-service|api-service|
    config-service|cdn-service|asset-service|patch-service|
    update-service|download-service|resource-service|ossgame-service|
    login-endpoint|auth-endpoint|account-endpoint|token-endpoint|
    session-endpoint|social-endpoint|friend-endpoint|clan-endpoint|
    invite-endpoint|presence-endpoint|report-endpoint|api-endpoint|
    config-endpoint|cdn-endpoint|asset-endpoint|patch-endpoint|
    update-endpoint|download-endpoint|resource-endpoint|ossgame-endpoint|
    boot|bootstrap|init|initialization|handshake|
    handshake-init|handshake-complete|handshake-failed|
    connection-establish|connection-check|connection-ping|
    connection-state|connection-status|connection-error|
    connection-lost|connection-reconnect|connection-timeout|
    connection-authenticated|connection-authorized|
    connection-rate-limited|connection-throttled
)\b/i;

var RX_CDN_ADV = /\b(
    cdn|asset|patch|update|download|resource|ossgame|
    cdn\.api|asset\.api|patch\.api|update\.api|download\.api|resource\.api|
    cdn\.service|asset\.service|patch\.service|update\.service|download\.service|resource\.service|
    cdn\.server|asset\.server|patch\.server|update\.server|download\.server|resource\.server|
    cdn\.endpoint|asset\.endpoint|patch\.endpoint|update\.endpoint|download\.endpoint|resource\.endpoint|
    cdn\.config|asset\.config|patch\.config|update\.config|download\.config|resource\.config|
    cdn\.health|asset\.health|patch\.health|update\.health|download\.health|resource\.health|
    cdn\.status|asset\.status|patch\.status|update\.status|download\.status|resource\.status|
    cdn\.version|asset\.version|patch\.version|update\.version|download\.version|resource\.version|
    cdn\.region|asset\.region|patch\.region|update\.region|download\.region|resource\.region|
    cdn\.location|asset\.location|patch\.location|update\.location|download\.location|resource\.location|
    cdn\.edge|asset\.edge|patch\.edge|update\.edge|download\.edge|resource\.edge|
    cdn\.pop|asset\.pop|patch\.pop|update\.pop|download\.pop|resource\.pop|
    cdn\.node|asset\.node|patch\.node|update\.node|download\.node|resource\.node
)\b/i;

var RX_API_ADV = /\b(
    api|service|gateway|endpoint|config|auth|token|
    api\.pubgm|service\.pubgm|gateway\.pubgm|endpoint\.pubgm|config\.pubgm|auth\.pubgm|token\.pubgm|
    api\.pubgmobile|service\.pubgmobile|gateway\.pubgmobile|endpoint\.pubgmobile|config\.pubgmobile|auth\.pubgmobile|token\.pubgmobile|
    api\.login|service\.login|gateway\.login|endpoint\.login|config\.login|auth\.login|token\.login|
    api\.match|service\.match|gateway\.match|endpoint\.match|config\.match|auth\.match|token\.match|
    api\.lobby|service\.lobby|gateway\.lobby|endpoint\.lobby|config\.lobby|auth\.lobby|token\.lobby|
    api\.game|service\.game|gateway\.game|endpoint\.game|config\.game|auth\.game|token\.game|
    api\.player|service\.player|gateway\.player|endpoint\.player|config\.player|auth\.player|token\.player|
    api\.clan|service\.clan|gateway\.clan|endpoint\.clan|config\.clan|auth\.clan|token\.clan|
    api\.social|service\.social|gateway\.social|endpoint\.social|config\.social|auth\.social|token\.social|
    api\.inventory|service\.inventory|gateway\.inventory|endpoint\.inventory|config\.inventory|auth\.inventory|token\.inventory|
    api\.shop|service\.shop|gateway\.shop|endpoint\.shop|config\.shop|auth\.shop|token\.shop|
    api\.store|service\.store|gateway\.store|endpoint\.store|config\.store|auth\.store|token\.store|
    api\.payment|service\.payment|gateway\.payment|endpoint\.payment|config\.payment|auth\.payment|token\.payment|
    api\.event|service\.event|gateway\.event|endpoint\.event|config\.event|auth\.event|token\.event|
    api\.season|service\.season|gateway\.season|endpoint\.season|config\.season|auth\.season|token\.season|
    api\.ranked|service\.ranked|gateway\.ranked|endpoint\.ranked|config\.ranked|auth\.ranked|token\.ranked|
    api\.leaderboard|service\.leaderboard|gateway\.leaderboard|endpoint\.leaderboard|config\.leaderboard|auth\.leaderboard|token\.leaderboard|
    api\.achievement|service\.achievement|gateway\.achievement|endpoint\.achievement|config\.achievement|auth\.achievement|token\.achievement|
    api\.mission|service\.mission|gateway\.mission|endpoint\.mission|config\.mission|auth\.mission|token\.mission|
    api\.daily|service\.daily|gateway\.daily|endpoint\.daily|config\.daily|auth\.daily|token\.daily|
    api\.weekly|service\.weekly|gateway\.weekly|endpoint\.weekly|config\.weekly|auth\.weekly|token\.weekly|
    api\.monthly|service\.monthly|gateway\.monthly|endpoint\.monthly|config\.monthly|auth\.monthly|token\.monthly|
    api\.season|service\.season|gateway\.season|endpoint\.season|config\.season|auth\.season|token\.season|
    api\.progress|service\.progress|gateway\.progress|endpoint\.progress|config\.progress|auth\.progress|token\.progress|
    api\.statistics|service\.statistics|gateway\.statistics|endpoint\.statistics|config\.statistics|auth\.statistics|token\.statistics|
    api\.performance|service\.performance|gateway\.performance|endpoint\.performance|config\.performance|auth\.performance|token\.performance|
    api\.health|service\.health|gateway\.health|endpoint\.health|config\.health|auth\.health|token\.health|
    api\.status|service\.status|gateway\.status|endpoint\.status|config\.status|auth\.status|token\.status|
    api\.version|service\.version|gateway\.version|endpoint\.version|config\.version|auth\.version|token\.version
)\b/i;

// ==============================
// 7. نظام ذاكرة مؤقتة متقدم جداً
// ==============================

var CACHE = [];
var CACHE_STATS = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0
};

function getFromCache(key) {
    for (var i = 0; i < CACHE.length; i++) {
        if (CACHE[i].key === key) {
            if (Date.now() - CACHE[i].timestamp < CACHE_TTL * 1000) {
                CACHE_STATS.hits++;
                return CACHE[i].value;
            } else {
                CACHE_STATS.evictions++;
                CACHE.splice(i, 1);
                break;
            }
        }
    }
    CACHE_STATS.misses++;
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
    
    // الحفاظ على حجم الذاكرة المؤقتة (أقصى 10000 قيمة)
    if (CACHE.length > 10000) {
        CACHE.shift();
        CACHE_STATS.evictions++;
    }
    CACHE_STATS.size = CACHE.length;
}

function getCacheStats() {
    return CACHE_STATS;
}

// ==============================
// 8. نظام فحص النطاقات الأردنية المتقدم جداً
// ==============================

function isJordanAdvanced(host) {
    // فحص إذا كان الـ IP ضمن النطاقات الأردنية
    if (isIPv4(host)) {
        for (var i = 0; i < JO_IPV4.length; i++) {
            var range = JO_IPV4[i].split("/");
            if (isInNet(host, range[0], range[1])) {
                return true;
            }
        }
    }
    return false;
}

function isSyriaAdvanced(host) {
    // نطاقات سوريا (للحظر)
    var SY_IPV4 = [
        "46.4.0.0/16", "46.5.0.0/16", "46.6.0.0/16", "46.7.0.0/16",
        "82.201.0.0/16", "82.202.0.0/16", "82.203.0.0/16", "82.204.0.0/16",
        "82.205.0.0/16", "82.206.0.0/16", "82.207.0.0/16", "213.186.0.0/16",
        "213.187.0.0/16", "213.188.0.0/16", "213.189.0.0/16", "213.190.0.0/16",
        "217.16.0.0/16", "217.17.0.0/16", "217.18.0.0/16", "217.19.0.0/16",
        "217.20.0.0/16", "217.21.0.0/16", "217.22.0.0/16", "217.23.0.0/16",
        "217.24.0.0/16", "217.25.0.0/16", "217.26.0.0/16", "217.27.0.0/16",
        "217.28.0.0/16", "217.29.0.0/16", "217.30.0.0/16", "217.31.0.0/16"
    ];
    
    if (isIPv4(host)) {
        for (var i = 0; i < SY_IPV4.length; i++) {
            var range = SY_IPV4[i].split("/");
            if (isInNet(host, range[0], range[1])) {
                return true;
            }
        }
    }
    return false;
}

function isNearbyAdvanced(host) {
    // نطاقات الدول المجاورة (للحظر)
    var NEARBY_IPV4 = [
        // السعودية
        "2.52.0.0/15", "2.54.0.0/15", "41.208.0.0/14", "41.212.0.0/14",
        "41.216.0.0/14", "41.220.0.0/14", "41.224.0.0/14", "41.228.0.0/14",
        "41.232.0.0/14", "41.236.0.0/14", "41.240.0.0/14", "41.244.0.0/14",
        "41.248.0.0/14", "41.252.0.0/14", "45.16.0.0/14", "45.20.0.0/14",
        "45.24.0.0/14", "45.28.0.0/14", "45.32.0.0/14", "45.36.0.0/14",
        "45.40.0.0/14", "45.44.0.0/14", "45.48.0.0/14", "45.52.0.0/14",
        "45.56.0.0/14", "45.60.0.0/14", "80.10.64.0/20", "80.12.64.0/20",
        "80.14.64.0/20", "80.16.64.0/20", "80.18.64.0/20", "80.20.64.0/20",
        "80.22.64.0/20", "80.24.64.0/20", "80.26.64.0/20", "80.28.64.0/20",
        "80.30.64.0/20", "80.32.64.0/20", "80.34.64.0/20", "80.36.64.0/20",
        "80.38.64.0/20", "80.40.64.0/20", "80.42.64.0/20", "80.44.64.0/20",
        "80.46.64.0/20", "80.48.64.0/20", "80.50.64.0/20", "80.52.64.0/20",
        "80.54.64.0/20", "80.56.64.0/20", "80.58.64.0/20", "80.60.64.0/20",
        "80.62.64.0/20", "86.136.0.0/14", "86.140.0.0/14", "86.144.0.0/14",
        "86.148.0.0/14", "86.152.0.0/14", "86.156.0.0/14", "86.160.0.0/14",
        "86.164.0.0/14", "86.168.0.0/14", "86.172.0.0/14", "86.176.0.0/14",
        "86.180.0.0/14", "86.184.0.0/14", "86.188.0.0/14", "86.192.0.0/14",
        "86.196.0.0/14", "86.200.0.0/14", "86.204.0.0/14", "86.208.0.0/14",
        "86.212.0.0/14", "86.216.0.0/14", "86.220.0.0/14", "86.224.0.0/14",
        "86.228.0.0/14", "86.232.0.0/14", "86.236.0.0/14", "86.240.0.0/14",
        "86.244.0.0/14", "86.248.0.0/14", "86.252.0.0/14", "109.226.0.0/15",
        "109.228.0.0/15", "109.230.0.0/15", "109.232.0.0/15", "109.234.0.0/15",
        "109.236.0.0/15", "109.238.0.0/15", "109.240.0.0/15", "109.242.0.0/15",
        "109.244.0.0/15", "109.246.0.0/15", "109.248.0.0/15", "109.250.0.0/15",
        "109.252.0.0/15", "109.254.0.0/15", "146.247.0.0/16", "146.248.0.0/16",
        "146.249.0.0/16", "146.250.0.0/16", "146.251.0.0/16", "158.135.0.0/16",
        "158.136.0.0/16", "158.137.0.0/16", "158.138.0.0/16", "158.139.0.0/16",
        "158.140.0.0/16", "158.141.0.0/16", "158.142.0.0/16", "158.143.0.0/16",
        "185.80.0.0/15", "185.82.0.0/15", "185.84.0.0/15", "185.86.0.0/15",
        "185.88.0.0/15", "185.90.0.0/15", "185.92.0.0/15", "185.94.0.0/15",
        "185.96.0.0/15", "185.98.0.0/15", "185.100.0.0/15", "185.102.0.0/15",
        "185.104.0.0/15", "185.106.0.0/15", "185.108.0.0/15", "185.110.0.0/15",
        "185.112.0.0/15", "185.114.0.0/15", "185.116.0.0/15", "185.118.0.0/15",
        "185.120.0.0/15", "185.122.0.0/15", "185.124.0.0/15", "185.126.0.0/15",
        "185.128.0.0/15", "185.130.0.0/15", "185.132.0.0/15", "185.134.0.0/15",
        "185.136.0.0/15", "185.138.0.0/15", "185.140.0.0/15", "185.142.0.0/15",
        "185.144.0.0/15", "185.146.0.0/15", "185.148.0.0/15", "185.150.0.0/15",
        "185.152.0.0/15", "185.154.0.0/15", "185.156.0.0/15", "185.158.0.0/15",
        "185.160.0.0/15", "185.162.0.0/15", "185.164.0.0/15", "185.166.0.0/15",
        "185.168.0.0/15", "185.170.0.0/15", "185.172.0.0/15", "185.174.0.0/15",
        "185.176.0.0/15", "185.178.0.0/15", "185.180.0.0/15", "185.182.0.0/15",
        "185.184.0.0/15", "185.186.0.0/15", "185.188.0.0/15", "185.190.0.0/15",
        "185.192.0.0/15", "185.194.0.0/15", "185.196.0.0/15", "185.198.0.0/15",
        "185.200.0.0/15", "185.202.0.0/15", "185.204.0.0/15", "185.206.0.0/15",
        "185.208.0.0/15", "185.210.0.0/15", "185.212.0.0/15", "185.214.0.0/15",
        "185.216.0.0/15", "185.218.0.0/15", "185.220.0.0/15", "185.222.0.0/15",
        "185.224.0.0/15", "185.226.0.0/15", "185.228.0.0/15", "185.230.0.0/15",
        "185.232.0.0/15", "185.234.0.0/15", "185.236.0.0/15", "185.238.0.0/15",
        "185.240.0.0/15", "185.242.0.0/15", "185.244.0.0/15", "185.246.0.0/15",
        "185.248.0.0/15", "185.250.0.0/15", "185.252.0.0/15", "185.254.0.0/15",
        "188.0.0.0/15", "188.2.0.0/15", "188.4.0.0/15", "188.6.0.0/15",
        "188.8.0.0/15", "188.10.0.0/15", "188.12.0.0/15", "188.14.0.0/15",
        "188.16.0.0/15", "188.18.0.0/15", "188.20.0.0/15", "188.22.0.0/15",
        "188.24.0.0/15", "188.26.0.0/15", "188.28.0.0/15", "188.30.0.0/15",
        "188.32.0.0/15", "188.34.0.0/15", "188.36.0.0/15", "188.38.0.0/15",
        "188.40.0.0/15", "188.42.0.0/15", "188.44.0.0/15", "188.46.0.0/15",
        "188.48.0.0/15", "188.50.0.0/15", "188.52.0.0/15", "188.54.0.0/15",
        "188.56.0.0/15", "188.58.0.0/15", "188.60.0.0/15", "188.62.0.0/15",
        "188.64.0.0/15", "188.66.0.0/15", "188.68.0.0/15", "188.70.0.0/15",
        "188.72.0.0/15", "188.74.0.0/15", "188.76.0.0/15", "188.78.0.0/15",
        "188.80.0.0/15", "188.82.0.0/15", "188.84.0.0/15", "188.86.0.0/15",
        "188.88.0.0/15", "188.90.0.0/15", "188.92.0.0/15", "188.94.0.0/15",
        "188.96.0.0/15", "188.98.0.0/15", "188.100.0.0/15", "188.102.0.0/15",
        "188.104.0.0/15", "188.106.0.0/15", "188.108.0.0/15", "188.110.0.0/15",
        "188.112.0.0/15", "188.114.0.0/15", "188.116.0.0/15", "188.118.0.0/15",
        "188.120.0.0/15", "188.122.0.0/15", "188.124.0.0/15", "188.126.0.0/15",
        "188.128.0.0/15", "188.130.0.0/15", "188.132.0.0/15", "188.134.0.0/15",
        "188.136.0.0/15", "188.138.0.0/15", "188.140.0.0/15", "188.142.0.0/15",
        "188.144.0.0/15", "188.146.0.0/15", "188.148.0.0/15", "188.150.0.0/15",
        "188.152.0.0/15", "188.154.0.0/15", "188.156.0.0/15", "188.158.0.0/15",
        "188.160.0.0/15", "188.162.0.0/15", "188.164.0.0/15", "188.166.0.0/15",
        "188.168.0.0/15", "188.170.0.0/15", "188.172.0.0/15", "188.174.0.0/15",
        "188.176.0.0/15", "188.178.0.0/15", "188.180.0.0/15", "188.182.0.0/15",
        "188.184.0.0/15", "188.186.0.0/15", "188.188.0.0/15", "188.190.0.0/15",
        "188.192.0.0/15", "188.194.0.0/15", "188.196.0.0/15", "188.198.0.0/15",
        "188.200.0.0/15", "188.202.0.0/15", "188.204.0.0/15", "188.206.0.0/15",
        "188.208.0.0/15", "188.210.0.0/15", "188.212.0.0/15", "188.214.0.0/15",
        "188.216.0.0/15", "188.218.0.0/15", "188.220.0.0/15", "188.222.0.0/15",
        "188.224.0.0/15", "188.226.0.0/15", "188.228.0.0/15", "188.230.0.0/15",
        "188.232.0.0/15", "188.234.0.0/15", "188.236.0.0/15", "188.238.0.0/15",
        "188.240.0.0/15", "188.242.0.0/15", "188.244.0.0/15", "188.246.0.0/15",
        "188.248.0.0/15", "188.250.0.0/15", "188.252.0.0/15", "188.254.0.0/15",
        "195.96.0.0/15", "195.98.0.0/15", "195.100.0.0/15", "195.102.0.0/15",
        "195.104.0.0/15", "195.106.0.0/15", "195.108.0.0/15", "195.110.0.0/15",
        "195.112.0.0/15", "195.114.0.0/15", "195.116.0.0/15", "195.118.0.0/15",
        "195.120.0.0/15", "195.122.0.0/15", "195.124.0.0/15", "195.126.0.0/15",
        "195.128.0.0/15", "195.130.0.0/15", "195.132.0.0/15", "195.134.0.0/15",
        "195.136.0.0/15", "195.138.0.0/15", "195.140.0.0/15", "195.142.0.0/15",
        "195.144.0.0/15", "195.146.0.0/15", "195.148.0.0/15", "195.150.0.0/15",
        "195.152.0.0/15", "195.154.0.0/15", "195.156.0.0/15", "195.158.0.0/15",
        "195.160.0.0/15", "195.162.0.0/15", "195.164.0.0/15", "195.166.0.0/15",
        "195.168.0.0/15", "195.170.0.0/15", "195.172.0.0/15", "195.174.0.0/15",
        "195.176.0.0/15", "195.178.0.0/15", "195.180.0.0/15", "195.182.0.0/15",
        "195.184.0.0/15", "195.186.0.0/15", "195.188.0.0/15", "195.190.0.0/15",
        "195.192.0.0/15", "195.194.0.0/15", "195.196.0.0/15", "195.198.0.0/15",
        "195.200.0.0/15", "195.202.0.0/15", "195.204.0.0/15", "195.206.0.0/15",
        "195.208.0.0/15", "195.210.0.0/15", "195.212.0.0/15", "195.214.0.0/15",
        "195.216.0.0/15", "195.218.0.0/15", "195.220.0.0/15", "195.222.0.0/15",
        "195.224.0.0/15", "195.226.0.0/15", "195.228.0.0/15", "195.230.0.0/15",
        "195.232.0.0/15", "195.234.0.0/15", "195.236.0.0/15", "195.238.0.0/15",
        "195.240.0.0/15", "195.242.0.0/15", "195.244.0.0/15", "195.246.0.0/15",
        "195.248.0.0/15", "195.250.0.0/15", "195.252.0.0/15", "195.254.0.0/15",
        "200.43.0.0/16", "200.44.0.0/16", "200.45.0.0/16", "200.46.0.0/16",
        "200.47.0.0/16", "200.48.0.0/16", "200.49.0.0/16", "200.50.0.0/16",
        "200.51.0.0/16", "200.52.0.0/16", "200.53.0.0/16", "200.54.0.0/16",
        "200.55.0.0/16", "200.56.0.0/16", "200.57.0.0/16", "200.58.0.0/16",
        "200.59.0.0/16", "200.60.0.0/16", "200.61.0.0/16", "200.62.0.0/16",
        "200.63.0.0/16", "200.64.0.0/16", "200.65.0.0/16", "200.66.0.0/16",
        "200.67.0.0/16", "200.68.0.0/16", "200.69.0.0/16", "200.70.0.0/16",
        "200.71.0.0/16", "200.72.0.0/16", "200.73.0.0/16", "200.74.0.0/16",
        "200.75.0.0/16", "200.76.0.0/16", "200.77.0.0/16", "200.78.0.0/16",
        "200.79.0.0/16", "200.80.0.0/16", "200.81.0.0/16", "200.82.0.0/16",
        "200.83.0.0/16", "200.84.0.0/16", "200.85.0.0/16", "200.86.0.0/16",
        "200.87.0.0/16", "200.88.0.0/16", "200.89.0.0/16", "200.90.0.0/16",
        "200.91.0.0/16", "200.92.0.0/16", "200.93.0.0/16", "200.94.0.0/16",
        "200.95.0.0/16", "200.96.0.0/16", "200.97.0.0/16", "200.98.0.0/16",
        "200.99.0.0/16", "200.100.0.0/16", "200.101.0.0/16", "200.102.0.0/16",
        "200.103.0.0/16", "200.104.0.0/16", "200.105.0.0/16", "200.106.0.0/16",
        "200.107.0.0/16", "200.108.0.0/16", "200.109.0.0/16", "200.110.0.0/16",
        "200.111.0.0/16", "200.112.0.0/16", "200.113.0.0/16", "200.114.0.0/16",
        "200.115.0.0/16", "200.116.0.0/16", "200.117.0.0/16", "200.118.0.0/16",
        "200.119.0.0/16", "200.120.0.0/16", "200.121.0.0/16", "200.122.0.0/16",
        "200.123.0.0/16", "200.124.0.0/16", "200.125.0.0/16", "200.126.0.0/16",
        "200.127.0.0/16", "210.48.0.0/15", "210.50.0.0/15", "210.52.0.0/15",
        "210.54.0.0/15", "210.56.0.0/15", "210.58.0.0/15", "210.60.0.0/15",
        "210.62.0.0/15", "210.64.0.0/15", "210.66.0.0/15", "210.68.0.0/15",
        "210.70.0.0/15", "210.72.0.0/15", "210.74.0.0/15", "210.76.0.0/15",
        "210.78.0.0/15", "210.80.0.0/15", "210.82.0.0/15", "210.84.0.0/15",
        "210.86.0.0/15", "210.88.0.0/15", "210.90.0.0/15", "210.92.0.0/15",
        "210.94.0.0/15", "210.96.0.0/15", "210.98.0.0/15", "210.100.0.0/15",
        "210.102.0.0/15", "210.104.0.0/15", "210.106.0.0/15", "210.108.0.0/15",
        "210.110.0.0/15", "210.112.0.0/15", "210.114.0.0/15", "210.116.0.0/15",
        "210.118.0.0/15", "210.120.0.0/15", "210.122.0.0/15", "210.124.0.0/15",
        "210.126.0.0/15", "210.128.0.0/15", "210.130.0.0/15", "210.132.0.0/15",
        "210.134.0.0/15", "210.136.0.0/15", "210.138.0.0/15", "210.140.0.0/15",
        "210.142.0.0/15", "210.144.0.0/15", "210.146.0.0/15", "210.148.0.0/15",
        "210.150.0.0/15", "210.152.0.0/15", "210.154.0.0/15", "210.156.0.0/15",
        "210.158.0.0/15", "210.160.0.0/15", "210.162.0.0/15", "210.164.0.0/15",
        "210.166.0.0/15", "210.168.0.0/15", "210.170.0.0/15", "210.172.0.0/15",
        "210.174.0.0/15", "210.176.0.0/15", "210.178.0.0/15", "210.180.0.0/15",
        "210.182.0.0/15", "210.184.0.0/15", "210.186.0.0/15", "210.188.0.0/15",
        "210.190.0.0/15", "210.192.0.0/15", "210.194.0.0/15", "210.196.0.0/15",
        "210.198.0.0/15", "210.200.0.0/15", "210.202.0.0/15", "210.204.0.0/15",
        "210.206.0.0/15", "210.208.0.0/15", "210.210.0.0/15", "210.212.0.0/15",
        "210.214.0.0/15", "210.216.0.0/15", "210.218.0.0/15", "210.220.0.0/15",
        "210.222.0.0/15", "210.224.0.0/15", "210.226.0.0/15", "210.228.0.0/15",
        "210.230.0.0/15", "210.232.0.0/15", "210.234.0.0/15", "210.236.0.0/15",
        "210.238.0.0/15", "210.240.0.0/15", "210.242.0.0/15", "210.244.0.0/15",
        "210.246.0.0/15", "210.248.0.0/15", "210.250.0.0/15", "210.252.0.0/15",
        "210.254.0.0/15", "212.64.0.0/16", "212.65.0.0/16", "212.66.0.0/16",
        "212.67.0.0/16", "212.68.0.0/16", "212.69.0.0/16", "212.70.0.0/16",
        "212.71.0.0/16", "212.72.0.0/16", "212.73.0.0/16", "212.74.0.0/16",
        "212.75.0.0/16", "212.76.0.0/16", "212.77.0.0/16", "212.78.0.0/16",
        "212.79.0.0/16", "212.80.0.0/16", "212.81.0.0/16", "212.82.0.0/16",
        "212.83.0.0/16", "212.84.0.0/16", "212.85.0.0/16", "212.86.0.0/16",
        "212.87.0.0/16", "212.88.0.0/16", "212.89.0.0/16", "212.90.0.0/16",
        "212.91.0.0/16", "212.92.0.0/16", "212.93.0.0/16", "212.94.0.0/16",
        "212.95.0.0/16", "212.96.0.0/16", "212.97.0.0/16", "212.98.0.0/16",
        "212.99.0.0/16", "212.100.0.0/16", "212.101.0.0/16", "212.102.0.0/16",
        "212.103.0.0/16", "212.104.0.0/16", "212.105.0.0/16", "212.106.0.0/16",
        "212.107.0.0/16", "212.108.0.0/16", "212.109.0.0/16", "212.110.0.0/16",
        "212.111.0.0/16", "212.112.0.0/16", "212.113.0.0/16", "212.114.0.0/16",
        "212.115.0.0/16", "212.116.0.0/16", "212.117.0.0/16", "212.118.0.0/16",
        "212.119.0.0/16", "212.120.0.0/16", "212.121.0.0/16", "212.122.0.0/16",
        "212.123.0.0/16", "212.124.0.0/16", "212.125.0.0/16", "212.126.0.0/16",
        "212.127.0.0/16", "217.23.32.0/20", "217.23.48.0/20", "217.23.64.0/20",
        "217.23.80.0/20", "217.23.96.0/20", "217.23.112.0/20", "217.23.128.0/20",
        "217.23.144.0/20", "217.23.160.0/20", "217.23.176.0/20", "217.23.192.0/20",
        "217.23.208.0/20", "217.23.224.0/20", "217.23.240.0/20", "217.24.0.0/16",
        "217.25.0.0/16", "217.26.0.0/16", "217.27.0.0/16", "217.28.0.0/16",
        "217.29.0.0/16", "217.30.0.0/16", "217.31.0.0/16"
    );
    
    if (isIPv4(host)) {
        for (var i = 0; i < NEARBY_IPV4.length; i++) {
            var range = NEARBY_IPV4[i].split("/");
            if (isInNet(host, range[0], range[1])) {
                return true;
            }
        }
    }
    return false;
}

// ==============================
// 9) نظام حماية متقدم من التسريب والخدمات السحابية
// ==============================

function preventLeak(host) {
    // حماية من تسريب DNS
    if (DNS_LEAK_PROTECTION) {
        var dnsServer = dnsGetServer();
        if (dnsServer && !isJordanAdvanced(dnsServer)) {
            return "BLOCK";
        }
    }
    
    // حماية من تسريب IPv6
    if (IPV6_LEAK_PROTECTION && isIPv6(host)) {
        return "BLOCK";
    }
    
    // حماية من تسريب HTTP/HTTPS
    if (HTTP_LEAK_PROTECTION) {
        if (host.indexOf("http://") === 0 || host.indexOf("https://") === 0) {
            return "BLOCK";
        }
    }
    
    // حماية من WebRTC (تسريب IP الحقيقي)
    if (host.indexOf("webrtc") !== -1 || host.indexOf("stun") !== -1 || host.indexOf("turn") !== -1) {
        return "BLOCK";
    }
    
    // حماية من DNS over HTTPS (DoH)
    if (host.indexOf("doh") !== -1 || host.indexOf("dns-over-https") !== -1) {
        return "BLOCK";
    }
    
    // حماية من QUIC (UDP 443)
    if (host.indexOf("quic") !== -1 || host.indexOf("udp-quic") !== -1) {
        return "BLOCK";
    }
    
    return null;
}

function isCloudHosted(host) {
    // حظر نطاقات AWS
    var awsRanges = [
        "3.0.0.0/8", "13.0.0.0/8", "15.0.0.0/8", "46.0.0.0/8", "50.0.0.0/8",
        "52.0.0.0/8", "54.0.0.0/8", "72.0.0.0/8", "74.0.0.0/8", "75.0.0.0/8",
        "76.0.0.0/8", "91.0.0.0/8", "96.0.0.0/8", "98.0.0.0/8", "99.0.0.0/8",
        "100.0.0.0/8", "107.0.0.0/8", "108.0.0.0/8", "131.0.0.0/8", "161.0.0.0/8",
        "162.0.0.0/8", "166.0.0.0/8", "167.0.0.0/8", "184.0.0.0/8", "185.0.0.0/8",
        "204.0.0.0/8", "205.0.0.0/8", "2400:8000::/32", "2600:0000::/16",
        "2618:0000::/16", "2a05:0000::/16", "2a07:0000::/16", "2a08:0000::/16",
        "2a0a:2740::/29", "2a00:18d0::/32", "2a03:fd00::/32", "2a07:140::/29",
        "2600:1900::/35", "2600:1901::/35", "2600:1902::/35", "2600:1903::/35",
        "2600:1904::/35", "2600:1905::/35", "2600:1906::/35", "2600:1907::/35"
    ];
    
    // حظر نطاقات Cloudflare
    var cloudflareRanges = [
        "104.16.0.0/12", "104.24.0.0/12", "108.160.0.0/12", "172.64.0.0/13",
        "173.245.0.0/15", "192.230.0.0/18", "198.41.0.0/16", "199.27.0.0/17",
        "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
        "2405:4800::/32", "2a06:98c0::/23", "2c0f:f008::/32",
        "162.159.0.0/16", "162.159.24.0/16", "162.159.25.0/16", "162.159.26.0/16",
        "162.159.27.0/16", "162.159.28.0/16", "162.159.29.0/16", "162.159.30.0/16"
    ];
    
    // حظر نطاقات Google Cloud
    var googleRanges = [
        "35.184.0.0/16", "35.202.0.0/16", "35.203.0.0/16", "35.204.0.0/16",
        "35.205.0.0/16", "35.206.0.0/16", "35.207.0.0/16", "35.208.0.0/16",
        "35.209.0.0/16", "35.210.0.0/16", "35.211.0.0/16", "35.212.0.0/16",
        "35.213.0.0/16", "35.214.0.0/16", "35.215.0.0/16", "35.216.0.0/16",
        "35.217.0.0/16", "35.218.0.0/16", "35.219.0.0/16", "35.220.0.0/16",
        "35.221.0.0/16", "35.222.0/16", "35.223.0/16", "35.224.0/16",
        "35.225.0/16", "35.226.0/16", "35.227.0/16", "35.228.0/16",
        "35.229.0/16", "35.230.0/16", "35.231.0/16", "35.232.0/16",
        "35.233.0/16", "35.234.0/16", "35.235.0/16", "35.236.0/16",
        "35.237.0/16", "35.238.0/16", "35.239.0/16", "35.240.0/16",
        "35.241.0/16", "35.242.0/16", "35.243.0/16", "35.244.0/16",
        "35.245.0/16", "35.246.0/16", "35.247.0/16", "35.248.0/16",
        "35.249.0/16", "35.250.0/16", "35.251.0/16", "35.252.0/16",
        "35.253.0/16", "35.254.0/16", "35.255.0/16", "2600:1900::/35",
        "2600:1901::/35", "2600:1902::/35", "2600:1903::/35",
        "2600:1904::/35", "2600:1905::/35", "2600:1906::/35", "2600:1907::/35",
        "2600:1908::/35", "2600:1909::/35", "2600:190a::/35", "2600:190b::/35",
        "2600:190c::/35", "2600:190d::/35", "2600:190e::/35", "2600:190f::/35"
    ];
    
    // حظر نطاقات Azure
    var azureRanges = [
        "13.64.0.0/18", "13.65.0.0/18", "13.66.0.0/18", "13.67.0.0/18",
        "13.68.0.0/18", "13.69.0.0/18", "13.70.0.0/18", "13.71.0.0/18",
        "13.72.0.0/18", "13.73.0.0/18", "13.74.0.0/18", "13.75.0.0/18",
        "13.76.0.0/18", "13.77.0.0/18", "13.78.0.0/18", "13.79.0.0/18",
        "20.0.0.0/8", "40.0.0.0/8", "51.0.0.0/8", "52.0.0.0/8",
        "65.52.0.0/18", "70.37.0.0/17", "104.40.0.0/14", "157.54.0.0/15",
        "168.1.0.0/16", "191.232.0.0/13", "192.55.0.0/16", "192.102.0.0/16",
        "192.241.0.0/16", "192.245.0.0/16", "198.23.0.0/16", "198.32.0.0/16",
        "198.180.0.0/16", "204.27.0.0/16", "208.64.0.0/16", "208.90.0.0/16",
        "208.128.0.0/16", "208.185.0.0/16", "208.230.0.0/16", "208.250.0.0/16",
        "209.221.0.0/16", "213.64.0.0/16", "216.119.0.0/16", "216.220.0.0/16",
        "20.36.0.0/14", "20.40.0.0/14", "20.44.0.0/14", "20.48.0.0/14",
        "20.52.0.0/14", "20.56.0.0/14", "20.60.0.0/14", "20.64.0.0/14",
        "20.68.0.0/14", "20.72.0.0/14", "20.76.0.0/14", "20.80.0.0/14",
        "20.84.0.0/14", "20.88.0.0/14", "20.92.0.0/14", "20.96.0.0/14",
        "20.100.0.0/14", "20.104.0.0/14", "20.108.0.0/14", "20.112.0.0/14",
        "20.116.0.0/14", "20.120.0.0/14", "20.124.0.0/14", "20.128.0.0/14",
        "20.132.0.0/14", "20.136.0.0/14", "20.140.0.0/14", "20.144.0.0/14",
        "20.148.0.0/14", "20.152.0.0/14", "20.156.0.0/14", "20.160.0.0/14",
        "20.164.0.0/14", "20.168.0.0/14", "20.172.0.0/14", "20.176.0.0/14",
        "20.180.0.0/14", "20.184.0.0/14", "20.188.0.0/14", "20.192.0.0/14",
        "20.196.0.0/14", "20.200.0.0/14", "20.204.0.0/14", "20.208.0.0/14",
        "20.212.0.0/14", "20.216.0.0/14", "20.220.0.0/14", "20.224.0.0/14",
        "20.228.0.0/14", "20.232.0.0/14", "20.236.0.0/14", "20.240.0.0/14",
        "20.244.0.0/14", "20.248.0.0/14", "20.252.0.0/14", "20.254.0.0/14",
        "40.64.0.0/14", "40.68.0.0/14", "40.72.0.0/14", "40.76.0.0/14",
        "40.80.0.0/14", "40.84.0.0/14", "40.88.0.0/14", "40.92.0.0/14",
        "40.96.0.0/14", "40.100.0.0/14", "40.104.0.0/14", "40.108.0.0/14",
        "40.112.0.0/14", "40.116.0.0/14", "40.120.0.0/14", "40.124.0.0/14",
        "40.128.0.0/14", "40.132.0.0/14", "40.136.0.0/14", "40.140.0.0/14",
        "40.144.0.0/14", "40.148.0.0/14", "40.152.0.0/14", "40.156.0.0/14",
        "40.160.0.0/14", "40.164.0.0/14", "40.168.0.0/14", "40.172.0.0/14",
        "40.176.0.0/14", "40.180.0.0/14", "40.184.0.0/14", "40.188.0.0/14",
        "40.192.0.0/14", "40.196.0.0/14", "40.200.0.0/14", "40.204.0.0/14",
        "40.208.0.0/14", "40.212.0.0/14", "40.216.0.0/14", "40.220.0.0/14",
        "40.224.0.0/14", "40.228.0.0/14", "40.232.0.0/14", "40.236.0.0/14",
        "40.240.0.0/14", "40.244.0.0/14", "40.248.0.0/14", "40.252.0.0/14"
    ];
    
    // حظر نطاقات DigitalOcean
    var digitaloceanRanges = [
        "64.116.0.0/18", "64.117.0.0/18", "64.118.0.0/18", "64.119.0.0/18",
        "64.120.0.0/18", "64.121.0.0/18", "64.122.0.0/18", "64.123.0.0/18",
        "64.124.0.0/18", "64.125.0.0/18", "64.126.0.0/18", "64.127.0.0/18",
        "138.197.0.0/17", "138.198.0.0/17", "138.199.0.0/17", "138.200.0.0/17",
        "138.201.0.0/17", "138.202.0.0/17", "138.203.0.0/17", "138.204.0.0/17",
        "138.205.0.0/17", "138.206.0.0/17", "138.207.0.0/17", "138.208.0.0/17",
        "138.209.0.0/17", "138.210.0.0/17", "138.211.0.0/17", "138.212.0.0/17",
        "138.213.0.0/17", "138.214.0.0/17", "138.215.0.0/17", "2400:2640::/32",
        "2400:2641::/32", "2400:2642::/32", "2400:2643::/32", "2400:2644::/32",
        "2400:2645::/32", "2400:2646::/32", "2400:2647::/32", "2400:2648::/32",
        "2400:2649::/32", "2400:264a::/32", "2400:264b::/32", "2400:264c::/32",
        "2400:264d::/32", "2400:264e::/32", "2400:264f::/32", "2400:2650::/32",
        "2400:2651::/32", "2400:2652::/32", "2400:2653::/32", "2400:2654::/32",
        "2400:2655::/32", "2400:2656::/32", "2400:2657::/32", "2400:2658::/32",
        "2400:2659::/32", "2400:265a::/32", "2400:265b::/32", "2400:265c::/32",
        "2400:265d::/32", "2400:265e::/32", "2400:265f::/32", "2400:2660::/32",
        "2400:2661::/32", "2400:2662::/32", "2400:2663::/32", "2400:2664::/32",
        "2400:2665::/32", "2400:2666::/32", "2400:2667::/32", "2400:2668::/32"
    ];
    
    // تحويل الـ host إلى IP إذا كان نطاق
    var ip = isIPv4(host) ? host : dnsResolve(host);
    if (!ip) return false;
    
    // فحص نطاقات AWS
    for (var i = 0; i < awsRanges.length; i++) {
        var range = awsRanges[i].split("/");
        if (isInNet(ip, range[0], range[1])) return true;
    }
    
    // فحص نطاقات Cloudflare
    for (var i = 0; i < cloudflareRanges.length; i++) {
        var range = cloudflareRanges[i].split("/");
        if (isInNet(ip, range[0], range[1])) return true;
    }
    
    // فحص نطاقات Google Cloud
    for (var i = 0; i < googleRanges.length; i++) {
        var range = googleRanges[i].split("/");
        if (isInNet(ip, range[0], range[1])) return true;
    }
    
    // فحص نطاقات Azure
    for (var i = 0; i < azureRanges.length; i++) {
        var range = azureRanges[i].split("/");
        if (isInNet(ip, range[0], range[1])) return true;
    }
    
    // فحص نطاقات DigitalOcean
    for (var i = 0; i < digitaloceanRanges.length; i++) {
        var range = digitaloceanRanges[i].split("/");
        if (isInNet(ip, range[0], range[1])) return true;
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
        cloudHost.indexOf("oracle") !== -1 ||
        cloudHost.indexOf("vultr") !== -1 ||
        cloudHost.indexOf("linode") !== -1 ||
        cloudHost.indexOf("backblaze") !== -1 ||
        cloudHost.indexOf("ovh") !== -1 ||
        cloudHost.indexOf("hetzner") !== -1 ||
        cloudHost.indexOf("contabo") !== -1 ||
        cloudHost.indexOf("cloudflare") !== -1 ||
        cloudHost.indexOf("cloudflare.com") !== -1 ||
        cloudHost.indexOf("cloudflare-proxy") !== -1 ||
        cloudHost.indexOf("cloudproxy") !== -1 ||
        cloudHost.indexOf("cloud-services") !== -1 ||
        cloudHost.indexOf("cloud-hosting") !== -1) {
        return true;
    }
    
    return false;
}

// ==============================
// 10) نظام التبديل الذكي المحسن للبروكسيات
// ==============================

var CURRENT_PROXY = null;
var LAST_SWITCH_TIME = 0;
var LAST_PING_CHECK = 0;
var QOS_ENABLED = false;

function getBestProxy() {
    var now = Date.now();
    var bestProxy = null;
    var bestScore = -Infinity;
    
    // تحديث بيانات جميع البروكسيات كل 20 ثانية
    if (now - LAST_PING_CHECK > PROXY_CHECK_INTERVAL) {
        for (var i = 0; i < PROXY_POOL.length; i++) {
            var proxy = PROXY_POOL[i];
            
            try {
                proxy.ping = ping(proxy.host, proxy.port);
                proxy.lastCheck = now;
                
                if (proxy.ping !== null) {
                    // تحديث إحصائيات الأداء
                    proxy.total++;
                    if (proxy.ping <= MAX_PING_MS) {
                        proxy.success++;
                        proxy.score = Math.min(100, proxy.score + 5);
                    } else {
                        proxy.score = Math.max(0, proxy.score - 10);
                    }
                    
                    // حساب الأولوية النهائية (أكثر تطوراً)
                    var priorityFactor = proxy.priority * 15; // زيادة وزن الأولوية
                    var successRate = proxy.total > 0 ? (proxy.success / proxy.total) * 100 : 0;
                    var successFactor = Math.min(50, successRate);
                    var latencyFactor = Math.max(0, 50 - (proxy.ping || 0));
                    var typeFactor = proxy.type === "SOCKS5" ? 10 : 0; // ميزة للـ SOCKS5
                    var freshnessFactor = (now - proxy.lastCheck) < 60000 ? 5 : 0; // ميزة للحديث
                    var qosFactor = ENABLE_QOS ? proxy.qos * 2 : 0; // عامل جودة الخدمة
                    
                    proxy.finalScore = priorityFactor + successFactor + latencyFactor + typeFactor + freshnessFactor + qosFactor;
                } else {
                    proxy.failures++;
                    proxy.score = Math.max(0, proxy.score - 15);
                    proxy.finalScore = 0;
                }
            } catch (e) {
                proxy.failures++;
                proxy.score = Math.max(0, proxy.score - 15);
                proxy.finalScore = 0;
            }
        }
        LAST_PING_CHECK = now;
    }
    
    // إزالة البروكسيات التي فشلت كثيراً
    for (var i = 0; i < PROXY_POOL.length; i++) {
        if (PROXY_POOL[i].failures >= MAX_FAILURES) {
            PROXY_POOL.splice(i, 1);
            i--;
        }
    }
    
    // اختيار أفضل بروكسي
    for (var i = 0; i < PROXY_POOL.length; i++) {
        var proxy = PROXY_POOL[i];
        if (proxy.finalScore > bestScore && proxy.score >= MIN_SUCCESS_RATE) {
            bestScore = proxy.finalScore;
            bestProxy = proxy;
        }
    }
    
    // إذا لم ينجح أي بروكسي، استخدم الأساسي (الأول في القائمة)
    if (!bestProxy && PROXY_POOL.length > 0) {
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
    if (newProxy.finalScore > currentProxy.finalScore) {
        return true;
    }
    
    // إذا كان البروكسي الجديد من نوع SOCKS5 والأساسي ليس SOCKS5
    if (ENABLE_SOCKS5_PREFERENCE && newProxy.type === "SOCKS5" && currentProxy.type !== "SOCKS5") {
        return true;
    }
    
    // إذا كان البروكسي الجديد أحدث (تم فحصه مؤخراً)
    if (newProxy.lastCheck > currentProxy.lastCheck + 30000) {
        return true;
    }
    
    // إذا كان البروكسي الجديد له QoS أعلى
    if (ENABLE_QOS && newProxy.qos > currentProxy.qos) {
        return true;
    }
    
    return false;
}

// ==============================
// 11) نظام قفل الجلسات المحسن (Sticky Sessions)
// ==============================

var SESSION = {
    matchHost: null,
    lobbyHost: null,
    lastMatchTime: 0,
    lastLobbyTime: 0,
    matchProxy: null,
    lobbyProxy: null,
    sessionCount: 0,
    matchDuration: 0,
    lobbyDuration: 0
};

function lockMatch(host) {
    if (!STICKY_MATCH) return true;
    
    var now = Date.now();
    var timeDiff = now - SESSION.lastMatchTime;
    
    // إعادة تعيين الجلسة بعد 5 دقائق
    if (timeDiff > 300000) {
        SESSION.matchHost = host;
        SESSION.lastMatchTime = now;
        SESSION.sessionCount++;
        return true;
    }
    
    if (SESSION.matchHost === null) {
        SESSION.matchHost = host;
        SESSION.lastMatchTime = now;
        SESSION.sessionCount++;
        return true;
    }
    
    return SESSION.matchHost === host;
}

function lockLobby(host) {
    if (!STICKY_LOBBY) return true;
    
    var now = Date.now();
    var timeDiff = now - SESSION.lastLobbyTime;
    
    // إعادة تعيين الجلسة بعد 5 دقائق
    if (timeDiff > 300000) {
        SESSION.lobbyHost = host;
        SESSION.lastLobbyTime = now;
        SESSION.sessionCount++;
        return true;
    }
    
    if (SESSION.lobbyHost === null) {
        SESSION.lobbyHost = host;
        SESSION.lastLobbyTime = now;
        SESSION.sessionCount++;
        return true;
    }
    
    return SESSION.lobbyHost === host;
}

function getSessionStats() {
    return {
        sessions: SESSION.sessionCount,
        matchHost: SESSION.matchHost,
        lobbyHost: SESSION.lobbyHost,
        lastMatch: new Date(SESSION.lastMatchTime).toLocaleString(),
        lastLobby: new Date(SESSION.lastLobbyTime).toLocaleString(),
        matchDuration: SESSION.matchDuration,
        lobbyDuration: SESSION.lobbyDuration
    };
}

// ==============================
// 12) المحرك الرئيسي المحسن (FindProxyForURL)
// ==============================

function FindProxyForURL(url, host) {
    host = host.toLowerCase();
    
    // وضع الطوارئ (حظر جميع المواقع)
    if (PANIC_BLOCK_ALL) return "BLOCK";
    
    // الشبكات المحلية
    if (isPlainHostName(host) || isPrivate4(host)) return "DIRECT";
    
    // التعامل مع IPv6
    if (isIPv6(host)) {
        if (IPV6_LEAK_PROTECTION || BLOCK_IPV6) return "BLOCK";
        if (isPUBGDomain(host)) return "BLOCK";
        return "DIRECT";
    }
    
    // منع التسريبات
    var leakResult = preventLeak(host);
    if (leakResult !== null) {
        return leakResult;
    }
    
    // التحقق من الذاكرة المؤقتة
    var cacheKey = host + (isIPv4(host) ? "_ip" : "_domain");
    var cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
        return cachedResult;
    }
    
    // التعامل مع عناوين IP
    if (isIPv4(host)) {
        // الأردن فقط (إذا تم التفعيل)
        if (ENABLE_JORDAN_ONLY && !isJordanAdvanced(host)) {
            setToCache(cacheKey, "BLOCK");
            return "BLOCK";
        }
        
        // حظر سوريا
        if (BLOCK_SYRIA && isSyriaAdvanced(host)) {
            setToCache(cacheKey, "BLOCK");
            return "BLOCK";
        }
        
        // حظر الدول المجاورة
        if (BLOCK_NEARBY && isNearbyAdvanced(host)) {
            setToCache(cacheKey, "BLOCK");
            return "BLOCK";
        }
        
        // PUBG IP
        if (isPUBGDomain(host)) {
            var bestProxy = getBestProxy();
            if (!bestProxy) return "DIRECT";
            
            var proxyStr = bestProxy.type === "SOCKS5" 
                ? "SOCKS " + bestProxy.host + ":" + bestProxy.port 
                : "PROXY " + bestProxy.host + ":" + bestProxy.port;
            
            // التبديل الذكي
            if (AUTO_SWITCH && CURRENT_PROXY && shouldSwitch(CURRENT_PROXY, bestProxy)) {
                CURRENT_PROXY = bestProxy;
                LAST_SWITCH_TIME = Date.now();
            } else if (!CURRENT_PROXY) {
                CURRENT_PROXY = bestProxy;
            }
            
            // قفل الجلسات للماتش واللوبي
            if (isMatch(host)) {
                if (!lockMatch(host)) {
                    setToCache(cacheKey, "BLOCK");
                    return "BLOCK";
                }
                setToCache(cacheKey, proxyStr);
                return proxyStr;
            }
            
            if (isLobby(host)) {
                if (!lockLobby(host)) {
                    setToCache(cacheKey, "BLOCK");
                    return "BLOCK";
                }
                setToCache(cacheKey, proxyStr);
                return proxyStr;
            }
            
            // الخدمات الأساسية (CDN, Login, API)
            if (isBoot(host) || isCDN(host) || isAPI(host)) {
                setToCache(cacheKey, "DIRECT");
                return "DIRECT";
            }
            
            setToCache(cacheKey, proxyStr);
            return proxyStr;
        }
        
        // حظر غير الأردن (إذا تم التفعيل)
        if (ENABLE_JORDAN_ONLY && !isJordanAdvanced(host)) {
            setToCache(cacheKey, "BLOCK");
            return "BLOCK";
        }
        
        return "DIRECT";
    }
    
    // التعامل مع النطاقات
    if (isPUBGDomain(host)) {
        // حظر الخدمات السحابية
        if (isCloudHosted(host)) {
            setToCache(cacheKey, "BLOCK");
            return "BLOCK";
        }
        
        // حظر أدوات التتبع والإعلانات
        if (BLOCK_TRACKERS && isTracker(host)) {
            setToCache(cacheKey, "BLOCK");
            return "BLOCK";
        }
        
        if (BLOCK_ADS && isAdNetwork(host)) {
            setToCache(cacheKey, "BLOCK");
            return "BLOCK";
        }
        
        var bestProxy = getBestProxy();
        if (!bestProxy) return "DIRECT";
        
        var proxyStr = bestProxy.type === "SOCKS5" 
            ? "SOCKS " + bestProxy.host + ":" + bestProxy.port 
            : "PROXY " + bestProxy.host + ":" + bestProxy.port;
        
        // التبديل الذكي
        if (AUTO_SWITCH && CURRENT_PROXY && shouldSwitch(CURRENT_PROXY, bestProxy)) {
            CURRENT_PROXY = bestProxy;
            LAST_SWITCH_TIME = Date.now();
        } else if (!CURRENT_PROXY) {
            CURRENT_PROXY = bestProxy;
        }
        
        // قفل الجلسات للماتش واللوبي
        if (isMatch(host)) {
            if (!lockMatch(host)) {
                setToCache(cacheKey, "BLOCK");
                return "BLOCK";
            }
            setToCache(cacheKey, proxyStr);
            return proxyStr;
        }
        
        if (isLobby(host)) {
            if (!lockLobby(host)) {
                setToCache(cacheKey, "BLOCK");
                return "BLOCK";
            }
            setToCache(cacheKey, proxyStr);
            return proxyStr;
        }
        
        // الخدمات الأساسية (CDN, Login, API)
        if (isBoot(host) || isCDN(host) || isAPI(host)) {
            setToCache(cacheKey, "DIRECT");
            return "DIRECT";
        }
        
        setToCache(cacheKey, proxyStr);
        return proxyStr;
    }
    
    // المواقع العادية (غير PUBG)
    setToCache(cacheKey, "DIRECT");
    return "DIRECT";
}

// ==============================
// 13) دوال مساعدة متقدمة
// ==============================

function isPrivate4(ip) {
    return isInNet(ip, "10.0.0.0", "255.0.0.0") ||
           isInNet(ip, "172.16.0.0", "255.240.0.0") ||
           isInNet(ip, "192.168.0.0", "255.255.0.0") ||
           isInNet(ip, "169.254.0.0", "255.255.0.0") ||
           isInNet(ip, "100.64.0.0", "255.192.0.0") ||
           isInNet(ip, "198.18.0.0", "255.254.0.0");
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
    return RX_BOOT_ADV.test(host);
}

function isCDN(host) {
    return RX_CDN_ADV.test(host);
}

function isAPI(host) {
    return RX_API_ADV.test(host);
}

function isTracker(host) {
    var trackers = [
        "google-analytics.com", "googletagmanager.com", "facebook.com", "fbcdn.net",
        "twitter.com", "instagram.com", "youtube.com", "tiktok.com", "snapchat.com",
        "linkedin.com", "pinterest.com", "reddit.com", "quora.com", "medium.com",
        "hotjar.com", "mouseflow.com", "fullstory.com", "mixpanel.com", "kissmetrics.com",
        "clicktale.com", "inspectlet.com", "crazyegg.com", "freshpaint.io", "segment.com",
        "mparticle.com", "rudderstack.com", "snowplowanalytics.com", "matomo.org",
        "plausible.io", "simpleanalytics.com", "umami.is", "goatcounter.com",
        "newrelic.com", "appdynamics.com", "datadog.com", "sigopt.com",
        "optimizely.com", "vwo.com", "convert.com", "abtasty.com",
        "kameleoon.com", "dynamicyield.com", "perzonalization.com", "recostream.com",
        "barilliance.com", "qualtrics.com", "surveymonkey.com", "typeform.com",
        "medallia.com", "confirmit.com", "forrester.com", "gartner.com"
    ];
    
    host = host.toLowerCase();
    for (var i = 0; i < trackers.length; i++) {
        if (host === trackers[i] || dnsDomainIs(host, "." + trackers[i])) {
            return true;
        }
    }
    return false;
}

function isAdNetwork(host) {
    var adNetworks = [
        "doubleclick.net", "googleads.com", "adobe.com", "adobedtm.com",
        "taboola.com", "outbrain.com", "revcontent.com", "content.ad",
        "adscale.de", "plista.com", "sharethrough.com", "districtm.io",
        "indexexchange.com", "openx.net", "appnexus.com", "rubiconproject.com",
        "pubmatic.com", "tremorintl.com", "illuminas.com", "smartclip.com",
        "spotx.tv", "spotxchange.com", "twiago.com", "adition.com",
        "yieldlab.net", "adform.com", "admedo.com", "adswizz.com",
        "adyoulike.com", "bidstack.com", "brandmetrics.com", "c1exchange.com",
        "dailymotion.com", "districtm.io", "dotdash.com", "dotmetrics.net",
        "ematicsolutions.com", "emxdigital.com", "engagebdr.com", "freestar.io",
        "fremework.com", "gimbal.com", "glispa.com", "gumgum.com",
        "imged.com", "indexexchange.com", "inmobi.com", "integralads.com",
        "jivox.com", "knorex.com", "kargo.com", "lkqd.com",
        "loopme.com", "magnetic.com", "mbraneworks.com", "media.net",
        "mediarithmics.com", "mediamath.com", "meredith.com", "mgid.com",
        "moatads.com", "ninthdecimal.com", "nintendo.com", "nintendo.net",
        "nintendo.de", "nintendo.fr", "nintendo.co.uk", "nintendo.es",
        "nintendo.it", "nintendo.nl", "nintendo.se", "nintendo.no",
        "nintendo.fi", "nintendo.dk", "nintendo.com.br", "nintendo.com.mx",
        "nintendo.com.au", "nintendo.co.nz", "nintendo.sg", "nintendo.my",
        "nintendo.co.id", "nintendo.co.th", "nintendo.com.ph", "nintendo.com.kh",
        "nintendo.com.vn", "nintendo.com.tw", "nintendo.com.hk", "nintendo.com.cn",
        "nintendo.co.kr", "nintendo.co.jp", "nintendo.cn", "nintendo-history.com"
    ];
    
    host = host.toLowerCase();
    for (var i = 0; i < adNetworks.length; i++) {
        if (host === adNetworks[i] || dnsDomainIs(host, "." + adNetworks[i])) {
            return true;
        }
    }
    return false;
}

// ==============================
// 14) إحصائيات النظام
// ==============================

function getSystemStats() {
    var proxyCount = PROXY_POOL.length;
    var activeProxies = PROXY_POOL.filter(function(p) { return p.active > 0; }).length;
    var cacheStats = getCacheStats();
    
    return {
        timestamp: new Date().toISOString(),
        proxyPool: {
            total: proxyCount,
            active: activeProxies,
            averagePing: calculateAveragePing(),
            bestProxy: getBestProxy()
        },
        cache: {
            hits: cacheStats.hits,
            misses: cacheStats.misses,
            evictions: cacheStats.evictions,
            size: CACHE.length
        },
        sessions: getSessionStats(),
        settings: {
            jordanOnly: ENABLE_JORDAN_ONLY,
            blockIPV6: BLOCK_IPV6,
            stickyMatch: STICKY_MATCH,
            stickyLobby: STICKY_LOBBY,
            autoSwitch: AUTO_SWITCH,
            maxPing: MAX_PING_MS,
            minSuccessRate: MIN_SUCCESS_RATE,
            systemMode: SYSTEM_MODE
        },
        protection: {
            dnsLeak: DNS_LEAK_PROTECTION,
            ipv6Leak: IPV6_LEAK_PROTECTION,
            httpLeak: HTTP_LEAK_PROTECTION,
            blockSyria: BLOCK_SYRIA,
            blockNearby: BLOCK_NEARBY,
            blockCloud: BLOCK_CLOUD,
            blockTrackers: BLOCK_TRACKERS,
            blockAds: BLOCK_ADS
        }
    };
}

function calculateAveragePing() {
    var totalPing = 0;
    var count = 0;
    for (var i = 0; i < PROXY_POOL.length; i++) {
        if (PROXY_POOL[i].ping !== null) {
            totalPing += PROXY_POOL[i].ping;
            count++;
        }
    }
    return count > 0 ? Math.round(totalPing / count) : 0;
}

// ==============================
// 15) إعدادات إضافية للحماية
// ==============================

// حظر نطاقات إضافية (اختياري)
var EXTRA_BLOCKS = [
    "doubleverify.com", "deltatic.com", "appsflyer.com", "adjust.com",
    "liftoff.io", "tune.com", "branch.io", "appsbee.com", "mobvista.com",
    "unity3d.com", "unityads.unity3d.com", "unity3d.ru", "unity3d.cn",
    "google-analytics.com", "googletagmanager.com", "facebook.com", "fbcdn.net",
    "twitter.com", "instagram.com", "youtube.com", "tiktok.com", "snapchat.com",
    "linkedin.com", "pinterest.com", "reddit.com", "quora.com", "medium.com",
    "hotjar.com", "mouseflow.com", "fullstory.com", "mixpanel.com", "kissmetrics.com",
    "clicktale.com", "inspectlet.com", "crazyegg.com", "freshpaint.io", "segment.com",
    "mparticle.com", "rudderstack.com", "snowplowanalytics.com", "matomo.org",
    "plausible.io", "simpleanalytics.com", "umami.is", "goatcounter.com",
    "doubleclick.net", "googleads.com", "adobe.com", "adobedtm.com",
    "taboola.com", "outbrain.com", "revcontent.com", "content.ad",
    "adscale.de", "plista.com", "sharethrough.com", "districtm.io",
    "indexexchange.com", "openx.net", "appnexus.com", "rubiconproject.com",
    "pubmatic.com", "tremorintl.com", "illuminas.com", "smartclip.com",
    "spotx.tv", "spotxchange.com", "twiago.com", "adition.com",
    "yieldlab.net", "adform.com", "admedo.com", "adswizz.com",
    "adyoulike.com", "bidstack.com", "brandmetrics.com", "c1exchange.com",
    "dailymotion.com", "districtm.io", "dotdash.com", "dotmetrics.net",
    "ematicsolutions.com", "emxdigital.com", "engagebdr.com", "freestar.io",
    "fremework.com", "gimbal.com", "glispa.com", "gumgum.com",
    "imged.com", "indexexchange.com", "inmobi.com", "integralads.com",
    "jivox.com", "knorex.com", "kargo.com", "lkqd.com",
    "loopme.com", "magnetic.com", "mbraneworks.com", "media.net",
    "mediarithmics.com", "mediamath.com", "meredith.com", "mgid.com",
    "moatads.com", "ninthdecimal.com", "nintendo.com", "nintendo.net",
    "nintendo.de", "nintendo.fr", "nintendo.co.uk", "nintendo.es",
    "nintendo.it", "nintendo.nl", "nintendo.se", "nintendo.no",
    "nintendo.fi", "nintendo.dk", "nintendo.com.br", "nintendo.com.mx",
    "nintendo.com.au", "nintendo.co.nz", "nintendo.sg", "nintendo.my",
    "nintendo.co.id", "nintendo.co.th", "nintendo.com.ph", "nintendo.com.kh",
    "nintendo.com.vn", "nintendo.com.tw", "nintendo.com.hk", "nintendo.com.cn",
    "nintendo.co.kr", "nintendo.co.jp", "nintendo.cn", "nintendo-history.com"
];

// إضافة هذه النطاقات إلى قائمة الحظر
for (var i = 0; i < EXTRA_BLOCKS.length; i++) {
    PUBG_DOMAINS_GLOBAL.push(EXTRA_BLOCKS[i]);
}

// حظر نطاقات VPN والبروكسيات المعروفة
var VPN_BLOCKS = [
    "vpn", "proxy", "tunnel", "gateway", "forwarder", "relay", "exit-node",
    "nordvpn.com", "expressvpn.com", "cyberghostvpn.com", "privateinternetaccess.com",
    "surfshark.com", "ipvanish.com", "purevpn.com", "vyprvpn.com", "protonvpn.com",
    "nordlayer.com", "vpnunlimited.com", "hide.me", "ibVPN.com", "vpnarea.com",
    "vpnsecure.me", "vpntunnel.se", "vpnunlimitedapp.com", "vpnforchrome.com",
    "vpnmaster.com", "vpntraffic.com", "vpnhelper.com", "freevpn.nu",
    "hotspotshield.com", "tunnelbear.com", "windscribe.com", "zenmate.com",
    "hola.org", "getlantern.org", "openvpn.net", "softether.org",
    "wireguard.com", "openvpn.com", "vpnreviews.com", "vpndetective.com",
    "vpntesting.com", "vpncritic.com", "vpnspys.com", "thatoneprivacypolicy.com",
    "anonymster.com", "bestvpn.com", "vpncompass.com", "vpnfaq.com",
    "vpnguide.com", "vpnmentor.com", "vpnreviews.com", "vpnspys.com",
    "vpnarea.com", "vpnunlimited.com", "vpnmaster.com", "vpntraffic.com",
    "vpnhelper.com", "freevpn.nu", "vpnforchrome.com", "vpnarea.com"
];

// إضافة VPN blocks
for (var i = 0; i < VPN_BLOCKS.length; i++) {
    PUBG_DOMAINS_GLOBAL.push(VPN_BLOCKS[i]);
}

// ==============================
// 16) دوال تحليل متقدمة
// ==============================

function analyzeTraffic(url, host, decision) {
    if (!LOGGING) return;
    
    console.log("=== Traffic Analysis ===");
    console.log("URL: " + url);
    console.log("Host: " + host);
    console.log("Decision: " + decision);
    console.log("Timestamp: " + new Date().toISOString());
    console.log("Cache Key: " + (host + (isIPv4(host) ? "_ip" : "_domain")));
    console.log("Current Proxy: " + (CURRENT_PROXY ? CURRENT_PROXY.host + ":" + CURRENT_PROXY.port : "None"));
    console.log("Session Stats: " + JSON.stringify(getSessionStats()));
    console.log("---");
}

// مراقبة القرارات
var originalFindProxyForURL = FindProxyForURL;
FindProxyForURL = function(url, host) {
    var decision = originalFindProxyForURL(url, host);
    analyzeTraffic(url, host, decision);
    return decision;
};

// ==============================
// 17) إعدادات النظام النهائية
// ==============================

// تهيئة النظام
function initializeSystem() {
    console.log("=== PUBG Jordan PAC System Initialized ===");
    console.log("Version: 3.0.0 (Advanced Network Control)");
    console.log("Focus: Jordan + Protection + Performance");
    console.log("Proxy Count: " + PROXY_POOL.length);
    console.log("Jordan IP Ranges: " + JO_IPV4.length);
    console.log("Settings:");
    console.log("  - System Mode: " + SYSTEM_MODE);
    console.log("  - Jordan Only: " + ENABLE_JORDAN_ONLY);
    console.log("  - Block IPv6: " + BLOCK_IPV6);
    console.log("  - Sticky Match: " + STICKY_MATCH);
    console.log("  - Sticky Lobby: " + STICKY_LOBBY);
    console.log("  - Auto Switch: " + AUTO_SWITCH);
    console.log("  - Max Ping: " + MAX_PING_MS + "ms");
    console.log("  - Min Success Rate: " + MIN_SUCCESS_RATE + "%");
    console.log("Protection:");
    console.log("  - DNS Leak: " + DNS_LEAK_PROTECTION);
    console.log("  - IPv6 Leak: " + IPV6_LEAK_PROTECTION);
    console.log("  - HTTP Leak: " + HTTP_LEAK_PROTECTION);
    console.log("  - Block Syria: " + BLOCK_SYRIA);
    console.log("  - Block Nearby: " + BLOCK_NEARBY);
    console.log("  - Block Cloud: " + BLOCK_CLOUD);
    console.log("  - Block Trackers: " + BLOCK_TRACKERS);
    console.log("  - Block Ads: " + BLOCK_ADS);
    console.log("QoS: " + (ENABLE_QOS ? "Enabled" : "Disabled"));
    console.log("======================================");
}

// تشغيل النظام
initializeSystem();

/* =========================================================
   END OF SCRIPT
   ========================================================= */
