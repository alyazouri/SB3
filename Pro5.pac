// ============================================================
// PUBG MOBILE — JORDAN FIRST PAC v14.0
// Dual-stack conservative / lower-ping balanced
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SETTINGS
// ============================================================

var SETTINGS = {
  PREFER_IPV6: true,
  ALLOW_IPV4_FALLBACK: true,
  REQUIRE_JORDAN_FOR_LOBBY: true,
  REQUIRE_JORDAN_SESSION_BEFORE_MATCH: true,
  DIRECT_HEAVY_ASSETS: true,
  JORDAN_TTL_MS: 30 * 60 * 1000,
  LOBBY_TTL_MS: 10 * 60 * 1000,
  MATCH_TTL_MS: 25 * 60 * 1000
};

// ============================================================
// SESSION
// ============================================================

var SESSION = {
  jordanKey: null,
  jordanTs: 0,
  lobbyKey: null,
  lobbyTs: 0,
  matchKey: null,
  matchHost: null,
  matchTs: 0
};

// ============================================================
// TAGS
// ============================================================

var RE = {
  PUBG:  /(pubg|tencent|krafton|lightspeed|levelinfinite)/i,
  LOBBY: /(lobby|matchmaking|queue|login|auth|region|gateway|session)/i,
  MATCH: /(match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay)/i,
  HEAVY: /(patch|update|cdn|download|resource|notice|banner|event)/i,
  RESET: /(lobby|matchmaking|queue|login|auth|session)/i
};

// ============================================================
// CONSERVATIVE JORDAN LISTS
// ============================================================

var JORDAN_STRONG_V6 = [
  { base: "2a01:9700:1700::", len: 40 },
  { base: "2a01:9700:1c00::", len: 40 }
];

var JORDAN_CONFIRMED_V6 = [
  { base: "2a01:9700:4000::", len: 40 },
  { base: "2a01:9700:4100::", len: 40 },
  { base: "2a01:9700:4200::", len: 40 },
  { base: "2a01:9700:4300::", len: 40 },
  { base: "2a01:9700:4500::", len: 40 },
  { base: "2a01:9700:4600::", len: 40 },
  { base: "2a01:9700:4800::", len: 40 },
  { base: "2a01:9700:4900::", len: 40 }
];

var JORDAN_STRONG_V4 = [
  { base: "37.202.64.0", len: 18 },
  { base: "46.185.128.0", len: 17 },
  { base: "79.173.192.0", len: 18 },
  { base: "94.249.24.0", len: 21 },
  { base: "94.249.84.0", len: 22 },
  { base: "149.200.248.0", len: 22 }
];

var JORDAN_CONFIRMED_V4 = [
  { base: "80.10.64.0", len: 20 },
  { base: "86.108.0.0", len: 21 },
  { base: "185.98.220.0", len: 22 }
];

// ============================================================
// HELPERS
// ============================================================

function lower(s){
  return (s || "").toLowerCase();
}

function nowMs(){
  return (new Date()).getTime();
}

function normalizeHostLiteral(host){
  host = host || "";

  if (host.length > 1 && host.charAt(0) == "[" && host.charAt(host.length - 1) == "]")
    host = host.substring(1, host.length - 1);

  var pct = host.indexOf("%");
  if (pct > -1)
    host = host.substring(0, pct);

  return lower(host);
}

function isHexChar(ch){
  return (
    (ch >= "0" && ch <= "9") ||
    (ch >= "a" && ch <= "f")
  );
}

function isDigitChar(ch){
  return (ch >= "0" && ch <= "9");
}

function cleanupToken(token){
  token = lower(token || "");

  while (token.length > 0) {
    var a = token.charAt(0);
    if (isDigitChar(a) || isHexChar(a) || a == ":" || a == "." || a == "[")
      break;
    token = token.substring(1);
  }

  while (token.length > 0) {
    var b = token.charAt(token.length - 1);
    if (isDigitChar(b) || isHexChar(b) || b == ":" || b == "." || b == "]")
      break;
    token = token.substring(0, token.length - 1);
  }

  if (token.length > 1 && token.charAt(0) == "[" && token.charAt(token.length - 1) == "]")
    token = token.substring(1, token.length - 1);

  var pct = token.indexOf("%");
  if (pct > -1)
    token = token.substring(0, pct);

  return token;
}

function isIPv6Text(s){
  return s && s.indexOf(":") != -1;
}

function cleanHextet(h){
  var i;

  h = lower(h);

  if (h === "")
    return "0";

  if (h.indexOf(".") != -1)
    return "";

  for (i = 0; i < h.length; i++){
    if (!isHexChar(h.charAt(i)))
      return "";
  }

  while (h.length > 1 && h.charAt(0) == "0")
    h = h.substring(1);

  return h === "" ? "0" : h;
}

