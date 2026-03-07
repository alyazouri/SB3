// ===================== ULTRA AGGRESSIVE JO-ONLY CONFIG =====================

var CFG = {
  ALLOW_SAFE_DIRECT: true,
  ENABLE_MATCHMAKING_PRESSURE: true,
  MAX_CHAIN: 3, // زدناه من 2 لـ 3
  PRESSURE_LEVEL: 20, // أقصى ضغط ممكن
  AGGRESSIVE_JO_MODE: true,
  LEARNING_ENABLED: true,
  ASN_OPTIMIZATION: true,
  
  // ========== إعدادات جديدة ULTRA ==========
  BLOCK_NON_JO_IMMEDIATELY: true, // فوراً ارفض غير الأردني
  MAX_NON_JO_ATTEMPTS: 0, // صفر تسامح
  FORCE_RETRY_ON_FOREIGN: true, // أجبر إعادة محاولة
  BLACKLIST_FOREIGN_IPS: true, // امنع IPs أجنبية نهائياً
  PARANOID_MODE: true // الوضع البارانويد - شك في كل شي
};

// ===================== SAFE DIRECT (محدود جداً) =====================
var SAFE_DIRECT_DOMAINS = [
  "captive.apple.com","ocsp.apple.com","time.apple.com",
  "connectivitycheck.gstatic.com"
  // حذفنا YouTube و GitHub - كل شي عبر بروكسي!
];

var BLOCK = "PROXY 0.0.0.0:0";

// ===================== HYPER PROXIES (نفس الشي) =====================
var HYPER_PROXIES = {
  JO_ULTRA: {
    QUANTUM_1: "PROXY 212.35.66.45:20020",
    QUANTUM_2: "PROXY 46.185.131.218:20001",
    QUANTUM_3: "PROXY 212.35.66.46:443",
    QUANTUM_4: "PROXY 91.106.109.12:20004",
    QUANTUM_5: "PROXY 185.165.120.34:8080",
    QUANTUM_6: "PROXY 94.249.123.45:3128"
  },
  JO_SPECIALIZED: {
    MATCH_ALPHA: "PROXY 212.35.66.45:20020",
    MATCH_BETA:  "PROXY 46.185.131.218:20001",
    MATCH_GAMMA: "PROXY 94.249.123.45:3128",
    VOICE_ALPHA: "PROXY 46.185.131.222:20001",
    VOICE_BETA:  "PROXY 46.185.131.223:20001",
    VOICE_GAMMA: "PROXY 185.165.120.34:8080",
    GAME_ALPHA:  "PROXY 91.106.109.12:20001",
    GAME_BETA:   "PROXY 91.106.109.25:20001",
    GAME_GAMMA:  "PROXY 212.35.66.46:443"
  },
  JO_BALANCERS: {
    LB_1: "PROXY 212.35.66.45:20020",
    LB_2: "PROXY 46.185.131.218:20001",
    LB_3: "PROXY 91.106.109.25:20001",
    LB_4: "PROXY 94.249.123.45:3128",
    LB_5: "PROXY 185.165.120.34:8080"
  },
  JO_RESERVE: {
    RESCUE_1: "PROXY 86.108.12.34:8080",
    RESCUE_2: "PROXY 109.107.224.56:3128",
    RESCUE_3: "PROXY 176.29.78.90:8080",
    RESCUE_4: "PROXY 37.202.128.12:3128"
  }
};

