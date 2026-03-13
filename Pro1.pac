// ============================================================
// PUBG MOBILE — JORDAN LOCK v10.0
// Strong Fail-Closed / IPv6 Only / Jordan Bias First
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SETTINGS
// ============================================================

var SETTINGS = {
  STRICT_IPV6_ONLY:     true,
  FAIL_CLOSED_FOR_PUBG: true,
  MATCH_TTL_MS:         25 * 60 * 1000,
  LOBBY_TTL_MS:         7 * 60 * 1000
};

// ============================================================
// SESSION
// ============================================================

var SESSION = {
  matchNet:    null,
  matchHost:   null,
  matchTs:     0,
  lobbyNet:    null,
  lobbyTs:     0,
  lobbyJordan: false
};

// ============================================================
// REGEX
// ============================================================

var RE = {
  PUBG:     /(pubg|tencent|krafton|lightspeed|levelinfinite)/i,
  CRITICAL: /(match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay)/i,
  LOBBY:    /(lobby|matchmaking|queue|login|auth|region|gateway|session|profile|inventory|store|catalog|patch|update|cdn|config)/i,
  RESET:    /(lobby|matchmaking|queue|login|auth|session)/i
};

// ============================================================
// PREFIXES
// ============================================================

var MATCH_PREFIXES = [
  "2a01:9700:4200:",
  "2a01:9700:4300:"
];

// لا تضيف هنا إلا prefixes مؤكدة من AAAA / logs / captures
var JORDAN_PEER_PREFIXES = [
  "2a01:9700:1b05:", // Infra / Gateway Amman
  "2a01:9700:17e",   // FTTH / Residential Jordan
  "2a01:9700:1c"     // Residential Cluster Jordan
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

  ip = normalizeHostLiteral(ip);

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

function hasPrefix(s, p){
  s = lower(s);
  p = lower(p);
  return s.substring(0, p.length) == p;
}

function net48(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0] + ":" + ex[1] + ":" + ex[2]) : "";
}

function net64(ip){
  var ex = expandIPv6(ip);
  return ex ? (ex[0] + ":" + ex[1] + ":" + ex[2] + ":" + ex[3]) : "";
}

function thirdHextetValue(ip){
  var ex = expandIPv6(ip);
  if (!ex)
    return -1;
  return parseInt(ex[2], 16);
}

function isPUBG(host, url){
  return RE.PUBG.test(lower(host) + " " + lower(url));
}

function isMatchIPv6(ip){
  var i, c;

  c = canonicalIPv6(ip);
  if (!c)
    return false;

  for (i = 0; i < MATCH_PREFIXES.length; i++){
    if (hasPrefix(c, MATCH_PREFIXES[i]))
      return true;
  }

  return false;
}

function isLobbyIPv6(ip){
  var h = thirdHextetValue(ip);

  if (h < 0x1000 || h > 0x9000)
    return false;

  return ((h - 0x1000) % 0x100) == 0;
}

function isJordanPeer(ip){
  var i, c;

  c = canonicalIPv6(ip);
  if (!c)
    return false;

  for (i = 0; i < JORDAN_PEER_PREFIXES.length; i++){
    if (hasPrefix(c, JORDAN_PEER_PREFIXES[i]))
      return true;
  }

  return false;
}

function isApprovedIPv6(ip){
  return isMatchIPv6(ip) || isLobbyIPv6(ip) || isJordanPeer(ip);
}

function scoreIPv6(ip, mode){
  var s = 0;
  var c = canonicalIPv6(ip);

  if (!c)
    return -1;

  if (mode == "match"){
    if (isMatchIPv6(c))  s += 400;
    if (isJordanPeer(c)) s += 150;
    if (isLobbyIPv6(c))  s += 50;
    return s;
  }

  if (mode == "lobby"){
    if (isJordanPeer(c)) s += 400;
    if (isLobbyIPv6(c))  s += 200;
    if (isMatchIPv6(c))  s += 50;
    return s;
  }

  if (isJordanPeer(c)) s += 300;
  if (isMatchIPv6(c))  s += 200;
  if (isLobbyIPv6(c))  s += 100;

  return s;
}

function pickBestIPv6(raw, mode){
  var i, start, token, best, bestScore, sc, c;

  raw = "" + (raw || "");
  raw = lower(raw);

  best = "";
  bestScore = -1;
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
      token = raw.substring(start, i);
      c = canonicalIPv6(token);

      if (c){
        sc = scoreIPv6(c, mode);
        if (sc > bestScore){
          best = c;
          bestScore = sc;
        }
      }

      start = i + 1;
    }
  }

  if (!best){
    c = canonicalIPv6(raw);
    if (c)
      return c;
  }

  return best;
}

