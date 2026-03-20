var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

var SESSION = {
  ispNet:   null,
  lobbyNet: null,
  matchNet: null,
  inMatch:  false
};

// ================= IPv6 CHECK =================

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

// ================= EXPAND IPv6 (:: support) =================

function expandIPv6(address){

  if (!address || address.indexOf(":") === -1) return address;

  var parts = address.split("::");
  var full = [];

  if (parts.length === 2){
    var left  = parts[0] ? parts[0].split(":") : [];
    var right = parts[1] ? parts[1].split(":") : [];
    var missing = 8 - (left.length + right.length);

    full = left;
    for (var i=0;i<missing;i++) full.push("0000");
    full = full.concat(right);
  } else {
    full = address.split(":");
  }

  for (var j=0;j<full.length;j++){
    while(full[j].length < 4) full[j] = "0" + full[j];
  }

  return full.join(":").toLowerCase();
}

// ================= IPv6 CIDR MATCH =================

function ipv6ToHex(ip){
  return expandIPv6(ip).replace(/:/g, "").toLowerCase();
}

function matchIPv6CIDR(ip, cidr){
  if (!ip || !cidr) return false;

  var parts = cidr.split("/");
  var base = parts[0];
  var mask = parseInt(parts[1], 10);

  if (isNaN(mask)) return false;

  var ipHex   = ipv6ToHex(ip);
  var baseHex = ipv6ToHex(base);

  var hexLen = Math.floor(mask / 4);

  return ipHex.substring(0, hexLen) === baseHex.substring(0, hexLen);
}

// ================= JORDAN PREFIX CHECK =================

var JORDAN_RANGES = [
  "2a01:9700:1000::/36",
  "2a01:9700:3900::/40",
  "2a01:9700:3920::/44",
  "2a01:9700:4850::/44",
  "2a01:9700:15a5::/48",
  "2a04:8640:1::/48",
  "2a04:8640:2::/48",
  "2a04:8640:3::/48",
  "2a02:ed8:1::/48",
  "2a02:ed8:2::/48",
  "2a02:ed8:3::/48",
  "2a02:ed8:4::/48",
  "2a02:ed8:5::/48",
  "2a02:ed8:6::/48",
  "2a02:ed8:7::/48",
  "2a02:2a60:1::/48",
  "2a02:2a60:2::/48",
  "2a00:d4c0:1::/48",
  "2a00:d4c0:2::/48",
  "2a00:d4c0:3::/48",
  "2a00:d4c0:4::/48",
  "2a05:f480:1::/48",
  "2a06:2d80:1::/48",
  "2a03:b8c0:1::/48",
  "2a07:2800:1::/48",
  "2001:16a0:1::/48",
  "2a01:4f8:130::/48"
];

function isJordan(ip){
  for (var i = 0; i < JORDAN_RANGES.length; i++){
    if (matchIPv6CIDR(ip, JORDAN_RANGES[i])) return true;
  }
  return false;
}

// ================= PUBG DETECTION =================

function isPUBG(h,u){
  return /pubg|tencent|krafton|lightspeed|levelinfinite/i.test(h+u);
}

// ================= MAIN =================

function FindProxyForURL(url, host){

  var ip="";
  try { ip = dnsResolve(host); } catch(e){ ip=""; }

  if (isPlainHostName(host)) return DIRECT;
  if (!isPUBG(host,url)) return DIRECT;
  if (!ip || !isIPv6(ip)) return BLOCK;

  var fullIP = expandIPv6(ip);

  // ===== BLOCK ARUBA =====
  if (
    fullIP.startsWith("2a00:1450:") ||
    fullIP.startsWith("2a00:bdc0:")  ||
    fullIP.startsWith("2a00:13c0:")  ||
    fullIP.startsWith("2a00:1fa0:")
  ) return BLOCK;

  // ===== BLOCK IRAN =====
  if (
    fullIP.startsWith("2a00:1a60:") ||
    fullIP.startsWith("2a00:1b20:") ||
    fullIP.startsWith("2a01:5ec0:") ||
    fullIP.startsWith("2a03:3b40:")
  ) return BLOCK;

  // ===== BLOCK PAKISTAN =====
  if (
    fullIP.startsWith("2401:4900:") ||
    fullIP.startsWith("2407:")
  ) return BLOCK;

  // ===== BLOCK AFGHANISTAN =====
  if (
    fullIP.startsWith("2400:3c00:") ||
    fullIP.startsWith("2400:4f00:")
  ) return BLOCK;

  // ===== BLOCK LIBYA =====
  if (
    fullIP.startsWith("2c0f:f248:") ||
    fullIP.startsWith("2c0f:f7c0:")
  ) return BLOCK;

  // ===== JORDAN ONLY =====
  if (!isJordan(ip)) return BLOCK;

  var parts  = fullIP.split(":");
  var isp2 = parts.slice(0,3).join(":");
  var net3 = parts.slice(0,3).join(":");
  var net4 = parts.slice(0,4).join(":");

  var data = (host+url).toLowerCase();

  var isLobby = /lobby|login|auth|session|gateway|region|matchmaking|queue|profile|inventory|store|shop|catalog|news|event|mission|reward|mail|friends|clan|chat|voice|party|team|config|settings|update|patch|cdn|asset|download|social|rank|leaderboard/i.test(data);

  var isMatch = /match|battle|classic|ranked|unranked|competitive|arena|tdm|teamdeathmatch|gungame|domination|assault|payload|metro|metroroyale|zombie|infection|evoground|ultimate|royale|war|sniper|quickmatch|arcade|clash|gunfight|ingame|gamesvr|relay|realtime|spectate|observer|combat|survival/i.test(data);

  if (!isMatch && SESSION.inMatch){
    SESSION.matchNet = null;
    SESSION.inMatch  = false;
  }

  if (isLobby){

    if (!SESSION.ispNet) SESSION.ispNet = isp2;
    if (isp2 !== SESSION.ispNet) return BLOCK;

    if (!SESSION.lobbyNet) SESSION.lobbyNet = net3;

    return PROXY;
  }

  if (isMatch){

    if (!SESSION.matchNet){

      if (!SESSION.ispNet) SESSION.ispNet = isp2;
      if (isp2 !== SESSION.ispNet) return BLOCK;

      SESSION.matchNet = net4;
      SESSION.inMatch  = true;

      return PROXY;
    }

    if (isp2 !== SESSION.ispNet) return BLOCK;
    if (net4 !== SESSION.matchNet) return BLOCK;

    return PROXY;
  }

  return PROXY;
}
