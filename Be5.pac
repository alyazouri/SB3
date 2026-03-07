// ============================================================
// PUBG JORDAN ULTRA LOCK FINAL
// Jordan IPv6 Lock + Lobby(4) + Match(5)
// Optimized for Low Ping
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001; DIRECT";
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

// ================= JORDAN IPv6 FILTER =================

function isJordanIPv6(ip){

  return (

    ip.startsWith("2a01:9700:4338:9700:") ||
    ip.startsWith("2a01:9700:1720:9700:") ||
    ip.startsWith("2a01:9700:1850:9700:") ||
    ip.startsWith("2a01:9700:3900:9700:") ||
    ip.startsWith("2a01:9700:8400:9700:") ||
    ip.startsWith("2a01:9700:1000:9700:") ||

    ip.startsWith("2a03:6b01:4000:6b01:") ||
    ip.startsWith("2a03:6b01:4400:6b01:") ||
    ip.startsWith("2a03:6b01:6000:6b01:") ||
    ip.startsWith("2a03:6b01:6400:6b01:")

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

// ================= NETWORK SEGMENTS =================

function getNet4(ip){
  var p = ip.split(":");
  return p[0]+":"+p[1]+":"+p[2]+":"+p[3];
}

function getNet5(ip){
  var p = ip.split(":");
  return p[0]+":"+p[1]+":"+p[2]+":"+p[3]+":"+p[4];
}

// ================= MAIN ENGINE =================

function FindProxyForURL(url,host){

  if(isPlainHostName(host))
    return DIRECT;

  if(!isPUBG(host))
    return DIRECT;

  var ip = dnsResolve(host);

  if(!ip)
    return PROXY;

  var fullIP = ip;

  if(isIPv6(ip))
    fullIP = expandIPv6(ip);

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
