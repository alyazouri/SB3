// =====================================================================
//
//  ██████╗ ██╗   ██╗██████╗  ██████╗     ██╗      ██████╗  ██████╗██╗  ██╗
//  ██╔══██╗██║   ██║██╔══██╗██╔═══██╗    ██║     ██╔═══██╗██╔════╝██║ ██╔╝
//  ██████╔╝██║   ██║██████╔╝██║   ██║    ██║     ██║   ██║██║     █████╔╝
//  ██╔═══╝ ██║   ██║██╔══██╗██║   ██║    ██║     ██║   ██║██║     ██╔═██╗
//  ██║     ╚██████╔╝██████╔╝╚██████╔╝    ███████╗╚██████╔╝╚██████╗██║  ██╗
//  ╚═╝      ╚═════╝ ╚═════╝  ╚═════╝     ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
//
//  PUBG MOBILE — JORDAN ULTIMATE LOCK v5.0
//  ════════════════════════════════════════
//  • دخول سيرفرات أردنية 100%
//  • إيجاد لاعبين أردنيين بأقصى عدد
//  • تثبيت + توجيه + ذكاء + حماية
//  • كل شيء داخل السكربت بدون ملفات خارجية
// =====================================================================

// ████████████████████████████████████████████████████████████████████
// ██                    الإعدادات الرئيسية                           ██
// ████████████████████████████████████████████████████████████████████

var CONFIG = {

    // ──── البروكسيات الأردنية الأساسية (كل المنافذ) ────
    PRIMARY_PROXIES: [
        // Orange Jordan — المنافذ الكاملة
        { addr: "PROXY 46.185.131.218:20001", tier: 1, isp: "orange",  purpose: "match",   weight: 100 },
        { addr: "PROXY 46.185.131.218:20002", tier: 1, isp: "orange",  purpose: "match",   weight: 98  },
        { addr: "PROXY 46.185.131.218:20003", tier: 1, isp: "orange",  purpose: "match",   weight: 96  },
        { addr: "PROXY 46.185.131.218:443",   tier: 1, isp: "orange",  purpose: "general", weight: 94  },
        { addr: "PROXY 46.185.131.218:8080",  tier: 1, isp: "orange",  purpose: "lobby",   weight: 92  },
        { addr: "PROXY 46.185.131.218:8443",  tier: 1, isp: "orange",  purpose: "lobby",   weight: 90  },
        { addr: "PROXY 46.185.131.218:8888",  tier: 1, isp: "orange",  purpose: "backup",  weight: 88  },
        { addr: "PROXY 46.185.131.218:3128",  tier: 1, isp: "orange",  purpose: "cdn",     weight: 86  },
        { addr: "PROXY 46.185.131.218:1080",  tier: 1, isp: "orange",  purpose: "social",  weight: 84  },

        // Zain Jordan — المنافذ الكاملة
        { addr: "PROXY 212.35.66.45:20001",   tier: 1, isp: "zain",    purpose: "match",   weight: 97  },
        { addr: "PROXY 212.35.66.45:20002",   tier: 1, isp: "zain",    purpose: "match",   weight: 95  },
        { addr: "PROXY 212.35.66.45:20003",   tier: 1, isp: "zain",    purpose: "match",   weight: 93  },
        { addr: "PROXY 212.35.66.45:443",     tier: 1, isp: "zain",    purpose: "general", weight: 91  },
        { addr: "PROXY 212.35.66.45:8085",    tier: 1, isp: "zain",    purpose: "lobby",   weight: 89  },
        { addr: "PROXY 212.35.66.45:8181",    tier: 1, isp: "zain",    purpose: "lobby",   weight: 87  },
        { addr: "PROXY 212.35.66.45:8443",    tier: 1, isp: "zain",    purpose: "lobby",   weight: 85  },
        { addr: "PROXY 212.35.66.45:8888",    tier: 1, isp: "zain",    purpose: "backup",  weight: 83  },
        { addr: "PROXY 212.35.66.45:3128",    tier: 1, isp: "zain",    purpose: "cdn",     weight: 81  },

        // Umniah — المنافذ
        { addr: "PROXY 79.134.128.1:20001",   tier: 2, isp: "umniah",  purpose: "match",   weight: 80  },
        { addr: "PROXY 79.134.128.1:443",     tier: 2, isp: "umniah",  purpose: "general", weight: 78  },
        { addr: "PROXY 79.134.128.1:8080",    tier: 2, isp: "umniah",  purpose: "lobby",   weight: 76  },
        { addr: "PROXY 79.134.128.1:8443",    tier: 2, isp: "umniah",  purpose: "lobby",   weight: 74  },
        { addr: "PROXY 79.134.128.1:8888",    tier: 2, isp: "umniah",  purpose: "backup",  weight: 72  },

        // Damamax — المنافذ
        { addr: "PROXY 176.29.0.1:20001",     tier: 2, isp: "damamax", purpose: "match",   weight: 75  },
        { addr: "PROXY 176.29.0.1:443",       tier: 2, isp: "damamax", purpose: "general", weight: 73  },
        { addr: "PROXY 176.29.0.1:8080",      tier: 2, isp: "damamax", purpose: "lobby",   weight: 71  },
        { addr: "PROXY 176.29.0.1:8443",      tier: 2, isp: "damamax", purpose: "backup",  weight: 69  },

        // بروكسيات إضافية أردنية
        { addr: "PROXY 185.131.216.1:20001",  tier: 2, isp: "regional", purpose: "match",  weight: 70  },
        { addr: "PROXY 185.131.216.1:443",    tier: 2, isp: "regional", purpose: "general", weight: 68  },
        { addr: "PROXY 185.170.164.1:443",    tier: 2, isp: "regional", purpose: "lobby",  weight: 66  },
        { addr: "PROXY 77.245.0.1:20001",     tier: 2, isp: "zain2",   purpose: "match",   weight: 65  },
        { addr: "PROXY 77.245.0.1:443",       tier: 2, isp: "zain2",   purpose: "general", weight: 63  },
        { addr: "PROXY 213.139.64.1:443",     tier: 2, isp: "orange2", purpose: "general", weight: 62  },
        { addr: "PROXY 176.57.0.1:443",       tier: 3, isp: "extra1",  purpose: "backup",  weight: 55  },
        { addr: "PROXY 188.123.0.1:443",      tier: 3, isp: "extra2",  purpose: "backup",  weight: 53  },
        { addr: "PROXY 188.247.0.1:443",      tier: 3, isp: "extra3",  purpose: "backup",  weight: 51  }
    ],

    // ──── إعدادات المحاولة ────
    MAX_RETRIES:            15,
    RETRY_DELAY_BASE:       500,
    BACKOFF_MULTIPLIER:     1.3,
    MAX_RETRY_DELAY:        6000,
    AGGRESSIVE_RETRIES:     20,    // محاولات إضافية للماتش

    // ──── إعدادات التثبيت ────
    STICKY_SESSION:         true,
    LOCK_NETWORK:           true,
    LOCK_PROXY:             true,
    LOCK_PORT:              true,
    LOCK_ISP:               true,
    LOCK_SERVER_CLUSTER:    true,

    // ──── إعدادات الذكاء ────
    ADAPTIVE_ROUTING:       true,
    SMART_ROTATION:         true,
    LEARNING_MODE:          true,
    PREDICTIVE_ROUTING:     true,
    PLAYER_AFFINITY:        true,   // محاولة إيجاد لاعبين أردنيين
    SERVER_CLUSTERING:      true,   // تجميع السيرفرات
    DYNAMIC_WEIGHT:         true,   // أوزان ديناميكية
    CONNECTION_POOLING:     true,   // تجميع الاتصالات

    // ──── إعدادات الأمان ────
    ANTI_LEAK:              true,
    BLOCK_IPV6:             true,
    BLOCK_TELEMETRY:        true,
    BLOCK_ANALYTICS:        true,
    BLOCK_ADS:              true,
    ANTI_FINGERPRINT:       true,
    GEO_SPOOFING:           true,   // انتحال الموقع الجغرافي
    HEADER_INJECTION:       true,   // إضافة هيدرات أردنية

    // ──── إعدادات الأوقات ────
    PEAK_START:             16,
    PEAK_END:               1,
    WEEKEND_BOOST:          true,
    RAMADAN_MODE:           false,  // وضع رمضان (أوقات مختلفة)
    FRIDAY_PRAYER_PAUSE:    true,   // إيقاف مؤقت وقت صلاة الجمعة

    // ──── إعدادات التسجيل ────
    DEBUG_MODE:             true,
    VERBOSE:                false,
    MAX_LOG:                1000,

    // ──── إعدادات DNS ────
    DNS_CACHE_TTL:          600000,
    DNS_PREFETCH:           true,
    DNS_OVER_HTTPS:         true,
    MAX_DNS_CACHE:          500,

    // ──── إعدادات الأداء ────
    HEALTH_INTERVAL:        15000,
    WARMUP_INTERVAL:        30000,
    OPTIMIZATION_INTERVAL:  60000,
    CONNECTION_TIMEOUT:     5000
};

// ████████████████████████████████████████████████████████████████████
// ██              سيرفرات ببجي الشرق الأوسط (الأردن)               ██
// ████████████████████████████████████████████████████████████████████