// ===================== DOMAIN MAP =====================
var ULTRA_DOMAINS = {
  MATCHMAKING_CRITICAL: [
    "igamecj.com","gcloudsdk.com","proximabeta.com",
    "match.pubgmobile.com","matchmaking.pubgmobile.com","mm.pubgmobile.com",
    "lobby.pubgmobile.com","queue.pubgmobile.com","room.pubgmobile.com",
    "recruit.pubgmobile.com","team.pubgmobile.com","find.pubgmobile.com",
    "search.pubgmobile.com","party.pubgmobile.com"
  ],
  GAME_SERVERS_CRITICAL: [
    "game.pubgmobile.com","gs.pubgmobile.com","server.pubgmobile.com",
    "battle.pubgmobile.com","play.pubgmobile.com","combat.pubgmobile.com",
    "pvp.pubgmobile.com","sync.pubgmobile.com","action.pubgmobile.com"
  ],
  VOICE_CRITICAL: [
    "voice.pubgmobile.com","rtc.igamecj.com","gvoice.qq.com",
    "voip.pubgmobile.com","audio.pubgmobile.com","rtc.pubgmobile.com",
    "talk.pubgmobile.com","mic.pubgmobile.com"
  ],
  CDN_UPDATES: [
    "cdn.pubgmobile.com","dl.pubgmobile.com","download.pubgmobile.com",
    "patch.pubgmobile.com","update.pubgmobile.com",
    "cloud.gsdk.proximabeta.com","down.qq.com","dldir1.qq.com"
  ],
  PUBG_CORE_HIGH: [
    "pubgmobile.com","pubgm.com","proximabeta.com","pubgmobile.proximabeta.com",
    "tencent.com","qq.com","qcloud.com","gcloudsdk.com"
  ]
};

// ===================== GEO MATRIX (موسّع) =====================
var GEO_MATRIX = {
  JO: [
  // Orange Jordan
  "62.90.0.0/16",
  "86.108.0.0/16",
  "87.236.232.0/21",
  // Zain Jordan
  "176.29.0.0/16",
  "37.75.144.0/20",
  // Umniah
  "46.32.96.0/19",
  "188.247.0.0/16"
  ],
  // الجيران - نقبلهم فقط كـ LAST RESORT
  PS: ["176.29.0.0/16","37.75.144.0/20"],
  LB: ["46.32.96.0/19","188.247.0.0/16"],
  SY: ["86.108.0.0/16","87.236.232.0/21"]
};

// ===================== IP BLACKLIST (جديد) =====================
var IP_BLACKLIST = {
  blocked: {},
  
  addToBlacklist: function(ip, reason) {
    if (!ip || ip === "0.0.0.0") return;
    this.blocked[ip] = {
      reason: reason,
      timestamp: Date.now(),
      attempts: (this.blocked[ip] ? this.blocked[ip].attempts + 1 : 1)
    };
  },
  
  isBlacklisted: function(ip) {
    if (!CFG.BLACKLIST_FOREIGN_IPS) return false;
    if (!ip || ip === "0.0.0.0") return false;
    
    var entry = this.blocked[ip];
    if (!entry) return false;
    
    // إذا الـ IP محظور من أكثر من 30 دقيقة، امسحه (إعطاء فرصة ثانية)
    var age = Date.now() - entry.timestamp;
    if (age > 1800000) { // 30 دقيقة
      delete this.blocked[ip];
      return false;
    }
    
    return true;
  },
  
  getBlockCount: function() {
    var count = 0;
    for (var ip in this.blocked) {
      if (this.isBlacklisted(ip)) count++;
    }
    return count;
  }
};

// ===================== CIDR FUNCTIONS =====================
var CIDR_CACHE = {};

function _ipToLong(ip){
  var p=ip.split(".");
  if(p.length!==4) return -1;
  var a=(parseInt(p[0],10)&255),b=(parseInt(p[1],10)&255),c=(parseInt(p[2],10)&255),d=(parseInt(p[3],10)&255);
  return (((a<<24)>>>0)|((b<<16)>>>0)|((c<<8)>>>0)|(d>>>0))>>>0;
}

function _precomputeCidrCache(){
  for (var cc in GEO_MATRIX){
    if (!Array.isArray(GEO_MATRIX[cc])) continue;
    CIDR_CACHE[cc]=[];
    for (var i=0;i<GEO_MATRIX[cc].length;i++){
      var cidr=GEO_MATRIX[cc][i];
      var s=cidr.indexOf("/");
      if(s<0) continue;
      var ip=cidr.substring(0,s);
      var bits=parseInt(cidr.substring(s+1),10);
      var ipLong=_ipToLong(ip);
      if(ipLong<0) continue;
      var mask=(0xFFFFFFFF << (32-bits))>>>0;
      CIDR_CACHE[cc].push({network: ipLong, mask: mask});
    }
  }
}

function _cidrMatch(ip, entry){
  var ipLong=_ipToLong(ip);
  if(ipLong<0) return false;
  return ((ipLong & entry.mask)>>>0) === (entry.network>>>0);
}

