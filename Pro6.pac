// ============================================================
// PUBG Mobile PAC Script v8.0 — Jordan ONLY
// ============================================================
// IPv6 أردني: فقط نطاقات موثقة من جلسات capture فعلية
// Blacklist: سوريا (RIPE كامل) + مصر (IPv4) + أوروبا
// المصدر: RIPE NCC allocations 2026-03-09
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// SETTINGS
// ============================================================
var SETTINGS = {
  PREFER_IPV6                         : true,
  ALLOW_IPV4_FALLBACK                 : true,
  REQUIRE_JORDAN_FOR_LOBBY            : true,
  REQUIRE_JORDAN_SESSION_BEFORE_MATCH : true,
  DIRECT_HEAVY_ASSETS                 : true,
  JORDAN_TTL_MS : 60 * 60 * 1000,
  LOBBY_TTL_MS  : 15 * 60 * 1000,
  MATCH_TTL_MS  : 40 * 60 * 1000
};

// ============================================================
// SESSION
// ============================================================
var SESSION = {
  jordanKey : null, jordanTs  : 0,
  lobbyKey  : null, lobbyTs   : 0,
  matchKey  : null, matchHost : null, matchTs : 0
};

// ============================================================
// TAGS
// ============================================================
var RE = {
  PUBG  : /(pubg|tencent|krafton|lightspeed|levelinfinite)/i,
  LOBBY : /(lobby|matchmaking|queue|login|auth|region|gateway|session)/i,
  MATCH : /(match|battle|classic|ranked|arena|tdm|metro|royale|erangel|livik|miramar|sanhok|vikendi|karakin|nusa|rondo|fpp|tpp|squad|duo|solo|quickmatch|ingame|gamesvr|relay)/i,
  HEAVY : /(patch|update|cdn|download|resource|notice|banner|event)/i,
  RESET : /(lobby|matchmaking|queue|login|auth|session)/i
};

// ============================================================
// JORDAN — IPv6
// القاعدة الصارمة: فقط نطاقات ظهرت في AAAA records / captures
// من جلسات PUBG Mobile حقيقية على Orange Jordan AS8376
// ============================================================
var JORDAN_V6 = [
  // موثق من captures — جلسات متعددة مؤكدة
  { base: "2a01:9700:1700::", len: 40 },
  { base: "2a01:9700:1c00::", len: 40 },
  // النطاق الرئيسي الرسمي /29 — يغطي ما فوق وكل فروعه
  // مُدرج بعد /40 حتى يحصل المسار الموثق على أعلى score
  { base: "2a01:9700::",      len: 29 }
];

// ============================================================
// JORDAN — IPv4  (Orange AS8376 + موثوق من جلسات سابقة)
// ============================================================
var JORDAN_V4_ORANGE = [
  { base: "37.202.64.0",   len: 18 },
  { base: "46.185.128.0",  len: 17 },  // يشمل عنوان البروكسي
  { base: "79.173.192.0",  len: 18 },
  { base: "94.249.24.0",   len: 21 },
  { base: "94.249.84.0",   len: 22 },
  { base: "149.200.248.0", len: 22 }
];

var JORDAN_V4_OTHER = [
  { base: "80.10.64.0",   len: 20 },   // Zain AS48832
  { base: "176.74.128.0", len: 17 },   // Zain mobile
  { base: "86.108.0.0",   len: 21 },   // Umniah AS9038
  { base: "5.21.0.0",     len: 17 },   // Jordan Telecom AS8697
  { base: "82.212.0.0",   len: 16 },   // Jordan Telecom AS8697
  { base: "185.98.220.0", len: 22 },   // Jordan Telecom AS8697
  { base: "188.247.0.0",  len: 18 }    // DAMAMAX AS50670
];

// ============================================================
// BLACKLIST — سوريا
// المصدر: RIPE NCC allocations file 2026-03-09 (كامل)
// ============================================================

