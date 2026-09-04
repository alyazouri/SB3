// =====================================================================
//
//  ██╗   ██╗███████╗    ██████╗     ███████╗██╗███╗   ██╗ █████╗ ██╗
//  ██║   ██║██╔════╝    ╚════██╗    ██╔════╝██║████╗  ██║██╔══██╗██║
//  ██║   ██║███████╗     █████╔╝    █████╗  ██║██╔██╗ ██║███████║██║
//  ██║   ██║╚════██║    ██╔═══╝     ██╔══╝  ██║██║╚██╗██║██╔══██║██║
//  ╚██████╔╝███████║    ███████╗    ██║     ██║██║ ╚████║██║  ██║███████╗
//   ╚═════╝ ╚══════╝    ╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
//
//  PUBG MOBILE — JORDAN FINAL LOCK v7.0
//  ═══════════════════════════════════════════════════
//  النسخة المطلقة — كل تقنية ممكنة داخل سكربت واحد
// =====================================================================

// ═══════════════════════════════════════════════════════════════
//  ★ الإعدادات ★
// ═══════════════════════════════════════════════════════════════

var DEBUG = true;
var MAX_RETRIES = 20;
var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ═══════════════════════════════════════════════════════════════
//  ★★ بروكسيات أردنية — كل المزودين + كل المنافذ ★★
// ═══════════════════════════════════════════════════════════════

// بروكسيات Orange (الأقوى — أكبر مزود بالاردن)
var P_ORANGE = [
    "PROXY 46.185.131.218:20001",
    "PROXY 46.185.131.218:20002",
    "PROXY 46.185.131.218:20003",
    "PROXY 46.185.131.218:20004",
    "PROXY 46.185.131.218:20005",
    "PROXY 46.185.131.218:20006",
    "PROXY 46.185.131.218:20007",
    "PROXY 46.185.131.218:20008",
    "PROXY 46.185.131.218:20009",
    "PROXY 46.185.131.218:20010",
    "PROXY 46.185.131.218:20011",
    "PROXY 46.185.131.218:20012",
    "PROXY 46.185.131.218:20013",
    "PROXY 46.185.131.218:20014",
    "PROXY 46.185.131.218:20015",
    "PROXY 46.185.131.218:20016",
    "PROXY 46.185.131.218:20017",
    "PROXY 46.185.131.218:20018",
    "PROXY 46.185.131.218:20019",
    "PROXY 46.185.131.218:20020",
    "PROXY 46.185.131.218:443",
    "PROXY 46.185.131.218:80",
    "PROXY 46.185.131.218:8080",
    "PROXY 46.185.131.218:8081",
    "PROXY 46.185.131.218:8082",
    "PROXY 46.185.131.218:8443",
    "PROXY 46.185.131.218:8888",
    "PROXY 46.185.131.218:3128",
    "PROXY 46.185.131.218:1080",
    "PROXY 46.185.131.218:9090",
    "PROXY 46.185.131.218:9050",
    "PROXY 46.185.131.218:7070",
    "PROXY 46.185.131.218:6060",
    "PROXY 46.185.131.218:5050",
    "PROXY 46.185.131.218:4040",
    "PROXY 46.185.131.218:3030",
    "PROXY 46.185.131.218:2080",
    "PROXY 46.185.131.218:2049",
    "PROXY 46.185.131.218:1024"
];

// بروكسيات Zain
var P_ZAIN = [
    "PROXY 212.35.66.45:20001",
    "PROXY 212.35.66.45:20002",
    "PROXY 212.35.66.45:20003",
    "PROXY 212.35.66.45:20004",
    "PROXY 212.35.66.45:20005",
    "PROXY 212.35.66.45:20006",
    "PROXY 212.35.66.45:20007",
    "PROXY 212.35.66.45:20008",
    "PROXY 212.35.66.45:20009",
    "PROXY 212.35.66.45:20010",
    "PROXY 212.35.66.45:20011",
    "PROXY 212.35.66.45:20012",
    "PROXY 212.35.66.45:20013",
    "PROXY 212.35.66.45:20014",
    "PROXY 212.35.66.45:20015",
    "PROXY 212.35.66.45:443",
    "PROXY 212.35.66.45:80",
    "PROXY 212.35.66.45:8085",
    "PROXY 212.35.66.45:8181",
    "PROXY 212.35.66.45:8443",
    "PROXY 212.35.66.45:8888",
    "PROXY 212.35.66.45:3128",
    "PROXY 212.35.66.45:1080",
    "PROXY 212.35.66.45:9090",
    "PROXY 212.35.66.45:7070",
    "PROXY 212.35.66.45:5050",
    "PROXY 212.35.66.45:4040",
    "PROXY 212.35.66.45:3030",
    "PROXY 212.35.66.45:2080",
    "PROXY 212.35.66.45:1024"
];

// بروكسيات Umniah
var P_UMNIAH = [
    "PROXY 79.134.128.1:20001",
    "PROXY 79.134.128.1:20002",
    "PROXY 79.134.128.1:20003",
    "PROXY 79.134.128.1:443",
    "PROXY 79.134.128.1:8080",
    "PROXY 79.134.128.1:8443",
    "PROXY 79.134.128.1:8888",
    "PROXY 79.134.128.1:3128",
    "PROXY 79.134.128.1:1080",
    "PROXY 79.134.128.1:9090",
    "PROXY 79.134.128.1:7070",
    "PROXY 79.134.128.1:5050"
];

// بروكسيات Damamax
var P_DAMAMAX = [
    "PROXY 176.29.0.1:20001",
    "PROXY 176.29.0.1:20002",
    "PROXY 176.29.0.1:443",
    "PROXY 176.29.0.1:8080",
    "PROXY 176.29.0.1:8888",
    "PROXY 176.29.0.1:3128",
    "PROXY 176.29.0.1:1080"
];

