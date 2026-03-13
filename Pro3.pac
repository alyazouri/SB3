// ============================================================
// PUBG MOBILE — JORDAN FIRST LOCK v12.0
// Conservative Jordan-confirmed IPv6 only
// Fail-closed / Jordan-first / PAC-safe
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SETTINGS
// ============================================================

var SETTINGS = {
  STRICT_IPV6_ONLY:             true,
  FAIL_CLOSED_FOR_PUBG:         true,
  AGGRESSIVE_JORDAN_LOBBY:      true,
  JORDAN_REQUIRED_BEFORE_MATCH: true,
  MATCH_TTL_MS:                 25 * 60 * 1000,
  LOBBY_TTL_MS:                 10 * 60 * 1000,
  JORDAN_TTL_MS:                30 * 60 * 1000
};

// ============================================================
// SESSION
// ============================================================

var SESSION = {
  jordan48:    null,
  jordanHost:  null,
  jordanTs:    0,
  jordanReady: false,

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
  PUBG:         /(pubg|tencent|krafton|lightspeed|levelinfinite)/i,
  MATCH:        /(match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay)/i,
  LOBBY_STRICT: /(lobby|matchmaking|queue|login|auth|region|gateway|session)/i,
  LOBBY_SOFT:   /(profile|inventory|store|catalog|patch|update|cdn|config)/i,
  RESET:        /(lobby|matchmaking|queue|login|auth|session)/i
};

// ============================================================
// VERIFIED / CONSERVATIVE IPV6 BLOCKS
// Jordan-confirmed public routing data only
// ============================================================

var MATCH_PREFIXES = [
  { base: "2a01:9700:4200::", len: 40 },
  { base: "2a01:9700:4300::", len: 40 }
];

var JORDAN_STRONG_V6 = [
  { base: "2a01:9700:1700::", len: 40 }, // Dynamic ADSL / FTTH
  { base: "2a01:9700:1c00::", len: 40 }  // Dynamic ADSL / FTTH
];

