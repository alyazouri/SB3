// ============================================================
// PUBG ELITE v7 ULTIMATE PRO ROUTING
// Jordan ISP + Precision IPv6 + Stable Match Lock
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobby:null,
  match:null,
  active:false
};

// ================= IPv6 =================

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

// ================= JORDAN IPv6 (Precise) =================

function isJordanIPv6(ip){

  return (

    // Orange Jordan
    ip.startsWith("2a01:9700:3f") ||
    ip.startsWith("2a01:9700:40") ||
    ip.startsWith("2a01:9700:41") ||
    ip.startsWith("2a01:9700:42") ||
    ip.startsWith("2a01:9700:43") ||
    ip.startsWith("2a01:9700:44") ||
    ip.startsWith("2a01:9700:45") ||

    // Orange detailed subnets
    ip.startsWith("2a01:9700:4010") ||
    ip.startsWith("2a01:9700:4020") ||
    ip.startsWith("2a01:9700:4030") ||
    ip.startsWith("2a01:9700:4040") ||
    ip.startsWith("2a01:9700:4050") ||
    ip.startsWith("2a01:9700:4060") ||

    // Zain
    ip.startsWith("2a02:2788:10") ||
    ip.startsWith("2a02:2788:11") ||
    ip.startsWith("2a02:2788:12") ||
    ip.startsWith("2a02:2788:13") ||
    ip.startsWith("2a02:2788:20") ||

    // Umniah
    ip.startsWith("2a02:2780:10") ||
    ip.startsWith("2a02:2780:11") ||
    ip.startsWith("2a02:2780:12") ||
    ip.startsWith("2a02:2780:20") ||

    // Jordan Data Network
    ip.startsWith("2a00:1c98:10") ||
    ip.startsWith("2a00:1c98:20")

  );

}

// ================= JORDAN IPv4 =================

function isJordanIPv4(ip){

  return (

    isInNet(ip,"46.185.128.0","255.255.192.0") ||
    isInNet(ip,"62.90.0.0","255.255.0.0") ||
    isInNet(ip,"77.28.0.0","255.252.0.0") ||
    isInNet(ip,"78.154.0.0","255.254.0.0") ||
    isInNet(ip,"79.134.128.0","255.255.128.0") ||
    isInNet(ip,"86.108.0.0","255.252.0.0") ||
    isInNet(ip,"87.236.232.0","255.255.252.0") ||
    isInNet(ip,"94.249.0.0","255.255.0.0")

  );

}

// ================= REGION BLOCK =================

function isBlocked(ip){

  return (

    ip.startsWith("240") ||
    ip.startsWith("241") ||
    ip.startsWith("242") ||

    ip.startsWith("2a05") ||
    ip.startsWith("2a06") ||

    ip.startsWith("2a0f") ||

    ip.startsWith("2c") ||

    ip.startsWith("260") ||

    ip.startsWith("280")

  );

}

// ================= PUBG DETECTION =================

function isPUBG(host){

  host = host.toLowerCase();

  return (

    host.indexOf("pubg") !== -1 ||
    host.indexOf("tencent") !== -1 ||
    host.indexOf("krafton") !== -1 ||
    host.indexOf("levelinfinite") !== -1 ||
    host.indexOf("lightspeed") !== -1

  );

}

// ================= LOBBY =================

function isLobby(data){

  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|friends|party|team|update|patch|cdn|download/i
  .test(data);

}

// ================= MATCH =================

function isMatch(data){

  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate/i
  .test(data);

}

// ================= SEGMENTS =================

function getNet4(ip){

  if(isIPv6(ip))
    return ip.split(":").slice(0,4).join(":");

  return ip.split(".").slice(0,3).join(".");
}

function getNet5(ip){

  if(isIPv6(ip))
    return ip.split(":").slice(0,5).join(":");

  return ip.split(".").slice(0,4).join(".");
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

  if(isBlocked(ip))
    return BLOCK;

  if(isIPv6(ip)){

    if(!isJordanIPv6(ip))
      return PROXY;

  }else{

    if(!isJordanIPv4(ip))
      return PROXY;

  }

  var data=(host+url).toLowerCase();

  var lobby=isLobby(data);
  var match=isMatch(data);

  var net4=getNet4(ip);
  var net5=getNet5(ip);

  if(!match && SESSION.active){

    SESSION.match=null;
    SESSION.active=false;

  }

  if(lobby){

    if(!SESSION.lobby)
      SESSION.lobby=net4;

    if(net4!==SESSION.lobby)
      return BLOCK;

    return PROXY;

  }

  if(match){

    if(!SESSION.match){

      SESSION.match=net5;
      SESSION.active=true;

    }

    if(net5!==SESSION.match)
      return BLOCK;

    return PROXY;

  }

  return PROXY;

}
