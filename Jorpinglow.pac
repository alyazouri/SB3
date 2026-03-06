// ============================================================
// PUBG JORDAN FINAL ROUTING SCRIPT
// Jordan IPv6 Lock + Lobby 4 Segments + Match 5 Segments
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

// ================= SESSION =================

var SESSION = {
  isp:null,
  lobby:null,
  match:null,
  active:false
};

// ================= IPv6 CHECK =================

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

// ================= EXPAND IPv6 =================

function expandIPv6(address){

  if(!address || address.indexOf(":") === -1)
    return address;

  var parts = address.split("::");
  var full = [];

  if(parts.length === 2){

    var left = parts[0] ? parts[0].split(":") : [];
    var right = parts[1] ? parts[1].split(":") : [];

    var missing = 8 - (left.length + right.length);

    full = left;

    for(var i=0;i<missing;i++)
      full.push("0000");

    full = full.concat(right);

  }else{

    full = address.split(":");

  }

  for(var j=0;j<full.length;j++){
    while(full[j].length < 4)
      full[j] = "0" + full[j];
  }

  return full.join(":").toLowerCase();
}

// ================= JORDAN RANGES =================
// Source: RIPE NCC allocation for Orange Jordan

function isJordan(ip){

  var parts = ip.split(":");
  var net3 = parts.slice(0,3).join(":");

  return (

    net3 === "2a01:9700:3f" ||
    net3 === "2a01:9700:40" ||
    net3 === "2a01:9700:41" ||
    net3 === "2a01:9700:42" ||
    net3 === "2a01:9700:43" ||
    net3 === "2a01:9700:44" ||
    net3 === "2a01:9700:45"

  );

}

// ================= REGION BLOCK =================

function isBlocked(ip){

  return (

    ip.startsWith("2400") ||
    ip.startsWith("2401") ||
    ip.startsWith("2402") ||
    ip.startsWith("2403") ||

    ip.startsWith("2a05") ||
    ip.startsWith("2a06") ||

    ip.startsWith("2a0f") ||

    ip.startsWith("2600") ||
    ip.startsWith("2601") ||

    ip.startsWith("2800") ||

    ip.startsWith("2c0")

  );

}

// ================= PUBG DETECTION =================

function isPUBG(host){

  host = host.toLowerCase();

  if(host.indexOf("pubg") !== -1) return true;
  if(host.indexOf("tencent") !== -1) return true;
  if(host.indexOf("krafton") !== -1) return true;
  if(host.indexOf("levelinfinite") !== -1) return true;
  if(host.indexOf("lightspeed") !== -1) return true;

  return false;
}

// ================= LOBBY TRAFFIC =================

function isLobby(data){

  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|catalog|news|event|mission|reward|mail|friends|clan|chat|voice|party|team|config|settings|update|patch|cdn|asset|download|social|rank|leaderboard/i
  .test(data);

}

// ================= MATCH TRAFFIC =================

function isMatch(data){

  return /match|battle|classic|ranked|arena|tdm|teamdeathmatch|royale|war|payload|metro|zombie|gamesvr|relay|realtime|combat|survival|spectate/i
  .test(data);

}

// ================= NETWORK SEGMENTS =================

function getNet4(ip){
  return ip.split(":").slice(0,4).join(":");
}

function getNet5(ip){
  return ip.split(":").slice(0,5).join(":");
}

// ================= MAIN ENGINE =================

function FindProxyForURL(url,host){

  if(isPlainHostName(host))
    return DIRECT;

  if(!isPUBG(host))
    return DIRECT;

  var ip="";

  try{
    ip=dnsResolve(host);
  }catch(e){
    ip="";
  }

  if(!ip)
    return PROXY;

  var fullIP = ip;

  if(isIPv6(ip))
    fullIP = expandIPv6(ip);

  // ===== REGION BLOCK =====

  if(isBlocked(fullIP))
    return BLOCK;

  // ===== JORDAN FILTER =====

  if(!isJordan(fullIP))
    return BLOCK;

  var data = (host + url).toLowerCase();

  var lobby = isLobby(data);
  var match = isMatch(data);

  var net4 = getNet4(fullIP);
  var net5 = getNet5(fullIP);

  // ===== RESET SESSION =====

  if(!match && SESSION.active){

    SESSION.match = null;
    SESSION.active = false;

  }

  // ===== LOBBY LOCK (4 SEGMENTS) =====

  if(lobby){

    if(!SESSION.lobby)
      SESSION.lobby = net4;

    if(net4 !== SESSION.lobby)
      return BLOCK;

    return PROXY;

  }

  // ===== MATCH LOCK (5 SEGMENTS) =====

  if(match){

    if(!SESSION.match){

      SESSION.match = net5;
      SESSION.active = true;

    }

    if(net5 !== SESSION.match)
      return BLOCK;

    return PROXY;

  }

  return PROXY;

}
