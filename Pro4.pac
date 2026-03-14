// ============================================================
// PUBG MOBILE — JORDAN FIRST PAC v13.0
// Jordan-first / lower-ping balanced / PAC-safe
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SETTINGS
// ============================================================

var SETTINGS = {
  STRICT_IPV6_ONLY:          true,
  REQUIRE_JORDAN_FOR_LOBBY:  true,
  REQUIRE_JORDAN_FOR_MATCH:  true,
  DIRECT_HEAVY_ASSETS:       true,
  JORDAN_TTL_MS:             30 * 60 * 1000,
  LOBBY_TTL_MS:              10 * 60 * 1000,
  MATCH_TTL_MS:              25 * 60 * 1000
};

// ============================================================
// SESSION
// ============================================================

var SESSION = {
  jordan48:   null,
  jordanTs:   0,
  lobby48:    null,
  lobbyTs:    0,
  match64:    null,
  matchHost:  null,
  matchTs:    0
};

// ============================================================
// TAGS
// ============================================================

var RE = {
  PUBG:   /(pubg|tencent|krafton|lightspeed|levelinfinite)/i,

  LOBBY:  /(lobby|matchmaking|queue|login|auth|region|gateway|session)/i,

  MATCH:  /(match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay)/i,

  HEAVY:  /(patch|update|cdn|catalog|store|inventory|profile|resource|download|event|notice|banner)/i,

  RESET:  /(lobby|matchmaking|queue|login|auth|session)/i
};

// ============================================================
// EXACT IPv6 /40 LISTS
// ============================================================

var JORDAN_STRONG_V6 = [
  { base: "2a01:9700:1700::", len: 40 },
  { base: "2a01:9700:1c00::", len: 40 }
];

var JORDAN_CONFIRMED_V6 = [
  { base: "2a01:9700:4000::", len: 40 },
  { base: "2a01:9700:4100::", len: 40 },
  { base: "2a01:9700:4200::", len: 40 },
  { base: "2a01:9700:4500::", len: 40 },
  { base: "2a01:9700:4600::", len: 40 },
  { base: "2a01:9700:4800::", len: 40 },
  { base: "2a01:9700:4900::", len: 40 }
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

function isIPv6Text(s){
  return s && s.indexOf(":") != -1;
}

function isHexChar(ch){
  return (
    (ch >= "0" && ch <= "9") ||
    (ch >= "a" && ch <= "f")
  );
}

function cleanupToken(token){
  token = lower(token || "");

  while (token.length > 0) {
    var a = token.charAt(0);
    if (isHexChar(a) || a == ":" || a == "[")
      break;
    token = token.substring(1);
  }

  while (token.length > 0) {
    var b = token.charAt(token.length - 1);
    if (isHexChar(b) || b == ":" || b == "]")
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

function net48(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0] + ":" + ex[1] + ":" + ex[2]) : "";
}

function net64(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0] + ":" + ex[1] + ":" + ex[2] + ":" + ex[3]) : "";
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

function isInV6List(ip, list){
  var i;
  for (i = 0; i < list.length; i++){
    if (v6MatchCidr(ip, list[i].base, list[i].len))
      return true;
  }
  return false;
}

function isJordanStrong(ip){
  return isInV6List(ip, JORDAN_STRONG_V6);
}

function isJordanConfirmed(ip){
  return isInV6List(ip, JORDAN_CONFIRMED_V6);
}

function isJordan(ip){
  return isJordanStrong(ip) || isJordanConfirmed(ip);
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
  if (RE.MATCH.test(data))
    return "match";

  if (RE.LOBBY.test(data))
    return "lobby";

  if (RE.HEAVY.test(data))
    return "heavy";

  return "generic";
}

function scoreIP(ip, mode){
  var s = 0;
  var c = canonicalIPv6(ip);
  var n48, n64;

  if (!c)
    return -1;

  n48 = net48(c);
  n64 = net64(c);

  if (SESSION.match64 && n64 == SESSION.match64)
    s += 6000;

  if (SESSION.jordan48 && n48 == SESSION.jordan48)
    s += 3000;

  if (mode == "lobby"){
    if (isJordanStrong(c))    s += 2500;
    if (isJordanConfirmed(c)) s += 1800;
    return s;
  }

  if (mode == "match"){
    if (isJordanStrong(c))    s += 2200;
    if (isJordanConfirmed(c)) s += 1500;
    return s;
  }

  if (isJordanStrong(c))    s += 1800;
  if (isJordanConfirmed(c)) s += 1200;

  return s;
}