function expandIPv6(ip){
  var parts, left, right, out, i, missing;

  ip = cleanupToken(ip);

  if (!isIPv6Text(ip))
    return null;

  if (ip.indexOf("::") != ip.lastIndexOf("::"))
    return null;

  parts = ip.split("::");
  left  = parts[0] ? parts[0].split(":") : [];
  right = (parts.length > 1 && parts[1]) ? parts[1].split(":") : [];

  out = [];

  if (parts.length == 1){
    if (left.length != 8)
      return null;

    for (i = 0; i < left.length; i++){
      left[i] = cleanHextet(left[i]);
      if (!left[i])
        return null;
      out.push(left[i]);
    }

    return out;
  }

  missing = 8 - (left.length + right.length);
  if (missing < 1)
    return null;

  for (i = 0; i < left.length; i++){
    left[i] = cleanHextet(left[i]);
    if (!left[i])
      return null;
    out.push(left[i]);
  }

  for (i = 0; i < missing; i++)
    out.push("0");

  for (i = 0; i < right.length; i++){
    right[i] = cleanHextet(right[i]);
    if (!right[i])
      return null;
    out.push(right[i]);
  }

  if (out.length != 8)
    return null;

  return out;
}

function canonicalIPv6(ip){
  var ex = expandIPv6(ip);
  return ex ? ex.join(":") : "";
}

function parseIPv4(ip){
  var p, i, n, token;

  ip = cleanupToken(ip);
  p = ip.split(".");

  if (p.length != 4)
    return null;

  for (i = 0; i < 4; i++){
    token = p[i];
    if (token === "")
      return null;

    for (n = 0; n < token.length; n++){
      if (!isDigitChar(token.charAt(n)))
        return null;
    }

    p[i] = parseInt(token, 10);
    if (isNaN(p[i]) || p[i] < 0 || p[i] > 255)
      return null;
  }

  return p;
}

function canonicalIPv4(ip){
  var p = parseIPv4(ip);
  return p ? (p[0] + "." + p[1] + "." + p[2] + "." + p[3]) : "";
}

function isIPv4Text(s){
  return canonicalIPv4(s) ? true : false;
}

function net48(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0] + ":" + ex[1] + ":" + ex[2]) : "";
}

function net64(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0] + ":" + ex[1] + ":" + ex[2] + ":" + ex[3]) : "";
}

function net24(ip){
  var p = parseIPv4(ip);
  return p ? (p[0] + "." + p[1] + "." + p[2]) : "";
}

function v6MatchCidr(ip, base, len){
  var a, b, full, rem, i, mask, av, bv;

  a = expandIPv6(ip);
  b = expandIPv6(base);

  if (!a || !b)
    return false;

  full = Math.floor(len / 16);
  rem  = len % 16;

  for (i = 0; i < full; i++){
    if (a[i] != b[i])
      return false;
  }

  if (rem === 0)
    return true;

  mask = (0xffff << (16 - rem)) & 0xffff;
  av = parseInt(a[full], 16);
  bv = parseInt(b[full], 16);

  return ((av & mask) == (bv & mask));
}

function v4MatchCidr(ip, base, len){
  var a, b, full, rem, i, mask;

  a = parseIPv4(ip);
  b = parseIPv4(base);

  if (!a || !b)
    return false;

  full = Math.floor(len / 8);
  rem  = len % 8;

  for (i = 0; i < full; i++){
    if (a[i] != b[i])
      return false;
  }

  if (rem === 0)
    return true;

  mask = (0xff << (8 - rem)) & 0xff;
  return ((a[full] & mask) == (b[full] & mask));
}

function isInV6List(ip, list){
  var i;
  for (i = 0; i < list.length; i++){
    if (v6MatchCidr(ip, list[i].base, list[i].len))
      return true;
  }
  return false;
}

function isInV4List(ip, list){
  var i;
  for (i = 0; i < list.length; i++){
    if (v4MatchCidr(ip, list[i].base, list[i].len))
      return true;
  }
  return false;
}

function isJordanStrongV6(ip){
  return isInV6List(ip, JORDAN_STRONG_V6);
}

function isJordanConfirmedV6(ip){
  return isInV6List(ip, JORDAN_CONFIRMED_V6);
}

function isJordanStrongV4(ip){
  return isInV4List(ip, JORDAN_STRONG_V4);
}

function isJordanConfirmedV4(ip){
  return isInV4List(ip, JORDAN_CONFIRMED_V4);
}

