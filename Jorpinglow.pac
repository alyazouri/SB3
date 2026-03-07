// ============================================================
// PUBG JORDAN FINAL LOCK SCRIPT
// Jordan IPv6 Lock + Lobby(4) + Match(5)
// FINAL STABLE VERSION
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
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

  } else {

    full = address.split(":");

  }

  for(var j=0;j<full.length;j++){
    while(full[j].length < 4)
      full[j] = "0" + full[j];
  }

  return full.join(":").toLowerCase();
}

// ================= JORDAN IPv6 PREFIXES =================

function isJordanIPv6(ip){

  return (

    // Orange Jordan
    ip.startsWith("2a01:9700:") ||

    // Jordan backbone
    ip.startsWith("2a03:6b00:") ||

    // ISP blocks
    ip.startsWith("2a02:c040:") ||
    ip.startsWith("2a02:2558:") ||
    ip.startsWith("2a02:09c0:") ||

    // Mobile / ISP
    ip.startsWith("2a05:7500:") ||
    ip.startsWith("2a05:74c0:") ||

    // Additional ISP
    ip.startsWith("2a06:9bc0:") ||
    ip.startsWith("2a06:bd80:") ||

    // Telecom Jordan
    ip.startsWith("2001:32c0:") ||

    // Other Jordan allocations
    ip.startsWith("2a01:e240:") ||
    ip.startsWith("2a01:ee40:") ||
    ip.startsWith("2a04:6200:")

  );

}

// ================= REGION BLOCK =================

function isBlocked(ip){

  if(isJordanIPv6(ip))
    return false;

  return (

    ip.startsWith("240") ||
    ip.startsWith("241") ||
    ip.startsWith("242") ||

    ip.startsWith("260") ||
    ip.startsWith("280") ||

    ip.startsWith("2c")

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

// ================= LOBBY =================

function isLobby(data){

  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download/i
  .test(data);

}

// ================= MATCH =================

function isMatch(data){

  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate/i
  .test(data);

}

// ================= SEGMENTS =================

function getNet4(ip){
  return ip.split(":").slice(0,3).join(":");
}

function getNet5(ip){
  return ip.split(":").slice(0,4).join(":");
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

  if(isBlocked(fullIP))
    return BLOCK;

  if(!isJordanIPv6(fullIP))
    return BLOCK;

  var data = (host+url).toLowerCase();

  var lobby = isLobby(data);
  var match = isMatch(data);

  var net4 = getNet4(fullIP);
  var net5 = getNet5(fullIP);

  if(!match && SESSION.active){

    SESSION.match = null;
    SESSION.active = false;

  }

  if(lobby){

    if(!SESSION.lobby)
      SESSION.lobby = net4;

    if(net4 !== SESSION.lobby)
      return BLOCK;

    return PROXY;

  }

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