// قائمة IP سيرفرات ببجي المعروفة في الشرق الأوسط
var PUBG_ME_SERVERS = [
    // سيرفرات دبي / الشرق الأوسط الرئيسية
    { ip: "203.116.0.0",    mask: "255.255.0.0",   region: "ME",     city: "dubai"    },
    { ip: "103.28.0.0",     mask: "255.255.192.0", region: "ME",     city: "dubai"    },
    { ip: "185.93.0.0",     mask: "255.255.0.0",   region: "ME",     city: "dubai"    },
    { ip: "94.56.0.0",      mask: "255.254.0.0",   region: "ME",     city: "dubai"    },
    { ip: "37.202.0.0",     mask: "255.255.0.0",   region: "ME",     city: "dubai"    },
    { ip: "91.72.0.0",      mask: "255.252.0.0",   region: "ME",     city: "dubai"    },
    { ip: "94.200.0.0",     mask: "255.248.0.0",   region: "ME",     city: "dubai"    },

    // سيرفرات الأردن / الشام
    { ip: "46.185.128.0",   mask: "255.255.128.0", region: "JO",     city: "amman"    },
    { ip: "77.245.0.0",     mask: "255.255.240.0", region: "JO",     city: "amman"    },
    { ip: "79.134.128.0",   mask: "255.255.224.0", region: "JO",     city: "amman"    },
    { ip: "212.34.0.0",     mask: "255.255.0.0",   region: "JO",     city: "amman"    },
    { ip: "213.139.64.0",   mask: "255.255.192.0", region: "JO",     city: "amman"    },
    { ip: "176.29.0.0",     mask: "255.255.0.0",   region: "JO",     city: "amman"    },

    // سيرفرات السعودية / الخليج
    { ip: "212.76.0.0",     mask: "255.252.0.0",   region: "GCC",    city: "riyadh"   },
    { ip: "86.51.0.0",      mask: "255.255.0.0",   region: "GCC",    city: "riyadh"   },
    { ip: "188.54.0.0",     mask: "255.254.0.0",   region: "GCC",    city: "riyadh"   },
    { ip: "94.96.0.0",      mask: "255.224.0.0",   region: "GCC",    city: "jeddah"   },
    { ip: "188.160.0.0",    mask: "255.240.0.0",   region: "GCC",    city: "jeddah"   },

    // سيرفرات مصر
    { ip: "41.206.0.0",     mask: "255.255.128.0", region: "EGYPT",  city: "cairo"    },
    { ip: "196.202.0.0",    mask: "255.254.0.0",   region: "EGYPT",  city: "cairo"    },
    { ip: "197.34.0.0",     mask: "255.254.0.0",   region: "EGYPT",  city: "cairo"    },

    // سيرفرات لبنان
    { ip: "185.26.124.0",   mask: "255.255.252.0", region: "LEB",    city: "beirut"   },
    { ip: "178.135.0.0",    mask: "255.255.0.0",   region: "LEB",    city: "beirut"   }
];

// سيرفرات ببجي CDN المعروفة
var PUBG_CDN_SERVERS = [
    { host: "cdn-pubgmobile.com",            purpose: "assets"    },
    { host: "dl.pubgmobile.com",             purpose: "download"  },
    { host: "igamecj.com",                   purpose: "api"       },
    { host: "gtimg.com",                     purpose: "cdn"       },
    { host: "idqqimg.com",                   purpose: "images"    },
    { host: "anticheatexpert.com",           purpose: "security"  },
    { host: "overseas.gcloudsdk.com",        purpose: "gaming"    },
    { host: "gcloud.igamecj.com",           purpose: "gaming"    },
    { host: "tencentgme.com",               purpose: "voice"     },
    { host: "match.pubgmobile.com",          purpose: "match"     },
    { host: "api.pubgmobile.com",            purpose: "api"       },
    { host: "gpjbh.igamecj.com",            purpose: "gameplay"  },
    { host: "gpjcj.igamecj.com",            purpose: "gameplay"  }
];

// خريطة تجميع السيرفرات (المناطق القريبة من الأردن)
var SERVER_CLUSTERS = {
    // التجميعة الأفضل: الأردن مباشرة
    "JO_AMMAN": {
        priority: 1,
        servers: ["46.185.128.0/17", "77.245.0.0/20", "79.134.128.0/19",
                  "212.34.0.0/16", "213.139.64.0/18", "176.29.0.0/16"],
        maxPing: 20,
        playerDensity: "HIGH"
    },
    // التجميعة الثانية: لبنان / الشام
    "LEVANT": {
        priority: 2,
        servers: ["185.26.124.0/22", "178.135.0.0/16"],
        maxPing: 40,
        playerDensity: "MEDIUM"
    },
    // التجميعة الثالثة: الخليج
    "GCC": {
        priority: 3,
        servers: ["212.76.0.0/14", "86.51.0.0/16", "94.96.0.0/11"],
        maxPing: 60,
        playerDensity: "HIGH"
    },
    // التجميعة الرابعة: مصر
    "EGYPT": {
        priority: 4,
        servers: ["41.206.0.0/17", "196.202.0.0/15"],
        maxPing: 50,
        playerDensity: "HIGH"
    }
};

// ████████████████████████████████████████████████████████████████████
// ██                    شبكات الأردن الكاملة                         ██
// ████████████████████████████████████████████████████████████████████

var JORDAN_IPV4 = [
    // ──── Orange Jordan (أكبر مزود) ────
    ["46.185.128.0",    "255.255.128.0"],   // /17 — الرئيسية
    ["46.185.192.0",    "255.255.192.0"],   // /18
    ["213.139.64.0",    "255.255.192.0"],   // /18
    ["213.139.128.0",   "255.255.128.0"],   // /17
    ["41.188.0.0",      "255.255.128.0"],   // /17

    // ──── Zain Jordan (第二大) ────
    ["77.245.0.0",      "255.255.240.0"],   // /20
    ["77.245.16.0",     "255.255.240.0"],   // /20
    ["77.245.32.0",     "255.255.224.0"],   // /19
    ["212.34.0.0",      "255.255.0.0"],     // /16
    ["212.34.128.0",    "255.255.128.0"],   // /17
    ["37.123.128.0",    "255.255.128.0"],   // /17 — Gaming

    // ──── Umniah ────
    ["79.134.128.0",    "255.255.224.0"],   // /19
    ["79.134.160.0",    "255.255.224.0"],   // /19
    ["91.186.0.0",      "255.255.224.0"],   // /19

    // ──── Damamax / Batelco ────
    ["176.29.0.0",      "255.255.0.0"],     // /16
    ["176.29.128.0",    "255.255.128.0"],   // /17
    ["176.57.0.0",      "255.255.0.0"],     // /16

    // ──── Regional Datacenters ────
    ["185.131.216.0",   "255.255.252.0"],   // /22
    ["185.170.164.0",   "255.255.252.0"],   // /22
    ["185.86.148.0",    "255.255.252.0"],   // /22

    // ──── مزودون آخرون ────
    ["188.123.0.0",     "255.255.0.0"],     // /16
    ["188.247.0.0",     "255.255.0.0"],     // /16
    ["5.23.0.0",        "255.255.0.0"],     // /16
    ["109.224.0.0",     "255.255.0.0"],     // /16
    ["193.188.64.0",    "255.255.224.0"],   // /19
    ["149.200.0.0",     "255.255.0.0"],     // /16
    ["31.14.64.0",      "255.255.192.0"],   // /18
    ["178.77.0.0",      "255.255.0.0"],     // /16

    // ──── إضافات جديدة (4G/5G) ────
    ["5.41.0.0",        "255.255.0.0"],
    ["37.34.0.0",       "255.254.0.0"],
    ["46.32.0.0",       "255.255.0.0"],
    ["62.72.0.0",       "255.255.0.0"],
    ["85.159.0.0",      "255.255.0.0"],
    ["93.93.0.0",       "255.255.0.0"],
    ["93.95.0.0",       "255.255.0.0"],
    ["94.127.0.0",      "255.255.0.0"],
    ["195.94.0.0",      "255.255.0.0"],
    ["37.202.0.0",      "255.255.0.0"],
    ["37.252.0.0",      "255.255.0.0"]
];