function _inCidrArray(ip, cc){
  var arr = CIDR_CACHE[cc];
  if(!ip || !arr) return false;
  for (var i=0;i<arr.length;i++){
    if(_cidrMatch(ip, arr[i])) return true;
  }
  return false;
}

_precomputeCidrCache();

// ===================== DOMAIN MATCHING =====================
function _endsWith(host, dom){
  return host===dom || (host.length>dom.length && host.substring(host.length-dom.length-1)==="."+dom);
}

function _inDomainArray(host, arr){
  for(var i=0;i<arr.length;i++){
    if(_endsWith(host, arr[i])) return true;
  }
  return false;
}

// ===================== ENHANCED GEO DETECTION =====================
var GEO_DETECTIVE = {
  // فحص شامل: هل هذا IP أردني؟
  isDefinitelyJordanian: function(ip) {
    if (!ip || ip === "0.0.0.0") return false;
    
    // 1. فحص CIDR الأساسي
    if (_inCidrArray(ip, "JO")) return true;
    
    // 2. فحص ASN
    var asn = ASN_ROUTER.detectASN(ip);
    if (asn && asn.indexOf("AS8376") === 0) return true; // Orange
    if (asn && asn.indexOf("AS48832") === 0) return true; // Zain
    if (asn && asn.indexOf("AS47887") === 0) return true; // Umniah
    if (asn && asn.indexOf("AS41330") === 0) return true; // Batelco
    
    // 3. فحص المغناطيسية
    var magnetism = GEO_MAGNETISM.classifyByMagnetism(ip);
    if (magnetism === "ULTRA_CLOSE") return true;
    
    return false;
  },
  
  // فحص: هل ممكن يكون أردني؟
  isPossiblyJordanian: function(ip) {
    if (this.isDefinitelyJordanian(ip)) return true;
    
    var magnetism = GEO_MAGNETISM.classifyByMagnetism(ip);
    if (magnetism === "VERY_CLOSE") return true;
    
    // فحص الجيران القريبين
    if (_inCidrArray(ip, "PS")) return true;
    if (_inCidrArray(ip, "LB")) return true;
    
    return false;
  },
  
  // فحص: هل أكيد مش أردني؟
  isDefinitelyForeign: function(ip) {
    if (this.isDefinitelyJordanian(ip)) return false;
    if (this.isPossiblyJordanian(ip)) return false;
    
    var magnetism = GEO_MAGNETISM.classifyByMagnetism(ip);
    
    // بعيد جداً = أجنبي أكيد
    if (magnetism === "FAR") return true;
    if (magnetism === "MEDIUM") return true;
    
    return false;
  }
};

// ===================== ASN ROUTER =====================
var ASN_ROUTER = {
  jordanianASN: {
    "212.35.0.0/16": "AS8376",
    "35.66.0.0/16": "AS8376",
    "46.185.128.0/17": "AS48832",
    "92.253.0.0/17": "AS48832",
    "37.202.64.0/18": "AS47887",
    "82.212.64.0/18": "AS47887",
    "185.165.120.0/22": "AS41330",
    "91.106.0.0/16": "AS8376",
    "213.6.64.0/19": "AS8376"
  },
  
  detectASN: function(ip) {
    for (var cidr in this.jordanianASN) {
      var s = cidr.indexOf("/");
      var network = cidr.substring(0, s);
      var bits = parseInt(cidr.substring(s + 1), 10);
      var netLong = _ipToLong(network);
      var ipLong = _ipToLong(ip);
      var mask = (0xFFFFFFFF << (32 - bits)) >>> 0;
      if (((ipLong & mask) >>> 0) === ((netLong & mask) >>> 0)) {
        return this.jordanianASN[cidr];
      }
    }
    return null;
  },
  
  classifyProvider: function(asn) {
    if (!asn) return "UNKNOWN";
    if (asn === "AS8376") return "ORANGE";
    if (asn === "AS48832") return "ZAIN";
    if (asn === "AS47887") return "UMNIAH";
    if (asn === "AS41330") return "BATELCO";
    return "FOREIGN";
  },
  
  sameProviderProxy: function(provider) {
    var providerProxies = {
      ORANGE: HYPER_PROXIES.JO_ULTRA.QUANTUM_1,
      ZAIN: HYPER_PROXIES.JO_ULTRA.QUANTUM_2,
      UMNIAH: HYPER_PROXIES.JO_SPECIALIZED.GAME_ALPHA,
      BATELCO: HYPER_PROXIES.JO_ULTRA.QUANTUM_5
    };
    return providerProxies[provider] || null;
  }
};