// بروكسيات إضافية أردنية (مزودون صغار + داتاسنتر)
var P_EXTRA = [
    "PROXY 185.131.216.1:20001",
    "PROXY 185.131.216.1:443",
    "PROXY 185.131.216.1:8080",
    "PROXY 185.170.164.1:20001",
    "PROXY 185.170.164.1:443",
    "PROXY 185.170.164.1:8080",
    "PROXY 185.86.148.1:443",
    "PROXY 185.86.148.1:8080",
    "PROXY 77.245.0.1:20001",
    "PROXY 77.245.0.1:443",
    "PROXY 77.245.0.1:8080",
    "PROXY 213.139.64.1:443",
    "PROXY 213.139.64.1:8080",
    "PROXY 176.57.0.1:443",
    "PROXY 176.57.0.1:8080",
    "PROXY 41.188.0.1:443",
    "PROXY 41.188.0.1:8080",
    "PROXY 91.186.0.1:443",
    "PROXY 91.186.0.1:8080",
    "PROXY 37.123.128.1:443",
    "PROXY 37.123.128.1:20001",
    "PROXY 188.123.0.1:443",
    "PROXY 188.247.0.1:443",
    "PROXY 5.23.0.1:443",
    "PROXY 109.224.0.1:443",
    "PROXY 193.188.64.1:443",
    "PROXY 149.200.0.1:443"
];

// ═══════════════════════════════════════════════════════════════
//  ★★★ القلب: سيرفرات ببجي الشرق الأوسط — IP كاملة ★★★
//  ★★★ هاي أهم شي — كل سيرفرات ME ممكنة ★★★
// ═══════════════════════════════════════════════════════════════

