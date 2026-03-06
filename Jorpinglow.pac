// ============================================================
// PUBG JORDAN GOD ROUTING
// Ultra Jordan Focus + Region Block + Match Lock
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  isp:null,
  lobby:null,
  match:null,
  active:false
};
function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

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
function isJordan(ip){

  return (

    ip.startsWith("2a01:9700") || 
    ip.startsWith("2a02:2788") || 
    ip.startsWith("2a02:2780") || 
    ip.startsWith("2a00:1c98") || 
    ip.startsWith("2a03:8c")  || 
    ip.startsWith("2a10") ||
    ip.startsWith("2a12")

  );

}
function isBlocked(ip){

  return (

    ip.startsWith("2400") || 
    ip.startsWith("2401") || 
    ip.startsWith("2402") || 
    ip.startsWith("2403") ||

    ip.startsWith("2600") || 
    ip.startsWith("2601") ||

    ip.startsWith("2800") ||

    ip.startsWith("2c0")  ||

    ip.startsWith("2a0f") || 
    ip.startsWith("2a05") || 
    ip.startsWith("2a06")

  );

}
function isPUBG(host){

  host = host.toLowerCase();

  if(host.indexOf("pubg") !== -1) return true;
  if(host.indexOf("tencent") !== -1) return true;
  if(host.indexOf("krafton") !== -1) return true;
  if(host.indexOf("levelinfinite") !== -1) return true;
  if(host.indexOf("lightspeed") !== -1) return true;

  return false;
}
function isLobby(data){

  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|catalog|news|event|mission|reward|mail|friends|clan|chat|voice|party|team|config|settings|update|patch|cdn|asset|download|social|rank|leaderboard/i
  .test(data);

}
function isMatch(data){

  return /match|battle|classic|ranked|arena|tdm|teamdeathmatch|royale|war|payload|metro|zombie|gamesvr|relay|realtime|combat|survival|spectate/i
  .test(data);

}
function getNet3(ip){

  if(isIPv6(ip))
    return ip.split(":").slice(0,3).join(":");

  return ip.split(".").slice(0,3).join(".");
}

function getNet4(ip){

  if(isIPv6(ip))
    return ip.split(":").slice(0,4).join(":");

  return ip.split(".").slice(0,3).join(".");
}
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

  var fullIP=ip;

  if(isIPv6(ip))
    fullIP=expandIPv6(ip);

  if(isBlocked(fullIP))
    return BLOCK;

  if(!isJordan(fullIP))
    return BLOCK;

  var data=(host+url).toLowerCase();

  var lobby=isLobby(data);
  var match=isMatch(data);

  var net3=getNet3(fullIP);
  var net4=getNet4(fullIP);

  if(!match && SESSION.active){

    SESSION.match=null;
    SESSION.active=false;

  }

  if(lobby){

    if(!SESSION.isp)
      SESSION.isp=net3;

    if(SESSION.isp!==net3)
      return BLOCK;

    SESSION.lobby=net3;

    return PROXY;

  }

  if(match){

    if(!SESSION.match){

      SESSION.match=net4;
      SESSION.isp=net3;
      SESSION.active=true;

    }

    if(SESSION.match!==net4)
      return BLOCK;

    if(SESSION.isp!==net3)
      return BLOCK;

    return PROXY;

  }

  return PROXY;

}
