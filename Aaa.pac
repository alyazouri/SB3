// ============================================================
// JORDAN LOCK v24
// IPv6 prefixes: RIPE NCC verified + BGP confirmed (Mar 2026)
//
// Orange Jordan AS8376:
//   2a01:9700::/32       — allocated block (umbrella)
//   2a01:9700:1000::/36  — ADSL-FTTH (netname: ADSL-FTTH, RIPE 2022)
//   2a01:9700:17e0::/44  — route6 BGP announced (RIPE 2023-10-22)
//
// Zain Jordan AS48832 (Linkdotnet-Jordan):
//   2a06:8ec0::/32       — BGP confirmed
//
// Umniah/Batelco AS9038:
//   2a05:d040::/29       — BGP announced
//
// VTEL/Damamax AS50670:
//   2a02:ed0::/32        — BGP confirmed
//
// DNS: 194.165.130.114 / 86.108.15.199  (Orange Jordan AS8376)
// Proxy: 46.185.131.218:20001
// ============================================================

var PROXY = "PROXY 46.185.131.218:20001";
var BLOCK = "PROXY 0.0.0.0:0";

// ── State Machine ─────────────────────────────────────────
var SM = {
  state: "IDLE", matchNet: null,
  lobbyNet: null, matchHost: null, ts: 0
};

function now(){ return (new Date()).getTime(); }
function touch(){ SM.ts = now(); }
function reset(){
  SM.state="IDLE"; SM.matchNet=null;
  SM.lobbyNet=null; SM.matchHost=null; SM.ts=0;
}
function tick(){
  if (!SM.ts) return;
  var e = now() - SM.ts;
  if (SM.state==="MATCH"  && e>7200000){ reset(); return; }
  if ((SM.state==="LOBBY"||SM.state==="QUEUE") && e>1800000){ reset(); return; }
  if (SM.state==="END"    && e>300000) { reset(); return; }
}

// ── URL Classifier ────────────────────────────────────────
var P = {
  PUBG:  /pubg|tencent|krafton|lightspeed|levelinfinite/i,
  CDN:   /akamai|cloudfront|fastly|gstatic|googleapis|msecnd|windowsupdate/i,
  CDNP:  /patch|update|asset|download|launcher|delivery|\.cdn\.|ota\./i,
  MATCH: /match|battle|classic|ranked|arena|tdm|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay|gameserver/i,
  QUEUE: /matchmak|queue|region|ping|latency|serverlist/i,
  END:   /result|reward|postgame|endgame|summary/i,
  LOBBY: /lobby|login|auth|session|profile|inventory|store|gateway|config/i
};

function kind(host, url){
  if (P.CDN.test(host)||P.CDNP.test(host)) return "CDN";
  var s = host + url;
  if (!P.PUBG.test(s)) return "OTHER";
  if (P.MATCH.test(s)) return "MATCH";
  if (P.QUEUE.test(s)) return "QUEUE";
  if (P.END.test(s))   return "END";
  if (P.LOBBY.test(s)) return "LOBBY";
  return "G";
}

// ── IP Classification — RIPE/BGP exact prefixes ──────────
function v6(ip){ return ip && ip.indexOf(":")!==-1; }

// Orange Jordan AS8376
// /32 umbrella + /36 ADSL-FTTH + /44 announced route6
function orange(ip){
  return ip.startsWith("2a01:9700:");
}

// Orange ADSL-FTTH — الـ /36 الرسمي (RIPE inet6num 2022)
// يغطي 2a01:9700:1000:: → 2a01:9700:1fff::
function orangeFTTH(ip){
  if (!ip.startsWith("2a01:9700:")) return false;
  var s3 = parseInt(ip.split(":")[2], 16);
  return s3 >= 0x1000 && s3 <= 0x1fff;
}

// Orange BGP announced route6 /44 (RIPE 2023-10-22)
function orangeRoute(ip){
  return ip.startsWith("2a01:9700:17e");
}

// Zain Jordan AS48832
function zain(ip){ return ip.startsWith("2a06:8ec0:"); }

// Umniah/Batelco AS9038 — /29 covers 2a05:d040:: → 2a05:d047::
function umniah(ip){
  if (!ip.startsWith("2a05:d0")) return false;
  var s2 = parseInt(ip.split(":")[2], 16);
  return s2 >= 0x40 && s2 <= 0x47;  // /29 exact
}

// VTEL/Damamax AS50670
function vtel(ip){ return ip.startsWith("2a02:ed0:"); }

function jo(ip){
  return orange(ip)||zain(ip)||umniah(ip)||vtel(ip);
}

// Match server pool — Orange core /48s (4100–4500)
function matchSrv(ip){
  return ip.startsWith("2a01:9700:4100:")||
         ip.startsWith("2a01:9700:4200:")||
         ip.startsWith("2a01:9700:4300:")||
         ip.startsWith("2a01:9700:4400:")||
         ip.startsWith("2a01:9700:4500:");
}

// ── Main ──────────────────────────────────────────────────
function FindProxyForURL(url, host){

  if (P.CDN.test(host)||P.CDNP.test(host)) return "DIRECT";
  if (isPlainHostName(host))               return "DIRECT";

  var k = kind(host, url);
  if (k==="CDN"||k==="OTHER") return "DIRECT";

  var ip="";
  try{ ip=dnsResolve(host); }catch(e){ ip=""; }
  if (!ip||!v6(ip)) return BLOCK;

  tick();

  var seg=ip.split(":");
  var n64=seg.slice(0,4).join(":");
  var n48=seg.slice(0,3).join(":");

  // MATCH
  if (k==="MATCH"){
    if (!jo(ip)) return BLOCK;
    if (SM.state!=="MATCH"){
      SM.state="MATCH"; SM.matchNet=n64;
      SM.matchHost=host; touch(); return PROXY;
    }
    if (matchSrv(ip)){ SM.matchNet=n64; touch(); return PROXY; }
    if (n64!==SM.matchNet) return BLOCK;
    touch(); return PROXY;
  }

  // END
  if (k==="END"){
    if (SM.state==="MATCH"){ SM.state="END"; touch(); }
    return jo(ip) ? PROXY : BLOCK;
  }

  // QUEUE
  if (k==="QUEUE"){
    if (!jo(ip)) return BLOCK;
    if (SM.state!=="MATCH"){ SM.state="QUEUE"; SM.lobbyNet=n48; }
    touch(); return PROXY;
  }

  // LOBBY / GENERIC
  if (k==="LOBBY"||k==="G"){
    if (!jo(ip)) return BLOCK;
    if (SM.state==="IDLE") SM.state="LOBBY";
    SM.lobbyNet=n48; touch(); return PROXY;
  }

  return jo(ip) ? PROXY : BLOCK;
}
