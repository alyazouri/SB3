/* =====================================================================
   jordan.pac — سكربت توجيه اتصال مُخصّص للأردن (Proxy Auto-Config)
   =====================================================================
   الفكرة:
     • كل ما هو أردني / محلي (بنوك، فواتيركم، CliQ، وزارات، جامعات،
       مزوّدو الإنترنت، شبكات LAN)  ->  DIRECT بدون بروكسي  (أسرع +
       يتجنّب فشل الدفع ورموز OTP وكسر الجلسات).
     • كل ما هو خارج الأردن        ->  يمرّ عبر البروكسي مع قائمة بدائل
       (fallback) حتى لا ينقطع الاتصال لو وقع أحد الخوادم.

   التثبيت (اختصرته في نهاية الملف + ملف README-pac.md):
     • Windows : الإعدادات > الشبكة > البروكسي > Use setup script
     • macOS   : Network > Details > Proxies > Automatic Proxy Config
     • Android : Wi‑Fi > الشبكة > تعديل > إعدادات متقدمة > بروكسي = تلقائي
     • iOS     : Wi‑Fi > (i) > HTTP Proxy > Automatic
     • Firefox : about:preferences#general > Network Settings > Automatic URL
     • المتصفح : ارفع الملف على أي URL (مثلاً file:///home/user/jordan.pac)

   ⚠ ملاحظة مهمة: ملف PAC لا يُصلح DNS. هو يقرّر "من وين تطلع".
     إذا مشكلتك DNS (مواقع محجوبة / لا تُفتح) فاستخدم بروكسي/VPN
     أو DNS مختلف (1.1.1.1 / 8.8.8.8) — وهذا يغطّيه وضع MODE 1 بالأسفل.
   ===================================================================== */

/* =========================== 1) الإعدادات =========================== */

/* وضع العمل:
     0 = أردني مباشر + الباقي عبر البروكسي   (الافتراضي الموصى به)
     1 = أردني عبر البروكسي + الباقي مباشر   (عكس المنطق — للاختبار)
     2 = أردني عبر البروكسي + الباقي عبر البروكسي (عدا الشبكة المحلية = DIRECT دائماً)
     3 = كل شي DIRECT (البروكسي معطّل — مفيد للمقارنة/التشخيص)        */
var MODE = 0;

/* سلسلة الخوادم بالترتيب: يُجرَّب الأول، ولو فشل ينتقل للتالي.
   الصيغ المدعومة:  "PROXY ip:port"  |  "SOCKS ip:port"  |  "SOCKS5 ip:port"
   غيّر القيم التالية لتطابق خادمك/اشتراكك الحقيقي.                     */
var PROXY_CHAIN = [
    "SOCKS5 127.0.0.1:7890",   // 1) بروكسي محلي (Clash/V2Ray/Nekoray/SingBox)
    "SOCKS5 127.0.0.1:1080",   // 2) بديل محلي شائع
    "PROXY  127.0.0.1:7897",   // 3) HTTP محلي
    "PROXY  127.0.0.1:8080",   // 4) HTTP محلي بديل
    "DIRECT"                   // 5) آخر حل: اتصال مباشر
];

/* لو تريد خادماً واحداً فقط بدون سلسلة بدائل، املأ هذا السطر وسيُستخدم
   بدل PROXY_CHAIN (اتركه فارغاً "" لتفعيل السلسلة بالأعلى):            */
var SINGLE_PROXY = "";          // مثال: "SOCKS5 51.15.12.34:8388"

/* إظهار تنبيه تشخيصي عند كل قرار توجيه (للتجربة فقط — مزعج، أبقه false): */
var DEBUG = false;

/* تجاهل هذه النطاقات دائماً (لا بروكسي عليها مهما كان الوضع):
   أضف هنا أسماء خوادم البروكسي/VPN نفسها حتى لا يدخل traffic في حلقة. */
var NEVER_PROXY = [
    "localhost", "127.0.0.1", "::1", "0.0.0.0"
];

/* ======================== 2) الشبكات المحلية (LAN) ================== */
/* كل ما هنا -> DIRECT دائماً ومهما كان MODE (حتى MODE 2).              */