function pickBestIP(raw, mode){
  var items, i, c, best, bestScore, sc;

  items = splitCandidates(raw);
  best = "";
  bestScore = -1;

  for (i = 0; i < items.length; i++){
    c = canonicalIPv6(items[i]);

    if (!c)
      continue;

    sc = scoreIP(c, mode);
    if (sc > bestScore){
      best = c;
      bestScore = sc;
    }
  }

  if (!best){
    c = canonicalIPv6(cleanupToken(raw));
    if (c)
      return c;
  }

  return best;
}

function resolveBestIP(host, mode){
  var literal, raw, ip;

  literal = normalizeHostLiteral(host);

  if (isIPv6Text(literal))
    return canonicalIPv6(literal);

  raw = "";
  ip  = "";

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
  SESSION.jordan48 = null;
  SESSION.jordanTs = 0;
}

function clearLobby(){
  SESSION.lobby48 = null;
  SESSION.lobbyTs = 0;
}

function clearMatch(){
  SESSION.match64 = null;
  SESSION.matchHost = null;
  SESSION.matchTs = 0;
}

function touchJordan(ip){
  SESSION.jordan48 = net48(ip);
  SESSION.jordanTs = nowMs();
}

function touchLobby(ip){
  SESSION.lobby48 = net48(ip);
  SESSION.lobbyTs = nowMs();
}

function touchMatch(host, ip){
  SESSION.match64 = net64(ip);
  SESSION.matchHost = host;
  SESSION.matchTs = nowMs();
}

function resetExpiredLocks(){
  var t = nowMs();

  if (SESSION.jordan48 && (t - SESSION.jordanTs > SETTINGS.JORDAN_TTL_MS)){
    clearJordan();
    clearLobby();
  }

  if (SESSION.lobby48 && (t - SESSION.lobbyTs > SETTINGS.LOBBY_TTL_MS))
    clearLobby();

  if (SESSION.match64 && (t - SESSION.matchTs > SETTINGS.MATCH_TTL_MS))
    clearMatch();
}

// ============================================================
// CORE
// ============================================================

function __PAC(url, host){
  var hostLiteral, data, pubg, mode, ip, n48, n64;

  if (isPlainHostName(host))
    return DIRECT;

  hostLiteral = normalizeHostLiteral(host);
  data = lower(host) + " " + lower(url);
  pubg = isPUBG(host, url);

  if (!pubg && !(isIPv6Text(hostLiteral) && isJordan(hostLiteral)))
    return DIRECT;

  resetExpiredLocks();

  mode = detectMode(data);

  if (SETTINGS.DIRECT_HEAVY_ASSETS && mode == "heavy")
    return DIRECT;

  ip = resolveBestIP(host, mode);

  if (!ip)
    return BLOCK;

  if (SETTINGS.STRICT_IPV6_ONLY && !isIPv6Text(ip))
    return BLOCK;

  n48 = net48(ip);
  n64 = net64(ip);

  if (!RE.MATCH.test(data) && RE.RESET.test(data))
    clearMatch();

  // ----------------------------------------------------------
  // STRICT LOBBY / AUTH / QUEUE / REGION / SESSION
  // ----------------------------------------------------------
  if (mode == "lobby"){
    if (isJordan(ip)){
      touchJordan(ip);
      touchLobby(ip);
      return PROXY;
    }

    if (SESSION.jordan48 && n48 == SESSION.jordan48){
      SESSION.jordanTs = nowMs();
      touchLobby(ip);
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
    if (SETTINGS.REQUIRE_JORDAN_FOR_MATCH && !SESSION.jordan48)
      return BLOCK;

    if (SESSION.match64 && n64 == SESSION.match64){
      SESSION.matchTs = nowMs();
      return PROXY;
    }

    if (isJordan(ip)){
      touchMatch(host, ip);
      if (!SESSION.jordan48)
        touchJordan(ip);
      return PROXY;
    }

    return BLOCK;
  }

  // ----------------------------------------------------------
  // GENERIC PUBG CONTROL TRAFFIC
  // ----------------------------------------------------------
  if (SESSION.jordan48 && n48 == SESSION.jordan48){
    SESSION.jordanTs = nowMs();
    return PROXY;
  }

  if (isJordan(ip)){
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
