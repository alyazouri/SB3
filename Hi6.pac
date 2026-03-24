// ============================================================================
// 🎮 PUBG MOBILE - JORDAN ULTRA SYSTEM v10.0 FINAL
// 🇯🇴 Bitmap Matching | O(1) Port Lookup | DNS+CIDR Cache | Auto-Reconnect
// ============================================================================

var PROXY_PRIMARY = "PROXY 212.35.66.45:3128";
var PROXY_SECOND  = "SOCKS5 91.106.109.50:1080";
var DIRECT        = "DIRECT";

var PROXY_CHAIN_STRONG = PROXY_PRIMARY+"; "+PROXY_SECOND+"; "+PROXY_PRIMARY+"; "+PROXY_SECOND+"; "+DIRECT;
var PROXY_CHAIN_NORMAL = PROXY_PRIMARY+"; "+PROXY_SECOND+"; "+DIRECT;
var PROXY_CHAIN_LIGHT  = PROXY_PRIMARY+"; "+DIRECT;

// ===================== 🇯🇴 JORDAN IPv4 =====================
var JO_V4_CIDR = [
  { base:"37.123.64.0",   mask:19 }, { base:"37.202.64.0",   mask:18 },
  { base:"176.29.0.0",    mask:16 }, { base:"194.165.128.0", mask:19 },
  { base:"212.35.64.0",   mask:19 }, { base:"46.185.128.0",  mask:17 },
  { base:"185.98.220.0",  mask:22 }, { base:"185.98.224.0",  mask:22 },
  { base:"82.212.64.0",   mask:18 }, { base:"86.108.0.0",    mask:17 },
  { base:"188.247.64.0",  mask:19 }, { base:"212.118.0.0",   mask:19 },
  { base:"213.139.32.0",  mask:19 }, { base:"185.12.244.0",  mask:22 },
  { base:"185.139.220.0", mask:22 }, { base:"176.28.128.0",  mask:17 },
  { base:"92.253.0.0",    mask:17 }, { base:"94.142.32.0",   mask:19 },
  { base:"193.188.64.0",  mask:19 }, { base:"212.34.0.0",    mask:19 },
  { base:"213.186.160.0", mask:19 }, { base:"217.144.0.0",   mask:20 }
];

// ===================== 🇯🇴 JORDAN IPv6 (مرتبة حسب الأولوية) =====================
var JO_V6_PREFIXES = [
  "2a01:9700::", "2a00:1a48::", "2a02:2788::", "2a0d:5642::",
  "2a00:1c88::", "2a02:26f0::", "2a0e:b107::", "2a00:1328::",
  "2a02:2e02::", "2a04:2ec0::", "2a07:7cc0::", "2a02:ac80::",
  "2a0d:5600::", "2a02:2120::", "2a0c:5a80::", "2a00:79e0::",
  "2a00:1398::", "2001:4978::", "2a00:1d78::"
];

// ===================== 🚫 BLOCKED IPv4 =====================
var BLOCKED_V4 = [
  { base:"41.32.0.0",    mask:11 }, { base:"41.64.0.0",    mask:10 },
  { base:"41.128.0.0",   mask:11 }, { base:"41.192.0.0",   mask:11 },
  { base:"156.160.0.0",  mask:11 }, { base:"196.128.0.0",  mask:11 },
  { base:"5.0.0.0",      mask:16 }, { base:"37.236.0.0",   mask:14 },
  { base:"82.137.192.0", mask:18 }, { base:"188.161.0.0",  mask:16 },
  { base:"37.239.0.0",   mask:16 }, { base:"46.34.0.0",    mask:15 },
  { base:"82.194.0.0",   mask:15 }, { base:"95.78.0.0",    mask:15 }
];

// ===================== 🚫 BLOCKED IPv6 =====================
var BLOCKED_V6 = [
  "2001:4350::", "2c0f:ee00::", "2c0f:f000::",
  "2a02:2528::", "2a04:b580::", "2a0b:4300::",
  "2a00:1a80::", "2a04:9dc0::"
];

// ===================== 🎯 PUBG DOMAINS =====================
var PUBG_CRITICAL = [
  "igamecj.com","gcloudsdk.com","proximabeta.com",
  "match.pubgmobile.com","matchmaking.pubgmobile.com",
  "mm.pubgmobile.com","lobby.pubgmobile.com",
  "queue.pubgmobile.com","room.pubgmobile.com",
  "crew.pubgmobile.com","crewchallenge.pubgmobile.com",
  "game.pubgmobile.com","gs.pubgmobile.com","battle.pubgmobile.com"
];

var PUBG_GENERAL = [
  "pubgmobile.com","pubgm.com","proximabeta.com",
  "tencent.com","qq.com","qcloud.com","myqcloud.com"
];

var SACRED_DIRECT = [
  "google.com","gstatic.com","googleapis.com","youtube.com",
  "facebook.com","instagram.com","whatsapp.com","twitter.com",
  "apple.com","microsoft.com","amazon.com","cloudflare.com"
];

// ===================== 📡 PUBG PORTS =====================
var PUBG_PORTS = [
  443,8443,10443,80,8080,17500,
  20000,20001,20002,20003,20004,20005,20006,20007,20008,20009,20010,
  10012,10013,10014,10015,10016,17000,17001,17002,
  20030,20031,20032,20033,20034,20035
];

// ============================================================================
// ⚡ PRE-COMPUTED STRUCTURES (تُبنى مرة واحدة عند التحميل)
// ============================================================================