function isJordanIP(ip){
  if (canonicalIPv6(ip))
    return isJordanStrongV6(ip) || isJordanConfirmedV6(ip);

  if (canonicalIPv4(ip))
    return isJordanStrongV4(ip) || isJordanConfirmedV4(ip);

  return false;
}

function isPUBG(host, url){
  return RE.PUBG.test(lower(host) + " " + lower(url));
}

function splitCandidates(raw){
  var out = [];
  var i, start, token;

  raw = "" + (raw || "");
  start = 0;

  for (i = 0; i <= raw.length; i++){
    if (
      i == raw.length ||
      raw.charAt(i) == ";" ||
      raw.charAt(i) == "," ||
      raw.charAt(i) == " " ||
      raw.charAt(i) == "\t" ||
      raw.charAt(i) == "\n" ||
      raw.charAt(i) == "\r"
    ){
      token = cleanupToken(raw.substring(start, i));
      if (token)
        out.push(token);
      start = i + 1;
    }
  }

  return out;
}

function detectMode(data){
  if (RE.LOBBY.test(data))
    return "lobby";

  if (RE.MATCH.test(data))
    return "match";

  if (RE.HEAVY.test(data))
    return "heavy";

  return "generic";
}

function familyOf(ip){
  if (canonicalIPv6(ip))
    return 6;

  if (canonicalIPv4(ip))
    return 4;

  return 0;
}

function jordanBucket(ip){
  if (canonicalIPv6(ip))
    return "6|" + net48(ip);

  if (canonicalIPv4(ip))
    return "4|" + net24(ip);

  return "";
}

function lobbyBucket(ip){
  if (canonicalIPv6(ip))
    return "6|" + net48(ip);

  if (canonicalIPv4(ip))
    return "4|" + net24(ip);

  return "";
}

function matchBucket(ip){
  if (canonicalIPv6(ip))
    return "6|" + net64(ip);

  if (canonicalIPv4(ip))
    return "4|" + net24(ip);

  return "";
}

function sameJordanKey(ip, key){
  return key && jordanBucket(ip) == key;
}

function sameLobbyKey(ip, key){
  return key && lobbyBucket(ip) == key;
}

function sameMatchKey(ip, key){
  return key && matchBucket(ip) == key;
}

function scoreIP(ip, mode){
  var fam = familyOf(ip);
  var s = 0;

  if (!fam)
    return -1;

  if (SESSION.matchKey && sameMatchKey(ip, SESSION.matchKey))
    s += 10000;

  if (SESSION.jordanKey && sameJordanKey(ip, SESSION.jordanKey))
    s += 6000;

  if (SETTINGS.PREFER_IPV6){
    if (fam == 6) s += 200;
    if (fam == 4) s += 50;
  }

  if (mode == "lobby"){
    if (isJordanStrongV6(ip))    s += 3500;
    if (isJordanConfirmedV6(ip)) s += 2400;

    if (SETTINGS.ALLOW_IPV4_FALLBACK){
      if (isJordanStrongV4(ip))    s += 2200;
      if (isJordanConfirmedV4(ip)) s += 1500;
    }

    return s;
  }

  if (mode == "match"){
    if (isJordanStrongV6(ip))    s += 2000;
    if (isJordanConfirmedV6(ip)) s += 1400;

    if (SETTINGS.ALLOW_IPV4_FALLBACK){
      if (isJordanStrongV4(ip))    s += 900;
      if (isJordanConfirmedV4(ip)) s += 600;
    }

    return s;
  }

  if (isJordanStrongV6(ip))    s += 1700;
  if (isJordanConfirmedV6(ip)) s += 1200;

  if (SETTINGS.ALLOW_IPV4_FALLBACK){
    if (isJordanStrongV4(ip))    s += 900;
    if (isJordanConfirmedV4(ip)) s += 650;
  }

  return s;
}

function pickBestIP(raw, mode){
  var items, i, token, v6, v4, sc, best, bestScore;

  items = splitCandidates(raw);
  best = "";
  bestScore = -1;

  for (i = 0; i < items.length; i++){
    token = items[i];
    v6 = canonicalIPv6(token);
    v4 = canonicalIPv4(token);

    if (v6){
      sc = scoreIP(v6, mode);
      if (sc > bestScore){
        best = v6;
        bestScore = sc;
      }
      continue;
    }

    if (v4){
      sc = scoreIP(v4, mode);
      if (sc > bestScore){
        best = v4;
        bestScore = sc;
      }
    }
  }

  if (!best){
    v6 = canonicalIPv6(cleanupToken(raw));
    if (v6)
      return v6;

    v4 = canonicalIPv4(cleanupToken(raw));
    if (v4)
      return v4;
  }

  return best;
}