/* نطاقات داخلية (تُطابق النطاق وأي نطاق فرعي تحته) */
var INTRANET_SUFFIXES = [
    ".local",      // mDNS / Bonjour / أسماء أجهزة الشبكة (nas.local, printer.local)
    ".internal",   // نطاق داخلي شائع
    ".intranet",
    ".corp",
    ".lan",
    ".home",
    ".localdomain",
    ".workgroup",
    ".int",
    ".priv",
    /* --- أضف نطاق شركتك/بيتك الداخلي هنا، مثال: --- */
    // ".office.example.jo",
    // ".dc1.local",
    ""
];

/* أسماء مضيفين داخليين محدّدة (بدون نقاط أو بأسماء قصيرة) */
var LAN_HOSTNAMES = [
    "router", "nas", "printer", "server", "pve", "proxmox", "unifi",
    "switch", "ap", "camera", "nvr", "gitlab", "jenkins", "wiki",
    /* --- أضف أسماء أجهزتك هنا --- */
    ""
];

/* عناوين/شبكات داخلية إضافية بصيغة CIDR (تُحوَّل تلقائياً لشبكة+قناع) */
var LAN_CIDR = [
    // "192.168.100.0/24",   // مثال: شبكة مختبر
    // "10.20.0.0/16",       // مثال: شبكة فرع
];

/* هل نفحص الـ IP بعد حلّ DNS لاكتشاف الأجهزة الداخلية؟                */
var LAN_DNS_CHECK = true;

/* الشبكات الخاصة — دائماً DIRECT */
var LOCAL_NETS = [
    ["10.0.0.0",      "255.0.0.0"],      // 10/8   شبكة داخلية كبيرة
    ["172.16.0.0",    "255.240.0.0"],    // 172.16/12
    ["192.168.0.0",   "255.255.0.0"],    // 192.168/16 راوتر البيت
    ["127.0.0.0",     "255.0.0.0"],      // loopback (البروكسي المحلي يعيش هنا)
    ["169.254.0.0",   "255.255.0.0"],    // link-local
    ["100.64.0.0",    "255.192.0.0"],    // CGNAT (شائع جداً على 4G الأردني)
    ["224.0.0.0",     "240.0.0.0"],      // multicast (mDNS 224.0.0.251 ...)
    ["0.0.0.0",       "255.255.255.255"] // "هذه الشبكة"
];

/* ======================== 3) نطاقات الأردن ========================= */

/* أي نطاق ينتهي بأحد هذه -> يُعتبر أردنياً/محلياً.
   (.jo يغطي وحده معظم المواقع: *.gov.jo, *.edu.jo, *.com.jo, *.org.jo ...) */
var JO_SUFFIXES = [
    ".jo"
];

/* مواقع أردنية/مهمة محلياً لكنها ليست على نطاق .jo
   (كلها تحقّقت أنها تعمل، 2026-09)                                    */
var JO_EXTRA = [
    /* --- الاتصالات ومزوّدو الخدمة --- */
    "orange.jo", "zain.jo", "jo.zain.com", "umniah.com", "zaincash.jo",
    /* --- الطيران والنقل --- */
    "rj.com", "jett.com.jo", "aig.aero",
    /* --- بنوك (نطاقات عالمية) --- */
    "hbtf.com", "housingbank.com", "jordanislamicbank.com", "arabbank.com.jo",
    "arabbank.jo", "cab.jo", "capitalbank.jo", "investbank.jo",
    "bankofjordan.com.jo",
    /* --- الدفع والتحصيل الإلكتروني (الأهم: لا تبروكسيها أبداً) --- */
    "efawateercom.jo", "efawateercom.com", "jopacc.com", "madfoat.com",
    /* --- شركات أردنية مستضافة عالمياً (اختياري — فعّلها لو تحتاجها مباشرة) --- */
    // "hikma.com", "aramex.com", "ltuc.com",
    /* --- أضف نطاقاتك هنا --- */
    ""
];

