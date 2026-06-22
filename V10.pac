// ================= PROXIES =================
var MATCH_JO = "PROXY 46.185.131.218:20001";

var LOBBY_POOL = [
  "PROXY 212.35.66.45:8085",
  "PROXY 212.35.66.45:8181",
  "PROXY 46.185.131.218:443"
];

var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= JORDAN MATCH (STRONG - IN-GAME) =================
var JORDAN_MATCH_IPV4 = [
  ["46.185.128.0", "255.255.128.0"], 
  ["77.245.0.0",   "255.255.240.0"], 
  ["79.134.128.0", "255.255.224.0"], 
  ["79.173.192.0", "255.255.192.0"], 
  ["80.90.160.0",  "255.255.240.0"], 
  ["149.200.128.0","255.255.128.0"], 
  ["185.131.216.0","255.255.252.0"], 
  ["5.23.0.0",     "255.255.0.0"]    
];

// ================= JORDAN WIDE (LOBBY / SOCIAL) =================
var JORDAN_WIDE_IPV4 = [
  // Zain Jordan
  ["46.32.0.0", "255.224.0.0"], ["79.134.128.0", "255.255.128.0"], 
  ["176.29.0.0", "255.255.0.0"], ["77.245.0.0", "255.255.0.0"], 
  ["178.77.0.0", "255.255.0.0"], ["185.86.0.0", "255.255.0.0"],

  // Orange Jordan
  ["62.72.0.0", "255.255.0.0"], ["37.202.0.0", "255.255.0.0"], 
  ["85.159.0.0", "255.255.0.0"], ["93.93.0.0", "255.255.0.0"], 
  ["93.95.0.0", "255.255.0.0"], ["37.252.0.0", "255.255.0.0"], 
  ["94.127.0.0", "255.255.0.0"], ["31.14.0.0", "255.255.0.0"], 
  ["195.94.0.0", "255.255.0.0"],

  // Umniah
  ["212.34.0.0", "255.255.0.0"], ["213.139.64.0", "255.255.192.0"], 
  ["176.57.0.0", "255.255.0.0"], ["188.123.0.0", "255.255.0.0"], 
  ["188.247.0.0", "255.255.0.0"], ["5.23.0.0", "255.255.0.0"], 
  ["109.224.0.0", "255.255.0.0"],

  // Jordan Data / Hosting
  ["193.188.64.0", "255.255.224.0"], ["149.200.0.0", "255.255.0.0"], 
  ["185.131.216.0", "255.255.252.0"], ["185.170.164.0", "255.255.252.0"]
];

// ================= BLACKLIST =================
var GEO_BLACKLIST = [
  ["5.136.0.0", "255.248.0.0"], ["31.128.0.0", "255.192.0.0"], 
  ["46.16.0.0", "255.240.0.0"], ["95.24.0.0", "255.248.0.0"], 
  ["178.64.0.0", "255.192.0.0"], ["36.0.0.0", "255.0.0.0"], 
  ["39.0.0.0", "255.0.0.0"], ["42.0.0.0", "255.0.0.0"], 
  ["49.0.0.0", "255.0.0.0"], ["58.0.0.0", "255.0.0.0"], 
  ["59.0.0.0", "255.0.0.0"], ["60.0.0.0", "255.0.0.0"], 
  ["1.0.0.0", "255.255.255.0"], ["14.0.0.0", "255.0.0.0"], 
  ["27.0.0.0", "255.0.0.0"]
];

// ================= SESSION =================
var SESSION = {
  matchNet: null,
  matchHost: null,
  dnsCache: {}
};

// ================= HELPERS =================
function norm(h){ var i=h.indexOf(":"); return i>-1?h.substring(0,i):h; }

function isInList(ip, list){
  if (!ip || ip.indexOf(":") > -1) return false; 
  for (var i=0; i<list.length; i++){
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}

function resolvePinned(host){
  if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
  var ip = dnsResolve(host);
  if (ip) SESSION.dnsCache[host] = ip;
  return ip;
}

function pickLobbyProxy(host){
  var h=0;
  for (var i=0; i<host.length; i++)
    h=(h+host.charCodeAt(i))%LOBBY_POOL.length;
  return LOBBY_POOL[h];
}

// ================= UNIVERSAL PUBG DETECTION =================
// يشمل: الدولي، الجديد، الهندية (BGMI)، الصينية، وجميع خوادم Tencent/Krafton
function isPUBG(h){
  return /pubg|bgmi|tencent|krafton|bluehole|levelinfinite|lightspeed|igamecj|yuanlin|anticheatexpert|gtimg|idqqimg|qcloud|myqcloud|gcloud|wegame/i.test(h);
}

// ================= TRAFFIC CLASSIFICATION =================
// يشمل جميع المودات: كلاسيك، TDM، أرينا، بايلود، الخرائط، إلخ
function isMatch(u,h){
  return /match|battle|game|combat|realtime|sync|udp|tick|room|gameplay|arena|tdm|erangel|miramar|sanhok|vikendi|karakin|livik|nusa|ronta|alien|payload/i.test(u+h);
}

// يشمل اللوبي، المتجر، الموسم، الأحداث، الرانك
function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|join|recruit|login|auth|season|event|shop|store|inventory|loadout|mission|task|rank/i.test(u+h);
}

// يشمل الدردشة، المايك، الفرق، العشائر
function isSocial(u,h){
  return /friend|invite|squad|team|party|clan|presence|social|voice|chat|mic|audio/i.test(u+h);
}

// يشمل التحديثات، السكنات، الموارد، الأصوات
function isCDN(u,h){
  return /cdn|asset|resource|patch|update|media|content|download|hotfix|res|skin|model|texture|audio|sound/i.test(u+h);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {
  host = norm(host.toLowerCase());
  
  // إذا لم يكن من نطاقات ببجي، اتركه مباشرة
  if (!isPUBG(host)) return DIRECT;

  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":") > -1) return BLOCK;

  // حجب جغرافي صارم
  if (isInList(ip, GEO_BLACKLIST)) return BLOCK;

  // حركة الماتش (داخل اللعبة - جميع المودات)
  if (isMatch(url, host)) {
    if (!isInList(ip, JORDAN_MATCH_IPV4)) return BLOCK;

    var net24 = ip.split('.').slice(0,3).join('.');
    if (!SESSION.matchNet) {
      SESSION.matchNet = net24;
      SESSION.matchHost = host;
      return MATCH_JO;
    }
    if (host !== SESSION.matchHost) return BLOCK;
    if (net24 !== SESSION.matchNet) return BLOCK;

    return MATCH_JO;
  }

  // حركة اللوبي، السوشال، والـ CDN
  if (isLobby(url, host) || isSocial(url, host) || isCDN(url, host)) {
    if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
    return pickLobbyProxy(host);
  }

  // أي شيء آخر خاص ببجي
  return pickLobbyProxy(host);
}
