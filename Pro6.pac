// ============================================================
// PUBG Mobile PAC Script v7.0 - Jordan Optimized
// Updated: 2026-03 | IPv6 Pure Jordan + Ping Stability
// ISPs: Orange AS8376 / Zain AS48832 / Umniah AS9038
//       Jordan Telecom AS8697 / DAMAMAX AS50670
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SETTINGS
// ============================================================

var SETTINGS = {
  PREFER_IPV6             : true,
  ALLOW_IPV4_FALLBACK     : true,
  REQUIRE_JORDAN_FOR_LOBBY: true,
  REQUIRE_JORDAN_SESSION_BEFORE_MATCH: true,
  DIRECT_HEAVY_ASSETS     : true,
  // تمديد TTL لتقليل إعادة التفاوض وثبات البنق
  JORDAN_TTL_MS : 60 * 60 * 1000,   // 60 دقيقة
  LOBBY_TTL_MS  : 15 * 60 * 1000,   // 15 دقيقة
  MATCH_TTL_MS  : 40 * 60 * 1000    // 40 دقيقة
};

// ============================================================
// SESSION
// ============================================================

var SESSION = {
  jordanKey : null,
  jordanTs  : 0,
  lobbyKey  : null,
  lobbyTs   : 0,
  matchKey  : null,
  matchHost : null,
  matchTs   : 0
};

// ============================================================
// TAGS
// ============================================================

var RE = {
  PUBG  : /(pubg|tencent|krafton|lightspeed|levelinfinite)/i,
  LOBBY : /(lobby|matchmaking|queue|login|auth|region|gateway|session)/i,
  MATCH : /(match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay)/i,
  HEAVY : /(patch|update|cdn|download|resource|notice|banner|event)/i,
  RESET : /(lobby|matchmaking|queue|login|auth|session)/i
};

// ============================================================
// JORDAN IPv6 — مصدر: RIPE NCC (AS8376 Orange /29 كامل)
// النطاق الأصلي المخصص: 2a01:9700::/29 (Orange Jordan)
// يشمل: 2a01:9700:: → 2a01:9701:ffff:ffff:...
// وكذلك نطاقات إضافية موثقة من RIPE
// ============================================================

// --- Orange Jordan AS8376 (النطاق الرئيسي الكامل /29) ---
// 2a01:9700::/29 يغطي 2a01:9700:: حتى 2a01:9701:ffff:...
var JORDAN_V6_ORANGE = [
  { base: "2a01:9700::",      len: 29 },   // Orange Jordan /29 كامل - RIPE رسمي
  { base: "2a01:9700::",      len: 32 },   // Orange /32 legacy
  { base: "2a01:9700:3900::", len: 40 },   // نطاق فرعي موثق
  { base: "2a01:9700:3920::", len: 44 },   // نطاق فرعي موثق
  { base: "2a01:9700:1700::", len: 40 },   // نطاق مستخدم (strong)
  { base: "2a01:9700:1c00::", len: 40 },   // نطاق مستخدم (strong)
  { base: "2a01:9700:4000::", len: 40 },
  { base: "2a01:9700:4100::", len: 40 },
  { base: "2a01:9700:4200::", len: 40 },
  { base: "2a01:9700:4300::", len: 40 },
  { base: "2a01:9700:4500::", len: 40 },
  { base: "2a01:9700:4600::", len: 40 },
  { base: "2a01:9700:4800::", len: 40 },
  { base: "2a01:9700:4900::", len: 40 }
];

// --- نطاقات أردنية إضافية من ScaniteX/RIPE (مصدر: scanitex.com/jo) ---
var JORDAN_V6_OTHER = [
  { base: "2001:32c0::",  len: 29 },   // Jordan (mixed ISPs)
  { base: "2a00:18d0::", len: 32 },
  { base: "2a00:18d8::", len: 29 },
  { base: "2a00:4620::", len: 32 },
  { base: "2a00:76e0::", len: 32 },
  { base: "2a00:b860::", len: 32 },
  { base: "2a00:caa0::", len: 32 },
  { base: "2a01:1d0::",  len: 29 },
  { base: "2a01:9700::", len: 29 },   // مدرج مرة أخرى لضمان التطابق
  { base: "2a01:e240::", len: 29 },
  { base: "2a01:ee40::", len: 29 },
  { base: "2a02:9c0::",  len: 29 },
  { base: "2a02:2558::", len: 29 },
  { base: "2a02:25d8::", len: 32 },
  { base: "2a02:5b60::", len: 32 },
  { base: "2a02:c040::", len: 29 },
  { base: "2a02:e680::", len: 29 },
  { base: "2a02:f0c0::", len: 29 },
  { base: "2a03:6b00::", len: 29 },
  { base: "2a03:6d00::", len: 32 }
];

