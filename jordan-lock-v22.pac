// ============================================================
// JORDAN LOCK v22
// State Machine: IDLE → LOBBY → QUEUE → MATCH → END
// DNS: 194.165.130.114 / 86.108.15.199 (Orange Jordan AS8376)
// Proxy: 46.185.131.218:20001
// ============================================================

var PROXY = "PROXY 46.185.131.218:20001";
var BLOCK = "PROXY 0.0.0.0:0";

// ============================================================
// SESSION STATE MACHINE
// ============================================================

var SM = {
  state:     "IDLE",
  matchNet:  null,
  lobbyNet:  null,
  matchHost: null,
  ts:        0
};

var TIMEOUT = {
  MATCH: 7200000,
  LOBBY: 1800000,
  END:    300000
};

function now(){ return (new Date()).getTime(); }

function touch(){ SM.ts = now(); }

function reset(){
  SM.state     = "IDLE";
  SM.matchNet  = null;
  SM.lobbyNet  = null;
  SM.matchHost = null;
  SM.ts        = 0;
}

function tick(){
  if (!SM.ts) return;
  var e = now() - SM.ts;
  if (SM.state === "MATCH"                               && e > TIMEOUT.MATCH) reset();
  if ((SM.state === "LOBBY" || SM.state === "QUEUE")     && e > TIMEOUT.LOBBY) reset();
  if (SM.state === "END"                                 && e > TIMEOUT.END)   reset();
}

// ============================================================
// URL CLASSIFIER
// ============================================================

var P = {
  PUBG:  /pubg|tencent|krafton|lightspeed|levelinfinite/i,
  CDN:   /akamai|akamaized|akamaihd|cloudfront|fastly|edgesuite|llnwd|mcdn|gstatic|googleapis|crashlytics|firebase|adjust|appsflyer|msecnd|windowsupdate|steamcdn/i,
  CDNP:  /patch|update|asset|download|launcher|install|delivery|\.cdn\.|dl\.|dl[0-9]+\.|ota\./i,
  MATCH: /match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay|gamesrv|gameserver/i,
  QUEUE: /matchmak|queue|region|ping|latency|serverlist|server.?list/i,
  END:   /result|reward|battle.?report|postgame|endgame|summary/i,
  LOBBY: /lobby|login|auth|account|session|profile|inventory|store|catalog|gateway|config/i
};

function kind(host, url){
  if (P.CDN.test(host) || P.CDNP.test(host)) return "CDN";
  var s = host + url;
  if (!P.PUBG.test(s))   return "OTHER";
  if (P.MATCH.test(s))   return "MATCH";
  if (P.QUEUE.test(s))   return "QUEUE";
  if (P.END.test(s))     return "END";
  if (P.LOBBY.test(s))   return "LOBBY";
  return "G";
}

// ============================================================
// IP CLASSIFICATION
// ============================================================

function v6(ip){ return ip && ip.indexOf(":") !== -1; }

// Orange Jordan AS8376 — full /32 (RIPE: JO-SPRINT-20110309)
function orange(ip){ return ip.startsWith("2a01:9700:"); }

// Zain Jordan AS48832
function zain(ip){
  return ip.startsWith("2a05:b480:") ||
         ip.startsWith("2001:16d8:");
}

// Umniah/Batelco AS9038
function umniah(ip){
  return ip.startsWith("2a05:d580:") ||
         ip.startsWith("2001:16c0:");
}

// VTEL/Damamax AS50670
function vtel(ip){ return ip.startsWith("2a02:ed0:"); }

// Jordan Telecom AS8697
function jt(ip){ return ip.startsWith("2a01:4f8:c0:"); }

function jo(ip){
  return orange(ip) || zain(ip) || umniah(ip) || vtel(ip) || jt(ip);
}

// Known match server /48s inside Orange block
function matchSrv(ip){
  return ip.startsWith("2a01:9700:4100:") ||
         ip.startsWith("2a01:9700:4200:") ||
         ip.startsWith("2a01:9700:4300:") ||
         ip.startsWith("2a01:9700:4400:") ||
         ip.startsWith("2a01:9700:4500:");
}

// ============================================================
// MAIN
// ============================================================

function FindProxyForURL(url, host){

  if (P.CDN.test(host) || P.CDNP.test(host)) return "DIRECT";
  if (isPlainHostName(host))                  return "DIRECT";

  var k = kind(host, url);
  if (k === "CDN" || k === "OTHER") return "DIRECT";

  var ip = "";
  try { ip = dnsResolve(host); } catch(e) { ip = ""; }

  if (!ip || !v6(ip)) return BLOCK;

  tick();

  var seg = ip.split(":");
  var n64 = seg.slice(0,4).join(":");
  var n48 = seg.slice(0,3).join(":");

  // ── MATCH ──────────────────────────────────────────────────
  if (k === "MATCH"){
    if (!jo(ip)) return BLOCK;

    if (SM.state !== "MATCH"){
      SM.state     = "MATCH";
      SM.matchNet  = n64;
      SM.matchHost = host;
      touch();
      return PROXY;
    }

    // /64 lock — reject server change mid-match
    if (!matchSrv(ip) && n64 !== SM.matchNet) return BLOCK;

    // allow match server rotation within Orange block
    if (matchSrv(ip)) SM.matchNet = n64;

    touch();
    return PROXY;
  }

  // ── END ────────────────────────────────────────────────────
  if (k === "END"){
    if (SM.state === "MATCH"){ SM.state = "END"; touch(); }
    return jo(ip) ? PROXY : BLOCK;
  }

  // ── QUEUE ──────────────────────────────────────────────────
  if (k === "QUEUE"){
    if (!jo(ip)) return BLOCK;
    if (SM.state !== "MATCH"){
      SM.state    = "QUEUE";
      SM.lobbyNet = n48;
    }
    touch();
    return PROXY;
  }

  // ── LOBBY / GENERIC ────────────────────────────────────────
  if (k === "LOBBY" || k === "G"){
    if (!jo(ip)) return BLOCK;
    if (SM.state === "IDLE") SM.state = "LOBBY";
    if (SM.lobbyNet !== n48)  SM.lobbyNet = n48;
    touch();
    return PROXY;
  }

  return jo(ip) ? PROXY : BLOCK;
}
