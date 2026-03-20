var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

var SESSION = {
  ispNet:   null,
  matchNet: null,
  inMatch:  false
};

// ================= HELPERS =================

function startsWithStr(s, prefix){
  return s && prefix && s.indexOf(prefix) === 0;
}

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

function expandIPv6(address){
  if (!address || address.indexOf(":") === -1) return address;

  var parts = address.split("::");
  var full = [];

  if (parts.length === 2){
    var left  = parts[0] ? parts[0].split(":") : [];
    var right = parts[1] ? parts[1].split(":") : [];
    var missing = 8 - (left.length + right.length);

    full = left;
    for (var i = 0; i < missing; i++) full.push("0000");
    full = full.concat(right);
  } else {
    full = address.split(":");
  }

  for (var j = 0; j < full.length; j++){
    while (full[j].length < 4) full[j] = "0" + full[j];
  }

  return full.join(":").toLowerCase();
}

function ipv6ToHex(ip){
  return expandIPv6(ip).replace(/:/g, "").toLowerCase();
}

// ================= JORDAN RANGES =================

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

var JORDAN_PREFIXES = (function(){
  var out = [];
  for (var i = 0; i < JORDAN_RANGES.length; i++){
    var parts = JORDAN_RANGES[i].split("/");
    var base = ipv6ToHex(parts[0]);
    var mask = parseInt(parts[1], 10);
    var hexLen = mask / 4; // masks كلها مضاعفات 4
    out.push(base.substring(0, hexLen));
  }
  return out;
})();

function isJordan(fullIP){
  var hex = fullIP.replace(/:/g, "").toLowerCase();

  for (var i = 0; i < JORDAN_PREFIXES.length; i++){
    if (hex.substring(0, JORDAN_PREFIXES[i].length) === JORDAN_PREFIXES[i]){
      return true;
    }
  }
  return false;
}

// ================= PUBG DETECTION =================

function isPUBG(host, url){
  var s = (host + url).toLowerCase();
  return s.indexOf("pubg") !== -1 ||
         s.indexOf("tencent") !== -1 ||
         s.indexOf("krafton") !== -1 ||
         s.indexOf("lightspeed") !== -1 ||
         s.indexOf("levelinfinite") !== -1;
}

// ================= MAIN =================

function FindProxyForURL(url, host){
  var ip = "";
  try { ip = dnsResolve(host); } catch(e){ ip = ""; }

  if (isPlainHostName(host)) return DIRECT;
  if (!isPUBG(host, url)) return DIRECT;

  // هذا السكربت مبني على IPv6 فقط
  if (!ip || !isIPv6(ip)) return BLOCK;

  var fullIP = expandIPv6(ip);

  // الأردن فقط - أي دولة ثانية يتم حجبها
  if (!isJordan(fullIP)) return BLOCK;

  var parts = fullIP.split(":");

  // /48 لتمييز مزود/شبكة رئيسية
  var ispNet   = parts.slice(0, 3).join(":");

  // /64 لتثبيت سيرفر المباراة نفسها
  var matchNet = parts.slice(0, 4).join(":");

  var data = (host + url).toLowerCase();

  var isLobby = /lobby|login|auth|oauth|token|session|gateway|region|dispatch|discover|directory|matchmaking|queue|prequeue|ready|reservation|profile|account|inventory|item|warehouse|loadout|store|shop|catalog|mall|purchase|payment|order|news|notice|announcement|event|activity|anniversary|mission|quest|task|reward|mail|message|friends|friend|clan|guild|crew|chat|voice|party|team|group|social|config|setting|preference|update|patch|version|manifest|cdn|asset|res|resource|download|upload|avatar|cosmetic|skin|outfit|rank|leaderboard|season|royalepass|pass|achievement|security|banpan|anti.?cheat|report/i.test(data);

  var isMatch = /match|battle|ingame|game|gamesvr|gserver|battlefield|combat|realtime|relay|room|instance|classic|ranked|unranked|competitive|tournament|scrim|custom|roomcard|arena|tdm|teamdeathmatch|domination|assault|gun.?game|gunfight|payload|hotdrop|dropzone|war|sniper|quickmatch|arcade|clash|royale|battle.?royale|survival|zombie|infection|infected|evoground|evo|ultimate|metro|metroroyale|aftermath|wow|worldofwonder|home|dragonball|theme|themed|universe|evolving|race|racing|vehicle|kart|parkour|spectate|observer/i.test(data);

  // إذا خرجنا من المباراة، صفّر تثبيت سيرفر الماتش
  if (!isMatch && SESSION.inMatch){
    SESSION.matchNet = null;
    SESSION.inMatch  = false;
  }

  // تثبيت نفس مزود الأردن طوال الجلسة
  if (!SESSION.ispNet){
    SESSION.ispNet = ispNet;
  } else if (SESSION.ispNet !== ispNet){
    return BLOCK;
  }

  // اتصالات اللوبي تمر طبيعي
  if (isLobby){
    return PROXY;
  }

  // أول اتصال مباراة يثبت /64 ثم يسمح لنفس الشبكة فقط
  if (isMatch){
    if (!SESSION.matchNet){
      SESSION.matchNet = matchNet;
      SESSION.inMatch  = true;
      return PROXY;
    }

    if (SESSION.matchNet !== matchNet) return BLOCK;
    return PROXY;
  }

  // أي اتصال PUBG أردني غير مصنف بوضوح نمرره
  return PROXY;
}