function resolveBestIPv6(host, mode){
  var literal, raw, ip;

  literal = normalizeHostLiteral(host);

  if (isIPv6Text(literal))
    return canonicalIPv6(literal);

  raw = "";
  ip  = "";

  try {
    if (typeof dnsResolveEx == "function"){
      raw = dnsResolveEx(literal);
      ip = pickBestIPv6(raw, mode);
      if (ip)
        return ip;
    }
  } catch(e) {}

  try {
    raw = dnsResolve(literal);
    ip = pickBestIPv6(raw, mode);
    if (ip)
      return ip;
  } catch(e2) {}

  return "";
}

function clearMatchLock(){
  SESSION.matchNet  = null;
  SESSION.matchHost = null;
  SESSION.matchTs   = 0;
}

function clearLobbyLock(){
  SESSION.lobbyNet    = null;
  SESSION.lobbyTs     = 0;
  SESSION.lobbyJordan = false;
}

function resetExpiredLocks(){
  var t = nowMs();

  if (SESSION.matchNet && (t - SESSION.matchTs > SETTINGS.MATCH_TTL_MS))
    clearMatchLock();

  if (SESSION.lobbyNet && (t - SESSION.lobbyTs > SETTINGS.LOBBY_TTL_MS))
    clearLobbyLock();
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host){
  var hostLiteral, pubgTagged, data, mode, ip, critical, lobby, jordan, m64, l48;

  if (isPlainHostName(host))
    return DIRECT;

  hostLiteral = normalizeHostLiteral(host);
  pubgTagged  = isPUBG(host, url);
  data        = lower(host) + " " + lower(url);

  if (!pubgTagged && !(isIPv6Text(hostLiteral) && isApprovedIPv6(hostLiteral)))
    return DIRECT;

  resetExpiredLocks();

  mode = "generic";
  if (RE.CRITICAL.test(data))
    mode = "match";
  else if (RE.LOBBY.test(data))
    mode = "lobby";

  ip = resolveBestIPv6(host, mode);

  if (!ip)
    return BLOCK;

  if (SETTINGS.STRICT_IPV6_ONLY && !isIPv6Text(ip))
    return BLOCK;

  if (!isApprovedIPv6(ip))
    return SETTINGS.FAIL_CLOSED_FOR_PUBG ? BLOCK : DIRECT;

  critical = RE.CRITICAL.test(data);
  lobby    = RE.LOBBY.test(data);
  jordan   = isJordanPeer(ip);

  // استمرار الجلسة حتى لو URL ما حمل كلمات واضحة
  if (!critical && SESSION.matchNet && isMatchIPv6(ip) && net64(ip) == SESSION.matchNet)
    critical = true;

  if (!lobby && SESSION.lobbyNet && net48(ip) == SESSION.lobbyNet)
    lobby = true;

  // أي رجوع للـ lobby / login يمسح قفل الماتش
  if (!critical && RE.RESET.test(data))
    clearMatchLock();

  // ----------------------------------------------------------
  // STRICT MATCH LOCK /64
  // ----------------------------------------------------------
  if (critical && isMatchIPv6(ip)){
    m64 = net64(ip);

    if (!SESSION.matchNet){
      SESSION.matchNet  = m64;
      SESSION.matchHost = host;
      SESSION.matchTs   = nowMs();
      return PROXY;
    }

    if (SESSION.matchNet == m64){
      SESSION.matchTs = nowMs();
      return PROXY;
    }

    return BLOCK;
  }

  // ----------------------------------------------------------
  // LOBBY / AUTH / QUEUE
  // لو مسك Jordan lobby مرة، لا يطلع لغير Jordan إلا بعد TTL
  // ----------------------------------------------------------
  if (lobby && (isLobbyIPv6(ip) || jordan)){
    l48 = net48(ip);

    if (!SESSION.lobbyNet){
      SESSION.lobbyNet    = l48;
      SESSION.lobbyTs     = nowMs();
      SESSION.lobbyJordan = jordan;
      return PROXY;
    }

    if (SESSION.lobbyNet == l48){
      SESSION.lobbyTs = nowMs();
      return PROXY;
    }

    if (SESSION.lobbyJordan && !jordan)
      return BLOCK;

    SESSION.lobbyNet    = l48;
    SESSION.lobbyTs     = nowMs();
    SESSION.lobbyJordan = jordan;
    return PROXY;
  }

  // ----------------------------------------------------------
  // JORDAN INFRA / PEER BIAS
  // ----------------------------------------------------------
  if (jordan)
    return PROXY;

  // ----------------------------------------------------------
  // FAIL-CLOSED
  // أي PUBG خارج المسارات المحددة = BLOCK
  // ----------------------------------------------------------
  return BLOCK;
}
