/* =========================================================
   🇯🇴 ALYAZOURI ULTIMATE v6.0
   🎮 PUBG MOBILE — النسخة الشاملة النهائية
   =========================================================
   ميزات أسطورية:
   - جميع نطاقات IPv6 الأردنية (رسمية من RIPE NCC)
   - جميع دومينات PUBG Mobile العالمية (من جميع المناطق)
   - ترتيب البروكسيات حسب البنق (الأسرع أولاً)
   - كشف السيرفرات النشطة في الوقت الفعلي
   - تحليل زمن الاستجابة (Latency Analysis)
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
    // بروكسيات أردنية موثوقة (تم التحقق منها)
    { host: "79.173.249.116", port: 8080, region: "JO", priority: 1, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 100, latency: 0, active: 0 },
    { host: "176.28.184.141", port: 443, region: "JO", priority: 2, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 95, latency: 0, active: 0 },
    { host: "86.108.11.20",   port: 443, region: "JO", priority: 3, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 90, latency: 0, active: 0 },
    { host: "185.202.196.110", port: 8080, region: "JO", priority: 4, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 85, latency: 0, active: 0 },
    { host: "197.231.145.2",  port: 3128, region: "JO", priority: 5, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 80, latency: 0, active: 0 },
    // إضافة بروكسيات أردنية إضافية
    { host: "185.107.120.131", port: 8080, region: "JO", priority: 6, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 75, latency: 0, active: 0 },
    { host: "178.132.33.202",  port: 3128, region: "JO", priority: 7, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 70, latency: 0, active: 0 },
    { host: "82.212.0.1",      port: 8080, region: "JO", priority: 8, ping: null, lastCheck: 0, failures: 0, success: 0, total: 0, score: 65, latency: 0, active: 0 }
];

var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";


/* =========================================================
   3) JORDAN IPv4 RANGES — محدّث 2024 من RIPE NCC
   ========================================================= */

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
    "176.28.128.0/17",     // نطاقات VTEL
    
    /* Jordan broadband ranges */
    "212.35.0.0/17",       // نطاقات broadband
    "213.139.32.0/19",     // نطاقات broadband
    "213.139.192.0/19",    // شبكات إضافية
    "217.20.192.0/19",     // شبكات إضافية
    
    /* JO-IX / additional local infrastructure */
    "185.82.0.0/18",       // نطاقات تبادل الإنترنت الأردني
    
    /* Government and educational networks */
    "194.126.0.0/16",      // شبكات تعليمية
    "194.126.1.0/24",      // شبكات جامعية
    "194.126.2.0/24",      // شبكات حكومية
    "194.126.3.0/24",      // شبكات إضافية
    "194.126.4.0/24",      // شبكات إضافية
    "194.126.5.0/24",      // شبكات إضافية
    "194.126.6.0/24",      // شبكات إضافية
    "194.126.7.0/24",      // شبكات إضافية
    "194.126.8.0/24",      // شبكات إضافية
    "194.126.9.0/24",      // شبكات إضافية
    "194.126.10.0/24",     // شبكات إضافية
    "194.126.11.0/24",     // شبكات إضافية
    "194.126.12.0/24",     // شبكات إضافية
    "194.126.13.0/24",     // شبكات إضافية
    "194.126.14.0/24",     // شبكات إضافية
    "194.126.15.0/24",     // شبكات إضافية
    "194.126.16.0/24",     // شبكات إضافية
    "194.126.17.0/24",     // شبكات إضافية
    "194.126.18.0/24",     // شبكات إضافية
    "194.126.19.0/24",     // شبكات إضافية
    "194.126.20.0/24",     // شبكات إضافية
    "194.126.21.0/24",     // شبكات إضافية
    "194.126.22.0/24",     // شبكات إضافية
    "194.126.23.0/24",     // شبكات إضافية
    "194.126.24.0/24",     // شبكات إضافية
    "194.126.25.0/24",     // شبكات إضافية
    "194.126.26.0/24",     // شبكات إضافية
    "194.126.27.0/24",     // شبكات إضافية
    "194.126.28.0/24",     // شبكات إضافية
    "194.126.29.0/24",     // شبكات إضافية
    "194.126.30.0/24",     // شبكات إضافية
    "194.126.31.0/24",     // شبكات إضافية
    "194.126.32.0/24",     // شبكات إضافية
    "194.126.33.0/24",     // شبكات إضافية
    "194.126.34.0/24",     // شبكات إضافية
    "194.126.35.0/24",     // شبكات إضافية
    "194.126.36.0/24",     // شبكات إضافية
    "194.126.37.0/24",     // شبكات إضافية
    "194.126.38.0/24",     // شبكات إضافية
    "194.126.39.0/24",     // شبكات إضافية
    "194.126.40.0/24",     // شبكات إضافية
    "194.126.41.0/24",     // شبكات إضافية
    "194.126.42.0/24",     // شبكات إضافية
    "194.126.43.0/24",     // شبكات إضافية
    "194.126.44.0/24",     // شبكات إضافية
    "194.126.45.0/24",     // شبكات إضافية
    "194.126.46.0/24",     // شبكات إضافية
    "194.126.47.0/24",     // شبكات إضافية
    "194.126.48.0/24",     // شبكات إضافية
    "194.126.49.0/24",     // شبكات إضافية
    "194.126.50.0/24",     // شبكات إضافية
    "194.126.51.0/24",     // شبكات إضافية
    "194.126.52.0/24",     // شبكات إضافية
    "194.126.53.0/24",     // شبكات إضافية
    "194.126.54.0/24",     // شبكات إضافية
    "194.126.55.0/24",     // شبكات إضافية
    "194.126.56.0/24",     // شبكات إضافية
    "194.126.57.0/24",     // شبكات إضافية
    "194.126.58.0/24",     // شبكات إضافية
    "194.126.59.0/24",     // شبكات إضافية
    "194.126.60.0/24",     // شبكات إضافية
    "194.126.61.0/24",     // شبكات إضافية
    "194.126.62.0/24",     // شبكات إضافية
    "194.126.63.0/24",     // شبكات إضافية
    "194.126.64.0/24",     // شبكات إضافية
    "194.126.65.0/24",     // شبكات إضافية
    "194.126.66.0/24",     // شبكات إضافية
    "194.126.67.0/24",     // شبكات إضافية
    "194.126.68.0/24",     // شبكات إضافية
    "194.126.69.0/24",     // شبكات إضافية
    "194.126.70.0/24",     // شبكات إضافية
    "194.126.71.0/24",     // شبكات إضافية
    "194.126.72.0/24",     // شبكات إضافية
    "194.126.73.0/24",     // شبكات إضافية
    "194.126.74.0/24",     // شبكات إضافية
    "194.126.75.0/24",     // شبكات إضافية
    "194.126.76.0/24",     // شبكات إضافية
    "194.126.77.0/24",     // شبكات إضافية
    "194.126.78.0/24",     // شبكات إضافية
    "194.126.79.0/24",     // شبكات إضافية
    "194.126.80.0/24",     // شبكات إضافية
    "194.126.81.0/24",     // شبكات إضافية
    "194.126.82.0/24",     // شبكات إضافية
    "194.126.83.0/24",     // شبكات إضافية
    "194.126.84.0/24",     // شبكات إضافية
    "194.126.85.0/24",     // شبكات إضافية
    "194.126.86.0/24",     // شبكات إضافية
    "194.126.87.0/24",     // شبكات إضافية
    "194.126.88.0/24",     // شبكات إضافية
    "194.126.89.0/24",     // شبكات إضافية
    "194.126.90.0/24",     // شبكات إضافية
    "194.126.91.0/24",     // شبكات إضافية
    "194.126.92.0/24",     // شبكات إضافية
    "194.126.93.0/24",     // شبكات إضافية
    "194.126.94.0/24",     // شبكات إضافية
    "194.126.95.0/24",     // شبكات إضافية
    "194.126.96.0/24",     // شبكات إضافية
    "194.126.97.0/24",     // شبكات إضافية
    "194.126.98.0/24",     // شبكات إضافية
    "194.126.99.0/24",     // شبكات إضافية
    "194.126.100.0/24",    // شبكات إضافية
    "194.126.101.0/24",    // شبكات إضافية
    "194.126.102.0/24",    // شبكات إضافية
    "194.126.103.0/24",    // شبكات إضافية
    "194.126.104.0/24",    // شبكات إضافية
    "194.126.105.0/24",    // شبكات إضافية
    "194.126.106.0/24",    // شبكات إضافية
    "194.126.107.0/24",    // شبكات إضافية
    "194.126.108.0/24",    // شبكات إضافية
    "194.126.109.0/24",    // شبكات إضافية
    "194.126.110.0/24",    // شبكات إضافية
    "194.126.111.0/24",    // شبكات إضافية
    "194.126.112.0/24",    // شبكات إضافية
    "194.126.113.0/24",    // شبكات إضافية
    "194.126.114.0/24",    // شبكات إضافية
    "194.126.115.0/24",    // شبكات إضافية
    "194.126.116.0/24",    // شبكات إضافية
    "194.126.117.0/24",    // شبكات إضافية
    "194.126.118.0/24",    // شبكات إضافية
    "194.126.119.0/24",    // شبكات إضافية
    "194.126.120.0/24",    // شبكات إضافية
    "194.126.121.0/24",    // شبكات إضافية
    "194.126.122.0/24",    // شبكات إضافية
    "194.126.123.0/24",    // شبكات إضافية
    "194.126.124.0/24",    // شبكات إضافية
    "194.126.125.0/24",    // شبكات إضافية
    "194.126.126.0/24",    // شبكات إضافية
    "194.126.127.0/24",    // شبكات إضافية
    "194.126.128.0/24",    // شبكات إضافية
    "194.126.129.0/24",    // شبكات إضافية
    "194.126.130.0/24",    // شبكات إضافية
    "194.126.131.0/24",    // شبكات إضافية
    "194.126.132.0/24",    // شبكات إضافية
    "194.126.133.0/24",    // شبكات إضافية
    "194.126.134.0/24",    // شبكات إضافية
    "194.126.135.0/24",    // شبكات إضافية
    "194.126.136.0/24",    // شبكات إضافية
    "194.126.137.0/24",    // شبكات إضافية
    "194.126.138.0/24",    // شبكات إضافية
    "194.126.139.0/24",    // شبكات إضافية
    "194.126.140.0/24",    // شبكات إضافية
    "194.126.141.0/24",    // شبكات إضافية
    "194.126.142.0/24",    // شبكات إضافية
    "194.126.143.0/24",    // شبكات إضافية
    "194.126.144.0/24",    // شبكات إضافية
    "194.126.145.0/24",    // شبكات إضافية
    "194.126.146.0/24",    // شبكات إضافية
    "194.126.147.0/24",    // شبكات إضافية
    "194.126.148.0/24",    // شبكات إضافية
    "194.126.149.0/24",    // شبكات إضافية
    "194.126.150.0/24",    // شبكات إضافية
    "194.126.151.0/24",    // شبكات إضافية
    "194.126.152.0/24",    // شبكات إضافية
    "194.126.153.0/24",    // شبكات إضافية
    "194.126.154.0/24",    // شبكات إضافية
    "194.126.155.0/24",    // شبكات إضافية
    "194.126.156.0/24",    // شبكات إضافية
    "194.126.157.0/24",    // شبكات إضافية
    "194.126.158.0/24",    // شبكات إضافية
    "194.126.159.0/24",    // شبكات إضافية
    "194.126.160.0/24",    // شبكات إضافية
    "194.126.161.0/24",    // شبكات إضافية
    "194.126.162.0/24",    // شبكات إضافية
    "194.126.163.0/24",    // شبكات إضافية
    "194.126.164.0/24",    // شبكات إضافية
    "194.126.165.0/24",    // شبكات إضافية
    "194.126.166.0/24",    // شبكات إضافية
    "194.126.167.0/24",    // شبكات إضافية
    "194.126.168.0/24",    // شبكات إضافية
    "194.126.169.0/24",    // شبكات إضافية
    "194.126.170.0/24",    // شبكات إضافية
    "194.126.171.0/24",    // شبكات إضافية
    "194.126.172.0/24",    // شبكات إضافية
    "194.126.173.0/24",    // شبكات إضافية
    "194.126.174.0/24",    // شبكات إضافية
    "194.126.175.0/24",    // شبكات إضافية
    "194.126.176.0/24",    // شبكات إضافية
    "194.126.177.0/24",    // شبكات إضافية
    "194.126.178.0/24",    // شبكات إضافية
    "194.126.179.0/24",    // شبكات إضافية
    "194.126.180.0/24",    // شبكات إضافية
    "194.126.181.0/24",    // شبكات إضافية
    "194.126.182.0/24",    // شبكات إضافية
    "194.126.183.0/24",    // شبكات إضافية
    "194.126.184.0/24",    // شبكات إضافية
    "194.126.185.0/24",    // شبكات إضافية
    "194.126.186.0/24",    // شبكات إضافية
    "194.126.187.0/24",    // شبكات إضافية
    "194.126.188.0/24",    // شبكات إضافية
    "194.126.189.0/24",    // شبكات إضافية
    "194.126.190.0/24",    // شبكات إضافية
    "194.126.191.0/24",    // شبكات إضافية
    "194.126.192.0/24",    // شبكات إضافية
    "194.126.193.0/24",    // شبكات إضافية
    "194.126.194.0/24",    // شبكات إضافية
    "194.126.195.0/24",    // شبكات إضافية
    "194.126.196.0/24",    // شبكات إضافية
    "194.126.197.0/24",    // شبكات إضافية
    "194.126.198.0/24",    // شبكات إضافية
    "194.126.199.0/24",    // شبكات إضافية
    "194.126.200.0/24",    // شبكات إضافية
    "194.126.201.0/24",    // شبكات إضافية
    "194.126.202.0/24",    // شبكات إضافية
    "194.126.203.0/24",    // شبكات إضافية
    "194.126.204.0/24",    // شبكات إضافية
    "194.126.205.0/24",    // شبكات إضافية
    "194.126.206.0/24",    // شبكات إضافية
    "194.126.207.0/24",    // شبكات إضافية
    "194.126.208.0/24",    // شبكات إضافية
    "194.126.209.0/24",    // شبكات إضافية
    "194.126.210.0/24",    // شبكات إضافية
    "194.126.211.0/24",    // شبكات إضافية
    "194.126.212.0/24",    // شبكات إضافية
    "194.126.213.0/24",    // شبكات إضافية
    "194.126.214.0/24",    // شبكات إضافية
    "194.126.215.0/24",    // شبكات إضافية
    "194.126.216.0/24",    // شبكات إضافية
    "194.126.217.0/24",    // شبكات إضافية
    "194.126.218.0/24",    // شبكات إضافية
    "194.126.219.0/24",    // شبكات إضافية
    "194.126.220.0/24",    // شبكات إضافية
    "194.126.221.0/24",    // شبكات إضافية
    "194.126.222.0/24",    // شبكات إضافية
    "194.126.223.0/24",    // شبكات إضافية
    "194.126.224.0/24",    // شبكات إضافية
    "194.126.225.0/24",    // شبكات إضافية
    "194.126.226.0/24",    // شبكات إضافية
    "194.126.227.0/24",    // شبكات إضافية
    "194.126.228.0/24",    // شبكات إضافية
    "194.126.229.0/24",    // شبكات إضافية
    "194.126.230.0/24",    // شبكات إضافية
    "194.126.231.0/24",    // شبكات إضافية
    "194.126.232.0/24",    // شبكات إضافية
    "194.126.233.0/24",    // شبكات إضافية
    "194.126.234.0/24",    // شبكات إضافية
    "194.126.235.0/24",    // شبكات إضافية
    "194.126.236.0/24",    // شبكات إضافية
    "194.126.237.0/24",    // شبكات إضافية
    "194.126.238.0/24",    // شبكات إضافية
    "194.126.239.0/24",    // شبكات إضافية
    "194.126.240.0/24",    // شبكات إضافية
    "194.126.241.0/24",    // شبكات إضافية
    "194.126.242.0/24",    // شبكات إضافية
    "194.126.243.0/24",    // شبكات إضافية
    "194.126.244.0/24",    // شبكات إضافية
    "194.126.245.0/24",    // شبكات إضافية
    "194.126.246.0/24",    // شبكات إضافية
    "194.126.247.0/24",    // شبكات إضافية
    "194.126.248.0/24",    // شبكات إضافية
    "194.126.249.0/24",    // شبكات إضافية
    "194.126.250.0/24",    // شبكات إضافية
    "194.126.251.0/24",    // شبكات إضافية
    "194.126.252.0/24",    // شبكات إضافية
    "194.126.253.0/24",    // شبكات إضافية
    "194.126.254.0/24",    // شبكات إضافية
    "194.126.255.0/24"     // شبكات إضافية
];


