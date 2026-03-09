// ============================================================
// JORDAN LOCK v21
// State Machine: IDLE → LOBBY → QUEUE → MATCH → END
// DNS: 194.165.130.114 / 86.108.15.199 (Orange Jordan AS8376)
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// STATE MACHINE
// ============================================================

var SM = {
  state:     "IDLE",   // IDLE | LOBBY | QUEUE | MATCH | END
  matchNet:  null,     // /64 locked during MATCH
  lobbyNet:  null,     // /48 tracked during LOBBY/QUEUE
  matchHost: null,
  ts:        0         // last touch timestamp (ms)
};

var TIMEOUT = {
  MATCH: 7200000,   // 2h — active match window
  LOBBY: 1800000,   // 30min — lobby/queue idle reset
  END:    300000    // 5min — cooldown after match ends
};

function now(){ return (new Date()).getTime(); }

function touchSession(){
  SM.ts = now();
}

function resetSession(){
  SM.state     = "IDLE";
  SM.matchNet  = null;
  SM.lobbyNet  = null;
  SM.matchHost = null;
  SM.ts        = 0;
}

function checkTimeout(){
  if (!SM.ts) return;
  var elapsed = now() - SM.ts;
  if (SM.state === "MATCH" && elapsed > TIMEOUT.MATCH) resetSession();
  if ((SM.state === "LOBBY" || SM.state === "QUEUE") && elapsed > TIMEOUT.LOBBY) resetSession();
  if (SM.state === "END"   && elapsed > TIMEOUT.END)  resetSession();
}

// ============================================================
// URL / HOST PATTERN ENGINE  (منفصل عن IP logic)
// ============================================================

var PAT = {
  // CDN / patch / assets — يمرون DIRECT بدون proxy
  CDN: /\.(akamai|akamaized|akamaihd|cloudfront|fastly|edgesuite|llnwd|level3|cdn|steamcdn|mcdn|dlied|mfs\.net|msecnd|windowsupdate|apple|gstatic|googleapis|crashlytics|firebase|adjust|appsflyer)\./i,
  CDN_HOST: /patch|update|asset|download|launcher|install|cdn[0-9]*\.|dl\.|dl[0-9]+\.|ota\.|delivery\./i,

  // PUBG identifiers
  PUBG: /pubg|tencent|krafton|lightspeed|levelinfinite/i,

  // Match / in-game
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay|gameserver|gamesrv/i,

  // Queue / matchmaking phase
  QUEUE: /matchmak|queue|region|lobby|ping|latency|server.?list|serverlist/i,

  // Lobby / auth / session
  LOBBY: /login|auth|account|session|profile|inventory|store|catalog|gateway|config|telemetry|log|crash|report/i,

  // End-of-match indicators
  END: /result|reward|battle.?report|postgame|endgame|summary/i
};

function classifyURL(host, url){
  var s = (host + url).toLowerCase();
  if (PAT.CDN.test(host) || PAT.CDN_HOST.test(host)) return "CDN";
  if (!PAT.PUBG.test(s))                              return "OTHER";
  if (PAT.MATCH.test(s))                              return "MATCH";
  if (PAT.QUEUE.test(s))                              return "QUEUE";
  if (PAT.END.test(s))                                return "END";
  if (PAT.LOBBY.test(s))                              return "LOBBY";
  return "PUBG_GENERIC";
}

// ============================================================
// IP CLASSIFICATION
// ============================================================

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

// Orange Jordan AS8376 — full /32
function isOrangeJO(ip){
  return ip.startsWith("2a01:9700:");
}

// Zain Jordan AS48832 — known IPv6 ranges (RIPE confirmed)
// Primary PA block + mobile users
function isZainJO(ip){
  return (
    ip.startsWith("2a05:b480:") ||   // Zain PA block
    ip.startsWith("2001:16d8:")       // Zain legacy DSL
  );
}

// Umniah/Batelco AS9038
function isUmniahJO(ip){
  return (
    ip.startsWith("2a05:d580:") ||   // Umniah residential
    ip.startsWith("2001:16c0:")       // Batelco Jordan legacy
  );
}

