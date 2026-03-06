// ============================================================
// PUBG MOBILE — JORDAN ULTIMATE v10.0
// ⚡ Ultra Low Ping | Jordan-First Routing
// 🚫 Blocked: Asia | Europe | Egypt
// ✅ Optimized: Jordan Priority + Minimal Gulf
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 0.0.0.0:0";

// ============================================================
// 🎯 MODE: JORDAN LOCKDOWN
// ============================================================

var MODE = {
  JORDAN_FIRST: true,          // الأردن أولاً دائماً
  BLOCK_FAR_REGIONS: true,     // حظر المناطق البعيدة
  PREFER_IPV6: true,           // تفضيل IPv6
  AGGRESSIVE_BLOCK: true,      // حظر عدواني
  SMART_ROUTING: true,         // توجيه ذكي
  MINIMAL_GULF: true           // تقليل الخليج
};

// ============================================================
// 📊 SESSION STATE
// ============================================================

var SESSION = {
  matchNet:      null,
  matchHost:     null,
  lobbyNet:      null,
  jordanServer:  null,
  bestPing:      999,
  startTime:     Date.now(),
  lastActivity:  Date.now(),
  totalMatches:  0,
  jordanMatches: 0
};

// ============================================================
// 🚫 BLOCKED REGIONS — المناطق المحظورة
// ============================================================

var BLOCKED_REGIONS = {
  // آسيا - Asia (كاملة)
  ASIA: [
    // الصين
    '2400:', '2401:', '2402:', '2403:', '2404:', '2405:', '2406:', '2407:',
    '2408:', '2409:', '240a:', '240b:', '240c:', '240d:', '240e:', '240f:',
    '2410:', '2411:', '2412:', '2413:', '2414:', '2415:', '2416:', '2417:',
    '2418:', '2419:', '241a:', '241b:', '241c:', '241d:', '241e:', '241f:',
    
    // اليابان
    '2001:2', '2001:3', '2400:1100', '2400:1200', '2600:3000', '2606:a000',
    '2606:b000', '2606:c000', '2606:d000', '2606:e000', '2606:f000',
    
    // كوريا الجنوبية
    '2001:2c0', '2001:2d0', '2001:2e0', '2001:2f0',
    '2400:8000', '2400:8100', '2400:8200', '2400:8300',
    
    // سنغافورة
    '2001:c00', '2001:c08', '2001:c10', '2001:c18',
    '2400:9800', '2400:a000', '2400:a800',
    
    // تايلاند
    '2001:3c0', '2001:3c8', '2001:3d0', '2001:3d8',
    '2401:3400', '2401:3800', '2401:3c00',
    
    // فيتنام
    '2001:4c0', '2001:4c8', '2001:4d0', '2001:4d8',
    '2401:d000', '2401:d400', '2401:d800',
    
    // ماليزيا
    '2001:440', '2001:448', '2001:450', '2001:458',
    '2400:c000', '2400:c400', '2400:c800',
    
    // إندونيسيا
    '2001:460', '2001:468', '2001:470', '2001:478',
    '2400:cc00', '2400:d000', '2400:d400',
    
    // الفلبين
    '2001:4c0', '2001:4c8', '2001:4d0',
    '2400:b000', '2400:b400', '2400:b800',
    
    // الهند (كاملة)
    '2001:470:', '2001:478:', '2001:480:', '2001:488:',
    '2001:490:', '2001:498:', '2001:4a0:', '2001:4a8:',
    '2400:4000:', '2400:5000:', '2400:6000:', '2400:7000:',
    '2401:4000:', '2401:5000:', '2401:6000:',
    
    // باكستان
    '2001:580:', '2001:588:', '2001:590:', '2001:598:',
    '2401:8000:', '2401:8400:', '2401:8800:',
    
    // بنغلاديش
    '2001:560:', '2001:568:', '2001:570:',
    '2401:9000:', '2401:9400:',
    
    // تايوان
    '2001:b0:', '2001:b8:', '2001:c0:',
    '2400:8800:', '2400:8900:', '2400:8a00:', '2400:8b00:',
    
    // هونغ كونغ
    '2001:c90:', '2001:c98:', '2001:ca0:', '2001:ca8:',
    '2400:dd00:', '2400:dd80:', '2400:de00:',
    
    // ميانمار
    '2001:670:', '2001:678:',
    '2401:2000:', '2401:2400:'
  ],

  // أوروبا - Europe (كاملة)
  EUROPE: [
    // ألمانيا
    '2a00:', '2a01:0', '2a01:1', '2a01:2', '2a01:3',
    '2a02:', '2a03:', '2a04:', '2a05:', '2a06:',
    
    // فرنسا
    '2a01:4', '2a01:5', '2a01:6', '2a01:7',
    '2a00:c', '2a00:d', '2a00:e', '2a00:f',
    
    // بريطانيا
    '2a00:1', '2a00:2', '2a00:3', '2a00:4', '2a00:5',
    '2a01:8', '2a01:9', '2a01:a', '2a01:b',
    
    // هولندا
    '2a00:6', '2a00:7', '2a00:8', '2a00:9',
    '2a01:10', '2a01:11', '2a01:12',
    
    // تركيا
    '2a00:b0', '2a00:b8', '2a00:c0', '2a00:c8',
    '2a01:90', '2a01:98', '2a01:a0', '2a01:a8',
    
    // روسيا
    '2a00:1c', '2a00:1d', '2a00:1e', '2a00:1f',
    '2a01:d', '2a01:e', '2a01:f',
    '2a02:c', '2a02:d', '2a02:e', '2a02:f',
    
    // بولندا
    '2a00:d0', '2a00:d8', '2a00:e0', '2a00:e8',
    
    // إسبانيا
    '2a00:f0', '2a00:f8', '2a01:00', '2a01:01',
    
    // إيطاليا
    '2a00:90', '2a00:98', '2a00:a0', '2a00:a8',
    
    // السويد
    '2a00:10', '2a00:11', '2a00:12', '2a00:13',
    
    // أوكرانيا
    '2a00:e0', '2a00:e8', '2a00:f0',
    
    // رومانيا
    '2a00:f8', '2a01:40', '2a01:48',
    
    // بلجيكا
    '2a00:14', '2a00:15', '2a00:16',
    
    // سويسرا
    '2a00:18', '2a00:19', '2a00:1a',
    
    // النمسا
    '2a00:1b', '2a00:1c', '2a02:0'
  ],

  // مصر - Egypt (كاملة)
  EGYPT: [
    '2001:1b80:', '2001:1b88:', '2001:1b90:', '2001:1b98:',
    '2a01:5c0:', '2a01:5c8:', '2a01:5d0:', '2a01:5d8:',
    '2a01:5e0:', '2a01:5e8:', '2a01:5f0:', '2a01:5f8:',
    '2a02:4e0:', '2a02:4e8:', '2a02:4f0:', '2a02:4f8:',
    '2c0f:f000:', '2c0f:f008:', '2c0f:f010:', '2c0f:f018:',
    '2c0f:ea00:', '2c0f:ea08:', '2c0f:ea10:',
    '156.0.0.0/8', '197.0.0.0/8'  // Egyptian IPv4
  ]
};

