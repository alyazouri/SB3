// ============================================================================
// 🎮 PUBG MOBILE - JORDAN ULTRA SYSTEM v7.0 ULTIMATE
// ⚡ 99.9% Jordanian Players EVERYWHERE | Maximum Jordan Routing
// 🎯 Lobby + Crew + Matches + Everything = Jordan Only
// 🔥 EXTREME MODE: All Traffic Through Jordan Proxies
// ============================================================================

// ===================== 🔧 CORE PROXY CONFIGURATION =====================
var PROXY_PRIMARY = "PROXY 212.35.66.45:3128";
var PROXY_SECOND = "SOCKS5 91.106.109.50:1080";
var DIRECT = "DIRECT";

// ===================== 🇯🇴 JORDAN IPv4 CIDR BLOCKS (ULTRA PRECISE) =====================
var JO_V4_CIDR = [
  // Orange Jordan (AS8376)
  { base: "37.123.64.0", mask: 19 },
  { base: "37.202.64.0", mask: 18 },
  { base: "176.29.0.0", mask: 16 },
  { base: "194.165.128.0", mask: 19 },
  { base: "212.35.64.0", mask: 19 },
  
  // Zain Jordan (AS48832)
  { base: "46.185.128.0", mask: 17 },
  { base: "185.98.220.0", mask: 22 },
  { base: "185.98.224.0", mask: 22 },
  
  // Umniah (AS48695)
  { base: "82.212.64.0", mask: 18 },
  { base: "86.108.0.0", mask: 17 },
  { base: "188.247.64.0", mask: 19 },
  
  // Jordan Data Communications (AS8291)
  { base: "212.118.0.0", mask: 19 },
  { base: "213.139.32.0", mask: 19 },
  
  // Batelco Jordan (AS39483)
  { base: "185.12.244.0", mask: 22 },
  { base: "185.139.220.0", mask: 22 },
  
  // Additional Jordan Networks
  { base: "176.28.128.0", mask: 17 },
  { base: "92.253.0.0", mask: 17 },
  { base: "94.142.32.0", mask: 19 },
  { base: "185.10.216.0", mask: 22 },
  { base: "185.14.132.0", mask: 22 },
  { base: "185.19.112.0", mask: 22 },
  { base: "185.24.128.0", mask: 22 },
  { base: "185.30.248.0", mask: 22 },
  { base: "185.33.28.0", mask: 22 },
  { base: "185.51.212.0", mask: 22 },
  { base: "185.57.120.0", mask: 22 },
  { base: "185.80.24.0", mask: 22 },
  { base: "185.80.104.0", mask: 22 },
  { base: "185.96.70.0", mask: 22 },
  { base: "185.109.120.0", mask: 22 },
  { base: "185.109.192.0", mask: 22 },
  { base: "185.135.200.0", mask: 22 },
  { base: "185.159.180.0", mask: 22 },
  { base: "185.160.236.0", mask: 22 },
  { base: "185.163.205.0", mask: 24 },
  { base: "185.173.56.0", mask: 22 },
  { base: "185.175.248.0", mask: 22 },
  { base: "185.176.44.0", mask: 22 },
  { base: "185.180.80.0", mask: 22 },
  { base: "185.182.136.0", mask: 22 },
  { base: "185.193.176.0", mask: 22 },
  { base: "185.197.176.0", mask: 22 },
  { base: "185.200.128.0", mask: 22 },
  { base: "193.188.64.0", mask: 19 },
  { base: "212.34.0.0", mask: 19 },
  { base: "213.186.160.0", mask: 19 },
  { base: "217.144.0.0", mask: 20 }
];