// سيرفرات ببجي المعروفة في الشرق الأوسط
// مصادر: Whois + RIPE + PUBG API endpoints + packet captures
var ME_RANGES = [
    // ──── Tencent/Level Infinite — سيرفرات ببجي الشرق الأوسط ────
    ["162.62.0.0",    "255.255.0.0"],     // Tencent Gaming ME
    ["49.51.0.0",     "255.255.0.0"],     // Tencent Cloud ME
    ["129.226.0.0",   "255.255.0.0"],     // Tencent Cloud
    ["150.109.0.0",   "255.255.0.0"],     // Tencent Gaming Global
    ["101.32.0.0",    "255.252.0.0"],     // Tencent Cloud
    ["203.205.128.0", "255.255.128.0"],   // Tencent Main
    ["203.205.192.0", "255.255.192.0"],   // Tencent CDN
    ["103.28.0.0",    "255.255.192.0"],   // Tencent ME CDN
    ["103.252.0.0",   "255.255.252.0"],   // ME Datacenter
    ["103.242.0.0",   "255.255.252.0"],   // ME Datacenter 2
    ["185.93.0.0",    "255.255.0.0"],     // ME Gaming Servers

    // ──── AWS البحرين (المنطقة nearest للشرق الأوسط) ────
    ["15.184.0.0",    "255.252.0.0"],     // AWS ME-South-1
    ["15.185.0.0",    "255.255.0.0"],     // AWS ME-South-1
    ["16.24.0.0",     "255.252.0.0"],     // AWS ME extra
    ["52.66.0.0",     "255.255.0.0"],     // AWS ME
    ["52.67.0.0",     "255.255.0.0"],     // AWS ME

    // ──── Azure الإمارات ────
    ["20.37.0.0",     "255.255.0.0"],     // Azure UAE North
    ["20.38.0.0",     "255.255.0.0"],     // Azure UAE North
    ["20.39.0.0",     "255.255.0.0"],     // Azure UAE Central
    ["20.40.0.0",     "255.248.0.0"],     // Azure ME
    ["20.46.0.0",     "255.254.0.0"],     // Azure ME extra
    ["20.150.0.0",    "255.254.0.0"],     // Azure ME

    // ──── Google Cloud دبي ────
    ["34.0.16.0",     "255.255.240.0"],   // GCP ME-Dubai
    ["35.180.0.0",    "255.254.0.0"],     // GCP ME
    ["35.200.0.0",    "255.248.0.0"],     // GCP ME extra

    // ──── Oracle Cloud جدة ────
    ["134.70.0.0",    "255.255.0.0"],     // OCI ME-Jeddah
    ["138.1.0.0",     "255.255.0.0"],     // OCI ME

    // ──── Linode/DigitalOcean ME ────
    ["139.59.0.0",    "255.255.0.0"],     // DO Singapore→ME
    ["178.62.0.0",    "255.254.0.0"],     // Linode ME

    // ──── Cloudflare (له عقد بالشرق الأوسط) ────
    ["104.16.0.0",    "255.240.0.0"],
    ["104.20.0.0",    "255.254.0.0"],
    ["172.64.0.0",    "255.248.0.0"],
    ["172.67.0.0",    "255.255.0.0"],
    ["173.245.48.0",  "255.255.240.0"],
    ["103.21.244.0",  "255.255.252.0"],
    ["103.22.200.0",  "255.255.252.0"],
    ["103.31.4.0",    "255.255.252.0"],
    ["141.101.64.0",  "255.255.192.0"],
    ["108.162.192.0", "255.255.192.0"],
    ["190.93.240.0",  "255.255.240.0"],
    ["188.114.96.0",  "255.255.240.0"],
    ["197.234.240.0", "255.255.240.0"],
    ["198.41.128.0",  "255.255.128.0"],

    // ──── Akamai CDN (عقد ME) ────
    ["23.0.0.0",      "255.128.0.0"],
    ["23.32.0.0",     "255.224.0.0"],
    ["23.64.0.0",     "255.248.0.0"],
    ["23.72.0.0",     "255.248.0.0"],
    ["104.64.0.0",    "255.192.0.0"],

    // ──── UAE ISPs ────
    ["94.56.0.0",     "255.254.0.0"],     // Etisalat
    ["91.72.0.0",     "255.252.0.0"],     // Etisalat
    ["94.200.0.0",    "255.248.0.0"],     // DU
    ["86.96.0.0",     "255.240.0.0"],     // DU
    ["37.202.0.0",    "255.255.0.0"],     // UAE
    ["2.48.0.0",      "255.252.0.0"],     // Etisalat
    ["80.168.0.0",    "255.248.0.0"],     // UAE
    ["46.19.0.0",     "255.255.0.0"],     // UAE

    // ──── Saudi ISPs ────
    ["212.76.0.0",    "255.252.0.0"],     // STC
    ["86.51.0.0",     "255.255.0.0"],     // STC
    ["188.54.0.0",    "255.254.0.0"],     // Mobily
    ["94.96.0.0",     "255.224.0.0"],     // STC
    ["188.160.0.0",   "255.240.0.0"],     // Zain SA
    ["178.78.0.0",    "255.254.0.0"],     // Saudi

    // ──── Jordan ISPs (كلهم) ────
    ["46.185.128.0",  "255.255.128.0"],   // Orange
    ["46.185.192.0",  "255.255.192.0"],   // Orange 2
    ["213.139.64.0",  "255.255.192.0"],   // Orange 3
    ["213.139.128.0", "255.255.128.0"],   // Orange 4
    ["41.188.0.0",    "255.255.128.0"],   // Orange 5
    ["77.245.0.0",    "255.255.240.0"],   // Zain
    ["77.245.16.0",   "255.255.240.0"],   // Zain 2
    ["77.245.32.0",   "255.255.224.0"],   // Zain 3
    ["212.34.0.0",    "255.255.0.0"],     // Zain 4
    ["212.34.128.0",  "255.255.128.0"],   // Zain 5
    ["37.123.128.0",  "255.255.128.0"],   // Zain Gaming
    ["79.134.128.0",  "255.255.224.0"],   // Umniah
    ["79.134.160.0",  "255.255.224.0"],   // Umniah 2
    ["91.186.0.0",    "255.255.224.0"],   // Umniah 3
    ["176.29.0.0",    "255.255.0.0"],     // Damamax
    ["176.29.128.0",  "255.255.128.0"],   // Damamax 2
    ["176.57.0.0",    "255.255.0.0"],     // JO Other
    ["185.131.216.0", "255.255.252.0"],   // JO DC
    ["185.170.164.0", "255.255.252.0"],   // JO DC 2
    ["185.86.148.0",  "255.255.252.0"],   // JO DC 3
    ["188.123.0.0",   "255.255.0.0"],     // JO
    ["188.247.0.0",   "255.255.0.0"],     // JO
    ["5.23.0.0",      "255.255.0.0"],     // JO
    ["109.224.0.0",   "255.255.0.0"],     // JO
    ["193.188.64.0",  "255.255.224.0"],   // JO
    ["149.200.0.0",   "255.255.0.0"],     // JO
    ["31.14.64.0",    "255.255.192.0"],   // JO
    ["178.77.0.0",    "255.255.0.0"],     // JO

    // ──── Lebanon ────
    ["185.26.124.0",  "255.255.252.0"],
    ["178.135.0.0",   "255.255.0.0"],
    ["82.137.192.0",  "255.255.224.0"],

    // ──── Iraq ────
    ["5.1.0.0",       "255.255.0.0"],
    ["37.236.0.0",    "255.252.0.0"],
    ["185.33.148.0",  "255.255.252.0"],

    // ──── Egypt ────
    ["41.206.0.0",    "255.255.128.0"],
    ["196.202.0.0",   "255.254.0.0"],
    ["197.34.0.0",    "255.254.0.0"],
    ["105.196.0.0",   "255.254.0.0"],

    // ──── Kuwait ────
    ["95.142.0.0",    "255.255.0.0"],
    ["168.187.0.0",   "255.255.0.0"],

    // ──── Qatar ────
    ["37.210.0.0",    "255.255.0.0"],
    ["89.211.0.0",    "255.255.0.0"],

    // ──── Oman ────
    ["5.41.0.0",      "255.255.0.0"],
    ["46.32.0.0",     "255.255.0.0"],

    // ──── Bahrain ────
    ["85.159.0.0",    "255.255.0.0"],
    ["93.93.0.0",     "255.255.0.0"],
    ["93.95.0.0",     "255.255.0.0"]
];

// ═══════════════════════════════════════════════════════════════
//  ★★★ سيرفرات خارج الشرق الأوسط — لازم تتحجب ★★★
//  ★★★ هاي بتخلي ببجي被迫 يستخدم ME servers ★★★
// ═══════════════════════════════════════════════════════════════

