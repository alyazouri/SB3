// ============================================================
// PUBG JORDAN ELITE LOCK
// Pattern: 2a01:9700:XXXX:9700:XXXX:XXXX:XXXX:XXXX
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001; DIRECT";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobby:null,
  match:null,
  active:false,
  locked:false,
  detected:false
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

// ================= RANGE CHECK =================

function isJordanIPv6(ip){

  if(!ip) return false;

  var p = ip.split(":");

  if(p.length < 4)
    return false;

  if(p[0] !== "2a01") return false;
  if(p[1] !== "9700") return false;
  if(p[3] !== "9700") return false;

  return true;
}

// ================= PUBG HOST DETECTION =================

function isPUBG(host){

  host = host.toLowerCase();

  if(host.indexOf("pubg") !== -1) return true;
  if(host.indexOf("tencent") !== -1) return true;
  if(host.indexOf("krafton") !== -1) return true;
  if(host.indexOf("lightspeed") !== -1) return true;
  if(host.indexOf("levelinfinite") !== -1) return true;

  return false;
}

// ================= LOBBY =================

function isLobby(data){

  return /login|lobby|auth|gateway|queue|profile|inventory|store|friends|party|team|settings|patch|update|cdn/i
  .test(data);

}

// ================= MATCH =================

function isMatch(data){

  return /match|battle|classic|ranked|arena|tdm|royale|gamesvr|relay|combat|survival/i
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

  // HARD GEO LOCK
  if(!isJordanIPv6(fullIP))
    return BLOCK;

  var data = (host+url).toLowerCase();

  var lobby = isLobby(data);
  var match = isMatch(data);

  var net4 = getNet4(fullIP);
  var net5 = getNet5(fullIP);

  // RESET AFTER MATCH
  if(!match && SESSION.active){

    SESSION.match = null;
    SESSION.active = false;
    SESSION.locked = false;
    SESSION.detected = false;

  }

  // LOBBY LOCK
  if(lobby){

    if(!SESSION.lobby)
      SESSION.lobby = net4;

    if(net4 !== SESSION.lobby)
      return BLOCK;

    return PROXY;

  }

  // MATCH LOCK
  if(match){

    if(!SESSION.detected){

      SESSION.match = net5;
      SESSION.active = true;
      SESSION.detected = true;
      SESSION.locked = true;

    }

    if(SESSION.locked && net5 !== SESSION.match)
      return BLOCK;

    return PROXY;

  }

  return PROXY;

}