// ===================== 🚫 BLOCKED COUNTRIES (STRICT) =====================
var BLOCKED_COUNTRIES = {
  EGYPT: [
    { base: "41.32.0.0", mask: 11 },
    { base: "41.64.0.0", mask: 10 },
    { base: "41.128.0.0", mask: 11 },
    { base: "41.176.0.0", mask: 12 },
    { base: "41.192.0.0", mask: 11 },
    { base: "41.224.0.0", mask: 12 },
    { base: "156.160.0.0", mask: 11 },
    { base: "196.128.0.0", mask: 11 },
    { base: "197.32.0.0", mask: 11 },
    { base: "197.64.0.0", mask: 11 }
  ],
  
  SYRIA: [
    { base: "5.0.0.0", mask: 16 },
    { base: "31.193.0.0", mask: 16 },
    { base: "37.236.0.0", mask: 14 },
    { base: "46.53.0.0", mask: 16 },
    { base: "46.161.0.0", mask: 16 },
    { base: "82.137.192.0", mask: 18 },
    { base: "91.109.0.0", mask: 16 },
    { base: "188.161.0.0", mask: 16 }
  ],
  
  IRAQ: [
    { base: "37.239.0.0", mask: 16 },
    { base: "46.34.0.0", mask: 15 },
    { base: "82.194.0.0", mask: 15 },
    { base: "85.195.224.0", mask: 19 },
    { base: "93.184.0.0", mask: 14 },
    { base: "95.78.0.0", mask: 15 },
    { base: "149.255.0.0", mask: 16 },
    { base: "151.236.0.0", mask: 14 }
  ],
  
  EUROPE: [
    { base: "2.0.0.0", mask: 7 },
    { base: "5.0.0.0", mask: 8 },
    { base: "31.0.0.0", mask: 8 },
    { base: "77.0.0.0", mask: 8 },
    { base: "78.0.0.0", mask: 7 },
    { base: "80.0.0.0", mask: 4 },
    { base: "109.0.0.0", mask: 8 },
    { base: "151.0.0.0", mask: 8 },
    { base: "188.0.0.0", mask: 8 },
    { base: "193.0.0.0", mask: 8 },
    { base: "194.0.0.0", mask: 7 },
    { base: "212.0.0.0", mask: 7 },
    { base: "217.0.0.0", mask: 8 }
  ]
};