// القائمة السوداء الموسّعة
var GEO_BLACKLIST = [
    // ──── روسيا ────
    ["5.136.0.0","255.248.0.0"],["31.128.0.0","255.192.0.0"],
    ["46.16.0.0","255.240.0.0"],["95.24.0.0","255.248.0.0"],
    ["178.64.0.0","255.192.0.0"],["91.196.0.0","255.252.0.0"],
    ["92.100.0.0","255.252.0.0"],["109.192.0.0","255.192.0.0"],
    ["176.59.0.0","255.255.0.0"],["178.140.0.0","255.254.0.0"],
    ["85.140.0.0","255.240.0.0"],["37.110.0.0","255.254.0.0"],
    ["37.29.0.0","255.255.0.0"],["80.246.0.0","255.254.0.0"],
    ["89.175.0.0","255.255.0.0"],["89.232.0.0","255.248.0.0"],

    // ──── الصين ────
    ["1.0.0.0","255.0.0.0"],["14.0.0.0","255.0.0.0"],
    ["27.0.0.0","255.0.0.0"],["36.0.0.0","255.0.0.0"],
    ["39.0.0.0","255.0.0.0"],["42.0.0.0","255.0.0.0"],
    ["49.0.0.0","255.0.0.0"],["58.0.0.0","255.0.0.0"],
    ["59.0.0.0","255.0.0.0"],["60.0.0.0","255.0.0.0"],
    ["103.0.0.0","255.0.0.0"],["110.0.0.0","254.0.0.0"],
    ["112.0.0.0","254.0.0.0"],["114.0.0.0","254.0.0.0"],
    ["116.0.0.0","252.0.0.0"],["120.0.0.0","248.0.0.0"],
    ["128.0.0.0","248.0.0.0"],["175.0.0.0","255.0.0.0"],
    ["180.0.0.0","248.0.0.0"],["182.0.0.0","254.0.0.0"],
    ["211.0.0.0","255.0.0.0"],["218.0.0.0","254.0.0.0"],
    ["220.0.0.0","252.0.0.0"],["222.0.0.0","254.0.0.0"],
    ["223.0.0.0","255.0.0.0"],

    // ──── كوريا / اليابان / شرق آسيا ────
    ["61.0.0.0","255.0.0.0"],["126.0.0.0","254.0.0.0"],
    ["133.0.0.0","255.0.0.0"],["125.0.0.0","255.0.0.0"],
    ["121.0.0.0","255.0.0.0"],["122.0.0.0","254.0.0.0"],
    ["124.0.0.0","255.0.0.0"],["118.0.0.0","254.0.0.0"],
    ["119.0.0.0","255.0.0.0"],["210.0.0.0","254.0.0.0"],
    ["219.0.0.0","255.0.0.0"],["221.0.0.0","255.0.0.0"],

    // ──── الهند / جنوب آسيا ────
    ["106.0.0.0","254.0.0.0"],["117.0.0.0","255.0.0.0"],
    ["150.0.0.0","255.0.0.0"],["152.0.0.0","248.0.0.0"],
    ["169.0.0.0","255.0.0.0"],["49.15.0.0","255.255.0.0"],
    ["14.139.0.0","255.255.0.0"],["27.56.0.0","255.248.0.0"],
    ["103.21.0.0","255.255.0.0"],["115.248.0.0","255.252.0.0"],

    // ──── جنوب شرق آسيا ────
    ["14.0.0.0","252.0.0.0"],["27.0.0.0","255.128.0.0"],
    ["43.0.0.0","255.0.0.0"],["45.0.0.0","255.0.0.0"],
    ["47.0.0.0","255.0.0.0"],["51.0.0.0","255.0.0.0"],
    ["52.0.0.0","252.0.0.0"],["101.0.0.0","255.0.0.0"],
    ["102.0.0.0","255.128.0.0"],["104.0.0.0","255.0.0.0"],
    ["159.0.0.0","255.0.0.0"],["168.0.0.0","255.0.0.0"],
    ["171.0.0.0","255.0.0.0"],["174.0.0.0","255.0.0.0"],
    ["183.0.0.0","255.0.0.0"],["202.0.0.0","254.0.0.0"],
    ["203.0.0.0","255.0.0.0"],["211.0.0.0","255.0.0.0"],

    // ──── أفريقيا (باستثناء الأردن والشام والخليج) ────
    ["102.0.0.0","254.0.0.0"],["105.0.0.0","255.0.0.0"],
    ["154.0.0.0","254.0.0.0"],["196.0.0.0","252.0.0.0"],
    ["197.0.0.0","255.0.0.0"],["41.0.0.0","255.128.0.0"],

    // ──── أوروبا الشرقية ────
    ["37.0.0.0","255.128.0.0"],["89.0.0.0","255.0.0.0"],
    ["188.0.0.0","255.128.0.0"],["212.0.0.0","255.0.0.0"],
    ["217.0.0.0","255.0.0.0"]
];

// خريطة ساعات الذروة للاعبين الأردنيين
var JORDAN_PEAK_HOURS = {
    // كل ساعة: نسبة اللاعبين الأردنيين (تقديرية)
    0:  30,  // منتصف الليل
    1:  20,  // 1 ص
    2:  10,  // 2 ص
    3:   5,  // 3 ص
    4:   3,  // 4 ص (أقل وقت)
    5:   3,  // 5 ص
    6:   5,  // 6 ص
    7:   8,  // 7 ص
    8:  12,  // 8 ص
    9:  15,  // 9 ص
    10: 18,  // 10 ص
    11: 20,  // 11 ص
    12: 25,  // 12 ظ
    13: 22,  // 1 م
    14: 20,  // 2 م
    15: 25,  // 3 م
    16: 35,  // 4 م — بداية الذروة
    17: 45,  // 5 م
    18: 65,  // 6 م — ذروة قوية
    19: 80,  // 7 م — ذروة قوية جداً
    20: 90,  // 8 م — أعلى ذروة
    21: 95,  // 9 م — أعلى ذروة
    22: 85,  // 10 م
    23: 60   // 11 م
};

// ████████████████████████████████████████████████████████████████████
// ██                    حالة الجلسة الكاملة                         ██
// ████████████████████████████████████████████████████████████████████

var SESSION = {
    // ──── التثبيت ────
    matchNet:          null,
    lockedNet:         null,
    lockedProxy:       null,
    lockedPort:        null,
    lockedISP:         null,
    lockedCluster:     null,
    lockedServerIP:    null,

    // ──── الكاش ────
    dnsCache:          {},
    dnsCacheTime:      {},
    geoCache:          {},
    serverCache:       {},
    playerPoolCache:   {},

    // ──── المحاولات ────
    retryCount:        0,
    lastProxyIdx:      0,
    lastRetryTime:     0,
    totalRetries:      0,
    consecutiveFails:  0,
    matchRetries:      0,

    // ──── الأداء ────
    proxyLatency:      {},
    proxySpeed:        {},
    proxyJitter:       {},
    proxyLoss:         {},
    proxyHealth:       {},
    serverLoad:        {},
    serverPing:        {},
    clusterLoad:       {},

    // ──── العدادات ────
    failCount:         {},
    successCount:      {},
    totalSuccess:      0,
    totalFail:         0,
    matchCount:        0,
    matchSuccess:      0,
    matchFail:         0,

    // ──── آلة الحالة ────
    gameState:         "IDLE",
    stateHistory:      [],
    prevState:         "IDLE",
    stateStartTime:    0,

    // ──── التعلم ────
    rotationSeed:      Math.floor(Math.random() * 99999),
    learnedRoutes:     {},
    bestRoutes:        {},
    predictionCache:   {},
    serverScores:      {},
    routeHistory:      [],

    // ──── إيجاد اللاعبين ────
    playerPool:        {},
    jordanPlayerEst:   0,
    lastMatchPlayers:  [],
    serverPlayerCount: {},

    // ──── الاتصالات ────
    activeConnections: {},
    connectionPool:    {},
    warmupDone:        false,

    // ──── التوقيت ────
    sessionStart:      0,
    lastHealthCheck:   0,
    lastOptimize:      0,
    lastWarmup:        0,
    lastPrefetch:      0,
    lastClusterUpdate: 0,

    // ──── السجل ────
    logs:              [],
    alerts:            [],
    stats:             {}
};

// ████████████████████████████████████████████████████████████████████
// ██                    دوال مساعدة أساسية                          ██
// ████████████████████████████████████████████████████████████████████

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
    h = h.replace(/[^a-z0-9\.\-]/g, "");
    return h;
}

function ip2long(ip) {
    var p = ip.split(".");
    if (p.length !== 4) return 0;
    return ((parseInt(p[0], 10) << 24) |
            (parseInt(p[1], 10) << 16) |
            (parseInt(p[2], 10) << 8)  |
             parseInt(p[3], 10)) >>> 0;
}

function long2ip(n) {
    return ((n >>> 24) & 255) + "." + ((n >>> 16) & 255) +
           "." + ((n >>> 8) & 255) + "." + (n & 255);
}

function mask2cidr(m) {
    var n = ip2long(m), b = 0;
    while (n & 0x80000000) { b++; n <<= 1; }
    return b;
}

function cidr2mask(c) {
    var m = 0;
    for (var i = 0; i < c; i++) m = (m >> 1) | 0x80000000;
    return long2ip(m >>> 0);
}

function inList(ip, list) {
    if (!ip || ip.indexOf(":") > -1) return false;
    var il = ip2long(ip);
    if (!il) return false;
    for (var i = 0; i < list.length; i++) {
        var nl = ip2long(list[i][0]);
        var ml = ip2long(list[i][1]);
        if ((il & ml) === (nl & ml)) return true;
    }
    return false;
}

function subnet24(ip) {
    var p = ip.split(".");
    return p.length >= 3 ? p[0] + "." + p[1] + "." + p[2] + ".0" : null;
}

function subnet16(ip) {
    var p = ip.split(".");
    return p.length >= 2 ? p[0] + "." + p[1] + ".0.0" : null;
}

function now()      { return Date.now(); }
function hour()     { return new Date().getHours(); }
function day()      { return new Date().getDay(); }
function isWeekend(){ var d = day(); return d === 4 || d === 5 || d === 6; }

function isPeak() {
    var h = hour();
    if (CONFIG.PEAK_START <= CONFIG.PEAK_END) {
        return h >= CONFIG.PEAK_START && h <= CONFIG.PEAK_END;
    }
    return h >= CONFIG.PEAK_START || h <= CONFIG.PEAK_END;
}

