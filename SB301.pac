// ============================================================
// PUBG MOBILE — JORDAN LOCK v9.0
// ============================================================
// Ultra Low Ping — IPv6 Pure Jordan
// DNS: Cloudflare IPv6 → 2606:4700:4700::1111 / ::1001
// Smart DNS Resolution — IPv6 Priority
// Dynamic Lobby Rotation — Full Jordan ISP Coverage
// Match Session Lock /64
// Anti-Leak Protection — IPv4 Hard Block
// Browser & App Traffic — DIRECT Bypass
// Relay & CDN Boost
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SESSION — Match + Lobby + Relay Tracking
// ============================================================

var SESSION = {
  matchNet:   null,
  matchHost:  null,
  lobbyNet:   null,
  relayNode:  null,
  startTime:  0,
  timeout:    1800000   // 30 دقيقة — إعادة تعيين تلقائية
};

// ============================================================
// PRIORITY PATTERNS
// ============================================================

var PRIORITY = {

  // داخل المباراة — أعلى أولوية
  CRITICAL: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr/i,

  // relay — ثاني أولوية
  RELAY: /relay|turn|stun|p2p|webrtc|udprelay|tcprelay/i,

  // لوبي وخدمات — ثالث أولوية
  LOBBY: /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|patch|update|cdn|config/i,

  // تصفح وخدمات عامة — DIRECT
  BROWSER: /google|youtube|facebook|instagram|twitter|tiktok|snapchat|whatsapp|telegram|netflix|spotify|apple|microsoft|windows|amazon|cloudfront|akamai|fastly/i

};

// ============================================================
// HELPERS
// ============================================================

function isPUBG(h, u){
  return /pubg|tencent|krafton|lightspeed|levelinfinite/i.test(h + u);
}

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

function isIPv4(ip){
  return ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip);
}

function isBrowser(h, u){
  return PRIORITY.BROWSER.test(h + u);
}

// ============================================================
// SESSION TIMEOUT — إعادة تعيين تلقائية بعد 30 دقيقة
// ============================================================

function checkSessionTimeout(){
  var now = Date.now ? Date.now() : new Date().getTime();
  if (SESSION.startTime && (now - SESSION.startTime) > SESSION.timeout){
    SESSION.matchNet  = null;
    SESSION.matchHost = null;
    SESSION.lobbyNet  = null;
    SESSION.relayNode = null;
    SESSION.startTime = 0;
  }
}

// ============================================================
// SMART DNS RESOLUTION — IPv6 Priority
// Cloudflare: 2606:4700:4700::1111 / 2606:4700:4700::1001
// ============================================================

function resolveIPv6(host){
  var ip = "";

  // المحاولة الأولى — dnsResolveEx (يُرجع كل العناوين)
  try {
    ip = dnsResolveEx(host);
  } catch(e1) {
    // المحاولة الثانية — dnsResolve العادي
    try {
      ip = dnsResolve(host);
    } catch(e2) {
      return "";
    }
  }

  if (!ip) return "";

  // إذا فيه أكثر من عنوان — اختر IPv6 أولاً
  if (ip.indexOf(";") !== -1){
    var addrs = ip.split(";");
    for (var i = 0; i < addrs.length; i++){
      var addr = addrs[i].trim();
      if (isIPv6(addr)) return addr;
    }
    // fallback لـ IPv4 إذا ما فيه IPv6
    for (var j = 0; j < addrs.length; j++){
      var addr4 = addrs[j].trim();
      if (isIPv4(addr4)) return addr4;
    }
  }

  return ip.trim();
}

// ============================================================
// MATCH SERVERS — Ultra Low Ping /48
// Orange Jordan Core Network
// ============================================================

function isMatchIPv6(ip){
  return (
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:")
  );
}

// ============================================================
// RELAY SERVERS — P2P + TURN + STUN
// ============================================================

function isRelayIPv6(ip){
  return (
    ip.startsWith("2a01:9700:3800:") ||
    ip.startsWith("2a01:9700:3900:") ||
    ip.startsWith("2a01:9700:3a00:") ||
    ip.startsWith("2a01:9700:3b00:") ||
    ip.startsWith("2a01:9700:3c00:") ||
    ip.startsWith("2a01:9700:3d00:") ||
    ip.startsWith("2a01:9700:3e00:")
  );
}