// IPv6 سوري — كل نطاق مخصص لـ LIR سوري في RIPE
var BLOCK_SY_V6 = [
  { base: "2a02:4520::", len: 32 },   // sy.inet  — Charif & Fakir
  { base: "2a04:9080::", len: 29 },   // sy.aya-isp — AYA ISP
  { base: "2a07:6980::", len: 29 },   // sy.lazernet — Lazer Net
  { base: "2a09:ebc0::", len: 29 },   // sy.lazer — Lazer Net
  { base: "2a0b:3840::", len: 29 },   // sy.highspeed — High Speed ISP
  { base: "2a0c:de40::", len: 32 },   // sy.hifillc — HiFi LLC
  { base: "2a0f:b940::", len: 29 },   // sy.alalfeih2 — Millennium Telecom
  { base: "2a10:b6c0::", len: 29 },   // sy.concurrence — Concurrence Telecom
  { base: "2a11:ccc0::", len: 29 },   // sy.arnouk — Arnouk Microsolutions
  { base: "2a11:5300::", len: 29 }    // sy.fiberspeed — Fiberspeed Ltd
];

// IPv4 سوري — أهم النطاقات المستخدمة
var BLOCK_SY_V4 = [
  { base: "82.100.176.0",  len: 21 },
  { base: "84.39.192.0",   len: 22 },
  { base: "83.150.200.0",  len: 22 },
  { base: "89.33.224.0",   len: 21 },
  { base: "90.153.128.0",  len: 17 },
  { base: "95.212.0.0",    len: 17 },
  { base: "109.238.144.0", len: 20 },
  { base: "178.218.252.0", len: 22 },
  { base: "185.23.76.0",   len: 24 },
  { base: "185.54.132.0",  len: 22 },
  { base: "185.121.184.0", len: 22 },
  { base: "185.128.180.0", len: 22 },
  { base: "185.134.132.0", len: 22 },
  { base: "185.135.48.0",  len: 22 },
  { base: "185.148.192.0", len: 22 },
  { base: "185.150.140.0", len: 22 },
  { base: "185.151.148.0", len: 22 },
  { base: "185.164.132.0", len: 22 },
  { base: "185.164.200.0", len: 22 },
  { base: "185.171.72.0",  len: 22 },
  { base: "185.173.172.0", len: 22 },
  { base: "185.174.228.0", len: 22 },
  { base: "185.178.148.0", len: 22 },
  { base: "185.185.72.0",  len: 22 },
  { base: "185.187.192.0", len: 22 },
  { base: "185.199.244.0", len: 22 },
  { base: "185.204.88.0",  len: 22 },
  { base: "185.220.168.0", len: 22 },
  { base: "185.224.124.0", len: 22 },
  { base: "185.227.140.0", len: 22 },
  { base: "185.235.16.0",  len: 22 },
  { base: "185.254.180.0", len: 22 },
  { base: "194.5.160.0",   len: 22 },
  { base: "194.61.124.0",  len: 22 },
  { base: "195.238.104.0", len: 22 },
  { base: "212.11.192.0",  len: 19 }
];

// ============================================================
// BLACKLIST — مصر
// ملاحظة RIPE: مصر لا تملك IPv6 مخصص من RIPE (صفر نطاقات)
// IPv4 فقط — المصدر: RIPE NCC + ARIN (Telecom Egypt + ISPs)
// ============================================================
var BLOCK_EG_V4 = [
  { base: "41.32.0.0",    len: 11 },   // Telecom Egypt AS8452 (كتلة رئيسية)
  { base: "62.240.0.0",   len: 18 },   // Telecom Egypt
  { base: "62.240.64.0",  len: 18 },
  { base: "80.78.192.0",  len: 18 },   // Telecom Egypt
  { base: "196.219.0.0",  len: 16 },   // Telecom Egypt / TE Data
  { base: "213.158.0.0",  len: 16 },   // Telecom Egypt
  { base: "156.192.0.0",  len: 16 },   // WE (Telecom Egypt broadband)
  { base: "197.32.0.0",   len: 11 },   // مجمع IPv4 مصري (AFRINIC delegation)
  { base: "105.0.0.0",    len: 11 }    // مجمع IPv4 مصري (AFRINIC)
];