// ===================== GEO MAGNETISM =====================
var GEO_MAGNETISM = {
  calculatePull: function(ip) {
    if (!ip) return 0;
    var ipLong = _ipToLong(ip);
    var jordanCenter = _ipToLong("212.35.66.1");
    var distance = Math.abs(ipLong - jordanCenter);
    var maxDist = 4294967295;
    var pull = 100 - ((distance / maxDist) * 100);
    return pull;
  },
  
  classifyByMagnetism: function(ip) {
    var pull = this.calculatePull(ip);
    if (pull > 92) return "ULTRA_CLOSE";
    if (pull > 75) return "VERY_CLOSE";
    if (pull > 55) return "CLOSE";
    if (pull > 35) return "MEDIUM";
    return "FAR";
  }
};

// ===================== PARANOID VALIDATOR (جديد) =====================
var PARANOID_VALIDATOR = {
  suspiciousPatterns: [
    // أنماط مشبوهة في الـ IP
    "185.220.", // Tor nodes
    "45.95.",   // VPNs
    "104.21.",  // Cloudflare (ممكن يخبي IP حقيقي)
    "172.67."   // Cloudflare
  ],
  
  isSuspicious: function(ip, host) {
    if (!CFG.PARANOID_MODE) return false;
    if (!ip) return true;
    
    // فحص الأنماط المشبوهة
    for (var i = 0; i < this.suspiciousPatterns.length; i++) {
      if (ip.indexOf(this.suspiciousPatterns[i]) === 0) {
        return true;
      }
    }
    
    // إذا DNS resolve فشل
    if (ip === "0.0.0.0") return true;
    
    // إذا الـ host فيه "test" أو "dev"
    if (host.indexOf("test") !== -1 || host.indexOf("dev") !== -1) {
      return true;
    }
    
    return false;
  }
};

// انتهى الجزء الأول - استنى الجزء الثاني
// ===================== PART 2: ULTRA AGGRESSIVE ENFORCEMENT =====================

// ===================== PING MATRIX =====================
var PING_MATRIX = {
  PING_WEIGHTS: {
    "PROXY 212.35.66.45:20020": {base: 12, stab: 9},
    "PROXY 46.185.131.218:20001": {base: 14, stab: 9},
    "PROXY 212.35.66.46:443": {base: 16, stab: 8},
    "PROXY 91.106.109.12:20004": {base: 17, stab: 8},
    "PROXY 91.106.109.12:20001": {base: 17, stab: 8},
    "PROXY 91.106.109.25:20001": {base: 18, stab: 8},
    "PROXY 185.165.120.34:8080": {base: 19, stab: 7},
    "PROXY 94.249.123.45:3128": {base: 20, stab: 7},
    "PROXY 86.108.12.34:8080": {base: 23, stab: 6},
    "PROXY 109.107.224.56:3128": {base: 24, stab: 6},
    "PROXY 176.29.78.90:8080": {base: 24, stab: 6},
    "PROXY 37.202.128.12:3128": {base: 25, stab: 6}
  },
  score: function(proxy){
    var w=this.PING_WEIGHTS[proxy] ? this.PING_WEIGHTS[proxy] : {base: 50, stab: 1};
    return (w.base*10) - (w.stab*3);
  },
  sortByPing: function(list){
    var a=list.slice();
    a.sort(function(x,y){ return PING_MATRIX.score(x)-PING_MATRIX.score(y); });
    return a;
  }
};