/* ========================== 4) شبكات الأردن ========================= */
/* [الشبكة، قناع الشبكة] — تُستخدم مع isInNet()                         */
var JO_NETS = [
    ["193.188.64.0",  "255.255.192.0"],  // الحكومة الأردنية (mof/moe/moh/moin...)
    ["188.247.72.0",  "255.255.248.0"],  // الحكومة الأردنية (istd/ssc/dos...)
    ["193.188.0.0",   "255.255.0.0"],    // حكومة/جامعات (شاملة)
    ["87.236.232.0",  "255.255.252.0"],  // جامعات (ju/just/aabu/gju...)
    ["86.108.0.0",    "255.252.0.0"],    // مزوّدو أردنيون (yu.edu.jo...)
    ["212.118.0.0",   "255.255.128.0"],  // Umniah / البنك المركزي
    ["213.139.32.0",  "255.255.224.0"],  // Orange Jordan
    ["80.90.160.0",   "255.255.224.0"],  // Zain Jordan
    ["213.186.128.0", "255.255.128.0"],  // استضافة أردنية
    ["217.29.240.0",  "255.255.240.0"],  // استضافة أردنية
    ["194.165.128.0", "255.255.128.0"],  // استضافة أردنية (amman.jo...)
    ["5.180.0.0",     "255.252.0.0"],    // تخصيصات أردنية
    ["37.75.128.0",   "255.255.128.0"],  // تخصيصات أردنية (arabbank...)
    ["46.185.128.0",  "255.255.128.0"],  // تخصيصات أردنية
    ["91.106.96.0",   "255.255.224.0"],  // تخصيصات أردنية (ammanu.edu.jo...)
    ["92.253.0.0",    "255.255.0.0"],    // تخصيصات أردنية (jpu.edu.jo...)
    ["185.217.124.0", "255.255.252.0"],  // تخصيصات أردنية (irbid.gov.jo...)
    ["176.100.0.0",   "255.252.0.0"],    // تخصيصات أردنية
    ["185.25.36.0",   "255.255.252.0"]   // تخصيصات أردنية
];

/* =========================== 5) الدوال ============================= */

/* تحويل اسم نطاق إلى حروف صغيرة (تجنّب أخطاء الأحرف الكبيرة) */
function lc(s) { return String(s || "").toLowerCase(); }

/* هل النص عنوان IPv4 صحيح؟ */
function isIpv4(h) {
    var p = lc(h).split(".");
    if (p.length !== 4) return false;
    for (var i = 0; i < 4; i++) {
        if (!/^\d{1,3}$/.test(p[i])) return false;
        if (+p[i] > 255) return false;
    }
    return true;
}

/* هل النص عنوان IP (v4 أو v6)؟ */
function isIpLiteral(h) {
    h = lc(h);
    if (h.indexOf(":") > -1) return true;   // IPv6
    return isIpv4(h);
}

/* تجريـد المنفذ/الأقواس من اسم المضيف (بعض الأنظمة تمرّرها معه) */
function bareHost(h) {
    h = lc(h);
    if (!h) return h;
    if (h.charAt(0) === "[") {
        var close = h.indexOf("]");
        if (close > -1) return h.substring(1, close);
        return h.replace(/[\[\]]/g, "");
    }
    var colon = h.lastIndexOf(":");
    var dot = h.lastIndexOf(".");
    if (colon > -1 && h.indexOf(":") === colon && colon > dot) return h.substring(0, colon);
    return h;
}

/* عنوان IPv6 محلي/خاص فقط — العام لا يُعتبر محلياً حتى لا يتجاوز البروكسي */
function isLocalIpv6(h) {
    h = lc(h).replace(/^\[|\]$/g, "").replace(/^::ffff:/, "");
    if (!h || h.indexOf(":") === -1) return false;
    if (h === "::" || h === "::1") return true;                        // غير معرّف / loopback
    if (h.indexOf("fe8") === 0 || h.indexOf("fe9") === 0 ||
        h.indexOf("fea") === 0 || h.indexOf("feb") === 0) return true;  // fe80::/10 link-local
    if (h.indexOf("fc") === 0 || h.indexOf("fd") === 0) return true;    // fc00::/7 (ULA)
    if (h.indexOf("ff") === 0) return true;                             // multicast
    return false;
}

/* تحويل CIDR مثل 192.168.100.0/24 إلى [الشبكة، القناع] */
function cidrToNet(cidr) {
    var parts = String(cidr).split("/");
    var ip = parts[0], bits = parts.length > 1 ? +parts[1] : 32;
    if (!isIpv4(ip) || isNaN(bits) || bits < 0 || bits > 32) return null;
    var mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
    var m = [(mask >>> 24) & 255, (mask >>> 16) & 255, (mask >>> 8) & 255, mask & 255].join(".");
    return [ip, m];
}