// ============================================================
// JORDAN IPv4
// ============================================================

var JORDAN_STRONG_V4 = [
  { base: "37.202.64.0",   len: 18 },   // Orange AS8376
  { base: "46.185.128.0",  len: 17 },   // Orange AS8376 (يشمل عنوان البروكسي)
  { base: "79.173.192.0",  len: 18 },   // Orange AS8376
  { base: "94.249.24.0",   len: 21 },   // Orange AS8376
  { base: "94.249.84.0",   len: 22 },   // Orange AS8376
  { base: "149.200.248.0", len: 22 }    // Orange AS8376
];

var JORDAN_CONFIRMED_V4 = [
  { base: "80.10.64.0",   len: 20 },    // Zain AS48832
  { base: "86.108.0.0",   len: 21 },    // Umniah AS9038
  { base: "185.98.220.0", len: 22 },    // Jordan Telecom AS8697
  { base: "5.21.0.0",     len: 17 },    // Jordan Telecom
  { base: "82.212.0.0",   len: 16 },    // Jordan Telecom
  { base: "188.247.0.0",  len: 18 },    // DAMAMAX AS50670
  { base: "176.74.128.0", len: 17 }     // Zain Jordan mobile
];

// ============================================================
// HELPERS
// ============================================================

function lower(s){ return (s || "").toLowerCase(); }
function nowMs(){ return (new Date()).getTime(); }

function normalizeHostLiteral(host){
  host = host || "";
  if (host.length > 1 && host.charAt(0) == "[" && host.charAt(host.length-1) == "]")
    host = host.substring(1, host.length-1);
  var pct = host.indexOf("%");
  if (pct > -1) host = host.substring(0, pct);
  return lower(host);
}

function isHexChar(ch){
  return (ch >= "0" && ch <= "9") || (ch >= "a" && ch <= "f");
}
function isDigitChar(ch){ return (ch >= "0" && ch <= "9"); }

function cleanupToken(token){
  token = lower(token || "");
  while (token.length > 0){
    var a = token.charAt(0);
    if (isDigitChar(a) || isHexChar(a) || a == ":" || a == "." || a == "[") break;
    token = token.substring(1);
  }
  while (token.length > 0){
    var b = token.charAt(token.length-1);
    if (isDigitChar(b) || isHexChar(b) || b == ":" || b == "." || b == "]") break;
    token = token.substring(0, token.length-1);
  }
  if (token.length > 1 && token.charAt(0) == "[" && token.charAt(token.length-1) == "]")
    token = token.substring(1, token.length-1);
  var pct = token.indexOf("%");
  if (pct > -1) token = token.substring(0, pct);
  return token;
}

function isIPv6Text(s){ return s && s.indexOf(":") != -1; }

function cleanHextet(h){
  h = lower(h);
  if (h === "") return "0";
  if (h.indexOf(".") != -1) return "";
  for (var i = 0; i < h.length; i++){
    if (!isHexChar(h.charAt(i))) return "";
  }
  while (h.length > 1 && h.charAt(0) == "0") h = h.substring(1);
  return h === "" ? "0" : h;
}

function expandIPv6(ip){
  ip = cleanupToken(ip);
  if (!isIPv6Text(ip)) return null;
  if (ip.indexOf("::") != ip.lastIndexOf("::")) return null;

  var parts = ip.split("::");
  var left  = parts[0] ? parts[0].split(":") : [];
  var right = (parts.length > 1 && parts[1]) ? parts[1].split(":") : [];
  var out   = [], i;

  if (parts.length == 1){
    if (left.length != 8) return null;
    for (i = 0; i < 8; i++){
      left[i] = cleanHextet(left[i]);
      if (!left[i]) return null;
      out.push(left[i]);
    }
    return out;
  }

  var missing = 8 - (left.length + right.length);
  if (missing < 1) return null;

  for (i = 0; i < left.length; i++){
    left[i] = cleanHextet(left[i]);
    if (!left[i]) return null;
    out.push(left[i]);
  }
  for (i = 0; i < missing; i++) out.push("0");
  for (i = 0; i < right.length; i++){
    right[i] = cleanHextet(right[i]);
    if (!right[i]) return null;
    out.push(right[i]);
  }
  return out.length != 8 ? null : out;
}

function canonicalIPv6(ip){
  var ex = expandIPv6(ip);
  return ex ? ex.join(":") : "";
}