// ===================== ULTRA ENFORCER (جديد) =====================
var ULTRA_ENFORCER = {
  foreignAttempts: 0,
  jordanianSuccess: 0,
  lastJordanianTime: 0,
  consecutiveForeign: 0,
  blockEverything: false,
  
  recordAttempt: function(ip, isJordanian) {
    if (isJordanian) {
      this.jordanianSuccess++;
      this.lastJordanianTime = Date.now();
      this.consecutiveForeign = 0;
      this.blockEverything = false;
    } else {
      this.foreignAttempts++;
      this.consecutiveForeign++;
      
      // إذا 3 محاولات متتالية أجنبية = نوقف كل شي
      if (this.consecutiveForeign >= 3) {
        this.blockEverything = true;
      }
    }
  },
  
  shouldBlockEverything: function() {
    // إذا طول الوقت أجانب = أوقف كل شي لإجبار إعادة محاولة
    return this.blockEverything && CFG.FORCE_RETRY_ON_FOREIGN;
  },
  
  getBlockReason: function() {
    return "TOO_MANY_FOREIGN_SERVERS";
  },
  
  reset: function() {
    var timeSinceJO = Date.now() - this.lastJordanianTime;
    // reset بعد دقيقتين
    if (timeSinceJO > 120000) {
      this.foreignAttempts = 0;
      this.consecutiveForeign = 0;
      this.blockEverything = false;
    }
  }
};

// ===================== ZERO TOLERANCE MATCHMAKING (جديد) =====================
var ZERO_TOLERANCE_MATCH = {
  attempts: {},
  globalAttempts: 0,
  
  // سجل كل محاولة matchmaking
  recordMatchAttempt: function(host, ip, isJordanian) {
    var key = host + ":" + ip;
    
    if (!this.attempts[key]) {
      this.attempts[key] = {
        total: 0,
        jordanian: 0,
        foreign: 0,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        blocked: false
      };
    }
    
    var record = this.attempts[key];
    record.total++;
    record.lastSeen = Date.now();
    this.globalAttempts++;
    
    if (isJordanian) {
      record.jordanian++;
    } else {
      record.foreign++;
      
      // أول مرة نشوف IP أجنبي = نحظره فوراً
      if (CFG.BLOCK_NON_JO_IMMEDIATELY) {
        record.blocked = true;
        IP_BLACKLIST.addToBlacklist(ip, "NON_JORDANIAN_MATCHMAKING");
      }
    }
    
    return record;
  },
  
  // قرار: هل نقبل هذا السيرفر؟
  shouldAccept: function(host, ip, isJordanian) {
    // أردني = قبول فوري
    if (isJordanian) return true;
    
    // غير أردني + ZERO TOLERANCE = رفض فوري
    if (CFG.MAX_NON_JO_ATTEMPTS === 0) {
      return false;
    }
    
    var key = host + ":" + ip;
    var record = this.attempts[key];
    
    // محظور سابقاً = رفض
    if (record && record.blocked) return false;
    
    // IP في الـ blacklist = رفض
    if (IP_BLACKLIST.isBlacklisted(ip)) return false;
    
    return false; // default: رفض كل شي غير أردني
  },
  
  // استراتيجية القوة القصوى
  getUltraAggressiveChain: function() {
    return [
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_ALPHA,
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_BETA,
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_GAMMA,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_1,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_2,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_3,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_4,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_5,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_6,
      HYPER_PROXIES.JO_BALANCERS.LB_1,
      HYPER_PROXIES.JO_BALANCERS.LB_2,
      HYPER_PROXIES.JO_BALANCERS.LB_3,
      HYPER_PROXIES.JO_BALANCERS.LB_4,
      HYPER_PROXIES.JO_BALANCERS.LB_5,
      HYPER_PROXIES.JO_RESERVE.RESCUE_1,
      HYPER_PROXIES.JO_RESERVE.RESCUE_2,
      HYPER_PROXIES.JO_RESERVE.RESCUE_3,
      HYPER_PROXIES.JO_RESERVE.RESCUE_4,
      BLOCK, // في النهاية: ارفض
      BLOCK, // كرره عشان يفشل أكيد
      BLOCK
    ].join("; ");
  },
  
  // حالة الطوارئ: كل البروكسيات + BLOCK متكرر
  getEmergencyChain: function() {
    var chain = [];
    
    // أضف كل بروكسي موجود
    for (var cat in HYPER_PROXIES) {
      for (var proxy in HYPER_PROXIES[cat]) {
        chain.push(HYPER_PROXIES[cat][proxy]);
      }
    }
    
    // أضف BLOCK 5 مرات في النهاية
    for (var i = 0; i < 5; i++) {
      chain.push(BLOCK);
    }
    
    return chain.join("; ");
  }
};

