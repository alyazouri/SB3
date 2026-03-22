// ============================================================
// PUBG MOBILE — JORDAN LOCK v9.1
// Ultra Low Ping | Smart Session | /32 Prefix Optimization
// Orange Jordan AS8376 | IPv6-Only + Hostname Fallback
// iOS/iPadOS PAC Compatible
// ============================================================

var PROXY = "PROXY 46.185.131.218:20001";
var BLOCK  = "PROXY 0.0.0.0:0";
var DIRECT = "DIRECT";

// ============================================================
// SESSION — مع Timeout تلقائي (45 دقيقة)
// ============================================================

var SESSION = {
  matchNet:   null,
  matchHost:  null,
  matchTime:  0,
  lobbyNet:   null,
  MATCH_TTL:  45 * 60 * 1000
};

// ============================================================
// PATTERNS
// ============================================================

var PAT = {
  PUBG:  /pubg|tencent|krafton|lightspeed|levelinfinite/i,
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay/i,
  LOBBY: /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|patch|update|cdn|config/i,
  CDN:   /akamai|cloudflare|fastly|amazonaws|googleusercontent/i,

  // ============================================================
  // HOSTNAME PATTERNS — Fallback عندما dnsResolve يفشل أو يُرجع IPv4
  // مصنَّفة بنفس منطق الـ IP
  // ============================================================

  // Match / Game Servers — أسماء مباشرة لسيرفرات اللعبة
  HOST_MATCH: /
    (?:^|\.)(?:
      gamesvr\d*           |   // gamesvr1, gamesvr2 ...
      match\d*             |   // match1, match-jo ...
      battle\d*            |   // battlesvr ...
      relay\d*             |   // relay, relay-me ...
      gs\d+                |   // gs1, gs2 ...
      gamesever            |   // typo variant
      ingame\d*            |   // ingame-jo ...
      fpp\d*               |   // fpp servers
      tpp\d*                   // tpp servers
    )\.(?:pubg|tencent|krafton|levelinfinite|lightspeed)\.
    (?:com|net|io|cc|me|co)
  /xi,

  // Lobby / Auth / Config Servers
  HOST_LOBBY: /
    (?:^|\.)(?:
      lobby\d*             |
      matchmaking\d*       |
      queue\d*             |
      login\d*             |
      auth\d*              |
      gateway\d*           |
      session\d*           |
      region\d*            |
      profile\d*           |
      inventory\d*         |
      store\d*             |
      catalog\d*           |
      config\d*            |
      patch\d*             |
      update\d*
    )\.(?:pubg|tencent|krafton|levelinfinite|lightspeed)\.
    (?:com|net|io|cc|me|co)
  /xi,

  // Jordan-specific hostnames (بعض السيرفرات تحتوي jo/me/jordan في اسمها)
  HOST_JORDAN: /[-.](?:jo|me|jordan|amman|orange)[-.]|[-.]jo\.|\.jo$/i
};

// ============================================================
// ORANGE JORDAN — AS8376
// 2a01:9700::/32 — سطر واحد يغطي كل الـ allocation
// ============================================================

function isOrangeJordan(ip) {
  return ip.startsWith("2a01:9700:");
}

// ============================================================
// MATCH SERVERS — Ultra Low Ping /48
// ============================================================

function isMatchServer(ip) {
  var p = getPrefix48(ip);
  return p === "2a01:9700:4200" ||
         p === "2a01:9700:4300";
}

// ============================================================
// JORDAN PEER / INFRASTRUCTURE — prefixes كاملة ودقيقة
// ============================================================

function isJordanPeer(ip) {
  var p = getPrefix48(ip);
  return (
    p === "2a01:9700:1b05" ||
    p === "2a01:9700:17e0" ||
    p === "2a01:9700:1c00"
  );
}

// ============================================================
// HELPERS — بدون array allocation
// ============================================================

function getPrefix48(ip) {
  var c = 0, i = 0;
  while (i < ip.length && c < 3) {
    if (ip[i] === ":") c++;
    i++;
  }
  return ip.substring(0, i - 1).toLowerCase();
}