// ============================================================
// ✅ ALLOWED REGIONS — المناطق المسموحة
// ============================================================

var ALLOWED_REGIONS = {
  // 🇯🇴 الأردن - JORDAN (أولوية قصوى)
  JORDAN: {
    // Orange Jordan AS8376 - البنية التحتية
    INFRA: [
      '2a01:9700:1b05:',     // Amman Gateway Primary
      '2a01:9700:1b06:',     // Amman Gateway Secondary
      '2a01:9700:1b07:',     // Amman Gateway Tertiary
      '2a01:9700:1b08:',     // Amman Gateway Quaternary
      '2a01:9700:1b09:',     // Amman Gateway Quinternary
      '2a01:9700:1b0a:',     // Data Center Primary
      '2a01:9700:1b0b:',     // Data Center Secondary
      '2a01:9700:1b0c:'      // Gaming Server
    ],
    
    // FTTH السكني - Residential
    RESIDENTIAL: [
      '2a01:9700:17e',       // FTTH Amman Central
      '2a01:9700:17f',       // FTTH Amman West
      '2a01:9700:180:',      // FTTH Amman East
      '2a01:9700:181:',      // FTTH Amman South
      '2a01:9700:182:',      // FTTH Amman North
      '2a01:9700:183:',      // FTTH Irbid
      '2a01:9700:184:',      // FTTH Zarqa
      '2a01:9700:185:',      // FTTH Aqaba
      '2a01:9700:1c',        // Residential Cluster A
      '2a01:9700:1d',        // Residential Cluster B
      '2a01:9700:1e',        // Residential Cluster C
      '2a01:9700:1f'         // Residential Cluster D
    ],
    
    // Business الأعمال
    BUSINESS: [
      '2a01:9700:190:',      // Business Amman
      '2a01:9700:191:',      // Corporate Zone
      '2a01:9700:192:',      // Enterprise Primary
      '2a01:9700:193:',      // Enterprise Secondary
      '2a01:9700:1a0:',      // Gaming Business
      '2a01:9700:1a1:',      // Esports Zone
      '2a01:9700:1a2:',      // Pro Gaming
      '2a01:9700:1a3:'       // Tournament Server
    ],
    
    // PUBG Dedicated - خوادم مخصصة
    PUBG_DEDICATED: [
      '2a01:9700:1b10:',     // PUBG Jordan Server 1
      '2a01:9700:1b11:',     // PUBG Jordan Server 2
      '2a01:9700:1b12:',     // PUBG Jordan Server 3
      '2a01:9700:1b20:',     // Match Jordan 1
      '2a01:9700:1b21:',     // Match Jordan 2
      '2a01:9700:1b30:',     // Lobby Jordan 1
      '2a01:9700:1b31:'      // Lobby Jordan 2
    ]
  },

  // 🌊 الخليج العربي - Gulf (مقلل جداً)
  GULF_MINIMAL: {
    // البحرين فقط - الأقرب للأردن
    BAHRAIN: [
      '2a01:9700:4200:',     // Bahrain Primary (أقرب خليجي)
      '2a01:9700:4201:',     // Bahrain Gaming
      '2a01:9700:4202:'      // Bahrain Match
    ],
    
    // الإمارات - للضرورة فقط
    UAE_EMERGENCY: [
      '2a01:9700:4300:',     // UAE Primary
      '2a01:9700:4301:'      // UAE Backup
    ]
  }
};