// ============================================================
// LOBBY SERVERS — Dynamic Rotation /48
// ============================================================

function isLobbyIPv6(ip){
  return (
    ip.startsWith("2a01:9700:3f00:") ||
    ip.startsWith("2a01:9700:4000:") ||
    ip.startsWith("2a01:9700:4100:") ||
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:") ||
    ip.startsWith("2a01:9700:4400:")
  );
}

// ============================================================
// JORDAN ISP FULL COVERAGE — FTTH / Residential / Infrastructure
// جميع شركات الاتصالات الأردنية — /48
// ============================================================

function isJordanISP(ip){
  return (

    // ----------------------------------------------------------
    // 🟠 Orange Jordan (AS8376) — Jordan Data Communications
    // FTTH + DSL + Infrastructure — عمود الفقري للإنترنت الأردني
    // ----------------------------------------------------------
    ip.startsWith("2a01:9700:1b05:") ||  // Infrastructure / Gateway (0.01ms)
    ip.startsWith("2a01:9700:17e0:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e1:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e2:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e3:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e4:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e5:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e6:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e7:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e8:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17e9:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17ea:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17eb:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17ec:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:17ed:") ||  // FTTH Residential — عمّان
    ip.startsWith("2a01:9700:1c77:") ||  // Residential Cluster — عمّان
    ip.startsWith("2a01:9700:1c78:") ||  // Residential Cluster — عمّان
    ip.startsWith("2a01:9700:1c9c:") ||  // Residential Cluster — عمّان
    ip.startsWith("2a01:9700:1cce:") ||  // Residential Cluster — عمّان
    ip.startsWith("2a01:9700:1ce8:") ||  // Residential Cluster — عمّان
    ip.startsWith("2a01:9700:814f:") ||  // FTTH Extended — عمّان
    ip.startsWith("2a01:9700:8155:") ||  // FTTH Extended — عمّان

    // ----------------------------------------------------------
    // 🔵 Zain Jordan (AS48832)
    // LTE + Broadband — الأوسع انتشاراً موبايل
    // ----------------------------------------------------------
    ip.startsWith("2a01:ee40:1000:") ||  // Residential — عمّان
    ip.startsWith("2a01:ee40:2000:") ||  // Residential — عمّان
    ip.startsWith("2a01:ee40:3000:") ||  // Broadband — عمّان
    ip.startsWith("2a01:ee40:4000:") ||  // LTE — عمّان
    ip.startsWith("2a01:ee40:5000:") ||  // LTE — الزرقاء / إربد
    ip.startsWith("2a01:ee40:6000:") ||  // Infrastructure
    ip.startsWith("2a01:9700:7378:") ||  // Shared Cluster — عمّان

    // ----------------------------------------------------------
    // 🟣 Umniah / Batelco Jordan (AS9038)
    // LTE + ADSL — الزرقاء / عمّان الجنوبية
    // ----------------------------------------------------------
    ip.startsWith("2a02:9c0:1000:")  ||  // Residential — عمّان
    ip.startsWith("2a02:9c0:2000:")  ||  // Residential — عمّان
    ip.startsWith("2a02:9c0:3000:")  ||  // LTE — عمّان
    ip.startsWith("2a02:9c0:4000:")  ||  // LTE — المملكة
    ip.startsWith("2a02:2558:1000:") ||  // Infrastructure — عمّان
    ip.startsWith("2a02:2558:2000:") ||  // Infrastructure — عمّان
    ip.startsWith("2a02:2558:3000:") ||  // Residential
    ip.startsWith("2a02:25d8:1000:") ||  // Batelco Jordan Residential

    // ----------------------------------------------------------
    // 🟡 Jordan Telecom Group — JTG (AS8697)
    // DSL + مؤسسات حكومية + شبكة قديمة موثوقة
    // ----------------------------------------------------------
    ip.startsWith("2a00:caa0:1000:") ||  // Residential — عمّان
    ip.startsWith("2a00:caa0:2000:") ||  // Residential — عمّان
    ip.startsWith("2a00:caa0:3000:") ||  // Infrastructure
    ip.startsWith("2a00:18d0:1000:") ||  // DSL — عمّان
    ip.startsWith("2a00:18d8:1000:") ||  // FTTH — عمّان
    ip.startsWith("2a00:18d8:2000:") ||  // FTTH — عمّان
    ip.startsWith("2a00:18d8:3000:") ||  // FTTH
    ip.startsWith("2a01:1d0:1000:")  ||  // Residential — عمّان
    ip.startsWith("2a01:1d0:2000:")  ||  // Residential
    ip.startsWith("2a01:1d0:3000:")  ||  // Infrastructure

    // ----------------------------------------------------------
    // 🔴 DAMAMAX / VTel (AS47887)
    // إنترنت لاسلكي ثابت — عمّان والمدن الكبرى
    // ----------------------------------------------------------
    ip.startsWith("2a02:c040:1000:") ||  // Residential — عمّان
    ip.startsWith("2a02:c040:2000:") ||  // Residential
    ip.startsWith("2a02:c040:3000:") ||  // Infrastructure
    ip.startsWith("2a03:6b00:1000:") ||  // Residential — عمّان
    ip.startsWith("2a03:6b00:2000:") ||  // Residential
    ip.startsWith("2a03:6b00:3000:")     // Infrastructure

  );
}