// ===================== PING OPTIMIZER (مبسط) =====================
var PING_OPTIMIZER = {
  history: {},
  
  recordPing: function(proxy, host, ping) {
    var key = proxy + ":" + host;
    if (!this.history[key]) {
      this.history[key] = {samples: [], avg: 0, min: 999, max: 0};
    }
    var record = this.history[key];
    record.samples.push(ping);
    if (record.samples.length > 20) record.samples.shift();
    
    var sum = 0;
    record.min = 999;
    record.max = 0;
    for (var i = 0; i < record.samples.length; i++) {
      sum += record.samples[i];
      if (record.samples[i] < record.min) record.min = record.samples[i];
      if (record.samples[i] > record.max) record.max = record.samples[i];
    }
    record.avg = sum / record.samples.length;
  },
  
  selectOptimalProxy: function(proxies, host) {
    var scored = [];
    for (var i = 0; i < proxies.length; i++) {
      var key = proxies[i] + ":" + host;
      var record = this.history[key];
      var score = 0;
      
      if (record && record.samples.length > 3) {
        score = 1000 - record.avg - (record.max - record.min);
      } else {
        var baseScore = PING_MATRIX.score(proxies[i]);
        score = 1000 - baseScore;
      }
      scored.push({proxy: proxies[i], score: score});
    }
    scored.sort(function(a, b) { return b.score - a.score; });
    return scored.map(function(item) { return item.proxy; });
  }
};

// ===================== STRATEGIES (محدّثة) =====================
var HYPER_STRATEGIES = {
  MATCHMAKING: {
    chain: [
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_ALPHA,
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_BETA,
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_GAMMA,
      HYPER_PROXIES.JO_BALANCERS.LB_1,
      HYPER_PROXIES.JO_BALANCERS.LB_2
    ],
    pressure: true
  },
  GAMEPLAY: {
    chain: [
      HYPER_PROXIES.JO_SPECIALIZED.GAME_ALPHA,
      HYPER_PROXIES.JO_SPECIALIZED.GAME_BETA,
      HYPER_PROXIES.JO_SPECIALIZED.GAME_GAMMA,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_2
    ],
    pressure: false
  },
  VOICE: {
    chain: [
      HYPER_PROXIES.JO_SPECIALIZED.VOICE_ALPHA,
      HYPER_PROXIES.JO_SPECIALIZED.VOICE_BETA,
      HYPER_PROXIES.JO_SPECIALIZED.VOICE_GAMMA
    ],
    pressure: false
  },
  CDN: {
    chain: [
      HYPER_PROXIES.JO_ULTRA.QUANTUM_1,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_3,
      HYPER_PROXIES.JO_BALANCERS.LB_5
    ],
    pressure: false
  },
  FALLBACK: {
    chain: [
      HYPER_PROXIES.JO_BALANCERS.LB_1,
      HYPER_PROXIES.JO_BALANCERS.LB_2,
      HYPER_PROXIES.JO_BALANCERS.LB_3,
      HYPER_PROXIES.JO_RESERVE.RESCUE_1,
      HYPER_PROXIES.JO_RESERVE.RESCUE_2
    ],
    pressure: false
  }
};

// ===================== HELPER FUNCTIONS =====================
function _dedup(list){
  var out=[], seen={};
  for(var i=0;i<list.length;i++){
    var x=list[i];
    if(!x || seen[x]) continue;
    seen[x]=1; out.push(x);
  }
  return out;
}

function _chainToString(list){
  var max = CFG.MAX_CHAIN;
  if(max<1) max=1;
  var a=list.slice(0, max);
  a=_dedup(a);
  if(a.length===0) return BLOCK;
  return a.join("; ");
}

function _build(strategy){
  var s=HYPER_STRATEGIES[strategy] || HYPER_STRATEGIES.FALLBACK;
  var chain = PING_MATRIX.sortByPing(s.chain);
  return _chainToString(chain);
}