// ============================================================
// BLACKLIST — أوروبا
// نطاقات IPv6 الأوروبية — RIPE يخصص من 2001::/16 و 2a00::/8
// الكتل الرئيسية المستخدمة لسيرفرات PUBG في أوروبا
// ============================================================
var BLOCK_EU_V6 = [
  // الكتل الأوروبية الرئيسية
  { base: "2001::",    len: 23 },   // 2001:0::/23 — RIPE early allocations
  { base: "2003::",    len: 19 },   // Deutsche Telekom (DE)
  { base: "2a00::",    len:  8 },   // كتلة /8 الأوروبية الرئيسية (بدون استثناءات JO)
  { base: "2a02::",    len:  8 },   // كتلة /8 أوروبية ثانية
  { base: "2a03::",    len:  8 },   // كتلة /8 أوروبية ثالثة
  { base: "2a04::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a05::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a06::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a07::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a08::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a09::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a0a::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a0b::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a0c::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a0d::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a0e::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a0f::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a10::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a11::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a12::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a13::",    len:  8 },   // كتلة /8 أوروبية
  { base: "2a14::",    len:  8 }    // كتلة /8 أوروبية
];

// IPv4 أوروبا — النطاقات التقليدية المخصصة لـ RIPE (بدون الشرق الأوسط)
var BLOCK_EU_V4 = [
  { base: "77.0.0.0",    len: 8 },
  { base: "78.0.0.0",    len: 7 },   // 78+79
  { base: "80.0.0.0",    len: 6 },   // 80-83 (تشمل بعض الأردن — انتبه*)
  { base: "84.0.0.0",    len: 6 },   // 84-87
  { base: "88.0.0.0",    len: 5 },   // 88-95
  { base: "176.0.0.0",   len: 4 },   // 176-191 (RIPE Europe block)
  { base: "193.0.0.0",   len: 8 },
  { base: "194.0.0.0",   len: 7 },   // 194-195
  { base: "212.0.0.0",   len: 7 },   // 212-213
  { base: "217.0.0.0",   len: 8 }
];
// * ملاحظة: نطاقات أردنية داخل /6 أعلاه (80.x, 86.x, 94.x)
//   ستُعطى أولوية JORDAN ولن تُحجب — منطق الفلتر يتحقق من
//   Jordan قبل Blacklist (انظر isBlockedIP أدناه)

// ============================================================
// HELPERS
// ============================================================
function lower(s){ return (s||"").toLowerCase(); }
function nowMs(){ return (new Date()).getTime(); }

function normalizeHostLiteral(host){
  host=host||"";
  if(host.length>1&&host.charAt(0)=="["&&host.charAt(host.length-1)=="]")
    host=host.substring(1,host.length-1);
  var p=host.indexOf("%"); if(p>-1) host=host.substring(0,p);
  return lower(host);
}

function isHexChar(c){ return (c>="0"&&c<="9")||(c>="a"&&c<="f"); }
function isDigit(c)  { return c>="0"&&c<="9"; }

function cleanupToken(t){
  t=lower(t||"");
  while(t.length>0){var a=t.charAt(0);if(isDigit(a)||isHexChar(a)||a==":"||a=="."||a=="[")break;t=t.substring(1);}
  while(t.length>0){var b=t.charAt(t.length-1);if(isDigit(b)||isHexChar(b)||b==":"||b=="."||b=="]")break;t=t.substring(0,t.length-1);}
  if(t.length>1&&t.charAt(0)=="["&&t.charAt(t.length-1)=="]") t=t.substring(1,t.length-1);
  var p=t.indexOf("%"); if(p>-1) t=t.substring(0,p);
  return t;
}

function cleanHextet(h){
  h=lower(h); if(h==="")return"0"; if(h.indexOf(".")!=-1)return"";
  for(var i=0;i<h.length;i++){if(!isHexChar(h.charAt(i)))return"";}
  while(h.length>1&&h.charAt(0)=="0")h=h.substring(1);
  return h===""?"0":h;
}

function expandIPv6(ip){
  ip=cleanupToken(ip);
  if(ip.indexOf(":")==-1)return null;
  if(ip.indexOf("::")!=ip.lastIndexOf("::"))return null;
  var parts=ip.split("::"),
      left =parts[0]?parts[0].split(":"):[],
      right=(parts.length>1&&parts[1])?parts[1].split(":"):[],
      out=[],i;
  if(parts.length==1){
    if(left.length!=8)return null;
    for(i=0;i<8;i++){left[i]=cleanHextet(left[i]);if(!left[i])return null;out.push(left[i]);}
    return out;
  }
  var miss=8-(left.length+right.length); if(miss<1)return null;
  for(i=0;i<left.length;i++){left[i]=cleanHextet(left[i]);if(!left[i])return null;out.push(left[i]);}
  for(i=0;i<miss;i++)out.push("0");
  for(i=0;i<right.length;i++){right[i]=cleanHextet(right[i]);if(!right[i])return null;out.push(right[i]);}
  return out.length!=8?null:out;
}

