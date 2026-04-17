// ============================================================
// PUBG JORDAN IPv6 RANGE LOCK SCRIPT - COMPLETE
// يعتمد على نطاقات IPv6 فقط
// - Allow only Jordan home IPv6 ranges
// - Block IPv4
// - Lock lobby by /48 + provider
// - Lock match by /64 + provider
// - Better session handling
// ============================================================

var PROXY  = "PROXY 188.247.94.198:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobbyProvider: "",
  lobbyNet: "",
  matchProvider: "",
  matchNet: "",
  active: false
};

// ============================================================
// JORDAN HOME IPv6 RANGES
// ============================================================

var JORDAN_V6_RANGES = [
  { name: "orange",     cidr: "2a00:18d8::/29" },
  { name: "orange_jdc", cidr: "2a01:9700::/29" },
  { name: "umniah",     cidr: "2a03:b640::/32" },
  { name: "zain",       cidr: "2a03:6b00::/40" },
  { name: "zain",       cidr: "2a03:6b01::/34" },
  { name: "zain",       cidr: "2a03:6b01:4000::/34" },
  { name: "zain",       cidr: "2a03:6b01:4000::/38" },
  { name: "zain",       cidr: "2a03:6b01:4400::/38" },
  { name: "zain",       cidr: "2a03:6b01:6000::/38" },
  { name: "zain",       cidr: "2a03:6b01:6400::/38" },
  { name: "zain",       cidr: "2a03:6b01:8000::/34" },
  { name: "zain",       cidr: "2a03:6b01:8000::/40" },
  { name: "zain",       cidr: "2a03:6b02:2000::/48" }
];

// ============================================================
// BASIC HELPERS
// ============================================================

function safeLower(s){
  if(!s) return "";
  return ("" + s).toLowerCase();
}

function isIPv6(ip){
  return ip && ip.indexOf(":") != -1;
}

function isIPv4(ip){
  return ip && ip.indexOf(".") != -1;
}

function isIPLiteral(host){
  return isIPv4(host) || isIPv6(host);
}

// ============================================================
// IPv6 EXPANSION
// ============================================================

function expandIPv6(address){
  if(!address || address.indexOf(":") == -1)
    return address;

  var parts = address.split("::");
  var left = [];
  var right = [];
  var full = [];
  var i, missing;

  if(parts.length == 2){
    if(parts[0] !== "")
      left = parts[0].split(":");
    if(parts[1] !== "")
      right = parts[1].split(":");

    missing = 8 - (left.length + right.length);

    for(i = 0; i < left.length; i++)
      full.push(left[i]);

    for(i = 0; i < missing; i++)
      full.push("0000");

    for(i = 0; i < right.length; i++)
      full.push(right[i]);
  } else {
    full = address.split(":");
  }

  for(i = 0; i < full.length; i++){
    if(full[i] === "")
      full[i] = "0000";

    while(full[i].length < 4)
      full[i] = "0" + full[i];
  }

  return full.join(":").toLowerCase();
}

// ============================================================
// IPv6 TO BINARY
// ============================================================

function hexNibbleToBin(ch){
  ch = safeLower(ch);

  if(ch == "0") return "0000";
  if(ch == "1") return "0001";
  if(ch == "2") return "0010";
  if(ch == "3") return "0011";
  if(ch == "4") return "0100";
  if(ch == "5") return "0101";
  if(ch == "6") return "0110";
  if(ch == "7") return "0111";
  if(ch == "8") return "1000";
  if(ch == "9") return "1001";
  if(ch == "a") return "1010";
  if(ch == "b") return "1011";
  if(ch == "c") return "1100";
  if(ch == "d") return "1101";
  if(ch == "e") return "1110";
  if(ch == "f") return "1111";

  return "";
}

function ipv6ToBinary(ip){
  var full = expandIPv6(ip);
  var hex = full.split(":").join("");
  var out = "";
  var i;

  for(i = 0; i < hex.length; i++)
    out += hexNibbleToBin(hex.charAt(i));

  return out;
}

// ============================================================
// IPv6 CIDR MATCH
// ============================================================

function matchIPv6CIDR(ip, cidr){
  if(!isIPv6(ip) || !cidr)
    return false;

  var p = cidr.indexOf("/");
  var net, bits, ipBin, netBin;

  if(p == -1)
    return false;

  net = cidr.substring(0, p);
  bits = parseInt(cidr.substring(p + 1), 10);

  if(isNaN(bits) || bits < 0 || bits > 128)
    return false;

  ipBin = ipv6ToBinary(ip);
  netBin = ipv6ToBinary(net);

  return ipBin.substring(0, bits) == netBin.substring(0, bits);
}

// ============================================================
// RANGE LOOKUP
// ============================================================

