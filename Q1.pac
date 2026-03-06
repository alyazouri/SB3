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

    ip.startsWith("2a01:9700:3900") ||
    ip.startsWith("2a01:9700:4300") ||
    ip.startsWith("2a01:9700:4400")

  );

}

// ================= JORDAN /44 =================

function jordan44(ip){

  return (

    ip.startsWith("2a01:9700:17a0") ||
    ip.startsWith("2a01:9700:17b0") ||
    ip.startsWith("2a01:9700:17c0") ||
    ip.startsWith("2a01:9700:17d0") ||
    ip.startsWith("2a01:9700:17e0") ||
    ip.startsWith("2a01:9700:1c70") ||
    ip.startsWith("2a01:9700:1c90") ||
    ip.startsWith("2a01:9700:1ca0") ||
    ip.startsWith("2a01:9700:1cb0") ||
    ip.startsWith("2a01:9700:1cc0") ||
    ip.startsWith("2a01:9700:1cd0") ||
    ip.startsWith("2a01:9700:1ce0") ||
    ip.startsWith("2a01:9700:1cf0") ||
    ip.startsWith("2a01:9700:3130") ||
    ip.startsWith("2a01:9700:3140") ||
    ip.startsWith("2a01:9700:3150") ||
    ip.startsWith("2a01:9700:3160") ||
    ip.startsWith("2a01:9700:3210") ||
    ip.startsWith("2a01:9700:3220") ||
    ip.startsWith("2a01:9700:3230") ||
    ip.startsWith("2a01:9700:3350") ||
    ip.startsWith("2a01:9700:3360") ||
    ip.startsWith("2a01:9700:3370") ||
    ip.startsWith("2a01:9700:3400") ||
    ip.startsWith("2a01:9700:3410") ||
    ip.startsWith("2a01:9700:3420") ||
    ip.startsWith("2a01:9700:34f0") ||
    ip.startsWith("2a01:9700:3520") ||
    ip.startsWith("2a01:9700:3530") ||
    ip.startsWith("2a01:9700:3540") ||
    ip.startsWith("2a01:9700:3550") ||
    ip.startsWith("2a01:9700:3560") ||
    ip.startsWith("2a01:9700:3570") ||
    ip.startsWith("2a01:9700:3580") ||
    ip.startsWith("2a01:9700:3840") ||
    ip.startsWith("2a01:9700:3850") ||
    ip.startsWith("2a01:9700:3860") ||
    ip.startsWith("2a01:9700:3870") ||
    ip.startsWith("2a01:9700:3880") ||
    ip.startsWith("2a01:9700:3890") ||
    ip.startsWith("2a01:9700:38a0") ||
    ip.startsWith("2a01:9700:3920") ||
    ip.startsWith("2a01:9700:3940") ||
    ip.startsWith("2a01:9700:3950") ||
    ip.startsWith("2a01:9700:3960") ||
    ip.startsWith("2a01:9700:3970") ||
    ip.startsWith("2a01:9700:3980") ||
    ip.startsWith("2a01:9700:3990") ||
    ip.startsWith("2a01:9700:3a00") ||
    ip.startsWith("2a01:9700:3a10") ||
    ip.startsWith("2a01:9700:3a20") ||
    ip.startsWith("2a01:9700:3b00") ||
    ip.startsWith("2a01:9700:3bf0") ||
    ip.startsWith("2a01:9700:3ca0") ||
    ip.startsWith("2a01:9700:3cb0") ||
    ip.startsWith("2a01:9700:3cc0") ||
    ip.startsWith("2a01:9700:3cd0") ||
    ip.startsWith("2a01:9700:3d00") ||
    ip.startsWith("2a01:9700:3d10") ||
    ip.startsWith("2a01:9700:3d20") ||
    ip.startsWith("2a01:9700:3df0") ||
    ip.startsWith("2a01:9700:3e00") ||
    ip.startsWith("2a01:9700:3e10") ||
    ip.startsWith("2a01:9700:3e40") ||
    ip.startsWith("2a01:9700:3e50") ||
    ip.startsWith("2a01:9700:3e60") ||
    ip.startsWith("2a01:9700:3f60") ||
    ip.startsWith("2a01:9700:3f70") ||
    ip.startsWith("2a01:9700:3f80") ||
    ip.startsWith("2a01:9700:3f90") ||
    ip.startsWith("2a01:9700:3fa0") ||
    ip.startsWith("2a01:9700:4000") ||
    ip.startsWith("2a01:9700:4030") ||
    ip.startsWith("2a01:9700:4040") ||
    ip.startsWith("2a01:9700:4050") ||
    ip.startsWith("2a01:9700:4060") ||
    ip.startsWith("2a01:9700:40f0") ||
    ip.startsWith("2a01:9700:4110") ||
    ip.startsWith("2a01:9700:4120") ||
    ip.startsWith("2a01:9700:4130") ||
    ip.startsWith("2a01:9700:42b0") ||
    ip.startsWith("2a01:9700:42c0") ||
    ip.startsWith("2a01:9700:4330") ||
    ip.startsWith("2a01:9700:4338")

  );

}