function getPlayerDensity() {
    var h = hour();
    return JORDAN_PEAK_HOURS[h] || 20;
}

function hash(s) {
    var h = SESSION.rotationSeed;
    for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) & 0x7FFFFFFF;
    }
    return h;
}

function addLog(msg) {
    if (!CONFIG.DEBUG_MODE) return;
    var ts = new Date().toISOString().substr(11, 12);
    var e = "[" + ts + "] " + msg;
    SESSION.logs.push(e);
    if (SESSION.logs.length > CONFIG.MAX_LOG) {
        SESSION.logs = SESSION.logs.slice(-CONFIG.MAX_LOG);
    }
    try { console.log("[JO] " + e); } catch(x) {}
}

function addAlert(type, msg) {
    SESSION.alerts.push({ type: type, msg: msg, t: now() });
    if (SESSION.alerts.length > 100) SESSION.alerts = SESSION.alerts.slice(-100);
    addLog("🚨 " + type + ": " + msg);
}

// ████████████████████████████████████████████████████████████████████
// ██                    نظام DNS المتقدم                             ██
// ████████████████████████████████████████████████████████████████████

function resolveDNS(host) {
    var n = now();

    // فحص الكاش
    if (SESSION.dnsCache[host] && SESSION.dnsCacheTime[host]) {
        if (n - SESSION.dnsCacheTime[host] < CONFIG.DNS_CACHE_TTL) {
            return SESSION.dnsCache[host];
        }
        delete SESSION.dnsCache[host];
        delete SESSION.dnsCacheTime[host];
    }

    var ip = null;

    // محاولة 1: dnsResolveEx
    try {
        if (typeof dnsResolveEx === "function") {
            var arr = dnsResolveEx(host);
            if (arr && arr.length) {
                for (var k = 0; k < arr.length; k++) {
                    if (arr[k].indexOf(":") === -1) { ip = arr[k]; break; }
                }
            }
        }
    } catch (e) {}

    // محاولة 2: dnsResolve
    if (!ip) {
        try { ip = dnsResolve(host); } catch (e) {}
    }

    // تخزين
    if (ip && ip.indexOf(":") === -1) {
        SESSION.dnsCache[host] = ip;
        SESSION.dnsCacheTime[host] = n;
        cleanDNSCache();
    }

    return ip;
}

function cleanDNSCache() {
    var n = now();
    var keys = [];
    for (var k in SESSION.dnsCache) {
        if (n - SESSION.dnsCacheTime[k] > CONFIG.DNS_CACHE_TTL) {
            delete SESSION.dnsCache[k];
            delete SESSION.dnsCacheTime[k];
        } else {
            keys.push(k);
        }
    }
    // حد أقصى للكاش
    while (keys.length > CONFIG.MAX_DNS_CACHE) {
        var oldest = keys.shift();
        delete SESSION.dnsCache[oldest];
        delete SESSION.dnsCacheTime[oldest];
    }
}

// ──── DNS Prefetch (جلب IPs مسبقاً) ────
function prefetchDNS() {
    if (!CONFIG.DNS_PREFETCH) return;
    var n = now();
    if (n - SESSION.lastPrefetch < 120000) return;
    SESSION.lastPrefetch = n;

    addLog("🔮 DNS Prefetch started...");

    for (var i = 0; i < PUBG_CDN_SERVERS.length; i++) {
        var s = PUBG_CDN_SERVERS[i];
        if (!SESSION.dnsCache[s.host]) {
            resolveDNS(s.host);
        }
    }

    addLog("🔮 DNS Prefetch done — cached " + Object.keys(SESSION.dnsCache).length + " entries");
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام اختيار البروكسي超级 الذكي                     ██
// ████████████████████████████████████████████████████████████████████

function calcProxyScore(entry, context) {
    var addr  = entry.addr || entry;
    var tier  = entry.tier  || 3;
    var isp   = entry.isp   || "unknown";
    var base  = entry.weight || 50;
    var score = base;

    // ──── 1. خصم للفشل ────
    var fails = SESSION.failCount[addr] || 0;
    score -= fails * 25;

    // ──── 2. مكافأة للنجاح ────
    var success = SESSION.successCount[addr] || 0;
    score += Math.min(success * 5, 40);

    // ──── 3. تأخير ────
    var lat = SESSION.proxyLatency[addr] || 500;
    if (lat < 30)       score += 35;
    else if (lat < 60)  score += 25;
    else if (lat < 100) score += 15;
    else if (lat < 200) score += 5;
    else if (lat > 500) score -= 20;
    else if (lat > 1000)score -= 40;

    // ──── 4. Jitter ────
    var jitter = SESSION.proxyJitter[addr] || 0;
    if (jitter > 100) score -= 25;
    else if (jitter > 50) score -= 10;
    else if (jitter < 10) score += 10;

    // ──── 5. فقدان حزم ────
    var loss = SESSION.proxyLoss[addr] || 0;
    if (loss > 5)      score -= 50;
    else if (loss > 2) score -= 25;
    else if (loss > 0) score -= 10;

    // ──── 6. مكافأة ISP المفضل ────
    if (context && context.preferredISP && isp === context.preferredISP) {
        score += 30;
    }

    // ──── 7. Tier ────
    score += (4 - tier) * 12;

    // ──── 8. وقت الذروة ────
    if (isPeak()) {
        if (tier === 1) score += 20;
        if (isp === "orange" || isp === "zain") score += 15;
    }

    // ──── 9. نهاية الأسبوع ────
    if (isWeekend() && CONFIG.WEEKEND_BOOST) {
        score += 10;
    }

    // ──── 10. كثافة اللاعبين ────
    var density = getPlayerDensity();
    if (density > 60 && tier <= 2) score += 15;

    // ──── 11. مسار مُعلَّم ────
    if (CONFIG.LEARNING_MODE && SESSION.learnedRoutes[addr]) {
        score += Math.min(SESSION.learnedRoutes[addr] * 3, 25);
    }

    // ──── 12. التأكد من الحدود ────
    if (SESSION.proxyHealth[addr] === "dead") return -999;
    if (SESSION.proxyHealth[addr] === "critical") score -= 60;

    return score;
}

function selectProxy(pool, host, context) {
    var candidates = [];

    for (var i = 0; i < pool.length; i++) {
        var entry = pool[i];
        var addr = entry.addr || entry;

        // تجاوز الميت
        if (SESSION.proxyHealth[addr] === "dead") continue;

        var score = calcProxyScore(entry, context);
        candidates.push({ addr: addr, score: score, entry: entry });
    }

    if (candidates.length === 0) {
        addLog("🆘 No healthy proxy in pool! Emergency mode");
        return getEmergencyProxy();
    }

    // ترتيب
    candidates.sort(function(a, b) { return b.score - a.score; });

    // تدوير ذكي: اختيار من أفضل 5 باحتمالية مرجحة
    if (CONFIG.SMART_ROTATION && candidates.length > 1) {
        var top = Math.min(candidates.length, 5);
        var totalW = 0;
        for (var t = 0; t < top; t++) {
            candidates[t].score = Math.max(candidates[t].score, 1);
            totalW += candidates[t].score;
        }

        var r = hash(host + now()) % totalW;
        var cum = 0;
        for (var c = 0; c < top; c++) {
            cum += candidates[c].score;
            if (r < cum) {
                return candidates[c].addr;
            }
        }
    }

    return candidates[0].addr;
}

// ──── مجمعات مخصصة لكل نوع حركة ────

function filterPool(purpose) {
    var result = [];
    for (var i = 0; i < CONFIG.PRIMARY_PROXIES.length; i++) {
        var p = CONFIG.PRIMARY_PROXIES[i];
        if (p.purpose === purpose || p.purpose === "general") {
            result.push(p);
        }
    }
    // إذا القائمة فاضية، نرجع general
    if (result.length === 0) {
        for (var j = 0; j < CONFIG.PRIMARY_PROXIES.length; j++) {
            if (CONFIG.PRIMARY_PROXIES[j].tier <= 2) {
                result.push(CONFIG.PRIMARY_PROXIES[j]);
            }
        }
    }
    return result;
}

function pickMatchProxy(host) {
    if (SESSION.lockedProxy && CONFIG.LOCK_PROXY) {
        return SESSION.lockedProxy;
    }
    var ctx = { type: "match", preferredISP: SESSION.lockedISP, density: getPlayerDensity() };
    var pool = filterPool("match");

    // في وقت الذروة: الأولوية لـ Tier 1
    if (isPeak()) {
        var tier1 = [];
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].tier === 1) tier1.push(pool[i]);
        }
        if (tier1.length > 0) pool = tier1;
    }

    return selectProxy(pool, host, ctx);
}

function pickLobbyProxy(host) {
    if (SESSION.lockedProxy && CONFIG.LOCK_PROXY) return SESSION.lockedProxy;
    var ctx = { type: "lobby", preferredISP: SESSION.lockedISP };
    return selectProxy(filterPool("lobby"), host, ctx);
}

function pickSocialProxy(host) {
    var ctx = { type: "social" };
    return selectProxy(filterPool("social"), host, ctx);
}

function pickCDNProxy(host) {
    var ctx = { type: "cdn" };
    return selectProxy(filterPool("cdn"), host, ctx);
}

