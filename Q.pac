// ============================================================
// PUBG JORDAN ULTRA PRECISION v2
// IPv6 /40 + /44 + /48 Jordan Filtering
// Lobby Lock + Match Lock + Stable Routing
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobby:null,
  match:null,
  active:false
};

// ================= IPv6 DETECT =================

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

    var left  = parts[0] ? parts[0].split(":") : [];
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

// ================= JORDAN /40 =================

function jordan40(ip){

  return (

    ip.startsWith("2a01:9700:3f") ||
    ip.startsWith("2a01:9700:40") ||
    ip.startsWith("2a01:9700:41") ||
    ip.startsWith("2a01:9700:42") ||
    ip.startsWith("2a01:9700:43") ||
    ip.startsWith("2a01:9700:44") ||
    ip.startsWith("2a01:9700:45") ||

    ip.startsWith("2a02:2788:10") ||
    ip.startsWith("2a02:2788:11") ||
    ip.startsWith("2a02:2788:12") ||
    ip.startsWith("2a02:2788:13") ||

    ip.startsWith("2a02:2780:10") ||
    ip.startsWith("2a02:2780:11") ||
    ip.startsWith("2a02:2780:12") ||

    ip.startsWith("2a00:1c98:10") ||
    ip.startsWith("2a00:1c98:20")

  );

}

// ================= JORDAN /44 =================

function jordan44(ip){

  return (

    ip.startsWith("2a01:9700:401") ||
    ip.startsWith("2a01:9700:402") ||
    ip.startsWith("2a01:9700:403") ||
    ip.startsWith("2a01:9700:404") ||
    ip.startsWith("2a01:9700:405") ||
    ip.startsWith("2a01:9700:406") ||

    ip.startsWith("2a02:2788:100") ||
    ip.startsWith("2a02:2788:110") ||
    ip.startsWith("2a02:2788:120") ||

    ip.startsWith("2a02:2780:100") ||
    ip.startsWith("2a02:2780:110")

  );

}

// ================= JORDAN /48 =================

function jordan48(ip){

  return (

    ip.startsWith("2a01:9700:4010") ||
    ip.startsWith("2a01:9700:4020") ||
    ip.startsWith("2a01:9700:4030") ||
    ip.startsWith("2a01:9700:4040") ||

    ip.startsWith("2a02:2788:1000") ||
    ip.startsWith("2a02:2788:1100") ||

    ip.startsWith("2a02:2780:1000") ||
    ip.startsWith("2a02:2780:1100")

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

  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|update|patch|cdn|download/i
  .test(data);

}

// ================= MATCH =================

function isMatch(data){

  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival/i
  .test(data);

}

// ================= NETWORK =================

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

// ================= MAIN =================

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

  if(isIPv6(ip)){

    ip = expandIPv6(ip);

    if(isBlocked(ip))
      return BLOCK;

    if(!jordan40(ip) && !jordan44(ip) && !jordan48(ip))
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