// ================= JORDAN /48 =================

function jordan48(ip){

  return (

    ip.startsWith("2a01:9700:100b") ||
    ip.startsWith("2a01:9700:140d")

  );

}

// ================= JORDAN IPv4 =================

function jordanIPv4(ip){

  return (

    ip.startsWith("37.202.") ||
    ip.startsWith("46.185.") ||
    ip.startsWith("79.173.") ||
    ip.startsWith("80.10.") ||
    ip.startsWith("86.108.") ||
    ip.startsWith("92.253.") ||
    ip.startsWith("94.249.") ||
    ip.startsWith("149.200.") ||
    ip.startsWith("194.165.") ||
    ip.startsWith("37.44.") ||
    ip.startsWith("46.243.") ||
    ip.startsWith("95.183.") ||
    ip.startsWith("212.118.") ||
    ip.startsWith("37.17.") ||
    ip.startsWith("46.32.") ||
    ip.startsWith("62.72.") ||
    ip.startsWith("77.245.") ||
    ip.startsWith("5.45.") ||
    ip.startsWith("5.198.") ||
    ip.startsWith("5.199.") ||
    ip.startsWith("37.75.") ||
    ip.startsWith("37.123.") ||
    ip.startsWith("37.152.") ||
    ip.startsWith("37.220.") ||
    ip.startsWith("45.142.") ||
    ip.startsWith("46.23.") ||
    ip.startsWith("46.248.") ||
    ip.startsWith("79.134.") ||
    ip.startsWith("82.212.") ||
    ip.startsWith("176.119.") ||
    ip.startsWith("185.15.") ||
    ip.startsWith("185.94.") ||
    ip.startsWith("185.177.") ||
    ip.startsWith("193.188.") ||
    ip.startsWith("194.126.")

  );

}

// ================= REGION BLOCK IPv6 =================

function isBlockedIPv6(ip){

  return (

    ip.startsWith("2400") ||
    ip.startsWith("2401") ||
    ip.startsWith("2402") ||
    ip.startsWith("2403") ||
    ip.startsWith("2404") ||
    ip.startsWith("2405") ||
    ip.startsWith("2406") ||
    ip.startsWith("2407") ||
    ip.startsWith("2408") ||
    ip.startsWith("2409") ||
    ip.startsWith("240a") ||
    ip.startsWith("240b") ||
    ip.startsWith("240c") ||
    ip.startsWith("240d") ||
    ip.startsWith("240e") ||
    ip.startsWith("240f") ||
    ip.startsWith("2410") ||
    ip.startsWith("2411") ||
    ip.startsWith("2412") ||
    ip.startsWith("2413") ||
    ip.startsWith("2414") ||
    ip.startsWith("2415") ||
    ip.startsWith("2416") ||
    ip.startsWith("2417") ||
    ip.startsWith("2418") ||
    ip.startsWith("2419") ||
    ip.startsWith("241a") ||
    ip.startsWith("241b") ||
    ip.startsWith("241c") ||
    ip.startsWith("241d") ||
    ip.startsWith("241e") ||
    ip.startsWith("241f") ||
    ip.startsWith("242") ||
    ip.startsWith("2a00:7c8") ||
    ip.startsWith("2a02:e0") ||
    ip.startsWith("2a03:b2c0") ||
    ip.startsWith("2a05:d8c0") ||
    ip.startsWith("2a06:8ec0") ||
    ip.startsWith("2a05:b500") ||
    ip.startsWith("2a0f") ||
    ip.startsWith("2a05") ||
    ip.startsWith("2a06") ||
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

  // ---- IPv6 ----
  if(isIPv6(ip)){

    ip = expandIPv6(ip);

    if(isBlockedIPv6(ip))
      return BLOCK;

    if(!jordan40(ip) && !jordan44(ip) && !jordan48(ip))
      return BLOCK;

  // ---- IPv4 ----
  }else{

    if(!jordanIPv4(ip))
      return BLOCK;

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