function getPrefix64(ip) {
  var c = 0, i = 0;
  while (i < ip.length && c < 4) {
    if (ip[i] === ":") c++;
    i++;
  }
  return ip.substring(0, i - 1).toLowerCase();
}

function isIPv6(ip) {
  return ip && ip.indexOf(":") !== -1;
}

function isPUBG(host, url) {
  return PAT.PUBG.test(host) || PAT.PUBG.test(url);
}

function now() {
  return new Date().getTime();
}

// ============================================================
// SESSION RESET — TTL تلقائي
// ============================================================

function checkMatchExpiry() {
  if (SESSION.matchNet && SESSION.matchTime) {
    if ((now() - SESSION.matchTime) > SESSION.MATCH_TTL) {
      SESSION.matchNet  = null;
      SESSION.matchHost = null;
      SESSION.matchTime = 0;
    }
  }
}

// ============================================================
// HOSTNAME FALLBACK
// يُستخدم فقط عندما dnsResolve يفشل أو يُرجع IPv4
// يُصنِّف بناءً على اسم الـ host مباشرة
// ============================================================

function hostnameClassify(host) {
  // Match server بالاسم
  if (PAT.HOST_MATCH.test(host)) {
    checkMatchExpiry();
    if (!SESSION.matchHost) {
      SESSION.matchHost = host;
      SESSION.matchTime = now();
    }
    // نفس الـ host أو لم يُقفل بعد
    if (SESSION.matchHost === host || !SESSION.matchNet)
      return PROXY;
    // host مختلف وعندنا lock = BLOCK
    return BLOCK;
  }

  // Lobby server بالاسم
  if (PAT.HOST_LOBBY.test(host))
    return PROXY;

  // Jordan-specific hostname
  if (PAT.HOST_JORDAN.test(host))
    return PROXY;

  // PUBG عام لكن لا نعرف نوعه — نمرره بحذر
  return PROXY;
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host) {

  // --- خطوة 1: Plain hostnames
  if (isPlainHostName(host))
    return DIRECT;

  // --- خطوة 2: غير PUBG = DIRECT
  if (!isPUBG(host, url))
    return DIRECT;

  // --- خطوة 3: CDN/Patches = DIRECT (لا تكسر التحديثات)
  if (PAT.CDN.test(host))
    return DIRECT;

  // --- خطوة 4: DNS Resolve
  var ip = "";
  try { ip = dnsResolve(host); } catch(e) {}

  // ============================================================
  // FALLBACK — dnsResolve فشل أو أرجع IPv4
  // نصنِّف بالاسم مباشرة
  // ============================================================
  if (!isIPv6(ip)) {
    return hostnameClassify(host);
  }

  // --- خطوة 5: IPv6 ليس Orange Jordan = BLOCK
  if (!isOrangeJordan(ip))
    return BLOCK;

  // --- خطوة 6: تصنيف الطلب
  var ctx     = (host + " " + url).toLowerCase();
  var isMatch = PAT.MATCH.test(ctx);
  var isLobby = PAT.LOBBY.test(ctx);

  // ============================================================
  // MATCH LOCK — /64 مع TTL
  // ============================================================

  if (isMatch && isMatchServer(ip)) {
    checkMatchExpiry();

    var net64 = getPrefix64(ip);

    if (!SESSION.matchNet) {
      SESSION.matchNet  = net64;
      SESSION.matchHost = host;
      SESSION.matchTime = now();
      return PROXY;
    }

    if (net64 === SESSION.matchNet)
      return PROXY;

    return BLOCK;
  }

  // ============================================================
  // LOBBY — Dynamic /48
  // ============================================================

  if (isLobby) {
    SESSION.lobbyNet = getPrefix48(ip);
    return PROXY;
  }

  // ============================================================
  // JORDAN PEER BIAS
  // ============================================================

  if (isJordanPeer(ip))
    return PROXY;

  // ============================================================
  // أي Orange Jordan آخر — يمر
  // ============================================================

  return PROXY;
}