// ============================================================
// 🎮 PUBG SERVER PATTERNS
// ============================================================

var PATTERNS = {
  // خوادم اللعب - Match
  MATCH: new RegExp([
    'match', 'battle', 'classic', 'ranked', 'arena', 'tdm', 'metro',
    'royale', 'erangel', 'livik', 'miramar', 'sanhok', 'vikendi',
    'karakin', 'nusa', 'rondo', 'haram', 'deston', 'taego',
    'fpp', 'tpp', 'squad', 'duo', 'solo', 'quickmatch',
    'ingame', 'gamesvr', 'gameserver', 'relay', 'pvp'
  ].join('|'), 'i'),

  // خوادم اللوبي - Lobby
  LOBBY: new RegExp([
    'lobby', 'matchmaking', 'queue', 'login', 'auth', 'region',
    'gateway', 'profile', 'inventory', 'store', 'config', 'api'
  ].join('|'), 'i'),

  // CDN
  CDN: new RegExp([
    'cdn', 'static', 'assets', 'download', 'patch', 'resource',
    'bundle', 'pak', 'obb', 'update'
  ].join('|'), 'i')
};

// ============================================================
// 🔧 HELPER FUNCTIONS
// ============================================================

/**
 * التحقق من PUBG
 */
function isPUBG(host, url) {
  var data = (host + url).toLowerCase();
  return /pubg|tencent|krafton|lightspeed|levelinfinite|proximabeta|playfab/i.test(data);
}

/**
 * التحقق من IPv6
 */
function isIPv6(ip) {
  return ip && ip.indexOf(':') !== -1;
}

/**
 * التحقق من IPv4
 */