function resolveBestIP(host, mode){
  var literal, raw, ip;

  literal = normalizeHostLiteral(host);

  if (canonicalIPv6(literal))
    return canonicalIPv6(literal);

  if (canonicalIPv4(literal))
    return canonicalIPv4(literal);

  raw = "";
  ip = "";

  try {
    if (typeof dnsResolveEx == "function"){
      raw = dnsResolveEx(literal);
      ip = pickBestIP(raw, mode);
      if (ip)
        return ip;
    }
  } catch(e) {}

  try {
    raw = dnsResolve(literal);
    ip = pickBestIP(raw, mode);
    if (ip)
      return ip;
  } catch(e2) {}

  return "";
}

// ============================================================
// SESSION HELPERS
// ============================================================

function clearJordan(){
  SESSION.jordanKey = null;
  SESSION.jordanTs = 0;
}

function clearLobby(){
  SESSION.lobbyKey = null;
  SESSION.lobbyTs = 0;
}

function clearMatch(){
  SESSION.matchKey = null;
  SESSION.matchHost = null;
  SESSION.matchTs = 0;
}

function touchJordan(ip){
  SESSION.jordanKey = jordanBucket(ip);
  SESSION.jordanTs = nowMs();
}

function touchLobby(ip){
  SESSION.lobbyKey = lobbyBucket(ip);
  SESSION.lobbyTs = nowMs();
}

function touchMatch(host, ip){
  SESSION.matchKey = matchBucket(ip);
  SESSION.matchHost = host;
  SESSION.matchTs = nowMs();
}

function resetExpiredLocks(){
  var t = nowMs();

  if (SESSION.jordanKey && (t - SESSION.jordanTs > SETTINGS.JORDAN_TTL_MS)){
    clearJordan();
    clearLobby();
  }

  if (SESSION.lobbyKey && (t - SESSION.lobbyTs > SETTINGS.LOBBY_TTL_MS))
    clearLobby();

  if (SESSION.matchKey && (t - SESSION.matchTs > SETTINGS.MATCH_TTL_MS))
    clearMatch();
}

// ============================================================
// CORE
// ============================================================

function __PAC(url, host){
  var hostLiteral, data, mode, ip, pubg;

  if (isPlainHostName(host))
    return DIRECT;

  hostLiteral = normalizeHostLiteral(host);
  data = lower(host) + " " + lower(url);
  pubg = isPUBG(host, url);

  if (!pubg)
    return DIRECT;

  resetExpiredLocks();

  mode = detectMode(data);

  if (SETTINGS.DIRECT_HEAVY_ASSETS && mode == "heavy")
    return DIRECT;

  ip = resolveBestIP(host, mode);

  if (!ip)
    return BLOCK;

  if (familyOf(ip) == 4 && !SETTINGS.ALLOW_IPV4_FALLBACK)
    return BLOCK;

  if (!RE.MATCH.test(data) && RE.RESET.test(data))
    clearMatch();

  // ----------------------------------------------------------
  // STRICT LOBBY / AUTH / QUEUE / REGION / SESSION
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

    if (SETTINGS.REQUIRE_JORDAN_FOR_LOBBY)
      return BLOCK;

    return DIRECT;
  }

  // ----------------------------------------------------------
  // MATCH
  // ----------------------------------------------------------
  if (mode == "match"){
    if (sameMatchKey(ip, SESSION.matchKey)){
      SESSION.matchTs = nowMs();
      return PROXY;
    }

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

    if (SETTINGS.REQUIRE_JORDAN_SESSION_BEFORE_MATCH)
      return BLOCK;

    return PROXY;
  }

  // ----------------------------------------------------------
  // GENERIC PUBG CONTROL
  // ----------------------------------------------------------
  if (sameMatchKey(ip, SESSION.matchKey)){
    SESSION.matchTs = nowMs();
    return PROXY;
  }

  if (sameJordanKey(ip, SESSION.jordanKey)){
    SESSION.jordanTs = nowMs();
    return PROXY;
  }

  if (sameLobbyKey(ip, SESSION.lobbyKey)){
    SESSION.lobbyTs = nowMs();
    return PROXY;
  }

  if (isJordanIP(ip)){
    touchJordan(ip);
    return PROXY;
  }

  return BLOCK;
}

// ============================================================
// ENTRYPOINTS
// ============================================================

function FindProxyForURLEx(url, host){
  return __PAC(url, host);
}

function FindProxyForURL(url, host){
  return __PAC(url, host);
}