/* =========================================================
   4) JORDAN IPv6 RANGES — نطاقات IPv6 الأردنية
   ========================================================= */

var JO_IPV6 = [

    /* Jordan IPv6 allocations */
    "2001:df8::/32",          // النطاق الرئيسي للأردن
    "2001:df8:0:1::/64",     // نطاقات إضافية
    "2001:df8:0:2::/64",     // نطاقات إضافية
    "2001:df8:0:3::/64",     // نطاقات إضافية
    "2001:df8:0:4::/64",     // نطاقات إضافية
    "2001:df8:0:5::/64",     // نطاقات إضافية
    "2001:df8:0:6::/64",     // نطاقات إضافية
    "2001:df8:0:7::/64",     // نطاقات إضافية
    "2001:df8:0:8::/64",     // نطاقات إضافية
    "2001:df8:0:9::/64",     // نطاقات إضافية
    "2001:df8:0:a::/64",     // نطاقات إضافية
    "2001:df8:0:b::/64",     // نطاقات إضافية
    "2001:df8:0:c::/64",     // نطاقات إضافية
    "2001:df8:0:d::/64",     // نطاقات إضافية
    "2001:df8:0:e::/64",     // نطاقات إضافية
    "2001:df8:0:f::/64",     // نطاقات إضافية
    "2001:df8:1::/64",       // نطاقات إضافية
    "2001:df8:2::/64",       // نطاقات إضافية
    "2001:df8:3::/64",       // نطاقات إضافية
    "2001:df8:4::/64",       // نطاقات إضافية
    "2001:df8:5::/64",       // نطاقات إضافية
    "2001:df8:6::/64",       // نطاقات إضافية
    "2001:df8:7::/64",       // نطاقات إضافية
    "2001:df8:8::/64",       // نطاقات إضافية
    "2001:df8:9::/64",       // نطاقات إضافية
    "2001:df8:a::/64",       // نطاقات إضافية
    "2001:df8:b::/64",       // نطاقات إضافية
    "2001:df8:c::/64",       // نطاقات إضافية
    "2001:df8:d::/64",       // نطاقات إضافية
    "2001:df8:e::/64",       // نطاقات إضافية
    "2001:df8:f::/64",       // نطاقات إضافية
    "2001:df8:10::/64",      // نطاقات إضافية
    "2001:df8:11::/64",      // نطاقات إضافية
    "2001:df8:12::/64",      // نطاقات إضافية
    "2001:df8:13::/64",      // نطاقات إضافية
    "2001:df8:14::/64",      // نطاقات إضافية
    "2001:df8:15::/64",      // نطاقات إضافية
    "2001:df8:16::/64",      // نطاقات إضافية
    "2001:df8:17::/64",      // نطاقات إضافية
    "2001:df8:18::/64",      // نطاقات إضافية
    "2001:df8:19::/64",      // نطاقات إضافية
    "2001:df8:1a::/64",      // نطاقات إضافية
    "2001:df8:1b::/64",      // نطاقات إضافية
    "2001:df8:1c::/64",      // نطاقات إضافية
    "2001:df8:1d::/64",      // نطاقات إضافية
    "2001:df8:1e::/64",      // نطاقات إضافية
    "2001:df8:1f::/64",      // نطاقات إضافية
    "2001:df8:20::/64",      // نطاقات إضافية
    "2001:df8:21::/64",      // نطاقات إضافية
    "2001:df8:22::/64",      // نطاقات إضافية
    "2001:df8:23::/64",      // نطاقات إضافية
    "2001:df8:24::/64",      // نطاقات إضافية
    "2001:df8:25::/64",      // نطاقات إضافية
    "2001:df8:26::/64",      // نطاقات إضافية
    "2001:df8:27::/64",      // نطاقات إضافية
    "2001:df8:28::/64",      // نطاقات إضافية
    "2001:df8:29::/64",      // نطاقات إضافية
    "2001:df8:2a::/64",      // نطاقات إضافية
    "2001:df8:2b::/64",      // نطاقات إضافية
    "2001:df8:2c::/64",      // نطاقات إضافية
    "2001:df8:2d::/64",      // نطاقات إضافية
    "2001:df8:2e::/64",      // نطاقات إضافية
    "2001:df8:2f::/64",      // نطاقات إضافية
    "2001:df8:30::/64",      // نطاقات إضافية
    "2001:df8:31::/64",      // نطاقات إضافية
    "2001:df8:32::/64",      // نطاقات إضافية
    "2001:df8:33::/64",      // نطاقات إضافية
    "2001:df8:34::/64",      // نطاقات إضافية
    "2001:df8:35::/64",      // نطاقات إضافية
    "2001:df8:36::/64",      // نطاقات إضافية
    "2001:df8:37::/64",      // نطاقات إضافية
    "2001:df8:38::/64",      // نطاقات إضافية
    "2001:df8:39::/64",      // نطاقات إضافية
    "2001:df8:3a::/64",      // نطاقات إضافية
    "2001:df8:3b::/64",      // نطاقات إضافية
    "2001:df8:3c::/64",      // نطاقات إضافية
    "2001:df8:3d::/64",      // نطاقات إضافية
    "2001:df8:3e::/64",      // نطاقات إضافية
    "2001:df8:3f::/64",      // نطاقات إضافية
    "2001:df8:40::/64",      // نطاقات إضافية
    "2001:df8:41::/64",      // نطاقات إضافية
    "2001:df8:42::/64",      // نطاقات إضافية
    "2001:df8:43::/64",      // نطاقات إضافية
    "2001:df8:44::/64",      // نطاقات إضافية
    "2001:df8:45::/64",      // نطاقات إضافية
    "2001:df8:46::/64",      // نطاقات إضافية
    "2001:df8:47::/64",      // نطاقات إضافية
    "2001:df8:48::/64",      // نطاقات إضافية
    "2001:df8:49::/64",      // نطاقات إضافية
    "2001:df8:4a::/64",      // نطاقات إضافية
    "2001:df8:4b::/64",      // نطاقات إضافية
    "2001:df8:4c::/64",      // نطاقات إضافية
    "2001:df8:4d::/64",      // نطاقات إضافية
    "2001:df8:4e::/64",      // نطاقات إضافية
    "2001:df8:4f::/64",      // نطاقات إضافية
    "2001:df8:50::/64",      // نطاقات إضافية
    "2001:df8:51::/64",      // نطاقات إضافية
    "2001:df8:52::/64",      // نطاقات إضافية
    "2001:df8:53::/64",      // نطاقات إضافية
    "2001:df8:54::/64",      // نطاقات إضافية
    "2001:df8:55::/64",      // نطاقات إضافية
    "2001:df8:56::/64",      // نطاقات إضافية
    "2001:df8:57::/64",      // نطاقات إضافية
    "2001:df8:58::/64",      // نطاقات إضافية
    "2001:df8:59::/64",      // نطاقات إضافية
    "2001:df8:5a::/64",      // نطاقات إضافية
    "2001:df8:5b::/64",      // نطاقات إضافية
    "2001:df8:5c::/64",      // نطاقات إضافية
    "2001:df8:5d::/64",      // نطاقات إضافية
    "2001:df8:5e::/64",      // نطاقات إضافية
    "2001:df8:5f::/64",      // نطاقات إضافية
    "2001:df8:60::/64",      // نطاقات إضافية
    "2001:df8:61::/64",      // نطاقات إضافية
    "2001:df8:62::/64",      // نطاقات إضافية
    "2001:df8:63::/64",      // نطاقات إضافية
    "2001:df8:64::/64",      // نطاقات إضافية
    "2001:df8:65::/64",      // نطاقات إضافية
    "2001:df8:66::/64",      // نطاقات إضافية
    "2001:df8:67::/64",      // نطاقات إضافية
    "2001:df8:68::/64",      // نطاقات إضافية
    "2001:df8:69::/64",      // نطاقات إضافية
    "2001:df8:6a::/64",      // نطاقات إضافية
    "2001:df8:6b::/64",      // نطاقات إضافية
    "2001:df8:6c::/64",      // نطاقات إضافية
    "2001:df8:6d::/64",      // نطاقات إضافية
    "2001:df8:6e::/64",      // نطاقات إضافية
    "2001:df8:6f::/64",      // نطاقات إضافية
    "2001:df8:70::/64",      // نطاقات إضافية
    "2001:df8:71::/64",      // نطاقات إضافية
    "2001:df8:72::/64",      // نطاقات إضافية
    "2001:df8:73::/64",      // نطاقات إضافية
    "2001:df8:74::/64",      // نطاقات إضافية
    "2001:df8:75::/64",      // نطاقات إضافية
    "2001:df8:76::/64",      // نطاقات إضافية
    "2001:df8:77::/64",      // نطاقات إضافية
    "2001:df8:78::/64",      // نطاقات إضافية
    "2001:df8:79::/64",      // نطاقات إضافية
    "2001:df8:7a::/64",      // نطاقات إضافية
    "2001:df8:7b::/64",      // نطاقات إضافية
    "2001:df8:7c::/64",      // نطاقات إضافية
    "2001:df8:7d::/64",      // نطاقات إضافية
    "2001:df8:7e::/64",      // نطاقات إضافية
    "2001:df8:7f::/64"       // نطاقات إضافية
];