// Jordan Telecom AS8697
function isJTJO(ip){
  return ip.startsWith("2a01:4f8:c0:");  // JT fiber
}

// VTEL/Damamax AS50670
function isVtelJO(ip){
  return ip.startsWith("2a02:ed0:");
}

// Any Jordanian IPv6
function isJordanIPv6(ip){
  return isOrangeJO(ip) || isZainJO(ip) || isUmniahJO(ip) || isJTJO(ip) || isVtelJO(ip);
}

// Best match server ranges (Orange core, low-ping)
function isMatchServer(ip){
  return (
    ip.startsWith("2a01:9700:4200:") ||
    ip.startsWith("2a01:9700:4300:") ||
    ip.startsWith("2a01:9700:4400:") ||  // expanded coverage
    ip.startsWith("2a01:9700:4100:")      // adjacent block
  );
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host){

  // ── CDN/patch bypass — always DIRECT ─────────────────────
  if (PAT.CDN.test(host) || PAT.CDN_HOST.test(host))
    return DIRECT;

  if (isPlainHostName(host))
    return DIRECT;

  // ── Classify URL ─────────────────────────────────────────
  var kind = classifyURL(host, url);

  if (kind === "CDN" || kind === "OTHER")
    return DIRECT;

  // ── DNS resolve ──────────────────────────────────────────
  var ip = "";
  try { ip = dnsResolve(host); } catch(e) { ip = ""; }

  if (!ip || !isIPv6(ip))
    return BLOCK;

  // ── Timeout check ────────────────────────────────────────
  checkTimeout();

  var parts = ip.split(":");

  // ============================================================
  // STATE: MATCH
  // ============================================================

  if (kind === "MATCH"){

    if (!isMatchServer(ip) && !isOrangeJO(ip))
      return BLOCK;

    var net64 = parts.slice(0, 4).join(":");

    if (SM.state !== "MATCH"){
      // Transition → MATCH
      SM.state     = "MATCH";
      SM.matchNet  = net64;
      SM.matchHost = host;
      touchSession();
      return PROXY;
    }

    // Locked — reject IP change
    if (net64 !== SM.matchNet)
      return BLOCK;

    touchSession();
    return PROXY;
  }

  // ============================================================
  // STATE: END
  // ============================================================

  if (kind === "END"){
    if (SM.state === "MATCH"){
      SM.state = "END";
      touchSession();
    }
    if (!isJordanIPv6(ip)) return BLOCK;
    return PROXY;
  }

  // ============================================================
  // STATE: QUEUE
  // ============================================================

  if (kind === "QUEUE"){

    if (!isJordanIPv6(ip))
      return BLOCK;

    var net48q = parts.slice(0, 3).join(":");

    if (SM.state === "IDLE" || SM.state === "LOBBY"){
      SM.state    = "QUEUE";
      SM.lobbyNet = net48q;
      touchSession();
      return PROXY;
    }

    if (SM.state === "QUEUE"){
      // Allow ISP rotation
      if (net48q !== SM.lobbyNet) SM.lobbyNet = net48q;
      touchSession();
      return PROXY;
    }

    return isJordanIPv6(ip) ? PROXY : BLOCK;
  }

  // ============================================================
  // STATE: LOBBY / GENERIC
  // ============================================================

  if (kind === "LOBBY" || kind === "PUBG_GENERIC"){

    if (!isJordanIPv6(ip))
      return BLOCK;

    var net48 = parts.slice(0, 3).join(":");

    if (SM.state === "IDLE"){
      SM.state    = "LOBBY";
      SM.lobbyNet = net48;
      touchSession();
    } else {
      if (net48 !== SM.lobbyNet) SM.lobbyNet = net48;
      touchSession();
    }

    return PROXY;
  }

  // ============================================================
  // FALLBACK — block non-Jordanian
  // ============================================================

  return isJordanIPv6(ip) ? PROXY : BLOCK;
}