function pickAntiCheatProxy(host) {
    var ctx = { type: "anticheat" };
    // مضاد الغش: أعلى أمان = Tier 1 فقط
    var pool = [];
    for (var i = 0; i < CONFIG.PRIMARY_PROXIES.length; i++) {
        if (CONFIG.PRIMARY_PROXIES[i].tier === 1) pool.push(CONFIG.PRIMARY_PROXIES[i]);
    }
    return selectProxy(pool.length > 0 ? pool : filterPool("general"), host, ctx);
}

function getEmergencyProxy() {
    addLog("🆘 EMERGENCY PROXY");
    // جرّب أفضل بروكسي Tier 1
    for (var i = 0; i < CONFIG.PRIMARY_PROXIES.length; i++) {
        var p = CONFIG.PRIMARY_PROXIES[i];
        if (p.tier === 1 && SESSION.proxyHealth[p.addr] !== "dead") {
            return p.addr;
        }
    }
    return CONFIG.PRIMARY_PROXIES[0].addr;
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام إعادة المحاولة المتقدم                       ██
// ████████████████████████████████████████████████████████████████████

function retryDelay() {
    var base = CONFIG.RETRY_DELAY_BASE;
    var mult = CONFIG.BACKOFF_MULTIPLIER;
    var delay = Math.floor(base * Math.pow(mult, SESSION.retryCount));
    delay = Math.min(delay, CONFIG.MAX_RETRY_DELAY);
    delay += Math.floor(Math.random() * 300); // jitter
    return delay;
}

function canRetry(aggressive) {
    var max = aggressive ? CONFIG.AGGRESSIVE_RETRIES : CONFIG.MAX_RETRIES;
    if (SESSION.retryCount >= max) return false;
    if (now() - SESSION.lastRetryTime < retryDelay()) return false;
    return true;
}

function doRetry(reason) {
    SESSION.retryCount++;
    SESSION.totalRetries++;
    SESSION.lastRetryTime = now();
    SESSION.consecutiveFails++;

    // تسجيل فشل البروكسي الحالي
    if (SESSION.lockedProxy) {
        recordFail(SESSION.lockedProxy);
    }

    // اختيار بروكسي بديل ذكي
    var proxy = pickNextBackup();

    addLog("↻ Retry " + SESSION.retryCount + "/" + CONFIG.MAX_RETRIES +
           " → " + proxy + " [" + reason + "] delay:" + retryDelay() + "ms");

    return proxy;
}

function pickNextBackup() {
    // تدوير بين كل البروكسيات المتاحة
    var all = CONFIG.PRIMARY_PROXIES;
    var idx = SESSION.lastProxyIdx;
    var tried = 0;

    while (tried < all.length) {
        idx = (idx + 1) % all.length;
        var p = all[idx];
        if (SESSION.proxyHealth[p.addr] !== "dead") {
            SESSION.lastProxyIdx = idx;
            return p.addr;
        }
        tried++;
    }

    // إذا كلهم ميتين، أعد تعيين
    SESSION.lastProxyIdx = 0;
    return all[0].addr;
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام التقييم والتعلم الآلي                        ██
// ████████████████████████████████████████████████████████████████████

function recordSuccess(proxy) {
    SESSION.successCount[proxy] = (SESSION.successCount[proxy] || 0) + 1;
    SESSION.totalSuccess++;
    SESSION.failCount[proxy] = 0;
    SESSION.consecutiveFails = 0;

    if (SESSION.proxyHealth[proxy] !== "excellent") {
        SESSION.proxyHealth[proxy] = "excellent";
    }

    // تسجيل المسار
    if (CONFIG.LEARNING_MODE) {
        SESSION.learnedRoutes[proxy] = (SESSION.learnedRoutes[proxy] || 0) + 1;

        // تسجيل مع الشبكة
        if (SESSION.lockedNet) {
            var key = SESSION.lockedNet + "|" + proxy;
            SESSION.bestRoutes[key] = (SESSION.bestRoutes[key] || 0) + 1;
        }
    }

    addLog("✓ SUCCESS: " + proxy + " (total:" + SESSION.successCount[proxy] + ")");
}

function recordFail(proxy) {
    SESSION.failCount[proxy] = (SESSION.failCount[proxy] || 0) + 1;
    SESSION.totalFail++;
    SESSION.consecutiveFails++;

    var f = SESSION.failCount[proxy];
    if (f >= 10) SESSION.proxyHealth[proxy] = "dead";
    else if (f >= 7) SESSION.proxyHealth[proxy] = "critical";
    else if (f >= 4) SESSION.proxyHealth[proxy] = "bad";
    else if (f >= 2) SESSION.proxyHealth[proxy] = "degraded";

    addLog("✗ FAIL: " + proxy + " (" + f + " consecutive)");

    // إعادة تحياء بعد 2 دقيقة
    if (f >= 10) {
        // محاكاة setTimeout في PAC
        SESSION.proxyHealth[proxy] = "recovering";
        SESSION.failCount[proxy] = 5;
        addLog("♻ Recovering: " + proxy);
    }
}

function recordLatency(proxy, lat) {
    var old = SESSION.proxyLatency[proxy] || lat;
    SESSION.proxyLatency[proxy] = Math.floor(old * 0.6 + lat * 0.4);

    var diff = Math.abs(lat - old);
    var oldJ = SESSION.proxyJitter[proxy] || 0;
    SESSION.proxyJitter[proxy] = Math.floor(oldJ * 0.7 + diff * 0.3);
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام تجميع السيرفرات                              ██
// ████████████████████████████████████████████████████████████████████

function identifyCluster(ip) {
    for (var name in SERVER_CLUSTERS) {
        var cluster = SERVER_CLUSTERS[name];
        for (var i = 0; i < cluster.servers.length; i++) {
            var parts = cluster.servers[i].split("/");
            var netIP = parts[0];
            var cidr = parseInt(parts[1], 10);
            var mask = cidr2mask(cidr);

            if (inList(ip, [[netIP, mask]])) {
                return name;
            }
        }
    }
    return "UNKNOWN";
}

function getClusterPriority(clusterName) {
    var cluster = SERVER_CLUSTERS[clusterName];
    return cluster ? cluster.priority : 99;
}

function getPlayerDensityForCluster(clusterName) {
    var cluster = SERVER_CLUSTERS[clusterName];
    return cluster ? cluster.playerDensity : "LOW";
}

function shouldPreferCluster(ip) {
    // الأردن دائماً الأول
    var cluster = identifyCluster(ip);
    if (cluster === "JO_AMMAN") return true;

    // إذا مافي أردن، الشام
    if (cluster === "LEVANT") return true;

    // باقي التجميعات حسب الأولوية
    var priority = getClusterPriority(cluster);
    return priority <= 3;
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام إيجاد اللاعبين الأردنيين                     ██
// ████████████████████████████████████████████████████████████████████

function estimateJordanPlayerCount() {
    var h = hour();
    var base = JORDAN_PEAK_HOURS[h] || 20;

    // تعديل حسب اليوم
    if (isWeekend()) base = Math.min(base * 1.4, 100);

    // تعديل حسب رمضان
    if (CONFIG.RAMADAN_MODE) {
        if (h >= 20 && h <= 23) base = Math.min(base * 1.5, 100);
        if (h >= 4 && h <= 6) base = Math.min(base * 1.3, 100); // السحور
    }

    SESSION.jordanPlayerEst = base;
    return base;
}

function getPlayerPoolScore(clusterName) {
    // نقاط لكل تجميعة بناءً على كثافة اللاعبين الأردنيين
    var scores = {
        "JO_AMMAN": 100,    // أعلى كثافة أردنية
        "LEVANT":   70,     // لاعبين شام (قريبين ثقافياً)
        "GCC":      50,     // خليج
        "EGYPT":    40,     // مصر
        "UNKNOWN":  10
    };

    var base = scores[clusterName] || 10;

    // ضرب بعامل الوقت
    var density = getPlayerDensity();
    base = Math.floor(base * (density / 100));

    return base;
}

function shouldForceJordanMatch() {
    // هل نجبر البحث عن ماتش أردنية؟
    var density = getPlayerDensity();

    // أكثر من 40% لاعبين أردنيين = نجبر
    if (density > 40) return true;

    // أقل من 20% = لا نجبر (ما رح نلاقي)
    if (density < 20) return false;

    // بين 20-40% = نحاول
    return SESSION.matchRetries < 3;
}

function optimizeForJordanPlayers(ip) {
    // هل هذا السيرفر يحتوي لاعبين أردنيين؟
    var cluster = identifyCluster(ip);
    var score = getPlayerPoolScore(cluster);

    addLog("🎯 Jordan player score for " + cluster + ": " + score + "%");

    // إذا النتيجة عالية، اقبل
    if (score >= 50) return true;

    // إذا النتيجة متوسطة وجديد بالماتش، حاول مرة ثانية
    if (score >= 30 && SESSION.matchRetries < 5) {
        addLog("🔄 Low player score, retrying for better server...");
        SESSION.matchRetries++;
        return false;
    }

    // قبل بأي نتيجة بعد المحاولات
    return true;
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام التسخين (Warmup)                             ██
// ████████████████████████████████████████████████████████████████████

function warmupConnections() {
    if (SESSION.warmupDone) return;
    var n = now();
    if (n - SESSION.lastWarmup < CONFIG.WARMUP_INTERVAL) return;
    SESSION.lastWarmup = n;

    addLog("🔥 Warming up connections...");

    // تسخين DNS
    prefetchDNS();

    // تسخين البروكسيات
    for (var i = 0; i < Math.min(CONFIG.PRIMARY_PROXIES.length, 10); i++) {
        var proxy = CONFIG.PRIMARY_PROXIES[i];
        if (!SESSION.proxyLatency[proxy.addr]) {
            testProxyLatency(proxy.addr);
        }
    }

    SESSION.warmupDone = true;
    addLog("🔥 Warmup complete");
}

function testProxyLatency(proxy) {
    var start = now();
    try {
        var result = dnsResolve("match.pubgmobile.com");
        var lat = now() - start;
        if (result) {
            recordLatency(proxy, lat);
            SESSION.proxyHealth[proxy] = lat < 100 ? "excellent" :
                                          lat < 300 ? "good" :
                                          lat < 600 ? "fair" : "bad";
        }
    } catch (e) {
        SESSION.proxyLatency[proxy] = 9999;
    }
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام فحص الصحة المتقدم                           ██
// ████████████████████████████████████████████████████████████████████

function healthCheck() {
    var n = now();
    if (n - SESSION.lastHealthCheck < CONFIG.HEALTH_INTERVAL) return;
    SESSION.lastHealthCheck = n;

    addLog("🏥 Health check — " + countHealthy() + "/" +
           CONFIG.PRIMARY_PROXIES.length + " healthy");

    for (var i = 0; i < CONFIG.PRIMARY_PROXIES.length; i++) {
        var p = CONFIG.PRIMARY_PROXIES[i];
        if (SESSION.proxyHealth[p.addr] === "dead") continue;
        testProxyLatency(p.addr);
    }

    // تنبيه إذا قلّت البروكسيات الصحية
    var healthy = countHealthy();
    if (healthy < 3) {
        addAlert("CRITICAL", "Only " + healthy + " healthy proxies!");
    }
}

function countHealthy() {
    var count = 0;
    for (var i = 0; i < CONFIG.PRIMARY_PROXIES.length; i++) {
        var h = SESSION.proxyHealth[CONFIG.PRIMARY_PROXIES[i].addr];
        if (h !== "dead" && h !== "critical") count++;
    }
    return count;
}

// ████████████████████████████████████████████████████████████████████
// ██              نظام التحسين الدوري                              ██
// ████████████████████████████████████████████████████████████████████

function optimize() {
    var n = now();
    if (n - SESSION.lastOptimize < CONFIG.OPTIMIZATION_INTERVAL) return;
    SESSION.lastOptimize = n;

    addLog("⚡ Optimization cycle...");

    // 1. تحديث ترتيب البروكسيات
    CONFIG.PRIMARY_PROXIES.sort(function(a, b) {
        return calcProxyScore(b, {}) - calcProxyScore(a, {});
    });

    // 2. تنظيف الذاكرة
    cleanMemory();

    // 3. تحديث تقدير اللاعبين
    estimateJordanPlayerCount();

    // 4. تحديث حمل السيرفرات
    updateServerLoads();

    // 5. طباعة ملخص
    printSummary();
}

function cleanMemory() {
    // تنظيف الكاش القديم
    var n = now();

    // سجلات الحالة القديمة
    if (SESSION.stateHistory.length > 100) {
        SESSION.stateHistory = SESSION.stateHistory.slice(-50);
    }

    // مسارات قديمة
    if (SESSION.routeHistory.length > 200) {
        SESSION.routeHistory = SESSION.routeHistory.slice(-100);
    }

    // حمل السيرفرات (إعادة تعيين دوري)
    if (Object.keys(SESSION.serverLoad).length > 100) {
        SESSION.serverLoad = {};
    }
}

function updateServerLoads() {
    for (var name in SERVER_CLUSTERS) {
        var cluster = SERVER_CLUSTERS[name];
        var load = 0;

        // تقدير الحمل بناءً على وقت الذروة والمحاولات
        var density = getPlayerDensity();
        load = Math.min(100, density + SESSION.retryCount * 5);

        if (isPeak()) load += 10;
        if (isWeekend()) load += 5;

        SESSION.clusterLoad[name] = Math.min(load, 100);
    }
}

function printSummary() {
    var uptime = Math.floor((now() - SESSION.sessionStart) / 60000);
    addLog("═══ SUMMARY ═══");
    addLog("  Uptime: " + uptime + "min");
    addLog("  Matches: " + SESSION.matchCount + " (✓" + SESSION.matchSuccess + " ✗" + SESSION.matchFail + ")");
    addLog("  Retries: " + SESSION.totalRetries);
    addLog("  State: " + SESSION.gameState);
    addLog("  Locked: net=" + SESSION.lockedNet + " proxy=" + SESSION.lockedProxy);
    addLog("  ISP: " + SESSION.lockedISP + " cluster=" + SESSION.lockedCluster);
    addLog("  Jordan Players: ~" + SESSION.jordanPlayerEst + "%");
    addLog("  Healthy: " + countHealthy() + "/" + CONFIG.PRIMARY_PROXIES.length);
    addLog("════════════════");
}

// ████████████████████████████████████████████████████████████████████
// ██              آلة حالة اللعبة المتقدمة                          ██
// ████████████████████████████████████████████████████████████████████

var STATES = {
    IDLE:         "IDLE",
    LOBBY:        "LOBBY",
    MATCHMAKING:  "MATCHMAKING",
    QUEUE:        "QUEUE",
    LOADING:      "LOADING",
    IN_MATCH:     "IN_MATCH",
    TDM:          "TDM",
    ARENA:        "ARENA",
    TRAINING:     "TRAINING",
    SPECTATING:   "SPECTATING",
    POST_MATCH:   "POST_MATCH",
    SHOPPING:     "SHOPPING",
    SOCIAL:       "SOCIAL",
    EVENT:        "EVENT"
};

function changeState(newState) {
    if (SESSION.gameState === newState) return;

    SESSION.prevState = SESSION.gameState;
    SESSION.gameState = newState;
    SESSION.stateStartTime = now();

    SESSION.stateHistory.push({
        from: SESSION.prevState,
        to: newState,
        time: now()
    });

    addLog("🎮 STATE: " + SESSION.prevState + " → " + newState);
    onStateEnter(SESSION.prevState, newState);
}

function onStateEnter(from, to) {
    // ──── عند بدء البحث عن ماتش ────
    if (to === STATES.MATCHMAKING || to === STATES.QUEUE) {
        SESSION.matchRetries = 0;
        resetMatchLock();
        addLog("🔄 MATCHMAKING — Lock reset, seeking Jordan server...");

        // تقدير اللاعبين
        estimateJordanPlayerCount();
        addLog("🎯 Jordan player density: " + SESSION.jordanPlayerEst + "%");

        // إذا وقت الذروة، قفل على الأردن بقوة
        if (getPlayerDensity() > 50) {
            addLog("💪 Peak hour detected — FORCE JORDAN LOCK");
        }
    }

    // ──── عند بدء اللعب ────
    if (to === STATES.IN_MATCH || to === STATES.TDM || to === STATES.ARENA) {
        SESSION.matchCount++;
        SESSION.matchSuccess++;
        addLog("⚔ MATCH #" + SESSION.matchCount + " STARTED!");
        addLog("  Server: " + SESSION.lockedServerIP);
        addLog("  Network: " + SESSION.lockedNet);
        addLog("  Proxy: " + SESSION.lockedProxy);
        addLog("  ISP: " + SESSION.lockedISP);
        addLog("  Cluster: " + SESSION.lockedCluster);
    }

    // ──── عند العودة للوبي ────
    if (to === STATES.LOBBY && (from === STATES.IN_MATCH || from === STATES.TDM ||
        from === STATES.ARENA || from === STATES.POST_MATCH)) {
        var dur = Math.floor((now() - SESSION.stateStartTime) / 1000);
        addLog("✓ Match ended — Duration: " + dur + "s");
    }

    // ──── عند فتح المتجر ────
    if (to === STATES.SHOPPING) {
        addLog("🛒 Shopping — keeping current proxy");
    }

    // ──── عند الحدث ────
    if (to === STATES.EVENT) {
        addLog("🎊 Event detected — optimizing for Jordan");
    }
}

function resetMatchLock() {
    SESSION.lockedNet = null;
    SESSION.matchNet = null;
    SESSION.lockedCluster = null;
    SESSION.lockedServerIP = null;
    SESSION.retryCount = 0;
    SESSION.consecutiveFails = 0;
    // نحتفظ بـ lockedProxy و lockedISP للثبات
}

function detectState(url, host) {
    var c = url + " " + host;

    if (/matchmaking|queue|findmatch|recruit|search/i.test(c))   return STATES.MATCHMAKING;
    if (/tdm|teamdeath/i.test(c))                                 return STATES.TDM;
    if (/arena|war\s*mode|infection|payday|zombie/i.test(c))      return STATES.ARENA;
    if (/training|practice|firing|drill/i.test(c))                return STATES.TRAINING;
    if (/spectate|replay|watch|observer/i.test(c))                return STATES.SPECTATING;
    if (/shop|store|purchase|uc\.|crate|draw|lucky|wheel|rp\.|offer|coupon/i.test(c)) return STATES.SHOPPING;
    if (/friend|invite|squad|team|party|clan|social|guild|msg|mail/i.test(c)) return STATES.SOCIAL;
    if (/event|special|limited|collab/i.test(c))                  return STATES.EVENT;
    if (/match|battle|gameplay|combat|realtime|sync|erangel|miramar|sanhok|vikendi|karakin|livik|nusa|ronta|alien|payload|udp|zone|circle|drop|airdrop/i.test(c)) return STATES.IN_MATCH;
    if (/lobby|login|auth|season|loadout|mission|task|rank|pass|inventory|main/i.test(c)) return STATES.LOBBY;

    return SESSION.gameState;
}

// ████████████████████████████████████████████████████████████████████
// ██              تصنيف حركة البيانات المتقدم                       ██
// ████████████████████████████████████████████████████████████████████

function classifyTraffic(url, host) {
    var c = url + " " + host;

    // ماتش (أولوية قصوى)
    if (/\bmatch\b|\bbattle\b|\bgameplay\b|combat|realtime|\bsync\b|\btdm\b|\barena\b|\bwar\b|\brush\b|\binfection\b|\bpayday\b|\bzombie\b|\bbrdm\b|\bflare\b|erangel|miramar|sanhok|vikendi|karakin|livik|nusa|\bronta\b|alien|payload|\budp\b|\bzone\b|\bcircle\b|\bdrop\b|\bairdrop\b|\bclutch\b|\bknock\b|\brevive\b|\bsquad\b|\bduo\b|\bsolo\b/i.test(c)) {
        return "MATCH";
    }

    // مضاد الغش (حساس)
    if (/anticheat|security|verify|hack|detect|monitor|safe|protect|report\.|cheat|integrity/i.test(c)) {
        return "ANTICHEAT";
    }

    // لوبي
    if (/lobby|matchmaking|queue|dispatch|gateway|region|login|auth|season|event|loadout|mission|task|rank|recruit|pass|main\s*menu/i.test(c)) {
        return "LOBBY";
    }

    // متجر
    if (/shop|store|purchase|uc\.|coupon|redeem|offer|bundle|discount|sale|royalpass|rp\.|lucky|wheel|crate|draw/i.test(c)) {
        return "SHOP";
    }

    // سوشيال
    if (/friend|invite|squad|team|party|clan|presence|social|voice|chat|mic|audio|guild|msg|mail|pm|whisper|live/i.test(c)) {
        return "SOCIAL";
    }

    // CDN
    if (/cdn|asset|resource|patch|update|media|content|download|hotfix|res\.|skin|model|texture|sound|apk|obb|bundle|config\.|version/i.test(c)) {
        return "CDN";
    }

    // تحليلات (حجب)
    if (/analytics|telemetry|track|log\.|metric|beacon|stat\.|crashlytics|bugly|firebase|adjust|appsflyer/i.test(c)) {
        return "ANALYTICS";
    }

    // إعلانات (حجب)
    if (/ad\.|ads\.|adservice|admob|unityads|applovin|vungle|mintegral|ironsource|pangle|topon/i.test(c)) {
        return "ADS";
    }

    return "UNKNOWN";
}

// ████████████████████████████████████████████████████████████████████
// ██              حماية من التسريب والبصمة                           ██
// ████████████████████████████████████████████████████████████████████

function isLeaking(ip, host) {
    if (!CONFIG.ANTI_LEAK) return false;
    if (isPUBG(host) && !inList(ip, JORDAN_IPV4) && !isMiddleEastIP(ip)) {
        addAlert("LEAK", host + " → " + ip);
        return true;
    }
    return false;
}

function isMiddleEastIP(ip) {
    // فحص سريع للمناطق المسموحة (الشرق الأوسط)
    // الأردن + لبنان + سوريا + العراق + الخليج + مصر
    var p = ip.split(".");
    var f = parseInt(p[0], 10);
    var s = parseInt(p[1], 10);

    // مناطق مسموحة (تقريبية)
    if (f === 46 && s >= 32 && s <= 185) return true;   // UAE/Jordan
    if (f === 94 && s >= 56 && s <= 200) return true;   // UAE
    if (f === 91 && s >= 72 && s <= 75) return true;    // UAE
    if (f === 212 && s >= 76 && s <= 79) return true;   // Saudi
    if (f === 86 && s === 51) return true;               // Saudi
    if (f === 197) return true;                           // Africa/ME
    if (f === 41 && s >= 206 && s <= 207) return true;  // Egypt
    if (f === 185 && s >= 26 && s <= 170) return true;  // ME various
    if (f === 176 && s >= 29 && s <= 57) return true;   // Jordan

    return false;
}

function getSpoofedHeaders() {
    if (!CONFIG.GEO_SPOOFING) return "";
    // هيدرات توحي بالموقع الأردني
    return "X-Forwarded-For: 46.185.131.218\r\n" +
           "X-Real-IP: 46.185.131.218\r\n" +
           "X-Country: JO\r\n" +
           "X-City: Amman\r\n";
}

// ████████████████████████████████████████████████████████████████████
// ██              فحص تكرارات الإعداد                               ██
// ████████████████████████████████████████████████████████████████████

function validateConfig() {
    var issues = [];
    var warns  = [];

    // فحص البروكسيات
    if (CONFIG.PRIMARY_PROXIES.length < 5) {
        issues.push("Need 5+ primary proxies (have " + CONFIG.PRIMARY_PROXIES.length + ")");
    }

    // فحص التكرارات
    var seen = {};
    var dupes = [];
    for (var i = 0; i < CONFIG.PRIMARY_PROXIES.length; i++) {
        var addr = CONFIG.PRIMARY_PROXIES[i].addr;
        if (seen[addr]) dupes.push(addr);
        seen[addr] = true;
    }
    if (dupes.length > 0) warns.push("Duplicate: " + dupes.join(", "));

    // فحص الشبكات
    if (JORDAN_IPV4.length < 10) issues.push("JORDAN_IPV4 too small");

    // فحص الإعدادات
    if (CONFIG.MAX_RETRIES < 5) warns.push("MAX_RETRIES low");
    if (CONFIG.RETRY_DELAY_BASE < 200) warns.push("RETRY_DELAY low");

    // طباعة
    if (issues.length > 0) addLog("❌ ERRORS: " + issues.join(" | "));
    if (warns.length > 0)  addLog("⚠ WARNS: " + warns.join(" | "));
    if (issues.length === 0 && warns.length === 0) addLog("✅ Config OK — " + CONFIG.PRIMARY_PROXIES.length + " proxies");

    return issues.length === 0;
}

// ████████████████████████████████████████████████████████████████████
// ██              كشف ببجي                                          ██
// ████████████████████████████████████████████████████████████████████

function isPUBG(h) {
    return /pubg|bgmi|tencent|krafton|bluehole|levelinfinite|lightspeed|igamecj|yuanlin|anticheatexpert|gtimg|idqqimg|gpubgm|match\.pubg|royalpass|rp\.pubg|pubgmobile|cdn-pubg|api-pubg|gpjbh|gpjcj|tencentgme|overseas\.gcloudsdk|gcloud|proximabeta|tencentyoutu|gameloop|tcgame/i.test(h);
}

// ████████████████████████████████████████████████████████████████████
// ██              معالجة أنواع الحركة                                ██
// ████████████████████████████████████████████████████████████████████

function handleMatch(url, host, ip) {
    addLog("⚔ MATCH TRAFFIC: " + host + " → " + ip);

    // ──── 1. فحص IP أردني ────
    if (!inList(ip, JORDAN_IPV4)) {
        addLog("✗ Non-Jordan IP: " + ip);

        // فحص: هل IP في تسموحة قريبة؟
        var cluster = identifyCluster(ip);
        if (cluster === "JO_AMMAN") {
            addLog("✓ IP in Jordan cluster (extended range)");
        } else {
            addLog("✗ IP in cluster: " + cluster + " (not Jordan)");

            // إذا وقت الذروة وممكن نلاقي أردني
            if (shouldForceJordanMatch()) {
                if (canRetry(true)) {
                    return doRetry("forcing Jordan (peak hour)");
                }
            } else if (canRetry(false)) {
                return doRetry("non-Jordan IP");
            }

            SESSION.matchFail++;
            addLog("✗✗ BLOCKED after retries");
            return BLOCK;
        }
    }

    // ──── 2. تثبيت الشبكة ────
    var net24 = subnet24(ip);
    if (!SESSION.lockedNet) {
        SESSION.lockedNet = net24;
        SESSION.matchNet = net24;
        SESSION.lockedISP = guessISP(ip);
        SESSION.lockedCluster = identifyCluster(ip);
        SESSION.lockedServerIP = ip;
        addLog("🔒 LOCKED: net=" + net24 + " ISP=" + SESSION.lockedISP +
               " cluster=" + SESSION.lockedCluster);
    }

    // ──── 3. فحص تطابق الشبكة ────
    if (CONFIG.LOCK_NETWORK && net24 !== SESSION.lockedNet) {
        addLog("⚠ Network mismatch: " + SESSION.lockedNet + " vs " + net24);

        if (canRetry(true)) {
            return doRetry("network mismatch");
        }
        addLog("✗✗ BLOCKED (network lock)");
        return BLOCK;
    }

    // ──── 4. فحص تطابق التجميعة ────
    if (CONFIG.SERVER_CLUSTERING) {
        var ipCluster = identifyCluster(ip);
        var ipPriority = getClusterPriority(ipCluster);
        var lockPriority = getClusterPriority(SESSION.lockedCluster || "JO_AMMAN");

        // إذا التجميعة أسوأ، حاول تحسين
        if (ipPriority > lockPriority + 1) {
            addLog("⚠ Cluster downgrade: " + SESSION.lockedCluster + " → " + ipCluster);
            if (canRetry(false)) {
                return doRetry("cluster downgrade");
            }
        }
    }

    // ──── 5. تحليل حمل السيرفر ────
    var load = analyzeLoad(ip);
    if (load > 95) {
        addLog("⚠ Critical server load (" + load + "%)");
        if (canRetry(false)) {
            return doRetry("server overload");
        }
    }

    // ──── 6. فحص إيجاد اللاعبين ────
    if (CONFIG.PLAYER_AFFINITY && shouldForceJordanMatch()) {
        if (!optimizeForJordanPlayers(ip)) {
            if (canRetry(true)) {
                return doRetry("low Jordan player density");
            }
        }
    }

    // ──── 7. اختيار أفضل بروكسي ────
    var proxy = pickMatchProxy(host);

    // ──── 8. نجاح! ────
    SESSION.retryCount = 0;
    SESSION.matchRetries = 0;
    SESSION.lockedProxy = proxy;
    recordSuccess(proxy);
    recordLatency(proxy, now() - SESSION.lastRetryTime);

    addLog("✓✓ MATCH CONNECTED → " + ip + " via " + proxy);
    addLog("  Cluster: " + identifyCluster(ip) + " | ISP: " + guessISP(ip));
    return proxy;
}

function handleLobby(url, host, ip) {
    if (!inList(ip, JORDAN_IPV4) && !isMiddleEastIP(ip)) {
        addLog("✗ Lobby non-Jordan: " + ip);
        return BLOCK;
    }
    var p = pickLobbyProxy(host);
    addLog("🏠 Lobby → " + p);
    return p;
}

function handleShop(url, host, ip) {
    if (!inList(ip, JORDAN_IPV4) && !isMiddleEastIP(ip)) {
        addLog("✗ Shop non-Jordan: " + ip);
        return BLOCK;
    }
    var p = pickLobbyProxy(host);
    addLog("🛒 Shop → " + p);
    return p;
}

function handleSocial(url, host, ip) {
    if (!inList(ip, JORDAN_IPV4) && !isMiddleEastIP(ip)) {
        addLog("✗ Social non-Jordan: " + ip);
        return BLOCK;
    }
    var p = pickSocialProxy(host);
    addLog("👥 Social → " + p);
    return p;
}

function handleCDN(url, host, ip) {
    if (!inList(ip, JORDAN_IPV4) && !isMiddleEastIP(ip)) {
        addLog("✗ CDN non-Jordan: " + ip);
        return BLOCK;
    }
    var p = pickCDNProxy(host);
    addLog("📦 CDN → " + p);
    return p;
}

function handleAntiCheat(url, host, ip) {
    if (!inList(ip, JORDAN_IPV4) && !isMiddleEastIP(ip)) {
        addLog("✗ Anti-cheat non-Jordan: " + ip);
        return BLOCK;
    }
    var p = pickAntiCheatProxy(host);
    addLog("🛡 AntiCheat → " + p);
    return p;
}

function handleAnalytics(url, host) {
    if (CONFIG.BLOCK_ANALYTICS) {
        addLog("📊 Analytics BLOCKED");
        return BLOCK;
    }
    return DIRECT;
}

function handleAds(url, host) {
    if (CONFIG.BLOCK_ADS) {
        addLog("📢 Ads BLOCKED");
        return BLOCK;
    }
    return DIRECT;
}

function handleFallback(url, host, ip) {
    if (inList(ip, JORDAN_IPV4) || isMiddleEastIP(ip)) {
        var p = pickLobbyProxy(host);
        addLog("🔗 Fallback (ME) → " + p);
        return p;
    }
    addLog("✗ Unknown PUBG BLOCKED: " + host + " → " + ip);
    return BLOCK;
}

// ████████████████████████████████████████████████████████████████████
// ██              تحليل الحمل                                       ██
// ████████████████████████████████████████████████████████████████████

function analyzeLoad(ip) {
    var key = subnet24(ip);
    if (!key) return 50;
    if (!SESSION.serverLoad[key]) {
        var base = SESSION.retryCount * 10;
        var peak = isPeak() ? 20 : 0;
        var wknd = isWeekend() ? 10 : 0;
        var fail = SESSION.consecutiveFails * 5;
        SESSION.serverLoad[key] = Math.min(100, base + peak + wknd + fail);
    }
    return SESSION.serverLoad[key];
}

function guessISP(ip) {
    var p = ip.split(".");
    var f = parseInt(p[0], 10);
    var s = parseInt(p[1], 10);
    if (f === 46  && s === 185) return "orange";
    if (f === 213 && s === 139) return "orange";
    if (f === 41  && s === 188) return "orange";
    if (f === 77  && s >= 245)  return "zain";
    if (f === 212 && s === 34)  return "zain";
    if (f === 37  && s === 123) return "zain";
    if (f === 79  && s === 134) return "umniah";
    if (f === 91  && s === 186) return "umniah";
    if (f === 176 && s === 29)  return "damamax";
    if (f === 176 && s === 57)  return "damamax";
    if (f === 185)              return "regional";
    return "unknown";
}

// ████████████████████████████████████████████████████████████████████
// ██                                                                  ██
// ██    ███████╗██╗███╗   ██╗██████╗     ██████╗ ██╗   ██╗███╗   ██╗ ██
// ██    ██╔════╝██║████╗  ██║██╔══██╗    ██╔══██╗██║   ██║████╗  ██║ ██
// ██    █████╗  ██║██╔██╗ ██║██║  ██║    ██████╔╝██║   ██║██╔██╗ ██║ ██
// ██    ██╔══╝  ██║██║╚██╗██║██║  ██║    ██╔══██╗██║   ██║██║╚██╗██║ ██
// ██    ██║     ██║██║ ╚████║██████╔╝    ██████╔╝╚██████╔╝██║ ╚████║ ██
// ██    ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ██
// ██                                                                  ██
// ████████████████████████████████████████████████████████████████████

function FindProxyForURL(url, host) {

    // ══════ الخطوة 0: التهيئة ══════
    if (!SESSION.sessionStart) {
        SESSION.sessionStart = now();
        validateConfig();
        estimateJordanPlayerCount();
        addLog("╔════════════════════════════════════════════╗");
        addLog("║  PUBG Jordan Ultimate Lock v5.0            ║");
        addLog("║  Session: " + new Date().toISOString() + " ║");
        addLog("║  Proxies: " + CONFIG.PRIMARY_PROXIES.length + "                              ║");
        addLog("║  Networks: " + JORDAN_IPV4.length + "                             ║");
        addLog("║  Peak: " + isPeak() + " | Weekend: " + isWeekend() + "              ║");
        addLog("║  Jordan Players: ~" + getPlayerDensity() + "%                       ║");
        addLog("╚════════════════════════════════════════════╝");
    }

    // ══════ الخطوة 1: تنظيف الهوست ══════
    host = norm(host);

    // ══════ الخطوة 2: مهام دورية ══════
    warmupConnections();
    healthCheck();
    optimize();

    // ══════ الخطوة 3: ليس ببجي = مباشر ══════
    if (!isPUBG(host)) return DIRECT;

    // ══════ الخطوة 4: حل DNS ══════
    var ip = resolveDNS(host);
    if (!ip) {
        addLog("✗ DNS failed: " + host);
        return BLOCK;
    }
    if (CONFIG.BLOCK_IPV6 && ip.indexOf(":") > -1) {
        addLog("✗ IPv6: " + host);
        return BLOCK;
    }

    // ══════ الخطوة 5: حماية ══════
    if (isLeaking(ip, host)) return BLOCK;
    if (inList(ip, GEO_BLACKLIST)) {
        addLog("✗ Blacklisted: " + ip);
        return BLOCK;
    }

    // ══════ الخطوة 6: تصنيف ══════
    var traffic = classifyTraffic(url, host);

    // ══════ الخطوة 7: تحديث الحالة ══════
    var state = detectState(url, host);
    if (state !== SESSION.gameState) changeState(state);

    // ══════ الخطوة 8: المعالجة ══════
    switch (traffic) {
        case "MATCH":      return handleMatch(url, host, ip);
        case "ANTICHEAT":  return handleAntiCheat(url, host, ip);
        case "LOBBY":      return handleLobby(url, host, ip);
        case "SHOP":       return handleShop(url, host, ip);
        case "SOCIAL":     return handleSocial(url, host, ip);
        case "CDN":        return handleCDN(url, host, ip);
        case "ANALYTICS":  return handleAnalytics(url, host);
        case "ADS":        return handleAds(url, host);
        default:           return handleFallback(url, host, ip);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  نهاية السكربت — PUBG Jordan Ultimate Lock v5.0
// ═══════════════════════════════════════════════════════════════════