function canonicalIPv6(ip){ var e=expandIPv6(ip); return e?e.join(""):""; }
// ملاحظة: canonicalIPv6 يُعيد string فارغ إذا لم يكن IPv6 — نستخدمه كـ boolean

function parseIPv4(ip){
  ip=cleanupToken(ip); var p=ip.split("."); if(p.length!=4)return null;
  for(var i=0;i<4;i++){
    if(!p[i])return null;
    for(var n=0;n<p[i].length;n++){if(!isDigit(p[i].charAt(n)))return null;}
    p[i]=parseInt(p[i],10); if(isNaN(p[i])||p[i]<0||p[i]>255)return null;
  }
  return p;
}
function canonicalIPv4(ip){ var p=parseIPv4(ip); return p?(p[0]+"."+p[1]+"."+p[2]+"."+p[3]):""; }

function v6MatchCidr(ip,base,len){
  var a=expandIPv6(ip),b=expandIPv6(base); if(!a||!b)return false;
  var full=Math.floor(len/16),rem=len%16;
  for(var i=0;i<full;i++){if(a[i]!=b[i])return false;}
  if(rem===0)return true;
  var mask=(0xffff<<(16-rem))&0xffff;
  return((parseInt(a[full],16)&mask)==(parseInt(b[full],16)&mask));
}
function v4MatchCidr(ip,base,len){
  var a=parseIPv4(ip),b=parseIPv4(base); if(!a||!b)return false;
  var full=Math.floor(len/8),rem=len%8;
  for(var i=0;i<full;i++){if(a[i]!=b[i])return false;}
  if(rem===0)return true;
  var mask=(0xff<<(8-rem))&0xff; return((a[full]&mask)==(b[full]&mask));
}
function inV6(ip,lst){for(var i=0;i<lst.length;i++){if(v6MatchCidr(ip,lst[i].base,lst[i].len))return true;}return false;}
function inV4(ip,lst){for(var i=0;i<lst.length;i++){if(v4MatchCidr(ip,lst[i].base,lst[i].len))return true;}return false;}

// ============================================================
// JORDAN DETECTION
// ============================================================
function isJordanV6Confirmed(ip){ return inV6(ip,[JORDAN_V6[0],JORDAN_V6[1]]); } // /40 موثقة
function isJordanV6(ip)         { return inV6(ip,JORDAN_V6); }                    // /29 كامل
function isJordanV4Orange(ip)   { return inV4(ip,JORDAN_V4_ORANGE); }
function isJordanV4Other(ip)    { return inV4(ip,JORDAN_V4_OTHER); }
function isJordanV4(ip)         { return isJordanV4Orange(ip)||isJordanV4Other(ip); }

function isJordanIP(ip){
  if(canonicalIPv6(ip)) return isJordanV6(ip);
  if(canonicalIPv4(ip)) return isJordanV4(ip);
  return false;
}

// ============================================================
// BLACKLIST DETECTION
// الأولوية: Jordan يتجاوز الـ blacklist دائماً
// ============================================================
function isBlockedIP(ip){
  // الأردن لا يُحجب أبداً حتى لو تداخل مع نطاق أوروبي
  if(isJordanIP(ip)) return false;

  if(canonicalIPv6(ip)){
    if(inV6(ip,BLOCK_SY_V6)) return true;
    if(inV6(ip,BLOCK_EU_V6)) return true;
    return false;
  }
  if(canonicalIPv4(ip)){
    if(inV4(ip,BLOCK_SY_V4)) return true;
    if(inV4(ip,BLOCK_EG_V4)) return true;
    if(inV4(ip,BLOCK_EU_V4)) return true;
    return false;
  }
  return false;
}

// ============================================================
// MISC HELPERS
// ============================================================
function isPUBG(host,url){ return RE.PUBG.test(lower(host)+" "+lower(url)); }

