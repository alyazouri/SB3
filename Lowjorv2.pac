// ============================================================
// PUBG JORDAN PAC SCRIPT - ENHANCED v2.0
// Jordan IPv4 + IPv6 Lock | Lobby(4) | Match(5)
// ISPs: Orange JO, Zain JO, Umniah, Jordan Telecom (JT)
// Fixes: false blocks, session drops, ISP coverage
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

var SESSION = {
  lobby:   null,
  match:   null,
  active:  false,
  lastSeen: 0
};

// Session timeout = 10 minutes (in ms)
var SESSION_TIMEOUT = 600000;

// ================= IPv6 CHECK =================

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

// ================= EXPAND IPv6 =================

function expandIPv6(address){
  if(!address || address.indexOf(":") === -1)
    return address;

  var parts = address.split("::");
  var full  = [];

  if(parts.length === 2){
    var left    = parts[0] ? parts[0].split(":") : [];
    var right   = parts[1] ? parts[1].split(":") : [];
    var missing = 8 - (left.length + right.length);
    full = left;
    for(var i = 0; i < missing; i++) full.push("0000");
    full = full.concat(right);
  } else {
    full = address.split(":");
  }

  for(var j = 0; j < full.length; j++){
    while(full[j].length < 4)
      full[j] = "0" + full[j];
  }

  return full.join(":").toLowerCase();
}

// ================= JORDAN IPv4 CHECK =================
// Covers: Orange JO, Zain, Umniah, Jordan Telecom, VTEL, Batelco JO

function isJordanIPv4(ip){
  // Convert IP string to comparable number for range checks
  var p = ip.split(".");
  if(p.length !== 4) return false;
  var a = parseInt(p[0]);
  var b = parseInt(p[1]);
  var c = parseInt(p[2]);

  // Orange Jordan / Jordan Telecom (JT)
  // 194.126.16.0/20 - 194.126.31.x
  if(a===194 && b===126 && c>=16 && c<=31) return true;
  // 82.212.0.0/15
  if(a===82 && b>=212 && b<=213) return true;
  // 62.240.96.0/19
  if(a===62 && b===240 && c>=96 && c<=127) return true;
  // 176.94.0.0/15
  if(a===176 && (b===94 || b===95)) return true;
  // 31.9.0.0/16
  if(a===31 && b===9) return true;
  // 188.247.128.0/17
  if(a===188 && b===247 && c>=128) return true;

  // Zain Jordan
  // 91.187.0.0/16
  if(a===91 && b===187) return true;
  // 37.98.0.0/16
  if(a===37 && b===98) return true;
  // 195.229.24.0/21
  if(a===195 && b===229 && c>=24 && c<=31) return true;
  // 212.118.128.0/17
  if(a===212 && b===118 && c>=128) return true;

  // Umniah
  // 46.185.128.0/17
  if(a===46 && b===185 && c>=128) return true;
  // 46.36.192.0/18
  if(a===46 && b===36 && c>=192) return true;
  // 77.246.176.0/20
  if(a===77 && b===246 && c>=176 && c<=191) return true;

  // VTEL / Other JO ISPs
  // 89.47.64.0/18
  if(a===89 && b===47 && c>=64 && c<=127) return true;
  // 109.224.0.0/12 (RIPE allocated JO)
  if(a===109 && b>=224 && b<=239) return true;
  // 178.20.64.0/18
  if(a===178 && b===20 && c>=64 && c<=127) return true;
  // 185.28.196.0/22
  if(a===185 && b===28 && c>=196 && c<=199) return true;
  // 185.41.208.0/22
  if(a===185 && b===41 && c>=208 && c<=211) return true;

  return false;
}

// ================= JORDAN IPv6 PREFIXES =================
// Expanded with additional RIPE allocations for JO ISPs

function isJordanIPv6(ip){
  return (
    // Orange Jordan
    ip.startsWith("2a01:9700:") ||
    ip.startsWith("2a01:e240:") ||
    ip.startsWith("2a01:ee40:") ||

    // Jordan Telecom (JT)
    ip.startsWith("2001:32c0:") ||
    ip.startsWith("2a03:6b00:") ||
    ip.startsWith("2a04:6200:") ||

    // Zain Jordan
    ip.startsWith("2a02:c040:") ||
    ip.startsWith("2a05:7500:") ||
    ip.startsWith("2a05:74c0:") ||

    // Umniah
    ip.startsWith("2a02:2558:") ||
    ip.startsWith("2a06:9bc0:") ||
    ip.startsWith("2a06:bd80:") ||

    // VTEL / other JO allocations
    ip.startsWith("2a02:09c0:") ||
    ip.startsWith("2a02:9c0:")  ||   // short form fallback
    ip.startsWith("2a07:2c40:") ||
    ip.startsWith("2a09:5ac0:") ||
    ip.startsWith("2a0d:5600:")
  );
}

// ================= JORDAN IP (IPv4 or IPv6) =================

function isJordanIP(ip, fullIP){
  if(isIPv6(ip)){
    return isJordanIPv6(fullIP);
  }
  return isJordanIPv4(ip);
}

// ================= REGION BLOCK (IPv6 non-JO) =================
// Block clearly non-Jordan IPv6 ranges (Asian, European, etc.)