function parseIPv4(ip){
  ip = cleanupToken(ip);
  var p = ip.split(".");
  if (p.length != 4) return null;
  for (var i = 0; i < 4; i++){
    if (p[i] === "") return null;
    for (var n = 0; n < p[i].length; n++){
      if (!isDigitChar(p[i].charAt(n))) return null;
    }
    p[i] = parseInt(p[i], 10);
    if (isNaN(p[i]) || p[i] < 0 || p[i] > 255) return null;
  }
  return p;
}

function canonicalIPv4(ip){
  var p = parseIPv4(ip);
  return p ? (p[0]+"."+p[1]+"."+p[2]+"."+p[3]) : "";
}

function net48(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0]+":"+ex[1]+":"+ex[2]) : "";
}
function net56(ip){
  var ex = expandIPv6(ip);
  if (!ex) return "";
  // /56 = 3 tam + 8 bit (yarım hextet)
  var h3 = parseInt(ex[3], 16);
  var masked = (h3 & 0xff00).toString(16);
  return ex[0]+":"+ex[1]+":"+ex[2]+":"+masked;
}
function net64(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0]+":"+ex[1]+":"+ex[2]+":"+ex[3]) : "";
}
function net24(ip){
  var p = parseIPv4(ip);
  return p ? (p[0]+"."+p[1]+"."+p[2]) : "";
}

function v6MatchCidr(ip, base, len){
  var a = expandIPv6(ip);
  var b = expandIPv6(base);
  if (!a || !b) return false;
  var full = Math.floor(len/16);
  var rem  = len % 16;
  for (var i = 0; i < full; i++){
    if (a[i] != b[i]) return false;
  }
  if (rem === 0) return true;
  var mask = (0xffff << (16-rem)) & 0xffff;
  return ((parseInt(a[full],16) & mask) == (parseInt(b[full],16) & mask));
}

function v4MatchCidr(ip, base, len){
  var a = parseIPv4(ip);
  var b = parseIPv4(base);
  if (!a || !b) return false;
  var full = Math.floor(len/8);
  var rem  = len % 8;
  for (var i = 0; i < full; i++){
    if (a[i] != b[i]) return false;
  }
  if (rem === 0) return true;
  var mask = (0xff << (8-rem)) & 0xff;
  return ((a[full] & mask) == (b[full] & mask));
}

function isInV6List(ip, list){
  for (var i = 0; i < list.length; i++){
    if (v6MatchCidr(ip, list[i].base, list[i].len)) return true;
  }
  return false;
}
function isInV4List(ip, list){
  for (var i = 0; i < list.length; i++){
    if (v4MatchCidr(ip, list[i].base, list[i].len)) return true;
  }
  return false;
}

// ============================================================
// JORDAN IP DETECTION
// الأولوية: Orange V6 > Other V6 > Strong V4 > Confirmed V4
// ============================================================

function isJordanOrangeV6(ip){  return isInV6List(ip, JORDAN_V6_ORANGE); }
function isJordanOtherV6(ip){   return isInV6List(ip, JORDAN_V6_OTHER);  }
function isJordanStrongV4(ip){  return isInV4List(ip, JORDAN_STRONG_V4); }
function isJordanConfirmedV4(ip){ return isInV4List(ip, JORDAN_CONFIRMED_V4); }

function isJordanV6(ip){ return isJordanOrangeV6(ip) || isJordanOtherV6(ip); }
function isJordanV4(ip){ return isJordanStrongV4(ip) || isJordanConfirmedV4(ip); }

function isJordanIP(ip){
  if (canonicalIPv6(ip)) return isJordanV6(ip);
  if (canonicalIPv4(ip)) return isJordanV4(ip);
  return false;
}

function isPUBG(host, url){
  return RE.PUBG.test(lower(host)+" "+lower(url));
}

function splitCandidates(raw){
  var out = [], start = 0, token;
  raw = ""+(raw||"");
  for (var i = 0; i <= raw.length; i++){
    var ch = i < raw.length ? raw.charAt(i) : ";";
    if (ch==";"||ch==","||ch==" "||ch=="\t"||ch=="\n"||ch=="\r"){
      token = cleanupToken(raw.substring(start, i));
      if (token) out.push(token);
      start = i+1;
    }
  }
  return out;
}

function detectMode(data){
  if (RE.LOBBY.test(data))  return "lobby";
  if (RE.MATCH.test(data))  return "match";
  if (RE.HEAVY.test(data))  return "heavy";
  return "generic";
}

function familyOf(ip){
  if (canonicalIPv6(ip)) return 6;
  if (canonicalIPv4(ip)) return 4;
  return 0;
}