function splitCandidates(raw){
  var out=[],start=0,token; raw=""+(raw||"");
  for(var i=0;i<=raw.length;i++){
    var c=i<raw.length?raw.charAt(i):";";
    if(c==";"||c==","||c==" "||c=="\t"||c=="\n"||c=="\r"){
      token=cleanupToken(raw.substring(start,i)); if(token)out.push(token); start=i+1;
    }
  }
  return out;
}

function detectMode(data){
  if(RE.LOBBY.test(data)) return"lobby";
  if(RE.MATCH.test(data)) return"match";
  if(RE.HEAVY.test(data)) return"heavy";
  return"generic";
}

function familyOf(ip){
  if(canonicalIPv6(ip)) return 6;
  if(canonicalIPv4(ip)) return 4;
  return 0;
}

function net48(ip){ var e=expandIPv6(ip); return e?(e[0]+":"+e[1]+":"+e[2]):""; }
function net64(ip){ var e=expandIPv6(ip); return e?(e[0]+":"+e[1]+":"+e[2]+":"+e[3]):""; }
function net24(ip){ var p=parseIPv4(ip);  return p?(p[0]+"."+p[1]+"."+p[2]):""; }

function jordanBucket(ip){ return canonicalIPv6(ip)?"6|"+net48(ip): canonicalIPv4(ip)?"4|"+net24(ip):""; }
function lobbyBucket(ip) { return jordanBucket(ip); }
function matchBucket(ip) { return canonicalIPv6(ip)?"6|"+net64(ip): canonicalIPv4(ip)?"4|"+net24(ip):""; }

function sameJordanKey(ip,k){ return k&&jordanBucket(ip)==k; }
function sameLobbyKey(ip,k){  return k&&lobbyBucket(ip)==k;  }
function sameMatchKey(ip,k){  return k&&matchBucket(ip)==k;  }

// ============================================================
// SCORING
// ============================================================
function scoreIP(ip, mode){
  var fam=familyOf(ip); if(!fam)return-1;
  var s=0;

  // جلسة جارية — أعلى أولوية مطلقة
  if(SESSION.matchKey  &&sameMatchKey(ip,SESSION.matchKey))   s+=20000;
  if(SESSION.jordanKey &&sameJordanKey(ip,SESSION.jordanKey)) s+=12000;
  if(SESSION.lobbyKey  &&sameLobbyKey(ip,SESSION.lobbyKey))   s+=9000;

  if(fam==6) s+=600;
  if(fam==4) s+=80;

  if(fam==6){
    if(isJordanV6Confirmed(ip)) s+=8000;  // /40 موثق من capture
    else if(isJordanV6(ip))     s+=4000;  // /29 رسمي فقط
  }
  if(fam==4){
    if(isJordanV4Orange(ip)) s+=4000;
    if(isJordanV4Other(ip))  s+=2500;
  }
  return s;
}

function pickBestIP(raw,mode){
  var items=splitCandidates(raw),best="",bs=-1;
  for(var i=0;i<items.length;i++){
    var t=items[i],v6=canonicalIPv6(t),v4=canonicalIPv4(t);
    if(v6){var s6=scoreIP(v6,mode);if(s6>bs){best=v6;bs=s6;}continue;}
    if(v4){var s4=scoreIP(v4,mode);if(s4>bs){best=v4;bs=s4;}}
  }
  if(!best){
    var f6=canonicalIPv6(cleanupToken(raw)); if(f6)return f6;
    var f4=canonicalIPv4(cleanupToken(raw)); if(f4)return f4;
  }
  return best;
}

function resolveBestIP(host,mode){
  var lit=normalizeHostLiteral(host);
  if(canonicalIPv6(lit))return canonicalIPv6(lit);
  if(canonicalIPv4(lit))return canonicalIPv4(lit);
  var raw="",ip="";
  try{if(typeof dnsResolveEx=="function"){raw=dnsResolveEx(lit);ip=pickBestIP(raw,mode);if(ip)return ip;}}catch(e){}
  try{raw=dnsResolve(lit);ip=pickBestIP(raw,mode);if(ip)return ip;}catch(e2){}
  return"";
}