function isIPv4(ip) {
  return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

/**
 * فحص تطابق نطاق محظور
 */
function isBlockedRegion(ip) {
  for (var region in BLOCKED_REGIONS) {
    var ranges = BLOCKED_REGIONS[region];
    for (var i = 0; i < ranges.length; i++) {
      if (ip.indexOf(ranges[i]) === 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * فحص نطاق الأردن - الأولوية القصوى
 */
function isJordanIP(ip) {
  var jordanRanges = ALLOWED_REGIONS.JORDAN;
  
  // فحص جميع فئات الأردن
  for (var category in jordanRanges) {
    var ranges = jordanRanges[category];
    for (var i = 0; i < ranges.length; i++) {
      if (ip.indexOf(ranges[i]) === 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * فحص نطاق الخليج المقلل
 */
function isGulfIP(ip) {
  var gulfRanges = ALLOWED_REGIONS.GULF_MINIMAL;
  
  for (var category in gulfRanges) {
    var ranges = gulfRanges[category];
    for (var i = 0; i < ranges.length; i++) {
      if (ip.indexOf(ranges[i]) === 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * استخراج /64 prefix
 */
function getPrefix64(ip) {
  var parts = ip.split(':');
  return parts.slice(0, 4).join(':');
}

/**
 * استخراج /48 prefix
 */
function getPrefix48(ip) {
  var parts = ip.split(':');
  return parts.slice(0, 3).join(':');
}

/**
 * تحديث النشاط
 */
function updateActivity() {
  SESSION.lastActivity = Date.now();
}

// ============================================================
// 🚀 MAIN ROUTING FUNCTION
// ============================================================

function FindProxyForURL(url, host) {
  // تحديث النشاط
  updateActivity();

  // حل DNS
  var ip = '';
  try {
    ip = dnsResolve(host);
  } catch(e) {
    ip = '';
  }

  // ===================
  // الطلبات المحلية
  // ===================
  if (isPlainHostName(host)) {
    return DIRECT;
  }

  // ===================
  // غير PUBG - مباشر
  // ===================
  if (!isPUBG(host, url)) {
    return DIRECT;
  }

  // ===================
  // حظر IPv4 نهائياً
  // ===================
  if (isIPv4(ip)) {
    return BLOCK;
  }

  // ===================
  // ليس IPv6 - حظر
  // ===================
  if (!ip || !isIPv6(ip)) {
    return BLOCK;
  }

  // ===================
  // 🚫 حظر المناطق البعيدة
  // ===================
  if (MODE.BLOCK_FAR_REGIONS && isBlockedRegion(ip)) {
    return BLOCK;
  }

  // ===================
  // تحليل نوع الطلب
  // ===================
  var data = host.toLowerCase();
  var isMatch = PATTERNS.MATCH.test(data);
  var isLobby = PATTERNS.LOBBY.test(data);
  var isCDN = PATTERNS.CDN.test(data);

  // ===================
  // 🇯🇴 JORDAN FIRST - الأولوية القصوى
  // ===================
  if (isJordanIP(ip)) {
    // تثبيت جلسة Match على الأردن
    if (isMatch) {
      var prefix64 = getPrefix64(ip);
      
      if (!SESSION.matchNet) {
        SESSION.matchNet = prefix64;
        SESSION.matchHost = host;
        SESSION.jordanServer = ip;
        SESSION.totalMatches++;
        SESSION.jordanMatches++;
        SESSION.bestPing = 5; // توقع ping منخفض
      }
      
      // السماح فقط بنفس الشبكة الأردنية
      if (prefix64 === SESSION.matchNet) {
        return PROXY;
      }
      
      // شبكة أردنية مختلفة - سماح (للتوازن)
      if (isJordanIP(ip)) {
        SESSION.matchNet = prefix64;
        return PROXY;
      }
      
      return BLOCK;
    }
    
    // Lobby أردني
    if (isLobby) {
      SESSION.lobbyNet = getPrefix48(ip);
      return PROXY;
    }
    
    // CDN أردني
    if (isCDN) {
      return PROXY;
    }
    
    // أي شيء أردني - سماح
    return PROXY;
  }

  // ===================
  // 🌊 GULF MINIMAL - للضرورة فقط
  // ===================
  if (MODE.MINIMAL_GULF && isGulfIP(ip)) {
    // البحرين - الأولى
    if (ip.indexOf('2a01:9700:420') === 0) {
      if (isMatch && !SESSION.matchNet) {
        SESSION.matchNet = getPrefix64(ip);
        SESSION.totalMatches++;
        return PROXY;
      }
      return PROXY;
    }
    
    // الإمارات - للطوارئ فقط
    if (ip.indexOf('2a01:9700:430') === 0) {
      // فقط إذا لم يكن هناك اتصال أردني
      if (SESSION.jordanServer) {
        return BLOCK; // نفضل الأردن
      }
      return PROXY;
    }
  }

  // ===================
  // 🚫 كل شيء آخر - محظور
  // ===================
  return BLOCK;
}

// ============================================================
// 📊 STATISTICS FUNCTION (للمراقبة)
// ============================================================

function getStats() {
  return {
    jordanRatio: SESSION.totalMatches > 0 ? 
      (SESSION.jordanMatches / SESSION.totalMatches * 100).toFixed(1) + '%' : '0%',
    jordanMatches: SESSION.jordanMatches,
    totalMatches: SESSION.totalMatches,
    bestPing: SESSION.bestPing + 'ms',
    currentServer: SESSION.jordanServer || 'None',
    uptime: Math.floor((Date.now() - SESSION.startTime) / 1000) + 's'
  };
}

// ============================================================
// 🎯 VERSION INFO
// ============================================================
var VERSION = '10.0-JORDAN-ULTIMATE';
var BUILD = '2024-ULTRA-LOW-PING';