/* هل h نفسه أو أي نطاق فرعي منه موجود في القائمة list؟ */
function inSuffixList(h, list) {
    h = lc(h);
    if (!h) return false;
    for (var i = 0; i < list.length; i++) {
        var d = lc(list[i]);
        if (!d) continue;
        if (d.charAt(0) === ".") d = d.substring(1);
        if (!d) continue;
        if (h === d) return true;
        if (h.length > d.length && h.substring(h.length - d.length - 1) === "." + d) return true;
    }
    return false;
}

/* هل العنوان داخل أي شبكة من nets؟ */
function inNets(ip, nets) {
    for (var i = 0; i < nets.length; i++) {
        try { if (isInNet(ip, nets[i][0], nets[i][1])) return true; } catch (e) {}
    }
    return false;
}

/* قائمة شبكات الـ LAN بعد دمج LOCAL_NETS مع LAN_CIDR */
function allLocalNets() {
    var nets = [];
    for (var i = 0; i < LOCAL_NETS.length; i++) nets.push(LOCAL_NETS[i]);
    for (var j = 0; j < LAN_CIDR.length; j++) {
        var n = cidrToNet(LAN_CIDR[j]);
        if (n) nets.push(n);
    }
    return nets;
}

/* هل هذا عنوان داخل الشبكة المحلية؟ (الأولوية القصوى — دائماً DIRECT) */
function isLocal(host) {
    host = lc(host);
    if (!host) return true;

    /* 0) تجريد المنفذ/الأقواس لو مرّا مع المضيف (192.168.1.50:8080 أو [fd00::5]:443) */
    var bare = bareHost(host);

    /* 1) عنوان IP مباشر */
    if (isIpLiteral(bare)) {
        if (bare.indexOf(":") > -1) return isLocalIpv6(bare);   // IPv6: خاص/محلي فقط
        if (inNets(bare, allLocalNets())) return true;
        return false;                                           // IP عام → ليس محلياً
    }

    /* 2) اسم قصير بدون نقطة = جهاز داخل الشبكة (بعد استثناء IPv6 بالأعلى) */
    if (bare.indexOf(".") === -1) return true;

    /* 3) قائمة أسماء الأجهزة الداخلية */
    if (inSuffixList(bare, LAN_HOSTNAMES)) return true;

    /* 4) النطاقات الداخلية: .local / .internal / .corp ... */
    if (inSuffixList(bare, INTRANET_SUFFIXES)) return true;

    /* 5) حلّ DNS ثم فحص الـ IP (يلتقط أسماء داخلية تُحلّ لعناوين خاصة) */
    if (LAN_DNS_CHECK) {
        try {
            var ips = dnsResolveEx(bare) || dnsResolve(bare) || "";
            var parts = String(ips).split(";");
            for (var i = 0; i < parts.length; i++) {
                var ip = parts[i];
                if (!ip) continue;
                if (ip.indexOf(":") > -1) continue;        // IPv6 → نتجاوزه هنا
                if (inNets(ip, allLocalNets())) return true;
            }
        } catch (e) { /* DNS فشل — نكتفي بما سبق */ }
    }
    return false;
}

/* قرار "أردني؟" — يعتمد على النطاق، ولو فشل يطبّق DNS ثم يفحص IP */
function isJordan(url, host) {
    host = lc(host);

    /* 1) فحص سريع بالنطاق (بدون DNS) */
    if (inSuffixList(host, JO_SUFFIXES)) return true;
    if (inSuffixList(host, JO_EXTRA))    return true;

    /* 2) حلّ DNS ثم قارن الـ IP بشبكات الأردن */
    if (DNS_CHECK) {
        try {
            var ips = dnsResolveEx(host);
            if (!ips) { var one = dnsResolve(host); ips = one ? one : ""; }
            var parts = String(ips).split(";");
            for (var i = 0; i < parts.length; i++) {
                var ip = parts[i];
                if (!ip || ip.indexOf(":") > -1) continue;  // نتجاهل IPv6 هنا
                if (inNets(ip, JO_NETS)) return true;
            }
        } catch (e) { /* DNS فشل — نكتفي بقرار النطاق */ }
    }
    return false;
}

/* فحص DNS اختياري (يبطّئ قليلاً لكنه يلتقط مواقع أردنية مستضافة على CDN
   مثل jordan.gov.jo و sanad.jo على Cloudflare/AWS). عطّله لو لاحظت بطئاً: */