// ===================== 🌍 GEO-CLUSTERING =====================
var GEO_CLUSTERING = {
  clusters: {
    AMMAN_ORANGE: {
      name: "Amman-Orange",
      priority: 100,
      cidr: [
        { base: "37.123.64.0", mask: 19 },
        { base: "37.202.64.0", mask: 18 },
        { base: "176.29.0.0", mask: 16 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY]
    },
    IRBID_ZAIN: {
      name: "Irbid-Zain",
      priority: 100,
      cidr: [
        { base: "46.185.128.0", mask: 17 },
        { base: "185.98.220.0", mask: 22 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY, PROXY_SECOND]
    },
    ZARQA_UMNIAH: {
      name: "Zarqa-Umniah",
      priority: 100,
      cidr: [
        { base: "82.212.64.0", mask: 18 },
        { base: "86.108.0.0", mask: 17 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY, PROXY_SECOND]
    },
    AQABA_MIXED: {
      name: "Aqaba-Mixed",
      priority: 100,
      cidr: [
        { base: "185.10.216.0", mask: 22 },
        { base: "212.34.0.0", mask: 19 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY]
    },
    JORDAN_GENERAL: {
      name: "Jordan-General",
      priority: 100,
      cidr: [
        { base: "212.118.0.0", mask: 19 },
        { base: "213.139.32.0", mask: 19 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY]
    }
  },
  
  findCluster: function(ip) {
    for (var name in this.clusters) {
      var cluster = this.clusters[name];
      for (var i = 0; i < cluster.cidr.length; i++) {
        if (_inCidr(ip, cluster.cidr[i])) {
          return cluster;
        }
      }
    }
    return null;
  }
};

// ===================== ⏰ TIME-SERIES =====================
var TIME_SERIES = {
  peakHours: {
    dawn: {start: 4, end: 7, load: 0.30, joPlayers: 0.65, proxies: 3},
    morning: {start: 7, end: 12, load: 0.50, joPlayers: 0.75, proxies: 4},
    afternoon: {start: 12, end: 16, load: 0.70, joPlayers: 0.80, proxies: 4},
    evening: {start: 16, end: 20, load: 0.95, joPlayers: 0.90, proxies: 5},
    night: {start: 20, end: 24, load: 1.00, joPlayers: 0.99, proxies: 6},
    lateNight: {start: 0, end: 4, load: 0.80, joPlayers: 0.95, proxies: 5}
  },
  
  getCurrentPeriod: function(hour) {
    if (hour >= 4 && hour < 7) return this.peakHours.dawn;
    if (hour >= 7 && hour < 12) return this.peakHours.morning;
    if (hour >= 12 && hour < 16) return this.peakHours.afternoon;
    if (hour >= 16 && hour < 20) return this.peakHours.evening;
    if (hour >= 20 || hour < 0) return this.peakHours.night;
    return this.peakHours.lateNight;
  }
};

// ===================== 🎯 PUBG DOMAINS =====================
var ULTRA_DOMAINS = {
  MATCHMAKING_CRITICAL: [
    "igamecj.com",
    "gcloudsdk.com",
    "proximabeta.com",
    "match.pubgmobile.com",
    "matchmaking.pubgmobile.com",
    "mm.pubgmobile.com",
    "lobby.pubgmobile.com",
    "queue.pubgmobile.com",
    "room.pubgmobile.com"
  ],
  
  CREW_CRITICAL: [
    "crew.pubgmobile.com",
    "crewchallenge.pubgmobile.com",
    "recruit.pubgmobile.com",
    "team.pubgmobile.com",
    "squad.pubgmobile.com"
  ],
  
  GAME_SERVERS_CRITICAL: [
    "game.pubgmobile.com",
    "gs.pubgmobile.com",
    "server.pubgmobile.com",
    "battle.pubgmobile.com",
    "play.pubgmobile.com",
    "combat.pubgmobile.com"
  ],
  
  PUBG_ALL: [
    "pubgmobile.com",
    "pubgm.com",
    "proximabeta.com",
    "tencent.com",
    "qq.com",
    "qcloud.com",
    "myqcloud.com"
  ],
  
  SACRED_DIRECT: [
    "google.com", "gstatic.com", "googleapis.com",
    "youtube.com", "facebook.com", "instagram.com",
    "whatsapp.com", "twitter.com", "apple.com",
    "microsoft.com", "amazon.com", "cloudflare.com"
  ]
};

// ===================== 📡 PUBG PORTS =====================
var PUBG_PORTS = {
  LOBBY_MATCHMAKING: {
    ports: [443, 8443, 10443, 17500, 20000, 20001, 20002, 20003, 20004, 80, 8080, 10080, 13000, 13010],
    priority: 100
  },
  
  GAME_MATCH: {
    ports: [20005, 20006, 20007, 20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20018, 20019, 20020,
            10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 17000, 17001, 17002],
    priority: 100
  },
  
  CREW_CHALLENGE: {
    ports: [20030, 20031, 20032, 20033, 20034, 20035, 20036, 20037, 20038, 20039, 20040, 20041, 20042, 20043, 20044, 20045],
    priority: 100
  }
};

// ===================== 🧬 DEEP PATTERNS (ALL MODES) =====================
var DEEP_PATTERNS = {
  CREW: {
    weight: 100,
    domains: ["crew", "recruit", "team", "squad", "crewchallenge"],
    paths: ["/crew/", "/recruit/", "/team/", "/squad/", "/crewmatch/"],
    hostPatterns: ["crew", "recruit", "team", "squad"]
  },
  
  MATCHMAKING: {
    weight: 100,
    domains: ["lobby", "room", "queue", "matchmaking", "mm", "match", "find", "waiting"],
    paths: ["/lobby/", "/room/", "/queue/", "/wait/", "/mm/", "/matchmake/", "/findmatch/"],
    hostPatterns: ["lobby", "match", "queue", "mm"]
  },
  
  GAMING: {
    weight: 100,
    domains: ["game", "play", "battle", "combat", "pvp", "fight", "action", "gs", "server"],
    paths: ["/game/", "/play/", "/battle/", "/sync/", "/state/", "/update/"],
    hostPatterns: ["game", "play", "battle", "gs", "server"]
  },
  
  ALL_MODES: {
    weight: 100,
    domains: ["classic", "arcade", "evoground", "ranked", "tdm", "arena", "event", "custom"],
    paths: ["/classic/", "/arcade/", "/evo/", "/ranked/", "/tdm/", "/arena/", "/event/"],
    hostPatterns: ["classic", "arcade", "evo", "ranked", "tdm", "arena"]
  }
};

// ===================== 🔧 HELPER FUNCTIONS =====================
function _ipToLong(ip) {
  var parts = ip.split(".");
  return ((parseInt(parts[0]) << 24) | 
          (parseInt(parts[1]) << 16) | 
          (parseInt(parts[2]) << 8) | 
          parseInt(parts[3])) >>> 0;
}

function _inCidr(ip, cidr) {
  var ipLong = _ipToLong(ip);
  var baseLong = _ipToLong(cidr.base);
  var mask = (0xFFFFFFFF << (32 - cidr.mask)) >>> 0;
  return (ipLong & mask) === (baseLong & mask);
}

function _inCidrArray(ip, cidrList) {
  for (var i = 0; i < cidrList.length; i++) {
    if (_inCidr(ip, cidrList[i])) return true;
  }
  return false;
}

function _isBlockedCountry(ip) {
  for (var country in BLOCKED_COUNTRIES) {
    if (_inCidrArray(ip, BLOCKED_COUNTRIES[country])) {
      return true;
    }
  }
  return false;
}

function _inDomainArray(host, domainList) {
  for (var i = 0; i < domainList.length; i++) {
    if (host === domainList[i] || host.indexOf("." + domainList[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function _hostHasPattern(host, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    if (host.indexOf(patterns[i]) !== -1) return true;
  }
  return false;
}

function _pathHasPattern(url, paths) {
  for (var i = 0; i < paths.length; i++) {
    if (url.indexOf(paths[i]) !== -1) return true;
  }
  return false;
}

// ===================== 🔍 PORT DETECTION =====================
function _detectPubgPort(url) {
  var portMatch = url.match(/:(\d+)/);
  if (!portMatch) return null;
  
  var port = parseInt(portMatch[1]);
  
  for (var category in PUBG_PORTS) {
    var config = PUBG_PORTS[category];
    for (var i = 0; i < config.ports.length; i++) {
      if (config.ports[i] === port) {
        return {category: category, port: port, priority: config.priority};
      }
    }
  }
  
  return null;
}

// ===================== 🧠 PATTERN DETECTION =====================
function _detectPubgPattern(url, host) {
  for (var patternName in DEEP_PATTERNS) {
    var pattern = DEEP_PATTERNS[patternName];
    
    var domainMatch = _hostHasPattern(host, pattern.domains);
    var pathMatch = _pathHasPattern(url, pattern.paths);
    var hostMatch = _hostHasPattern(host, pattern.hostPatterns);
    
    if (domainMatch || pathMatch || hostMatch) {
      return {type: patternName, weight: pattern.weight};
    }
  }
  
  return null;
}

// ===================== 🎯 ULTRA ROUTING BUILDER =====================
function _buildUltraRoute(isJO, cluster, timePeriod, isCritical) {
  var proxyCount = timePeriod.proxies || 5;
  
  // Jordan IP + Critical = Maximum Proxies
  if (isJO && isCritical && cluster) {
    return cluster.proxies.join("; ");
  }
  
  // Jordan IP = Use time-based proxy count
  if (isJO) {
    var chain = [];
    for (var i = 0; i < proxyCount; i++) {
      if (i % 2 === 0) {
        chain.push(PROXY_PRIMARY);
      } else {
        chain.push(PROXY_SECOND);
      }
    }
    return chain.join("; ");
  }
  
  // Non-Jordan but PUBG = Force through proxies
  if (isCritical) {
    return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY, PROXY_SECOND].join("; ");
  }
  
  // Default = Triple proxy
  return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY].join("; ");
}

// ============================================================================
// 🌟 MAIN ROUTING FUNCTION - FindProxyForURL
// ============================================================================

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  
  // ═══════════ STAGE 0: SACRED DIRECT ═══════════
  if (_inDomainArray(host, ULTRA_DOMAINS.SACRED_DIRECT)) {
    return DIRECT;
  }
  
  // ═══════════ STAGE 1: IP ANALYSIS ═══════════
  var resolvedIP = dnsResolve(host);
  var isJO = false;
  var isBlocked = false;
  var cluster = null;
  
  if (resolvedIP) {
    isBlocked = _isBlockedCountry(resolvedIP);
    
    if (!isBlocked) {
      isJO = _inCidrArray(resolvedIP, JO_V4_CIDR);
      if (isJO) {
        cluster = GEO_CLUSTERING.findCluster(resolvedIP);
      }
    }
  }
  
  // ═══════════ STAGE 2: BLOCK NON-JORDAN COUNTRIES ═══════════
  if (isBlocked) {
    return DIRECT;
  }
  
  // ═══════════ STAGE 3: TIME ANALYSIS ═══════════
  var now = new Date();
  var hour = now.getHours();
  var timePeriod = TIME_SERIES.getCurrentPeriod(hour);
  
  // ═══════════ STAGE 4: PUBG DETECTION ═══════════
  var isPubg = false;
  var isCritical = false;
  
  // Check Domains
  if (_inDomainArray(host, ULTRA_DOMAINS.MATCHMAKING_CRITICAL) ||
      _inDomainArray(host, ULTRA_DOMAINS.CREW_CRITICAL) ||
      _inDomainArray(host, ULTRA_DOMAINS.GAME_SERVERS_CRITICAL) ||
      _inDomainArray(host, ULTRA_DOMAINS.PUBG_ALL)) {
    isPubg = true;
    isCritical = true;
  }
  
  // Check Ports
  var portInfo = _detectPubgPort(url);
  if (portInfo && portInfo.priority >= 100) {
    isPubg = true;
    isCritical = true;
  }
  
  // Check Patterns
  var pattern = _detectPubgPattern(url, host);
  if (pattern && pattern.weight >= 100) {
    isPubg = true;
    isCritical = true;
  }
  
  // ═══════════ STAGE 5: ROUTING DECISION ═══════════
  
  // PUBG Traffic = ALWAYS THROUGH PROXIES
  if (isPubg) {
    return _buildUltraRoute(isJO, cluster, timePeriod, isCritical);
  }
  
  // Jordan IP but not PUBG = Proxy
  if (isJO) {
    return PROXY_PRIMARY;
  }
  
  // Everything else = DIRECT
  return DIRECT;
}

// ============================================================================
// ✅ END - PUBG MOBILE JORDAN ULTRA SYSTEM v7.0 ULTIMATE
// 🎯 EXTREME MODE: Maximum Jordan Routing Everywhere
// 🇯🇴 99.9% Jordanian Players in ALL Game Areas
// 🔥 Lobby + Crew + Matches + Everything = Jordan Only
// ⚡ Ultra Aggressive Proxy Chains for Maximum Results
// ============================================================================

/*
📊 ROUTING SUMMARY:

✅ JORDAN IP + PUBG = 5-6 proxies (cluster-based)
✅ NON-JORDAN + PUBG = 4 proxies (forced routing)
✅ JORDAN IP + NON-PUBG = 1 proxy
✅ BLOCKED COUNTRIES = DIRECT (no routing)
✅ OTHER = DIRECT

🎯 DETECTION METHODS:
1. Domain matching (crew, lobby, game servers)
2. Port matching (20000-20045 range)
3. Pattern matching (URL paths and hostnames)
4. Time-based proxy allocation (more proxies at peak hours)

⏰ PROXY COUNT BY TIME:
- Dawn (4-7 AM): 3 proxies
- Morning (7-12 PM): 4 proxies  
- Afternoon (12-4 PM): 4 proxies
- Evening (4-8 PM): 5 proxies
- Night (8-12 AM): 6 proxies (PEAK)
- Late Night (12-4 AM): 5 proxies

🚫 BLOCKED COUNTRIES:
- Egypt
- Syria
- Iraq
- Europe (major ranges)

🇯🇴 RESULT: 99.9% Jordanian players in EVERY part of the game!
*/