function _buildExtended(strategy, maxChain){
  var s=HYPER_STRATEGIES[strategy] || HYPER_STRATEGIES.FALLBACK;
  var chain = PING_MATRIX.sortByPing(s.chain);
  var a = chain.slice(0, maxChain);
  a = _dedup(a);
  if(a.length===0) return BLOCK;
  return a.join("; ");
}

// ===================== MAIN FUNCTION - ULTRA AGGRESSIVE =====================
function FindProxyForURL(url, host){
  host=(host||"").toLowerCase();
  url=(url||"");
  
  // ========== SAFE DIRECT (محدود جداً) ==========
  if(CFG.ALLOW_SAFE_DIRECT){
    if(_inDomainArray(host, SAFE_DIRECT_DOMAINS)) return "DIRECT";
    if(host==="clients3.google.com" && url.toLowerCase().indexOf("generate_204")!==-1) return "DIRECT";
  }
  
  // ========== DNS RESOLVE ==========
  var ip = dnsResolve(host);
  if (!ip) ip = "0.0.0.0";
  
  // ========== BLACKLIST CHECK ==========
  if (IP_BLACKLIST.isBlacklisted(ip)) {
    // IP محظور = BLOCK فوري
    return BLOCK;
  }
  
  // ========== PARANOID CHECK ==========
  if (PARANOID_VALIDATOR.isSuspicious(ip, host)) {
    IP_BLACKLIST.addToBlacklist(ip, "SUSPICIOUS_PATTERN");
    return BLOCK;
  }
  
  // ========== GEO DETECTION (شامل) ==========
  var isDefinitelyJO = GEO_DETECTIVE.isDefinitelyJordanian(ip);
  var isPossiblyJO = GEO_DETECTIVE.isPossiblyJordanian(ip);
  var isDefinitelyForeign = GEO_DETECTIVE.isDefinitelyForeign(ip);
  
  // ========== ULTRA ENFORCER CHECK ==========
  ULTRA_ENFORCER.recordAttempt(ip, isDefinitelyJO);
  ULTRA_ENFORCER.reset();
  
  // إذا أكثر من 3 محاولات أجنبية متتالية = أوقف كل شي
  if (ULTRA_ENFORCER.shouldBlockEverything()) {
    return BLOCK;
  }
  
  // ========== ASN & PROVIDER ==========
  var asn = null;
  var provider = "UNKNOWN";
  
  if (CFG.ASN_OPTIMIZATION) {
    asn = ASN_ROUTER.detectASN(ip);
    provider = ASN_ROUTER.classifyProvider(asn);
  }
  
  // ========== MATCHMAKING - ZERO TOLERANCE ==========
  if(_inDomainArray(host, ULTRA_DOMAINS.MATCHMAKING_CRITICAL)){
    
    // سجل المحاولة
    ZERO_TOLERANCE_MATCH.recordMatchAttempt(host, ip, isDefinitelyJO);
    
    // ========== إذا أردني 100% ==========
    if (isDefinitelyJO) {
      ULTRA_ENFORCER.consecutiveForeign = 0;
      
      // استخدم بروكسي من نفس المزود
      if (provider !== "UNKNOWN" && provider !== "FOREIGN") {
        var sameProvider = ASN_ROUTER.sameProviderProxy(provider);
        if (sameProvider) {
          var pingEst = PING_MATRIX.score(sameProvider);
          PING_OPTIMIZER.recordPing(sameProvider, host, pingEst);
          return sameProvider;
        }
      }
      
      // استخدم أفضل بروكسي من التاريخ
      if (CFG.LEARNING_ENABLED) {
        var matchProxies = [
          HYPER_PROXIES.JO_SPECIALIZED.MATCH_ALPHA,
          HYPER_PROXIES.JO_SPECIALIZED.MATCH_BETA,
          HYPER_PROXIES.JO_SPECIALIZED.MATCH_GAMMA
        ];
        var optimized = PING_OPTIMIZER.selectOptimalProxy(matchProxies, host);
        return optimized[0];
      }
      
      return HYPER_PROXIES.JO_SPECIALIZED.MATCH_ALPHA;
    }
    
    // ========== إذا ممكن يكون أردني ==========
    if (isPossiblyJO && !isDefinitelyForeign) {
      // جرب بقوة متوسطة
      return _buildExtended("MATCHMAKING", 5) + "; " + BLOCK;
    }
    
    // ========== إذا أجنبي أكيد ==========
    if (isDefinitelyForeign) {
      // احظره فوراً
      IP_BLACKLIST.addToBlacklist(ip, "FOREIGN_MATCHMAKING_SERVER");
      
      // استخدم كل البروكسيات + BLOCK متكرر
      if (ZERO_TOLERANCE_MATCH.globalAttempts < 5) {
        return ZERO_TOLERANCE_MATCH.getUltraAggressiveChain();
      } else {
        // بعد 5 محاولات = حالة طوارئ
        return ZERO_TOLERANCE_MATCH.getEmergencyChain();
      }
    }
    
    // ========== غير معروف = تعامل كأجنبي ==========
    return ZERO_TOLERANCE_MATCH.getUltraAggressiveChain();
  }
  
  // ========== GAMEPLAY ==========
  if(_inDomainArray(host, ULTRA_DOMAINS.GAME_SERVERS_CRITICAL)){
    
    // إذا أجنبي أكيد = احظره
    if (isDefinitelyForeign) {
      IP_BLACKLIST.addToBlacklist(ip, "FOREIGN_GAME_SERVER");
      return BLOCK;
    }
    
    // إذا أردني = استخدم أفضل بروكسي
    if(isDefinitelyJO) {
      if (provider !== "UNKNOWN" && provider !== "FOREIGN") {
        var gameProvider = ASN_ROUTER.sameProviderProxy(provider);
        if (gameProvider) return gameProvider;
      }
      
      if (CFG.LEARNING_ENABLED) {
        var gameProxies = [
          HYPER_PROXIES.JO_SPECIALIZED.GAME_ALPHA,
          HYPER_PROXIES.JO_SPECIALIZED.GAME_BETA,
          HYPER_PROXIES.JO_SPECIALIZED.GAME_GAMMA
        ];
        var gameOptimized = PING_OPTIMIZER.selectOptimalProxy(gameProxies, host);
        return gameOptimized[0];
      }
      
      return _build("GAMEPLAY");
    }
    
    // غير معروف = جرب بقوة
    return _buildExtended("GAMEPLAY", 4) + "; " + BLOCK;
  }
  
  // ========== VOICE ==========
  if(_inDomainArray(host, ULTRA_DOMAINS.VOICE_CRITICAL)){
    // Voice حساس - استخدم أقل بنق
    if (CFG.LEARNING_ENABLED) {
      var voiceProxies = [
        HYPER_PROXIES.JO_SPECIALIZED.VOICE_ALPHA,
        HYPER_PROXIES.JO_SPECIALIZED.VOICE_BETA,
        HYPER_PROXIES.JO_SPECIALIZED.VOICE_GAMMA
      ];
      var voiceOptimized = PING_OPTIMIZER.selectOptimalProxy(voiceProxies, host);
      return voiceOptimized.slice(0, 2).join("; ");
    }
    return _build("VOICE");
  }
  
  // ========== CDN/UPDATES ==========
  if(_inDomainArray(host, ULTRA_DOMAINS.CDN_UPDATES)){
    return _build("CDN");
  }
  
  // ========== PUBG CORE ==========
  if(_inDomainArray(host, ULTRA_DOMAINS.PUBG_CORE_HIGH)){
    
    // إذا أجنبي = احظره
    if (isDefinitelyForeign) {
      IP_BLACKLIST.addToBlacklist(ip, "FOREIGN_CORE_SERVER");
      return BLOCK;
    }
    
    if(isDefinitelyJO) {
      if (provider !== "UNKNOWN" && provider !== "FOREIGN") {
        var coreProvider = ASN_ROUTER.sameProviderProxy(provider);
        if (coreProvider) return coreProvider;
      }
      return _build("GAMEPLAY");
    }
    
    // غير معروف = استخدم fallback
    return _buildExtended("FALLBACK", 5);
  }
  
  // ========== DEFAULT ==========
  // أي شي تاني = عبر بروكسي
  return _build("FALLBACK");
}

// ===================== END OF ULTRA AGGRESSIVE SCRIPT =====================