var JORDAN_CONFIRMED_V6 = [
  { base: "2a01:9700:3100::", len: 40 },
  { base: "2a01:9700:3200::", len: 40 },
  { base: "2a01:9700:3300::", len: 40 },
  { base: "2a01:9700:3400::", len: 40 },
  { base: "2a01:9700:3500::", len: 40 },

  { base: "2a01:9700:3800::", len: 40 },
  { base: "2a01:9700:3900::", len: 40 },
  { base: "2a01:9700:3a00::", len: 40 },
  { base: "2a01:9700:3b00::", len: 40 },
  { base: "2a01:9700:3c00::", len: 40 },
  { base: "2a01:9700:3d00::", len: 40 },
  { base: "2a01:9700:3e00::", len: 40 },
  { base: "2a01:9700:3f00::", len: 40 },

  { base: "2a01:9700:4000::", len: 40 },
  { base: "2a01:9700:4100::", len: 40 },
  { base: "2a01:9700:4200::", len: 40 },
  { base: "2a01:9700:4300::", len: 40 },
  { base: "2a01:9700:4400::", len: 40 },
  { base: "2a01:9700:4500::", len: 40 },
  { base: "2a01:9700:4600::", len: 40 },

  { base: "2a01:9700:4800::", len: 40 },
  { base: "2a01:9700:4900::", len: 40 },
  { base: "2a01:9700:4a00::", len: 40 }
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

function isPUBG(host, url){
  return RE.PUBG.test(lower(host) + " " + lower(url));
}

// ============================================================
// NETWORK CLASSES
// ============================================================

function isMatchIPv6(ip){
  return isInV6List(ip, MATCH_PREFIXES);
}

function isJordanStrong(ip){
  return isInV6List(ip, JORDAN_STRONG_V6);
}

function isJordanConfirmed(ip){
  return isInV6List(ip, JORDAN_CONFIRMED_V6);
}

function isJordanPeer(ip){
  return isJordanStrong(ip) || isJordanConfirmed(ip);
}

function isLobbyIPv6(ip){
  return isJordanPeer(ip);
}

function isApprovedIPv6(ip){
  return isMatchIPv6(ip) || isJordanPeer(ip);
}

// ============================================================
// MODE / SCORE
// ============================================================

function detectMode(data){
  if (RE.MATCH.test(data))
    return "match";

  if (RE.LOBBY_STRICT.test(data))
    return "lobby_strict";

  if (RE.LOBBY_SOFT.test(data))
    return "lobby_soft";

  return "generic";
}

function scoreIPv6(ip, mode){
  var s = 0;
  var n48 = net48(ip);
  var n64 = net64(ip);

  if (!canonicalIPv6(ip))
    return -1;

  if (mode == "match"){
    if (isMatchIPv6(ip)) s += 1600;
    if (SESSION.matchNet && n64 == SESSION.matchNet) s += 700;
    if (SESSION.jordan48 && n48 == SESSION.jordan48) s += 450;
    if (isJordanStrong(ip)) s += 350;
    if (isJordanConfirmed(ip)) s += 180;
    return s;
  }

  if (mode == "lobby_strict"){
    if (SESSION.jordan48 && n48 == SESSION.jordan48) s += 3600;
    if (isJordanStrong(ip)) s += 3200;
    if (isJordanConfirmed(ip)) s += 2400;
    if (isMatchIPv6(ip)) s += 30;
    return s;
  }

  if (mode == "lobby_soft"){
    if (SESSION.jordan48 && n48 == SESSION.jordan48) s += 2200;
    if (SESSION.lobbyNet && n48 == SESSION.lobbyNet) s += 900;
    if (isJordanStrong(ip)) s += 1700;
    if (isJordanConfirmed(ip)) s += 1200;
    if (isMatchIPv6(ip)) s += 30;
    return s;
  }

  if (SESSION.jordan48 && n48 == SESSION.jordan48) s += 1700;
  if (isJordanStrong(ip)) s += 1300;
  if (isJordanConfirmed(ip)) s += 900;
  if (isMatchIPv6(ip)) s += 250;

  return s;
}

function pickBestIPv6(raw, mode){
  var i, start, token, best, bestScore, c, sc;

  raw = lower("" + (raw || ""));
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
      token = cleanupToken(raw.substring(start, i));
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
    c = canonicalIPv6(cleanupToken(raw));
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

// ============================================================
// SESSION HELPERS
// ============================================================

function clearJordanLock(){
  SESSION.jordan48    = null;
  SESSION.jordanHost  = null;
  SESSION.jordanTs    = 0;
  SESSION.jordanReady = false;
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

function pinJordan(host, ip){
  SESSION.jordan48    = net48(ip);
  SESSION.jordanHost  = host;
  SESSION.jordanTs    = nowMs();
  SESSION.jordanReady = true;
}

function touchLobby(ip, jordan){
  SESSION.lobbyNet    = net48(ip);
  SESSION.lobbyTs     = nowMs();
  SESSION.lobbyJordan = jordan ? true : false;
}

function touchMatch(host, ip){
  SESSION.matchNet  = net64(ip);
  SESSION.matchHost = host;
  SESSION.matchTs   = nowMs();
}

function resetExpiredLocks(){
  var t = nowMs();

  if (SESSION.matchNet && (t - SESSION.matchTs > SETTINGS.MATCH_TTL_MS))
    clearMatchLock();

  if (SESSION.lobbyNet && (t - SESSION.lobbyTs > SETTINGS.LOBBY_TTL_MS))
    clearLobbyLock();

  if (SESSION.jordanReady && (t - SESSION.jordanTs > SETTINGS.JORDAN_TTL_MS)){
    clearJordanLock();
    if (SESSION.lobbyJordan)
      clearLobbyLock();
  }
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host){
  var hostLiteral, pubgTagged, data, mode;
  var ip, critical, lobbyStrict, lobbySoft, jordan;
  var n48, n64;

  if (isPlainHostName(host))
    return DIRECT;

  hostLiteral = normalizeHostLiteral(host);
  pubgTagged  = isPUBG(host, url);

  if (!pubgTagged && !(isIPv6Text(hostLiteral) && isApprovedIPv6(hostLiteral)))
    return DIRECT;

  resetExpiredLocks();

  data = lower(host) + " " + lower(url);
  mode = detectMode(data);
  ip   = resolveBestIPv6(host, mode);

  if (!ip)
    return BLOCK;

  if (SETTINGS.STRICT_IPV6_ONLY && !isIPv6Text(ip))
    return BLOCK;

  if (!isApprovedIPv6(ip))
    return SETTINGS.FAIL_CLOSED_FOR_PUBG ? BLOCK : DIRECT;

  critical    = RE.MATCH.test(data);
  lobbyStrict = RE.LOBBY_STRICT.test(data);
  lobbySoft   = RE.LOBBY_SOFT.test(data);
  jordan      = isJordanPeer(ip);

  n48 = net48(ip);
  n64 = net64(ip);

  // استمرار الجلسة حتى لو الرابط ما حمل كلمات واضحة
  if (!critical && SESSION.matchNet && isMatchIPv6(ip) && n64 == SESSION.matchNet)
    critical = true;

  if (!lobbyStrict && SESSION.jordanReady && n48 == SESSION.jordan48)
    lobbyStrict = true;

  if (!critical && RE.RESET.test(data))
    clearMatchLock();

  // ----------------------------------------------------------
  // STRICT JORDAN-FIRST LOBBY / AUTH / QUEUE / REGION / SESSION
  // ----------------------------------------------------------
  if (lobbyStrict){
    if (jordan){
      pinJordan(host, ip);
      touchLobby(ip, true);
      return PROXY;
    }

    if (SETTINGS.AGGRESSIVE_JORDAN_LOBBY){
      if (SESSION.jordanReady && n48 == SESSION.jordan48){
        SESSION.jordanTs = nowMs();
        touchLobby(ip, true);
        return PROXY;
      }

      return BLOCK;
    }

    if (isLobbyIPv6(ip)){
      touchLobby(ip, false);
      return PROXY;
    }

    return BLOCK;
  }

  // ----------------------------------------------------------
  // MATCH — يبدأ فقط بعد Jordan lock
  // ----------------------------------------------------------
  if (critical && isMatchIPv6(ip)){
    if (SETTINGS.JORDAN_REQUIRED_BEFORE_MATCH && !SESSION.jordanReady)
      return BLOCK;

    if (!SESSION.matchNet){
      touchMatch(host, ip);
      return PROXY;
    }

    if (SESSION.matchNet == n64){
      SESSION.matchTs = nowMs();
      return PROXY;
    }

    return BLOCK;
  }

  // ----------------------------------------------------------
  // SOFT LOBBY / CDN / CONFIG
  // ----------------------------------------------------------
  if (lobbySoft && (isLobbyIPv6(ip) || jordan)){
    if (SESSION.jordanReady && n48 == SESSION.jordan48){
      SESSION.jordanTs = nowMs();
      return PROXY;
    }

    if (jordan){
      pinJordan(host, ip);
      touchLobby(ip, true);
      return PROXY;
    }

    if (SESSION.lobbyNet && n48 == SESSION.lobbyNet){
      SESSION.lobbyTs = nowMs();
      return PROXY;
    }

    return BLOCK;
  }

  // ----------------------------------------------------------
  // JORDAN FALLBACK
  // ----------------------------------------------------------
  if (jordan){
    pinJordan(host, ip);
    return PROXY;
  }

  if (SESSION.jordanReady && n48 == SESSION.jordan48){
    SESSION.jordanTs = nowMs();
    return PROXY;
  }

  if (SESSION.matchNet && isMatchIPv6(ip) && n64 == SESSION.matchNet){
    SESSION.matchTs = nowMs();
    return PROXY;
  }

  if (SESSION.lobbyNet && n48 == SESSION.lobbyNet){
    SESSION.lobbyTs = nowMs();
    return PROXY;
  }

  return BLOCK;
}