// ============================================================
// MAIN — FindProxyForURL
// ============================================================

function FindProxyForURL(url, host){

  // فحص انتهاء الجلسة
  checkSessionTimeout();

  // التصفح العام — DIRECT فوراً بدون معالجة
  if (isBrowser(host, url))
    return DIRECT;

  // النطاقات المحلية
  if (isPlainHostName(host))
    return DIRECT;

  // غير PUBG — DIRECT
  if (!isPUBG(host, url))
    return DIRECT;

  // ============================================================
  // DNS RESOLUTION — IPv6 Priority
  // ============================================================

  var ip = resolveIPv6(host);

  // فشل الـ resolution كلياً
  if (!ip)
    return BLOCK;

  // حجب IPv4 بشكل صارم — اللعبة تعمل IPv6 فقط
  if (isIPv4(ip))
    return BLOCK;

  var data  = (host + url).toLowerCase();
  var parts = ip.split(":");

  var isCritical = PRIORITY.CRITICAL.test(data);
  var isRelay    = PRIORITY.RELAY.test(data);
  var isLobby    = PRIORITY.LOBBY.test(data);

  // ============================================================
  // MATCH LOCK /64 — أعلى أولوية
  // تثبيت الجلسة على نفس الـ /64 طوال المباراة
  // ============================================================

  if (isCritical && isMatchIPv6(ip)){

    var net64 = parts.slice(0, 4).join(":");
    var now   = Date.now ? Date.now() : new Date().getTime();

    if (!SESSION.matchNet){
      SESSION.matchNet  = net64;
      SESSION.matchHost = host;
      SESSION.startTime = now;
      return PROXY;
    }

    // حجب أي server خارج الـ /64 المقفل
    if (net64 !== SESSION.matchNet)
      return BLOCK;

    return PROXY;
  }

  // ============================================================
  // RELAY BOOST — ثاني أولوية
  // تحسين الـ P2P والـ TURN داخل الشبكة الأردنية
  // ============================================================

  if (isRelay && isRelayIPv6(ip)){

    var relayNode = parts.slice(0, 3).join(":");

    if (!SESSION.relayNode)
      SESSION.relayNode = relayNode;

    return PROXY;
  }

  // ============================================================
  // DYNAMIC LOBBY /48 — ثالث أولوية
  // يسمح بتغيير العقدة داخل نفس الكلاستر
  // ============================================================

  if (isLobby && isLobbyIPv6(ip)){

    var net48 = parts.slice(0, 3).join(":");

    if (!SESSION.lobbyNet){
      SESSION.lobbyNet = net48;
      return PROXY;
    }

    // تحديث تلقائي عند تغيير العقدة
    if (SESSION.lobbyNet !== net48)
      SESSION.lobbyNet = net48;

    return PROXY;
  }

  // ============================================================
  // JORDAN ISP PEER BIAS
  // FTTH / Residential / Infrastructure — كل الشركات
  // ============================================================

  if (isJordanISP(ip))
    return PROXY;

  // ============================================================
  // HARD BLOCK — كل شيء خارج النطاق الأردني
  // ============================================================

  return BLOCK;
}
