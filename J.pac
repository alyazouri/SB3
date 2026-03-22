// ============================================================
// PUBG MOBILE — JORDAN LOCK v9.0
// Ultra Low Ping | Smart Session | /32 Prefix Optimization
// Orange Jordan AS8376 | IPv6-Only Architecture
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
  MATCH_TTL:  45 * 60 * 1000   // 45 min بالمللي ثانية
};

// ============================================================
// PATTERNS
// ============================================================

var PAT = {
  PUBG:  /pubg|tencent|krafton|lightspeed|levelinfinite/i,
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay/i,
  LOBBY: /lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|patch|update|cdn|config/i,
  CDN:   /akamai|cloudflare|fastly|amazonaws|googleusercontent/i
};

// ============================================================
// ORANGE JORDAN — AS8376
// كل الـ allocation = 2a01:9700::/32
// بدلاً من 100+ سطر startsWith
// ============================================================

function isOrangeJordan(ip) {
  // /32 check: الـ segment الأول والثاني فقط
  return ip.startsWith("2a01:9700:");
}

// ============================================================
// MATCH SERVERS — /48 الأكثر أداءً (Ultra Low Ping)
// 2a01:9700:4200:: و 2a01:9700:4300::
// ============================================================

function isMatchServer(ip) {
  var p = getPrefix48(ip);
  return p === "2a01:9700:4200" ||
         p === "2a01:9700:4300";
}

// ============================================================
// JORDAN PEER / INFRASTRUCTURE
// prefixes دقيقة ومكتملة
// ============================================================

function isJordanPeer(ip) {
  var p48 = getPrefix48(ip);
  return (
    p48 === "2a01:9700:1b05" ||   // Infrastructure / Gateway عمّان
    p48 === "2a01:9700:17e0" ||   // FTTH Residential عمّان
    p48 === "2a01:9700:1c00"      // Residential Cluster عمّان
  );
}

// ============================================================
// HELPERS
// ============================================================

function getPrefix48(ip) {
  // أسرع من split+slice: نبحث عن النقطتين الثالثة
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
// SESSION RESET — عند انتهاء المباراة أو TTL
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
// MAIN
// ============================================================

function FindProxyForURL(url, host) {

  // --- خطوة 1: Plain hostnames مباشرة
  if (isPlainHostName(host))
    return DIRECT;

  // --- خطوة 2: غير PUBG مباشرة (CDN / patches أيضاً)
  if (!isPUBG(host, url))
    return DIRECT;

  if (PAT.CDN.test(host))
    return DIRECT;

  // --- خطوة 3: DNS Resolve
  var ip = "";
  try { ip = dnsResolve(host); } catch(e) {}

  // IPv4 أو فشل الـ resolve = BLOCK (IPv6-only architecture)
  if (!isIPv6(ip))
    return BLOCK;

  // --- خطوة 4: ليس Orange Jordan = BLOCK
  if (!isOrangeJordan(ip))
    return BLOCK;

  // --- خطوة 5: تصنيف الطلب
  var ctx    = (host + " " + url).toLowerCase();
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

    // نفس الـ /64 = استمر
    if (net64 === SESSION.matchNet)
      return PROXY;

    // /64 مختلف = جلسة مشبوهة، احجب
    return BLOCK;
  }

  // ============================================================
  // LOBBY — Dynamic /48 (يسمح بالتناوب)
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
  // أي Orange Jordan آخر غير مصنَّف
  // ============================================================

  return PROXY;
}