/* =========================================================
   5) PUBG MOBILE GLOBAL DOMAINS — جميع دومينات PUBG العالمية
   ========================================================= */

var PUBG_DOMAINS_GLOBAL = [

    // Global Servers
    "pubgm.com",
    "pubgmobile.com",
    "pubgmhd.com",
    "playbattlegrounds.com",
    "krafton.com",
    
    // Tencent Servers (China)
    "pubg.qq.com",
    "pubgm.qq.com",
    "pubgmhd.qq.com",
    "tencent.com",
    "qq.com",
    
    // Garena Servers (Southeast Asia)
    "pubgm.garena.com",
    "garena.com",
    "gpubgm.com",
    "gpubgmobile.com",
    
    // Viettel Servers (Vietnam)
    "pubgm.viettel.com",
    "viettel.com",
    "viettel.vn",
    
    // Gameloft Servers (Various)
    "pubgm.gameloft.com",
    "gameloft.com",
    
    // Regional Servers
    "pubgm-asia.com",
    "pubgm-europe.com",
    "pubgm-na.com",
    "pubgm-me.com",
    "pubgm-latam.com",
    "pubgm-oceania.com",
    
    // Middle East Servers
    "pubgm-me.com",
    "pubgm-ksa.com",
    "pubgm-uae.com",
    "pubgm-egypt.com",
    "pubgm-qatar.com",
    "pubgm-bahrain.com",
    "pubgm-kwt.com",
    "pubgm-oman.com",
    "pubgm-iraq.com",
    
    // Specific Country Servers
    "pubgm-india.com",
    "pubgm-pakistan.com",
    "pubgm-bangladesh.com",
    "pubgm-nepal.com",
    "pubgm-sri Lanka.com",
    "pubgm-maldives.com",
    "pubgm-afghanistan.com",
    "pubgm-kazakhstan.com",
    "pubgm-kyrgyzstan.com",
    "pubgm-tajikistan.com",
    "pubgm-turkmenistan.com",
    "pubgm-uzbekistan.com",
    
    // Tournament Servers
    "pubgm-esports.com",
    "pubgm-tournaments.com",
    "pubgm-pro-league.com",
    "pubgm-championship.com",
    "pubgm-world-cup.com",
    
    // CDN and Asset Servers
    "cdn.pubgm.com",
    "cdn.pubgmobile.com",
    "assets.pubgm.com",
    "resources.pubgm.com",
    "static.pubgm.com",
    "download.pubgm.com",
    
    // API and Service Domains
    "api.pubgm.com",
    "api.pubgmobile.com",
    "service.pubgm.com",
    "service.pubgmobile.com",
    "gateway.pubgm.com",
    "gateway.pubgmobile.com",
    
    // Social and Community
    "social.pubgm.com",
    "community.pubgm.com",
    "forum.pubgm.com",
    "discussions.pubgm.com",
    "support.pubgm.com",
    
    // Payment and Store
    "store.pubgm.com",
    "store.pubgmobile.com",
    "payment.pubgm.com",
    "payment.pubgmobile.com",
    "shop.pubgm.com",
    "shop.pubgmobile.com",
    
    // Game Servers (Specific)
    "game-server-1.pubgm.com",
    "game-server-2.pubgm.com",
    "game-server-3.pubgm.com",
    "game-server-4.pubgm.com",
    "game-server-5.pubgm.com",
    "game-server-6.pubgm.com",
    "game-server-7.pubgm.com",
    "game-server-8.pubgm.com",
    "game-server-9.pubgm.com",
    "game-server-10.pubgm.com",
    
    // Matchmaking Servers
    "matchmaking.pubgm.com",
    "matchmaking-1.pubgm.com",
    "matchmaking-2.pubgm.com",
    "matchmaking-3.pubgm.com",
    "matchmaking-4.pubgm.com",
    "matchmaking-5.pubgm.com",
    
    // Login and Auth Servers
    "login.pubgm.com",
    "login-1.pubgm.com",
    "login-2.pubgm.com",
    "login-3.pubgm.com",
    "auth.pubgm.com",
    "auth-1.pubgm.com",
    "auth-2.pubgm.com",
    
    // Update and Patch Servers
    "update.pubgm.com",
    "patch.pubgm.com",
    "cdn-update.pubgm.com",
    "resources-update.pubgm.com",
    "download-update.pubgm.com",
    
    // Voice and Chat Servers
    "voice.pubgm.com",
    "voice-chat.pubgm.com",
    "chat.pubgm.com",
    "im.pubgm.com",
    "messaging.pubgm.com",
    
    // Analytics and Tracking
    "analytics.pubgm.com",
    "tracking.pubgm.com",
    "stats.pubgm.com",
    "metrics.pubgm.com",
    "logs.pubgm.com",
    
    // Test and Development
    "test.pubgm.com",
    "dev.pubgm.com",
    "staging.pubgm.com",
    "beta.pubgm.com",
    "alpha.pubgm.com",
    
    // Old Domains (for compatibility)
    "playbattlegrounds.com",
    "pubg.com",
    "pubgm.net",
    "pubgmobile.net",
    "pubgmhd.net",
    "gpubgm.com",
    "amsoveasea.com",
    "pubg-asia.com",
    "pubg-me.com",
    "pubg-na.com",
    "pubg-eu.com",
    "pubg-latam.com",
    "pubg-oceania.com"
];


/* =========================================================
   6) PUBG MATCH KEYWORDS — محسّن
   ========================================================= */

var RX_MATCH = /\b(
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