function _ipToLong(ip) {
  var p = ip.split(".");
  return ((parseInt(p[0])<<24)|(parseInt(p[1])<<16)|(parseInt(p[2])<<8)|parseInt(p[3]))>>>0;
}

// Bitmask arrays — حساب مسبق لكل النطاقات
var _joBitmasks = (function() {
  var r = [];
  for (var i = 0; i < JO_V4_CIDR.length; i++) {
    var m = (0xFFFFFFFF << (32 - JO_V4_CIDR[i].mask)) >>> 0;
    r.push({ net: (_ipToLong(JO_V4_CIDR[i].base) & m) >>> 0, mask: m });
  }
  return r;
})();

var _blkBitmasks = (function() {
  var r = [];
  for (var i = 0; i < BLOCKED_V4.length; i++) {
    var m = (0xFFFFFFFF << (32 - BLOCKED_V4[i].mask)) >>> 0;
    r.push({ net: (_ipToLong(BLOCKED_V4[i].base) & m) >>> 0, mask: m });
  }
  return r;
})();

// O(1) port lookup
var _portMap = (function() {
  var m = {};
  for (var i = 0; i < PUBG_PORTS.length; i++) m[PUBG_PORTS[i]] = true;
  return m;
})();

// O(depth) domain lookup
var _domainMap = (function() {
  var idx = { c:{}, g:{}, s:{} };
  function fill(list, b) { for (var i=0;i<list.length;i++) idx[b][list[i]]=true; }
  fill(PUBG_CRITICAL, "c");
  fill(PUBG_GENERAL,  "g");
  fill(SACRED_DIRECT, "s");
  return idx;
})();

// Fast IPv4 prefix map للمزودين الرئيسيين
var _fastV4 = (function() {
  var m = {};
  var p = ["37.123.","37.202.","176.29.","46.185.","82.212.",
           "86.108.","212.35.","212.118.","213.139.","185.98.","188.247."];
  for (var i = 0; i < p.length; i++) m[p[i]] = true;
  return m;
})();

// Compiled regex للأنماط
var _pubgRx = /lobby|match|queue|crew|recruit|team|squad|game|battle|\bgs\b|\bmm\b|play|combat|pvp|ranked/;

// Cache للنتائج
var _dnsCache = {};
var _ipCache  = {};

// ============================================================================
// 🔧 RUNTIME FUNCTIONS
// ============================================================================

function _isV6(ip) { return ip && ip.indexOf(":") !== -1; }

function _bitmaskHit(ipLong, masks) {
  for (var i = 0; i < masks.length; i++) {
    if ((ipLong & masks[i].mask) === masks[i].net) return true;
  }
  return false;
}

function _v6InList(ip, list) {
  ip = ip.toLowerCase().replace(/^\[|\]$/g,"");
  for (var i = 0; i < list.length; i++) {
    if (ip.indexOf(list[i].toLowerCase().replace(/:+$/,"")) === 0) return true;
  }
  return false;
}

function _domainHit(host, bucket) {
  if (_domainMap[bucket][host]) return true;
  var d = host.indexOf(".");
  while (d !== -1) {
    if (_domainMap[bucket][host.slice(d+1)]) return true;
    d = host.indexOf(".", d+1);
  }
  return false;
}

function _getIP(host) {
  if (_dnsCache[host] !== undefined) return _dnsCache[host];
  return (_dnsCache[host] = dnsResolve(host) || "");
}

function _classify(ip) {
  if (!ip) return { jo:false, blocked:false };
  var key = ip;
  if (_ipCache[key] !== undefined) return _ipCache[key];

  var jo = false, blocked = false;

  if (_isV6(ip)) {
    blocked = _v6InList(ip, BLOCKED_V6);
    if (!blocked) jo = _v6InList(ip, JO_V6_PREFIXES);
  } else {
    var ipL = _ipToLong(ip);
    blocked = _bitmaskHit(ipL, _blkBitmasks);
    if (!blocked) {
      // Fast-path أولاً
      var dot2 = ip.indexOf(".", ip.indexOf(".") + 1) + 1;
      var pre  = ip.substring(0, dot2);
      jo = !!_fastV4[pre] || _bitmaskHit(ipL, _joBitmasks);
    }
  }

  return (_ipCache[key] = { jo:jo, blocked:blocked });
}

function _hasPubgPort(url) {
  var m = url.match(/:(\d+)/);
  return m ? !!_portMap[parseInt(m[1])] : false;
}

// ============================================================================
// 🌟 FindProxyForURL
// ============================================================================
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  // 0. Sacred Direct
  if (_domainHit(host, "s")) return DIRECT;

  // 1. IP Classification (cached)
  var cl = _classify(_getIP(host));
  if (cl.blocked) return DIRECT;

  // 2. PUBG Detection
  var isCritical = _domainHit(host, "c") || _hasPubgPort(url);
  var isPubg     = isCritical || _domainHit(host, "g") || _pubgRx.test(host);

  // 3. Routing Decision
  if (isPubg && cl.jo && isCritical) return PROXY_CHAIN_STRONG;
  if (isPubg && cl.jo)               return PROXY_CHAIN_NORMAL;
  if (isCritical)                    return PROXY_CHAIN_NORMAL;
  if (isPubg)                        return PROXY_CHAIN_LIGHT;
  if (cl.jo)                         return PROXY_CHAIN_LIGHT;

  return DIRECT;
}
// ============================================================================
// ✅ v10.0 FINAL | Bitmap O(n) CIDR | O(1) Port/Domain | Full Cache | Auto-Reconnect
// ============================================================================
