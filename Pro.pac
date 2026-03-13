// ============================================================
// PUBG MOBILE — JORDAN LOCK v9.2
// IPv6 Only / PAC-safe / Stronger Session Stickiness
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SETTINGS
// ============================================================

var SETTINGS = {
  STRICT_IPV6_ONLY: true,
  MATCH_TTL_MS: 20 * 60 * 1000, // 20 min
  LOBBY_TTL_MS: 5 * 60 * 1000   // 5 min
};

// ============================================================
// SESSION
// ============================================================

var SESSION = {
  matchNet:  null,
  matchHost: null,
  matchTs:   0,
  lobbyNet:  null,
  lobbyTs:   0
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

var JORDAN_PEER_PREFIXES = [
  "2a01:9700:1b05:", // Infrastructure / Gateway Amman
  "2a01:9700:17e",   // FTTH Residential Amman
  "2a01:9700:1c"     // Residential Cluster Amman
];

// ============================================================
// HELPERS
// ============================================================

function lower(s){
  return (s || "").toLowerCase();
}

function hasPrefix(s, p){
  s = lower(s);
  p = lower(p);
  return s.substring(0, p.length) == p;
}

function nowMs(){
  return (new Date()).getTime();
}

function isIPv6(ip){
  return ip && ip.indexOf(":") != -1;
}

function normalizeHostLiteral(host){
  host = host || "";
  if (host.length > 1 && host.charAt(0) == "[" && host.charAt(host.length - 1) == "]")
    return host.substring(1, host.length - 1);
  return host;
}

function getHextet(ip, idx){
  var p = lower(ip).split(":");
  if (idx >= p.length) return "0";
  if (p[idx] === "") return "0";
  return p[idx];
}

function net48(ip){
  return getHextet(ip, 0) + ":" + getHextet(ip, 1) + ":" + getHextet(ip, 2);
}

function net64(ip){
  return net48(ip) + ":" + getHextet(ip, 3);
}

function isPUBG(host, url){
  return RE.PUBG.test(lower(host) + " " + lower(url));
}

function isHexRange48(ip, h0, h1, start, end, step){
  var a = getHextet(ip, 0);
  var b = getHextet(ip, 1);
  var c = parseInt(getHextet(ip, 2), 16);

  if (a != lower(h0) || b != lower(h1)) return false;
  if (isNaN(c)) return false;
  if (c < start || c > end) return false;

  return ((c - start) % step) == 0;
}

function isMatchIPv6(ip){
  var i;
  ip = lower(ip);

  for (i = 0; i < MATCH_PREFIXES.length; i++){
    if (hasPrefix(ip, MATCH_PREFIXES[i]))
      return true;
  }

  return false;
}

function isLobbyIPv6(ip){
  // 2a01:9700:1000 -> 2a01:9700:9000  step 0x100
  return isHexRange48(ip, "2a01", "9700", 0x1000, 0x9000, 0x100);
}

function isJordanPeer(ip){
  var i;
  ip = lower(ip);

  for (i = 0; i < JORDAN_PEER_PREFIXES.length; i++){
    if (hasPrefix(ip, JORDAN_PEER_PREFIXES[i]))
      return true;
  }

  return false;
}

function pickIPv6(raw){
  var i, start, token;

  raw = lower(raw);
  if (!raw) return "";

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
      if (token && isIPv6(token))
        return token;
      start = i + 1;
    }
  }

  return isIPv6(raw) ? raw : "";
}

function resolveIPv6(host){
  var literal = normalizeHostLiteral(host);
  var raw = "";

  if (isIPv6(literal))
    return lower(literal);

  try {
    if (typeof dnsResolveEx == "function")
      raw = dnsResolveEx(literal);
  } catch (e) {
    raw = "";
  }

  raw = pickIPv6(raw);
  if (raw)
    return raw;

  try {
    raw = dnsResolve(literal);
  } catch (e2) {
    raw = "";
  }

  raw = pickIPv6(raw);
  return raw || "";
}

function clearMatchLock(){
  SESSION.matchNet  = null;
  SESSION.matchHost = null;
  SESSION.matchTs   = 0;
}

function clearLobbyLock(){
  SESSION.lobbyNet = null;
  SESSION.lobbyTs  = 0;
}

function resetExpiredLocks(){
  var t = nowMs();

  if (SESSION.matchNet && (t - SESSION.matchTs > SETTINGS.MATCH_TTL_MS))
    clearMatchLock();

  if (SESSION.lobbyNet && (t - SESSION.lobbyTs > SETTINGS.LOBBY_TTL_MS))
    clearLobbyLock();
}

function isAllowedIPv6(ip){
  return isMatchIPv6(ip) || isLobbyIPv6(ip) || isJordanPeer(ip);
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host){
  var hostLiteral, pubgTagged, ip, data, critical, lobby, m64, l48;

  if (isPlainHostName(host))
    return DIRECT;

  hostLiteral = normalizeHostLiteral(host);
  pubgTagged  = isPUBG(host, url);

  // لو host نفسه IPv6 literal وداخل allowlist نكمله حتى لو بدون اسم دومين واضح
  if (!pubgTagged && !(isIPv6(hostLiteral) && isAllowedIPv6(hostLiteral)))
    return DIRECT;

  resetExpiredLocks();

  ip = resolveIPv6(host);
  if (!ip)
    return BLOCK;

  if (SETTINGS.STRICT_IPV6_ONLY && !isIPv6(ip))
    return BLOCK;

  // حماية حتى لا نمسك ترافيك غير PUBG بالخطأ إذا resolve طلع خارج allowlist
  if (!pubgTagged && !isAllowedIPv6(ip))
    return DIRECT;

  data     = lower(host) + " " + lower(url);
  critical = RE.CRITICAL.test(data);
  lobby    = RE.LOBBY.test(data);

  // reset تلقائي عند العودة للـ lobby/login/session
  if (!critical && RE.RESET.test(data))
    clearMatchLock();

  // ------------------------------------------------------------
  // MATCH LOCK /64
  // ------------------------------------------------------------
  if (critical && isMatchIPv6(ip)){
    m64 = net64(ip);

    if (!SESSION.matchNet){
      SESSION.matchNet  = m64;
      SESSION.matchHost = host;
      SESSION.matchTs   = nowMs();
      return PROXY;
    }

    if (SESSION.matchNet == m64 || SESSION.matchHost == host){
      SESSION.matchTs = nowMs();
      return PROXY;
    }

    return BLOCK;
  }

  // ------------------------------------------------------------
  // DYNAMIC LOBBY /48
  // ------------------------------------------------------------
  if (lobby && isLobbyIPv6(ip)){
    l48 = net48(ip);

    if (!SESSION.lobbyNet || SESSION.lobbyNet != l48)
      SESSION.lobbyNet = l48;

    SESSION.lobbyTs = nowMs();
    return PROXY;
  }

  // ------------------------------------------------------------
  // JORDAN PEER / INFRA BIAS
  // ------------------------------------------------------------
  if (isJordanPeer(ip))
    return PROXY;

  // ------------------------------------------------------------
  // SAFE FALLBACK
  // بعض مسارات PUBG لا تحمل كلمات واضحة، لكن طالما داخل allowlist IPv6
  // نمشيها على البروكسي بدل ما تنكسر الجلسة.
  // ------------------------------------------------------------
  if (isAllowedIPv6(ip))
    return PROXY;

  return BLOCK;
}