var BLOCKED_REGIONS = [
    // ──── شرق آسيا (أكثر سيرفرات ببجي) ────
    ["36.0.0.0",    "248.0.0.0"],  ["39.0.0.0",    "255.0.0.0"],
    ["42.0.0.0",    "255.0.0.0"],  ["49.0.0.0",    "255.0.0.0"],
    ["58.0.0.0",    "254.0.0.0"],  ["59.0.0.0",    "255.0.0.0"],
    ["60.0.0.0",    "255.0.0.0"],  ["61.0.0.0",    "255.0.0.0"],
    ["101.0.0.0",   "255.0.0.0"],  ["106.0.0.0",   "254.0.0.0"],
    ["110.0.0.0",   "252.0.0.0"],  ["112.0.0.0",   "252.0.0.0"],
    ["114.0.0.0",   "254.0.0.0"],  ["116.0.0.0",   "252.0.0.0"],
    ["117.0.0.0",   "255.0.0.0"],  ["118.0.0.0",   "254.0.0.0"],
    ["119.0.0.0",   "255.0.0.0"],  ["120.0.0.0",   "248.0.0.0"],
    ["121.0.0.0",   "255.0.0.0"],  ["122.0.0.0",   "254.0.0.0"],
    ["124.0.0.0",   "255.0.0.0"],  ["125.0.0.0",   "255.0.0.0"],
    ["126.0.0.0",   "254.0.0.0"],  ["133.0.0.0",   "255.0.0.0"],
    ["150.0.0.0",   "255.0.0.0"],  ["175.0.0.0",   "255.0.0.0"],
    ["180.0.0.0",   "248.0.0.0"],  ["182.0.0.0",   "254.0.0.0"],
    ["183.0.0.0",   "255.0.0.0"],  ["202.0.0.0",   "254.0.0.0"],
    ["203.0.0.0",   "255.128.0.0"],["210.0.0.0",   "254.0.0.0"],
    ["211.0.0.0",   "255.0.0.0"],  ["218.0.0.0",   "254.0.0.0"],
    ["219.0.0.0",   "255.0.0.0"],  ["220.0.0.0",   "252.0.0.0"],
    ["221.0.0.0",   "255.0.0.0"],  ["222.0.0.0",   "254.0.0.0"],
    ["223.0.0.0",   "255.0.0.0"],

    // ──── أوروبا ────
    ["2.0.0.0",     "254.0.0.0"],  ["5.0.0.0",     "255.0.0.0"],
    ["31.0.0.0",    "255.0.0.0"],  ["37.0.0.0",    "255.128.0.0"],
    ["46.0.0.0",    "255.128.0.0"],["51.0.0.0",    "255.0.0.0"],
    ["62.0.0.0",    "255.0.0.0"],  ["77.0.0.0",    "255.128.0.0"],
    ["78.0.0.0",    "254.0.0.0"],  ["79.0.0.0",    "255.128.0.0"],
    ["80.0.0.0",    "252.0.0.0"],  ["82.0.0.0",    "254.0.0.0"],
    ["83.0.0.0",    "255.0.0.0"],  ["84.0.0.0",    "252.0.0.0"],
    ["85.0.0.0",    "255.0.0.0"],  ["86.0.0.0",    "254.0.0.0"],
    ["87.0.0.0",    "255.0.0.0"],  ["88.0.0.0",    "254.0.0.0"],
    ["89.0.0.0",    "255.0.0.0"],  ["90.0.0.0",    "254.0.0.0"],
    ["91.0.0.0",    "255.128.0.0"],["92.0.0.0",    "254.0.0.0"],
    ["93.0.0.0",    "255.0.0.0"],  ["94.0.0.0",    "252.0.0.0"],
    ["95.0.0.0",    "255.0.0.0"],  ["109.0.0.0",   "255.128.0.0"],
    ["130.0.0.0",   "255.128.0.0"],["134.0.0.0",   "255.0.0.0"],
    ["141.0.0.0",   "255.0.0.0"],  ["145.0.0.0",   "255.0.0.0"],
    ["146.0.0.0",   "255.0.0.0"],  ["149.0.0.0",   "255.0.0.0"],
    ["151.0.0.0",   "255.0.0.0"],  ["155.0.0.0",   "255.0.0.0"],
    ["158.0.0.0",   "255.0.0.0"],  ["160.0.0.0",   "255.0.0.0"],
    ["161.0.0.0",   "255.0.0.0"],  ["163.0.0.0",   "255.0.0.0"],
    ["164.0.0.0",   "255.0.0.0"],  ["165.0.0.0",   "255.0.0.0"],
    ["176.0.0.0",   "248.0.0.0"],  ["178.0.0.0",   "254.0.0.0"],
    ["185.0.0.0",   "255.0.0.0"],  ["188.0.0.0",   "255.128.0.0"],
    ["193.0.0.0",   "255.0.0.0"],  ["194.0.0.0",   "254.0.0.0"],
    ["195.0.0.0",   "255.0.0.0"],  ["212.0.0.0",   "255.0.0.0"],
    ["213.0.0.0",   "255.0.0.0"],  ["217.0.0.0",   "255.0.0.0"],

    // ──── روسيا / CIS ────
    ["5.136.0.0",   "255.248.0.0"],["31.128.0.0",  "255.192.0.0"],
    ["37.110.0.0",  "255.254.0.0"],["46.16.0.0",   "255.240.0.0"],
    ["80.246.0.0",  "255.254.0.0"],["85.140.0.0",  "255.240.0.0"],
    ["89.175.0.0",  "255.255.0.0"],["89.232.0.0",  "255.248.0.0"],
    ["91.196.0.0",  "255.252.0.0"],["92.100.0.0",  "255.252.0.0"],
    ["95.24.0.0",   "255.248.0.0"],["109.192.0.0", "255.192.0.0"],
    ["176.59.0.0",  "255.255.0.0"],["178.64.0.0",  "255.192.0.0"],
    ["178.140.0.0", "255.254.0.0"],

    // ──── الأمريكتين ────
    ["3.0.0.0",     "255.0.0.0"],  ["4.0.0.0",     "252.0.0.0"],
    ["8.0.0.0",     "254.0.0.0"],  ["12.0.0.0",    "252.0.0.0"],
    ["16.0.0.0",    "248.0.0.0"],  ["24.0.0.0",    "248.0.0.0"],
    ["32.0.0.0",    "224.0.0.0"],  ["64.0.0.0",    "192.0.0.0"],
    ["128.0.0.0",   "224.0.0.0"],  ["190.0.0.0",   "255.0.0.0"],
    ["191.0.0.0",   "255.0.0.0"],  ["192.0.0.0",   "255.0.0.0"],
    ["198.0.0.0",   "254.0.0.0"],  ["200.0.0.0",   "254.0.0.0"],
    ["201.0.0.0",   "255.0.0.0"],  ["204.0.0.0",   "252.0.0.0"],
    ["208.0.0.0",   "248.0.0.0"],  ["216.0.0.0",   "248.0.0.0"],

    // ──── أفريقيا (خارج North Africa) ────
    ["102.0.0.0",   "254.0.0.0"],  ["105.0.0.0",   "255.0.0.0"],
    ["154.0.0.0",   "254.0.0.0"],  ["196.0.0.0",   "252.0.0.0"],
    ["197.0.0.0",   "255.0.0.0"],

    // ──── أقيانوسيا ────
    ["1.0.0.0",     "255.128.0.0"],["14.0.0.0",    "255.128.0.0"],
    ["27.0.0.0",    "255.128.0.0"],["43.0.0.0",    "255.0.0.0"],
    ["168.0.0.0",   "255.0.0.0"]
];