// ============================================================
// SESSION HELPERS
// ============================================================
function clearJordan(){ SESSION.jordanKey=null;SESSION.jordanTs=0; }
function clearLobby(){  SESSION.lobbyKey=null; SESSION.lobbyTs=0;  }
function clearMatch(){  SESSION.matchKey=null; SESSION.matchHost=null;SESSION.matchTs=0; }
function touchJordan(ip){ SESSION.jordanKey=jordanBucket(ip);SESSION.jordanTs=nowMs(); }
function touchLobby(ip){  SESSION.lobbyKey=lobbyBucket(ip); SESSION.lobbyTs=nowMs();  }
function touchMatch(h,ip){ SESSION.matchKey=matchBucket(ip);SESSION.matchHost=h;SESSION.matchTs=nowMs(); }

function resetExpiredLocks(){
  var t=nowMs();
  if(SESSION.jordanKey&&(t-SESSION.jordanTs>SETTINGS.JORDAN_TTL_MS)){clearJordan();clearLobby();}
  if(SESSION.lobbyKey &&(t-SESSION.lobbyTs >SETTINGS.LOBBY_TTL_MS)) clearLobby();
  if(SESSION.matchKey &&(t-SESSION.matchTs >SETTINGS.MATCH_TTL_MS)) clearMatch();
}

// ============================================================
// CORE ROUTING
// ============================================================
function __PAC(url, host){
  if(isPlainHostName(host)) return DIRECT;

  var data=lower(host)+" "+lower(url);
  if(!isPUBG(host,url)) return DIRECT;

  resetExpiredLocks();

  var mode=detectMode(data);
  if(SETTINGS.DIRECT_HEAVY_ASSETS&&mode=="heavy") return DIRECT;

  var ip=resolveBestIP(host,mode);
  if(!ip) return BLOCK;
  if(familyOf(ip)==4&&!SETTINGS.ALLOW_IPV4_FALLBACK) return BLOCK;

  // ---- Blacklist check (Syria / Egypt / Europe) ----
  if(isBlockedIP(ip)) return BLOCK;

  if(!RE.MATCH.test(data)&&RE.RESET.test(data)) clearMatch();

  // --------------------------------------------------
  // LOBBY
  // --------------------------------------------------
  if(mode=="lobby"){
    if(isJordanIP(ip)){touchJordan(ip);touchLobby(ip);return PROXY;}
    if(sameJordanKey(ip,SESSION.jordanKey)){SESSION.jordanTs=nowMs();touchLobby(ip);return PROXY;}
    if(sameLobbyKey(ip,SESSION.lobbyKey)) {SESSION.lobbyTs=nowMs();return PROXY;}
    if(SETTINGS.REQUIRE_JORDAN_FOR_LOBBY) return BLOCK;
    return DIRECT;
  }

  // --------------------------------------------------
  // MATCH
  // --------------------------------------------------
  if(mode=="match"){
    if(sameMatchKey(ip,SESSION.matchKey)){SESSION.matchTs=nowMs();return PROXY;}
    if(SESSION.matchHost&&SESSION.matchHost==host){SESSION.matchTs=nowMs();return PROXY;}
    if(SESSION.jordanKey){touchMatch(host,ip);return PROXY;}
    if(isJordanIP(ip)){touchJordan(ip);touchMatch(host,ip);return PROXY;}
    if(SETTINGS.REQUIRE_JORDAN_SESSION_BEFORE_MATCH) return BLOCK;
    return PROXY;
  }

  // --------------------------------------------------
  // GENERIC
  // --------------------------------------------------
  if(sameMatchKey(ip,SESSION.matchKey)) {SESSION.matchTs=nowMs(); return PROXY;}
  if(sameJordanKey(ip,SESSION.jordanKey)){SESSION.jordanTs=nowMs();return PROXY;}
  if(sameLobbyKey(ip,SESSION.lobbyKey)) {SESSION.lobbyTs=nowMs(); return PROXY;}
  if(isJordanIP(ip)){touchJordan(ip);return PROXY;}

  return BLOCK;
}

// ============================================================
// ENTRY POINTS
// ============================================================
function FindProxyForURLEx(url, host){ return __PAC(url, host); }
function FindProxyForURL(url, host){   return __PAC(url, host); }