// مفاتيح الجلسة بدقة أكبر لثبات أفضل
function jordanBucket(ip){
  if (canonicalIPv6(ip)) return "6|"+net48(ip);
  if (canonicalIPv4(ip)) return "4|"+net24(ip);
  return "";
}
function lobbyBucket(ip){
  if (canonicalIPv6(ip)) return "6|"+net48(ip);
  if (canonicalIPv4(ip)) return "4|"+net24(ip);
  return "";
}
function matchBucket(ip){
  // استخدام /56 للـ IPv6 بدلاً من /64 — أكثر ثباتاً عند تغيير الـ subnet
  if (canonicalIPv6(ip)) return "6|"+net56(ip);
  if (canonicalIPv4(ip)) return "4|"+net24(ip);
  return "";
}

function sameJordanKey(ip, key){ return key && jordanBucket(ip) == key; }
function sameLobbyKey(ip, key){  return key && lobbyBucket(ip) == key;  }
function sameMatchKey(ip, key){  return key && matchBucket(ip) == key;  }

// ============================================================
// SCORING — IPv6 الأردني يحصل على أولوية قصوى
// ============================================================

function scoreIP(ip, mode){
  var fam = familyOf(ip);
  if (!fam) return -1;
  var s = 0;

  // استمرارية الجلسة الحالية — أعلى أولوية دائماً
  if (SESSION.matchKey  && sameMatchKey(ip, SESSION.matchKey))   s += 20000;
  if (SESSION.jordanKey && sameJordanKey(ip, SESSION.jordanKey)) s += 10000;
  if (SESSION.lobbyKey  && sameLobbyKey(ip, SESSION.lobbyKey))   s +=  8000;

  // تفضيل IPv6 الأردني بقوة
  if (SETTINGS.PREFER_IPV6 && fam == 6) s += 500;
  if (fam == 4) s += 50;

  if (mode == "lobby"){
    if (isJordanOrangeV6(ip))    s += 6000;
    else if (isJordanOtherV6(ip)) s += 4500;
    if (SETTINGS.ALLOW_IPV4_FALLBACK){
      if (isJordanStrongV4(ip))    s += 3000;
      if (isJordanConfirmedV4(ip)) s += 2000;
    }
    return s;
  }

  if (mode == "match"){
    if (isJordanOrangeV6(ip))    s += 5000;
    else if (isJordanOtherV6(ip)) s += 3500;
    if (SETTINGS.ALLOW_IPV4_FALLBACK){
      if (isJordanStrongV4(ip))    s += 2000;
      if (isJordanConfirmedV4(ip)) s += 1200;
    }
    return s;
  }

  // generic
  if (isJordanOrangeV6(ip))    s += 4000;
  else if (isJordanOtherV6(ip)) s += 2800;
  if (SETTINGS.ALLOW_IPV4_FALLBACK){
    if (isJordanStrongV4(ip))    s += 1800;
    if (isJordanConfirmedV4(ip)) s += 1200;
  }
  return s;
}

function pickBestIP(raw, mode){
  var items = splitCandidates(raw);
  var best = "", bestScore = -1;
  for (var i = 0; i < items.length; i++){
    var token = items[i];
    var v6 = canonicalIPv6(token);
    var v4 = canonicalIPv4(token);
    if (v6){ var sc6 = scoreIP(v6,mode); if(sc6>bestScore){best=v6;bestScore=sc6;} continue; }
    if (v4){ var sc4 = scoreIP(v4,mode); if(sc4>bestScore){best=v4;bestScore=sc4;} }
  }
  if (!best){
    var fb6 = canonicalIPv6(cleanupToken(raw)); if(fb6) return fb6;
    var fb4 = canonicalIPv4(cleanupToken(raw)); if(fb4) return fb4;
  }
  return best;
}

function resolveBestIP(host, mode){
  var literal = normalizeHostLiteral(host);
  if (canonicalIPv6(literal)) return canonicalIPv6(literal);
  if (canonicalIPv4(literal)) return canonicalIPv4(literal);

  var raw = "", ip = "";

  // محاولة dnsResolveEx أولاً (يعيد جميع العناوين بما فيها IPv6)
  try {
    if (typeof dnsResolveEx == "function"){
      raw = dnsResolveEx(literal);
      ip = pickBestIP(raw, mode);
      if (ip) return ip;
    }
  } catch(e){}

  // fallback إلى dnsResolve العادي
  try {
    raw = dnsResolve(literal);
    ip = pickBestIP(raw, mode);
    if (ip) return ip;
  } catch(e2){}

  return "";
}

// ============================================================
// SESSION HELPERS
// ============================================================