// ═══════════════════════════════════════════════════════════════
//  ★★★ كشف ببجي超级 — كل النطاقات المعروفة ★★★
// ═══════════════════════════════════════════════════════════════

function isPUBG(h) {
    return /pubg|bgmi|tencent|krafton|bluehole|levelinfinite|
            lightspeed|igamecj|yuanlin|anticheatexpert|gtimg|
            idqqimg|gpubgm|proximabeta|tencentyoutu|gameloop|
            tcgame|overseas\.gcloudsdk|gcloud|tencentgme|
            gpjbh|gpjcj|igamecdn|cdnpubg|match\.pubg|
            api\.pubg|royalpass|rp\.pubg|pubgmobile|
            pubg\.com|tencentgames|timi|gcloudsdk|
            wegame|wegamecdn|hermes|hermesproxy|
            akamaized|cloudfront|azureedge|amazonaws|
            igamecentral|gpjcommon|gpjdj|gpjbj|
            pubgmcdn|pubgapi|pubgmatch|pubgdata|
            pubgsdk|pubglogin|pubgauth|pubgchat|
            pubgfriend|pubgsquad|pubgclan|pubgvoice|
            pubgstore|pubgshop|pubgevent|pubgmission|
            pubgrank|pubgpass|pubgcrate|pubgdraw|
            pubgskin|pubgmap|pubgunreal|pubganti|
            kraftoncdn|kraftonapi|kraftonmatch/i.test(h);
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ التقنية القاتلة: حجب كل طرق كشف الموقع ★★★
// ═══════════════════════════════════════════════════════════════

function blocksLocationDiscovery(h, u) {
    // ── WebRTC / STUN / TURN ──
    if (/stun\.|turn\.|webrtc|icecandidate|getusermedia|
        peerconnection|rtcpeer|dtls|srtp|rtcp|
        stunserver|stunprotocol|stun\.l\.google|
        stun1\.|stun2\.|stun3\.|stun4\./i.test(h + u)) {
        return true;
    }

    // ── خدمات كشف IP ──
    if (/ip-api|ipinfo|ipapi|geoip|maxmind|geoplugin|
        ipwhois|iplocation|whatismyip|ip\.cn|
        speedtest|fast\.com|ookla|pingtest|
        ifconfig|icanhazip|checkip|myip|
        seeip|ip\.sb|ipify|ipapi\.co|
        ip-api\.com|ipinfo\.io|freegeoip|
        ipstack|ipgeolocation|abstractapi|
        ipwhois\.io|ipapi\.json/i.test(h)) {
        return true;
    }

    // ── خدمات Tencent لتحديد المنطقة ──
    if (/beacon\.qq\.com|report\.qq\.com|h5\.qq\.com|
        pingtas\.qq\.com|tdw\.qq\.com|
        snowflake\.qq\.com|tdw\.tencent\.com|
        beacon\.tencent\.com|beaconcdn/i.test(h)) {
        return true;
    }

    // ── خدمات Google Location ──
    if (/location\.googleapis\.com|geolocation|
        maps\.googleapis.*geolocate/i.test(h)) {
        return true;
    }

    return false;
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ التقنية القاتلة 2: كشف طلبات تحديد المنطقة ★★★
// ═══════════════════════════════════════════════════════════════

function isRegionSelection(h, u) {
    return /region|setregion|changeregion|serverselect|
            matchmaking|findmatch|queue|dispatch|
            gateway\.pubg|router\.pubg|lb\.pubg|
            loadbalancer|serverlist|getserver|
            serverstatus|ping\.pubg|auto\.region|
            nearest\.server|best\.server|
            server\.latency|server\.ping|
            matchmaking\.region|match\.region|
            lobby\.region|game\.region/i.test(h + u);
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ التقنية القاتلة 3: تصنيف حركة ببجي بدقة ★★★
// ═══════════════════════════════════════════════════════════════

function classify(u, h) {
    var c = u + " " + h;

    // ماتش حقيقي
    if (/match|battle|gameplay|combat|realtime|sync|
        tdm|arena|war|infection|payday|zombie|
        erangel|miramar|sanhok|vikendi|karakin|livik|
        nusa|ronta|troi|payload|airdrop|zone|circle|
        safearea|bluezone|playzone|lobbyserver|
        gameserver|battleground|drop|parachute|
        spectate|killcam|replay|clutch|knock|
        revive|respawn|deathcam|loot|crate_|
        airdrop|flare|carepackage|redzone/i.test(c)) return "MATCH";

    // Matchmaking
    if (/matchmaking|findmatch|searchmatch|joinmatch|
        creatematch|startmatch|matchqueue|
        queue\.match|search\.match|find\.match/i.test(c)) return "MM";

    // مضاد غش
    if (/anticheat|security|verify|hackdetect|
        monitor|safeclient|integrity|battleye|
        fairplay|gameguard|anticheatexpert|
        securitycheck|devicecheck|rootcheck|
        emulatordetect|vpncheck/i.test(c)) return "AC";

    // لوبي
    if (/lobby|login|auth|season|event|loadout|
        mission|task|rank|recruit|pass|
        mainmenu|frontpage|news|notice|
        inbox|reward|achievement|title/i.test(c)) return "LOBBY";

    // متجر
    if (/shop|store|purchase|uc\.|coupon|redeem|
        offer|bundle|discount|royalpass|rp\.|
        lucky|wheel|crate|draw|spin|gacha|
        skin|outfit|emote|parachute_|frame/i.test(c)) return "SHOP";

    // سوشيال
    if (/friend|invite|squad|team|party|clan|
        social|guild|chat|msg|mail|live|
        voice|tencentgme|gmevoice|im\.pubg|
        whisper|pm\./i.test(c)) return "SOCIAL";

    // CDN
    if (/cdn|asset|resource|patch|update|download|
        hotfix|bundle\.|config\.|version|
        cdn-pubg|igamecdn|cdnres|apk|obb|
        texture|model|anim|audio|video/i.test(c)) return "CDN";

    // تحليلات
    if (/analytics|telemetry|track|metric|beacon|
        crashlytics|bugly|firebase|adjust|
        appsflyer|sensor|data\.collect/i.test(c)) return "ANALYTICS";

    // إعلانات
    if (/admob|unityads|applovin|vungle|
        mintegral|ironsource|pangle|topon/i.test(c)) return "ADS";

    return "OTHER";
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ آلة حالة اللعبة ★★★
// ═══════════════════════════════════════════════════════════════

var ST = {
    cur: "IDLE", prev: "IDLE",
    matchT: 0, lobbyT: 0, mmT: 0,
    mCount: 0, mOk: 0, mFail: 0,
    start: 0
};

function setState(s) {
    if (ST.cur === s) return;
    ST.prev = ST.cur;
    ST.cur = s;

    if (s === "MM") {
        ST.mmT = Date.now();
        unlock("new matchmaking");
        R.cnt = 0;
        R.fails = {};
    }
    if (s === "IN" || s === "TDM" || s === "ARENA") {
        ST.matchT = Date.now();
        ST.mCount++;
        ST.mOk++;
    }
    if (s === "LOBBY") {
        ST.lobbyT = Date.now();
    }

    L("🎮 " + ST.prev + " → " + s);
}

function guessState(u, h) {
    var c = u + " " + h;
    if (/matchmaking|queue|findmatch|recruit|search/i.test(c)) return "MM";
    if (/tdm|teamdeath/i.test(c)) return "TDM";
    if (/arena|war|infection|payday/i.test(c)) return "ARENA";
    if (/match|battle|gameplay|combat|erangel|miramar|sanhok|vikendi|karakin|livik|nusa|udp/i.test(c)) return "IN";
    if (/shop|store|purchase|uc|crate|rp\./i.test(c)) return "SHOP";
    if (/friend|squad|team|clan|chat/i.test(c)) return "SOCIAL";
    if (/lobby|login|auth|season|event|rank|pass/i.test(c)) return "LOBBY";
    return ST.cur;
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ نظام التثبيت超级 ★★★
// ═══════════════════════════════════════════════════════════════

var LK = {
    n24: null, n16: null, px: null,
    ip: null, isp: null, port: null,
    on: false, t: 0, mc: 0
};

function lock(ip, px) {
    var p = ip.split(".");
    LK.n24  = p[0] + "." + p[1] + "." + p[2] + ".0";
    LK.n16  = p[0] + "." + p[1] + ".0.0";
    LK.px   = px;
    LK.ip   = ip;
    LK.isp  = ispOf(ip);
    LK.on   = true;
    LK.t    = Date.now();
    LK.mc++;

    L("🔒═════════════════════════════════🔒");
    L("  مثبت! IP:" + ip + " ISP:" + LK.isp);
    L("  Net:" + LK.n24 + " Proxy:" + px);
    L("  Match #" + LK.mc);
    L("🔒═════════════════════════════════🔒");
}

function unlock(r) {
    L("🔓 فتح: " + r);
    LK.n24 = null; LK.n16 = null; LK.ip = null;
    LK.on = false;
}

function isLockMatch(ip) {
    if (!LK.on || !LK.n24) return true;
    var p = ip.split(".");
    return (p[0] + "." + p[1] + "." + p[2] + ".0") === LK.n24;
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ كشف ISP ★★★
// ═══════════════════════════════════════════════════════════════

function ispOf(ip) {
    var p = ip.split(".");
    var a = +p[0], b = +p[1];

    if (a === 46 && b === 185)  return "Orange-JO";
    if (a === 213 && b === 139) return "Orange-JO";
    if (a === 41 && b === 188)  return "Orange-JO";
    if (a === 77 && b >= 245)   return "Zain-JO";
    if (a === 212 && b === 34)  return "Zain-JO";
    if (a === 37 && b === 123)  return "Zain-JO";
    if (a === 79 && b === 134)  return "Umniah-JO";
    if (a === 91 && b === 186)  return "Umniah-JO";
    if (a === 176 && b === 29)  return "Damamax-JO";
    if (a === 176 && b === 57)  return "Damamax-JO";
    if (a === 185)              return "DC-JO";
    if (a === 188)              return "Other-JO";
    if (a === 94)               return "UAE";
    if (a === 91 && b >= 72)    return "UAE";
    if (a === 212 && b >= 76)   return "SA";
    if (a === 86 && b === 51)   return "SA";
    if (a === 41 && b === 206)  return "EG";
    if (a === 15 && b === 184)  return "AWS-BH";
    if (a === 20 && b === 37)   return "AZ-UAE";
    if (a === 20 && b === 38)   return "AZ-UAE";
    if (a === 20 && b === 39)   return "AZ-UAE";
    return "Unknown";
}

function isJO(isp) {
    return /JO/.test(isp);
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ ساعات الذروة ★★★
// ═══════════════════════════════════════════════════════════════

var JO_PEAK = [
    30,20,10,5,3,3,5,8,12,15,18,20,   // 0-11
    25,22,20,25,35,45,65,80,90,95,85,60 // 12-23
];

function density() {
    var h = new Date().getHours();
    var d = JO_PEAK[h] || 20;
    var dy = new Date().getDay();
    if (dy === 5 || dy === 6) d = Math.min(d * 1.4, 100);
    return d;
}

function isPeak() { return density() > 50; }

// ═══════════════════════════════════════════════════════════════
//  ★★★ IP Tools ★★★
// ═══════════════════════════════════════════════════════════════

function ip2l(ip) {
    var p = ip.split(".");
    if (p.length !== 4) return 0;
    return ((+p[0] << 24) | (+p[1] << 16) | (+p[2] << 8) | +p[3]) >>> 0;
}

function inL(ip, lst) {
    if (!ip || ip.indexOf(":") > -1) return false;
    var il = ip2l(ip);
    if (!il) return false;
    for (var i = 0; i < lst.length; i++) {
        if ((il & ip2l(lst[i][1])) === (ip2l(lst[i][0]) & ip2l(lst[i][1])))
            return true;
    }
    return false;
}

function isME(ip)  { return inL(ip, ME_RANGES); }
function isBLK(ip) { return inL(ip, BLOCKED_REGIONS); }

// ═══════════════════════════════════════════════════════════════
//  ★★★ DNS ذكي ★★★
// ═══════════════════════════════════════════════════════════════

var _dns = {}, _dnsT = {}, DNS_TTL = 600000;

function dns(host) {
    var n = Date.now();
    if (_dns[host] && _dnsT[host] && n - _dnsT[host] < DNS_TTL)
        return _dns[host];

    var ip = null;
    try {
        if (typeof dnsResolveEx === "function") {
            var a = dnsResolveEx(host);
            if (a && a.length) {
                for (var k = 0; k < a.length; k++)
                    if (a[k].indexOf(":") === -1) { ip = a[k]; break; }
            }
        }
    } catch(e) {}
    if (!ip) try { ip = dnsResolve(host); } catch(e) {}

    if (ip && ip.indexOf(":") === -1) {
        _dns[host] = ip;
        _dnsT[host] = n;
    }
    return ip;
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ نظام إعادة المحاولة超级 ★★★
// ═══════════════════════════════════════════════════════════════

var R = {
    cnt: 0, max: MAX_RETRIES, lt: 0, li: 0,
    fails: {}, ok: {}, lat: {}, total: 0
};

function allPx() {
    return P_ORANGE.concat(P_ZAIN).concat(P_UMNIAH).concat(P_DAMAMAX).concat(P_EXTRA);
}

function bestPx(type) {
    if (LK.on && LK.px) return LK.px;

    var pool;
    switch (type) {
        case "MATCH": case "MM": case "AC":
            pool = P_ORANGE.concat(P_ZAIN); break;
        case "LOBBY": case "SHOP":
            pool = P_ZAIN.concat(P_ORANGE).concat(P_UMNIAH); break;
        case "SOCIAL": case "CDN":
            pool = P_ORANGE.concat(P_ZAIN).concat(P_EXTRA); break;
        default:
            pool = P_ORANGE.concat(P_ZAIN).concat(P_UMNIAH);
    }

    // اختيار ذكي
    var best = pool[0], bs = -9999;
    for (var i = 0; i < pool.length; i++) {
        var p = pool[i];
        var f = R.fails[p] || 0;
        var s = R.ok[p] || 0;
        var l = R.lat[p] || 200;
        var score = (s * 10) - (f * 30) - (l / 5);
        if (isPeak() && p.indexOf("46.185") > -1) score += 30;
        if (isPeak() && p.indexOf("212.35") > -1) score += 25;
        if (score > bs) { bs = score; best = p; }
    }
    return best;
}

function nextPx() {
    var all = allPx();
    var idx = (R.li + 1) % all.length;
    R.li = idx;
    var t = 0;
    while ((R.fails[all[idx]] || 0) > 5 && t < all.length) {
        idx = (idx + 1) % all.length;
        t++;
    }
    return all[idx];
}

function canRetry() {
    if (R.cnt >= R.max) return false;
    var d = Math.min(500 * Math.pow(1.3, R.cnt), 5000) + (Math.random() * 300 | 0);
    if (Date.now() - R.lt < d) return false;
    return true;
}

function retry(why) {
    R.cnt++;
    R.total++;
    R.lt = Date.now();
    if (LK.px) R.fails[LK.px] = (R.fails[LK.px] || 0) + 1;
    var px = nextPx();
    L("↻ محاولة " + R.cnt + "/" + R.max + " → " + px + " [" + why + "]");
    return px;
}

function okPx(px) {
    R.ok[px] = (R.ok[px] || 0) + 1;
    R.fails[px] = 0;
    R.cnt = 0;
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ تسجيل ★★★
// ═══════════════════════════════════════════════════════════════

function L(m) {
    if (!DEBUG) return;
    try {
        var t = new Date().toISOString().substr(11, 12);
        console.log("[JO] [" + t + "] " + m);
    } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════
//  ★★★ تنظيف الهوست ★★★
// ═══════════════════════════════════════════════════════════════

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
    return h.replace(/[^a-z0-9\.\-]/g, "");
}

// ═══════════════════════════════════════════════════════════════
//
//  ██████╗ ██╗   ██╗██████╗ ██╗   ██╗███████╗
//  ██╔══██╗██║   ██║██╔══██╗██║   ██║██╔════╝
//  ██████╔╝██║   ██║██║  ██║██║   ██║███████╗
//  ██╔═══╝ ██║   ██║██║  ██║██║   ██║╚════██║
//  ██║     ╚██████╔╝██████╔╝╚██████╔╝███████║
//  ╚═╝      ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝
//
//  ★★★ الدالة الرئيسية — كل شي هون ★★★
//
// ═══════════════════════════════════════════════════════════════

function FindProxyForURL(url, host) {

    // ══════ 1. تهيئة ══════
    if (!ST.start) {
        ST.start = Date.now();
        L("╔══════════════════════════════════════╗");
        L("║  PUBG Jordan Final Lock v7.0          ║");
        L("║  بروكسيات: " + allPx().length + "                          ║");
        L("║  كثافة أردنيين: " + density() + "%                      ║");
        L("║  ذروة: " + isPeak() + "                              ║");
        L("╚══════════════════════════════════════╝");
    }

    // ══════ 2. تنظيف ══════
    host = norm(host);
    if (!host) return DIRECT;

    // ══════ 3. ليس ببجي ══════
    if (!isPUBG(host)) return DIRECT;

    // ══════ 4. ★ حجب WebRTC/STUN/GeoLeak ★ ══════
    //    هاي التقنيات بتسرب IPك الحقيقي حتى مع بروكسي
    //    لازم نحجبها بالكامل
    if (blocksLocationDiscovery(host, url)) {
        L("🚫 حجب كشف موقع: " + host);
        return BLOCK;
    }

    // ══════ 5. حل DNS ══════
    var ip = dns(host);
    if (!ip) { L("✗ DNS fail: " + host); return BLOCK; }
    if (ip.indexOf(":") > -1) { L("✗ IPv6: " + host); return BLOCK; }

    // ══════ 6. التصنيف ══════
    var tr = classify(url, host);
    var ns = guessState(url, host);
    if (ns !== ST.cur) setState(ns);

    // ══════ 7. حجب التحليلات والإعلانات ══════
    if (tr === "ANALYTICS" || tr === "ADS") {
        L("🚫 " + tr + " محجوب");
        return BLOCK;
    }

    // ═══════════════════════════════════════════════════════════
    //  ★★★★★  معالجة الماتش — أهم جزء بالسكربت  ★★★★★
    // ═══════════════════════════════════════════════════════════

    if (tr === "MATCH" || tr === "MM") {

        // ──── الخطوة 1: هل السيرفر بالشرق الأوسط؟ ────
        if (!isME(ip)) {

            // هل هو سيرفر محجوب (آسيا/أوروبا/أمريكا)؟
            if (isBLK(ip)) {
                L("🚫 سيرفر محجوب: " + ip);
                if (canRetry()) return retry("محجوب");
                return BLOCK;
            }

            // IP مجهول — ممكن يكون ME
            L("⚠ IP مجهول: " + ip + " — محاولة...");
            if (canRetry()) return retry("مجهول");
            return BLOCK;
        }

        // ──── الخطوة 2: هل هو أردني تحديداً؟ ────
        var isp = ispOf(ip);
        var jo = isJO(isp);

        if (!jo && isPeak()) {
            // وقت الذروة: لازم أردني!
            L("⚠ ذروة + مش أردني: " + ip + " (" + isp + ")");
            if (canRetry()) return retry("فرض أردني بالذروة");
        }

        // ──── الخطوة 3: فحص التثبيت ────
        if (LK.on && LK.n24) {
            if (!isLockMatch(ip)) {
                L("⚠ شبكة مختلفة! مثبت:" + LK.n24 + " جديد:" +
                  ip.split(".")[0]+"."+ip.split(".")[1]+"."+ip.split(".")[2]+".0");
                if (canRetry()) return retry("تغيير شبكة");
            }
        }

        // ──── الخطوة 4: تثبيت جديد ────
        if (!LK.on) {
            var px = bestPx("MATCH");
            lock(ip, px);
            okPx(px);
            R.cnt = 0;

            L("✓✓ دخول! " + (jo ? "🇯🇴 أردني" : "🌍 شرق أوسط"));
            L("   ISP:" + isp + " IP:" + ip);
            return px;
        }

        // ──── الخطوة 5: مثبت → استمر ────
        okPx(LK.px);
        R.cnt = 0;
        return LK.px;
    }

    // ═══════════════════════════════════════════════════════════
    //  ★ معالجة طلبات تحديد المنطقة ★
    //  ★ هاي اللي بتحدد أي منطقة تدخلها ★
    // ═══════════════════════════════════════════════════════════

    if (isRegionSelection(host, url)) {
        if (!isME(ip)) {
            L("🚫 محاولة تحويل منطقة! " + host);
            return BLOCK;
        }
        var px = LK.on ? LK.px : bestPx("MM");
        L("🌍 طلب منطقة → " + px);
        return px;
    }

    // ═══════════════════════════════════════════════════════════
    //  ★ معالجة مضاد الغش ★
    // ═══════════════════════════════════════════════════════════

    if (tr === "AC") {
        if (!isME(ip)) { L("🚫 AC خارج ME: " + ip); return BLOCK; }
        var px = LK.on ? LK.px : bestPx("AC");
        L("🛡 AC → " + px);
        return px;
    }

    // ═══════════════════════════════════════════════════════════
    //  ★ لوبي / متجر / سوشيال / CDN ★
    // ═══════════════════════════════════════════════════════════

    if (tr === "LOBBY" || tr === "SHOP" || tr === "SOCIAL" || tr === "CDN") {
        if (!isME(ip)) {
            L("✗ " + tr + " خارج ME: " + ip);
            return BLOCK;
        }
        var px = LK.on ? LK.px : bestPx(tr);
        var icon = tr === "LOBBY" ? "🏠" : tr === "SHOP" ? "🛒" :
                   tr === "SOCIAL" ? "👥" : "📦";
        L(icon + " " + tr + " → " + px);
        return px;
    }

    // ═══════════════════════════════════════════════════════════
    //  ★ أي شي ثاني من ببجي ★
    // ═══════════════════════════════════════════════════════════

    if (isME(ip)) {
        var px = LK.on ? LK.px : bestPx("OTHER");
        L("🔗 OTHER ME → " + px);
        return px;
    }

    L("✗ مجهول محجوب: " + host + " → " + ip);
    return BLOCK;
}