function getJordanRangeInfo(ip){
  var i;

  if(!isIPv6(ip))
    return null;

  for(i = 0; i < JORDAN_V6_RANGES.length; i++){
    if(matchIPv6CIDR(ip, JORDAN_V6_RANGES[i].cidr))
      return JORDAN_V6_RANGES[i];
  }

  return null;
}

function isJordanIPv6(ip){
  return getJordanRangeInfo(ip) !== null;
}

function getProviderName(ip){
  var info = getJordanRangeInfo(ip);
  if(!info) return "";
  return info.name;
}

// ============================================================
// PUBG DETECTION
// ============================================================

function isPUBG(host, url){
  var data = safeLower(host + " " + url);

  if(data.indexOf("pubg") != -1) return true;
  if(data.indexOf("tencent") != -1) return true;
  if(data.indexOf("krafton") != -1) return true;
  if(data.indexOf("levelinfinite") != -1) return true;
  if(data.indexOf("lightspeed") != -1) return true;

  return false;
}

// ============================================================
// LOBBY / MATCH DETECTION
// ============================================================

function isLobby(data){
  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download/i.test(data);
}

function isMatch(data){
  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate/i.test(data);
}

// ============================================================
// GROUPING
// ============================================================

function getIPv6Group(ip, hextets){
  if(!isIPv6(ip)) return "";
  return expandIPv6(ip).split(":").slice(0, hextets).join(":");
}

function getLobbyGroup(ip){
  return getIPv6Group(ip, 3); // /48
}

function getMatchGroup(ip){
  return getIPv6Group(ip, 4); // /64
}

// ============================================================
// SESSION HELPERS
// ============================================================

function resetAllSessions(){
  SESSION.lobbyProvider = "";
  SESSION.lobbyNet = "";
  SESSION.matchProvider = "";
  SESSION.matchNet = "";
  SESSION.active = false;
}

function resetMatchSession(){
  SESSION.matchProvider = "";
  SESSION.matchNet = "";
  SESSION.active = false;
}

// ============================================================
// RESOLVE TARGET IP
// مهم: PAC engines قد لا ترجع AAAA بشكل مضمون
// ============================================================

function resolveTargetIP(host){
  var ip = "";

  if(isIPLiteral(host))
    return host;

  try{
    ip = dnsResolve(host);
  }catch(e){
    ip = "";
  }

  return ip;
}

// ============================================================
// MAIN ENGINE
// ============================================================

function FindProxyForURL(url, host){

  var ip = "";
  var fullIP = "";
  var provider = "";
  var data = "";
  var lobby = false;
  var match = false;
  var lobbyGroup = "";
  var matchGroup = "";

  if(isPlainHostName(host))
    return DIRECT;

  if(!isPUBG(host, url))
    return DIRECT;

  ip = resolveTargetIP(host);

  // إذا المحرك ما رجع IP، خليه يمر على البروكسي بدل ما يضيع الاتصال
  if(!ip || ip === "")
    return PROXY;

  // امنع IPv4 كليًا
  if(isIPv4(ip))
    return BLOCK;

  // لازم يكون IPv6
  if(!isIPv6(ip))
    return BLOCK;

  fullIP = expandIPv6(ip);

  // لازم يكون من النطاقات الأردنية فقط
  if(!isJordanIPv6(fullIP))
    return BLOCK;

  provider = getProviderName(fullIP);
  if(provider === "")
    return BLOCK;

  data = safeLower(host + url);
  lobby = isLobby(data);
  match = isMatch(data);

  lobbyGroup = getLobbyGroup(fullIP);
  matchGroup = getMatchGroup(fullIP);

  // إذا الطلب ليس match، نظف قفل الماتش
  if(!match && SESSION.active)
    resetMatchSession();

  // ---------------- LOBBY ----------------
  if(lobby){

    if(SESSION.lobbyProvider === ""){
      SESSION.lobbyProvider = provider;
      SESSION.lobbyNet = lobbyGroup;
    }

    if(provider != SESSION.lobbyProvider)
      return BLOCK;

    if(lobbyGroup != SESSION.lobbyNet)
      return BLOCK;

    return PROXY;
  }

  // ---------------- MATCH ----------------
  if(match){

    if(SESSION.matchProvider === ""){
      SESSION.matchProvider = provider;
      SESSION.matchNet = matchGroup;
      SESSION.active = true;
    }

    if(provider != SESSION.matchProvider)
      return BLOCK;

    if(matchGroup != SESSION.matchNet)
      return BLOCK;

    return PROXY;
  }

  // ---------------- OTHER PUBG TRAFFIC ----------------
  // لازم يبقى داخل نفس النطاقات الأردنية
  // وإذا كان عندك لوبي محفوظ، ثبّت عليه
  if(SESSION.lobbyProvider !== ""){
    if(provider != SESSION.lobbyProvider)
      return BLOCK;
  }

  return PROXY;
}