function isBlockedIPv6(ip){
  if(isJordanIPv6(ip)) return false;
  return (
    ip.startsWith("240")  ||   // APNIC Asia
    ip.startsWith("241")  ||
    ip.startsWith("242")  ||
    ip.startsWith("260")  ||   // ARIN North America
    ip.startsWith("280")  ||
    ip.startsWith("2c")   ||   // LACNIC / AFRINIC
    ip.startsWith("2001:0db8:") // Documentation range (never real)
  );
}

// ================= PUBG HOST DETECTION =================

function isPUBG(host){
  host = host.toLowerCase();
  return (
    host.indexOf("pubg")          !== -1 ||
    host.indexOf("tencent")       !== -1 ||
    host.indexOf("krafton")       !== -1 ||
    host.indexOf("levelinfinite") !== -1 ||
    host.indexOf("lightspeed")    !== -1 ||
    host.indexOf("proxima")       !== -1 ||  // PUBG mobile relay nodes
    host.indexOf("bgp.game")      !== -1 ||  // CDN used by PUBG Mobile
    host.indexOf("myqcloud")      !== -1 ||  // Tencent Cloud
    host.indexOf("intlgame")      !== -1
  );
}

// ================= LOBBY DETECTION =================

function isLobby(data){
  return /lobby|login|auth|session|gateway|queue|profile|inventory|store|shop|event|mission|friends|party|team|settings|patch|update|cdn|download|announce|config|dispatch|account|register/i
    .test(data);
}

// ================= MATCH DETECTION =================

function isMatch(data){
  return /match|battle|classic|ranked|arena|tdm|royale|war|payload|metro|zombie|gamesvr|relay|combat|survival|spectate|ingame|room|svr[0-9]|gs[0-9]/i
    .test(data);
}

// ================= SEGMENTS =================

function getNet4(ip){
  if(isIPv6(ip)){
    return ip.split(":").slice(0,3).join(":");
  }
  // For IPv4: lock on /24 (first 3 octets)
  return ip.split(".").slice(0,3).join(".");
}

function getNet5(ip){
  if(isIPv6(ip)){
    return ip.split(":").slice(0,4).join(":");
  }
  // For IPv4: lock on /24 same as lobby (IPv4 servers don't shift mid-match)
  return ip.split(".").slice(0,3).join(".");
}

// ================= SESSION TIMEOUT CHECK =================

function isSessionExpired(){
  if(!SESSION.active) return true;
  var now = new Date().getTime();
  return (now - SESSION.lastSeen) > SESSION_TIMEOUT;
}

function touchSession(){
  SESSION.lastSeen = new Date().getTime();
}

// ================= MAIN ENGINE =================

function FindProxyForURL(url, host){

  // 1. Local hosts always direct
  if(isPlainHostName(host))
    return DIRECT;

  // 2. Only intercept PUBG traffic
  if(!isPUBG(host))
    return DIRECT;

  // 3. Resolve IP
  var ip = "";
  try{ ip = dnsResolve(host); }catch(e){ ip = ""; }

  // 4. If DNS fails, allow through proxy (don't block on DNS failure)
  if(!ip)
    return PROXY;

  var fullIP = ip;
  if(isIPv6(ip))
    fullIP = expandIPv6(ip);

  // 5. Block clearly non-Jordan IPv6
  if(isIPv6(ip) && isBlockedIPv6(fullIP))
    return BLOCK;

  // 6. Check if Jordan IP
  var isJO = isJordanIP(ip, fullIP);

  // 7. Non-Jordan IPs: block (with safety fallback for unresolved CDN)
  if(!isJO){
    // If host looks like a CDN/patch server, allow direct to avoid breaking launcher
    if(/cdn|patch|dl\.|download|static|assets/i.test(host))
      return DIRECT;
    return BLOCK;
  }

  // 8. Classify traffic type
  var data  = (host + url).toLowerCase();
  var lobby = isLobby(data);
  var match = isMatch(data);

  var net4 = getNet4(fullIP);
  var net5 = getNet5(fullIP);

  // 9. Session expiry reset
  if(SESSION.active && isSessionExpired()){
    SESSION.match  = null;
    SESSION.active = false;
  }

  // 10. End match session when non-match traffic appears after active session
  if(!match && SESSION.active){
    // Only reset if lobby traffic detected (graceful end)
    if(lobby){
      SESSION.match  = null;
      SESSION.active = false;
    }
  }

  // 11. Lobby handling - lock to /24 or first 3 IPv6 segments
  if(lobby){
    if(!SESSION.lobby)
      SESSION.lobby = net4;

    // Allow small ISP re-routing: if lobby IP shifts, update gracefully
    if(net4 !== SESSION.lobby){
      // Check if it's still Jordan (ISP load-balancing)
      if(isJO){
        SESSION.lobby = net4; // update to new segment
      } else {
        return BLOCK;
      }
    }

    touchSession();
    return PROXY;
  }

  // 12. Match handling - lock to /32 or 4 IPv6 segments
  if(match){
    if(!SESSION.match){
      SESSION.match  = net5;
      SESSION.active = true;
      touchSession();
    }

    if(net5 !== SESSION.match){
      // Allow if still Jordan (server migration / relay switch)
      if(isJO){
        SESSION.match = net5; // adapt to relay switch
        touchSession();
      } else {
        return BLOCK;
      }
    }

    touchSession();
    return PROXY;
  }

  // 13. Unknown PUBG traffic from Jordan = allow
  return PROXY;
}