function clearJordan(){ SESSION.jordanKey=null; SESSION.jordanTs=0; }
function clearLobby(){  SESSION.lobbyKey=null;  SESSION.lobbyTs=0;  }
function clearMatch(){  SESSION.matchKey=null;  SESSION.matchHost=null; SESSION.matchTs=0; }

function touchJordan(ip){ SESSION.jordanKey=jordanBucket(ip); SESSION.jordanTs=nowMs(); }
function touchLobby(ip){  SESSION.lobbyKey=lobbyBucket(ip);  SESSION.lobbyTs=nowMs();  }
function touchMatch(host,ip){ SESSION.matchKey=matchBucket(ip); SESSION.matchHost=host; SESSION.matchTs=nowMs(); }

function resetExpiredLocks(){
  var t = nowMs();
  if (SESSION.jordanKey && (t-SESSION.jordanTs > SETTINGS.JORDAN_TTL_MS)){ clearJordan(); clearLobby(); }
  if (SESSION.lobbyKey  && (t-SESSION.lobbyTs  > SETTINGS.LOBBY_TTL_MS))  clearLobby();
  if (SESSION.matchKey  && (t-SESSION.matchTs  > SETTINGS.MATCH_TTL_MS))  clearMatch();
}

// ============================================================
// CORE ROUTING ENGINE
// ============================================================

function __PAC(url, host){

  if (isPlainHostName(host)) return DIRECT;

  var data  = lower(host)+" "+lower(url);
  var pubg  = isPUBG(host, url);

  if (!pubg) return DIRECT;

  resetExpiredLocks();

  var mode = detectMode(data);

  // الملفات الثقيلة (patch/cdn) تمر مباشرة لتجنب تأثيرها على البنق
  if (SETTINGS.DIRECT_HEAVY_ASSETS && mode == "heavy") return DIRECT;

  var ip = resolveBestIP(host, mode);

  if (!ip) return BLOCK;
  if (familyOf(ip) == 4 && !SETTINGS.ALLOW_IPV4_FALLBACK) return BLOCK;

  // إعادة تعيين قفل المباراة عند الرجوع إلى اللوبي
  if (!RE.MATCH.test(data) && RE.RESET.test(data)) clearMatch();

  // ----------------------------------------------------------
  // LOBBY / AUTH / QUEUE / REGION / SESSION
  // ----------------------------------------------------------
  if (mode == "lobby"){
    if (isJordanIP(ip)){
      touchJordan(ip);
      touchLobby(ip);
      return PROXY;
    }
    if (sameJordanKey(ip, SESSION.jordanKey)){
      SESSION.jordanTs = nowMs();
      touchLobby(ip);
      return PROXY;
    }
    if (sameLobbyKey(ip, SESSION.lobbyKey)){
      SESSION.lobbyTs = nowMs();
      return PROXY;
    }
    if (SETTINGS.REQUIRE_JORDAN_FOR_LOBBY) return BLOCK;
    return DIRECT;
  }

  // ----------------------------------------------------------
  // MATCH — ثبات قفل المباراة أولوية قصوى
  // ----------------------------------------------------------
  if (mode == "match"){
    if (sameMatchKey(ip, SESSION.matchKey)){
      SESSION.matchTs = nowMs();
      return PROXY;
    }
    // قفل بديل على hostname لتغطية تغييرات IP داخل نفس السيرفر
    if (SESSION.matchHost && SESSION.matchHost == host){
      SESSION.matchTs = nowMs();
      return PROXY;
    }
    if (SESSION.jordanKey){
      touchMatch(host, ip);
      return PROXY;
    }
    if (isJordanIP(ip)){
      touchJordan(ip);
      touchMatch(host, ip);
      return PROXY;
    }
    if (SETTINGS.REQUIRE_JORDAN_SESSION_BEFORE_MATCH) return BLOCK;
    return PROXY;
  }

  // ----------------------------------------------------------
  // GENERIC PUBG (UDP control, telemetry, إلخ)
  // ----------------------------------------------------------
  if (sameMatchKey(ip,  SESSION.matchKey)){  SESSION.matchTs=nowMs();  return PROXY; }
  if (sameJordanKey(ip, SESSION.jordanKey)){ SESSION.jordanTs=nowMs(); return PROXY; }
  if (sameLobbyKey(ip,  SESSION.lobbyKey)){  SESSION.lobbyTs=nowMs();  return PROXY; }
  if (isJordanIP(ip)){ touchJordan(ip); return PROXY; }

  return BLOCK;
}

// ============================================================
// ENTRY POINTS
// ============================================================

function FindProxyForURLEx(url, host){ return __PAC(url, host); }
function FindProxyForURL(url, host){   return __PAC(url, host); }