var DNS_CHECK = true;

/* بناء سلسلة البروكسي النهائية */
function proxyString() {
    if (SINGLE_PROXY && String(SINGLE_PROXY).length > 3) return SINGLE_PROXY;
    var out = [];
    for (var i = 0; i < PROXY_CHAIN.length; i++) {
        var s = String(PROXY_CHAIN[i] || "").replace(/\s+/g, " ").trim();
        if (s) out.push(s);
    }
    if (!out.length) return "DIRECT";
    /* تأكد أن DIRECT موجود كآخر خيار دائماً */
    var last = out[out.length - 1].toUpperCase();
    if (last.indexOf("DIRECT") === -1) out.push("DIRECT");
    return out.join("; ");
}

function dbg(host, decision, reason) {
    if (DEBUG) { try { alert("PAC [" + host + "] -> " + decision + "  (" + reason + ")"); } catch (e) {} }
}

/* ====================== 6) الدالة الرئيسية ========================= */

function FindProxyForURL(url, host) {
    host = bareHost(host);          /* تطبيع: حروف صغيرة + تجريد المنفذ/الأقواس */
    url  = lc(url);

    /* (أ) استثناءات مطلقة: لا بروكسي إطلاقاً */
    if (inSuffixList(host, NEVER_PROXY)) { dbg(host, "DIRECT", "never-proxy"); return "DIRECT"; }

    /* (ب) الشبكة المحلية — أولوية قصوى، مباشرة حتى لو MODE = 2 */
    if (isLocal(host)) { dbg(host, "DIRECT", "LAN / local → direct"); return "DIRECT"; }

    /* (ج) عنوان IP أردني صريح */
    if (isIpv4(host) && inNets(host, JO_NETS)) {
        dbg(host, "DIRECT", "Jordanian IP"); return "DIRECT";
    }

    /* (د) القرار حسب الوضع */
    if (MODE === 3) { dbg(host, "DIRECT", "MODE 3"); return "DIRECT"; }

    var jo = isJordan(url, host);

    if (MODE === 0) {
        if (jo) { dbg(host, "DIRECT", "Jordan → direct"); return "DIRECT"; }
        var p0 = proxyString();
        dbg(host, p0, "foreign → proxy");
        return p0;
    }

    if (MODE === 1) {
        if (jo) {
            var p1 = proxyString();
            dbg(host, p1, "Jordan → proxy");
            return p1;
        }
        dbg(host, "DIRECT", "MODE 1: foreign → direct");
        return "DIRECT";
    }

    if (MODE === 2) {
        var p2 = proxyString();
        dbg(host, p2, "MODE 2: everything → proxy");
        return p2;
    }

    /* احتياط: أي قيمة MODE غير معروفة = مباشر */
    return "DIRECT";
}

/* دعم بعض الأنظمة التي تنادي الاسم القديم */
function FindProxyForURLEx(url, host) { return FindProxyForURL(url, host); }

/* =========================== 7) التثبيت =============================
   Windows 10/11:
     Settings → Network & internet → Proxy → Use a setup script = On
     Script address: file:///C:/Users/<you>/jordan.pac   (أو رابط http)
   macOS:
     System Settings → Network → Wi‑Fi → Details → Proxies
     → Automatic Proxy Configuration → URL: file:///Users/<you>/jordan.pac
   Android (Wi‑Fi):
     long‑press الشبكة → Modify → Advanced → Proxy = Auto → PAC URL
     (يحتاج الملف منشوراً على http:// لأن file:// غير مدعوم غالباً)
   iPhone/iPad:
     Wi‑Fi → (i) → HTTP Proxy → Automatic → URL
   Firefox (مستقل عن إعدادات النظام):
     about:preferences#general → Network Settings → Settings
     → Automatic proxy configuration URL
   Chrome/Edge (Android) : لا يدعمان PAC مباشرة — استخدم تطبيقاً مثل
     "ProxyDroid" أو متصفح Firefox/Orfox، أو فعّل البروكسي على مستوى الجهاز.

   نشر الملف على رابط (مفيد للموبايل):
     cd /home/user && python3 -m http.server 8080 --bind 0.0.0.0
     ثم استخدم: http://<IP‑جهازك>:8080/jordan.pac
   ==================================================================== */
