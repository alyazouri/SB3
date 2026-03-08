// ╔════════════════════════════════════════════════════════════╗
//        PUBG JORDAN LOBBY MAGNET v3
//        iPad Pro PAC Script
//        Jordan Match Bias Engine — MAXIMUM AGGRESSIVE
//        Proxy: SOCKS5 91.106.109.50:1080
//        ⚡ Zero DNS delay — Host pattern only
//        🔒 100% PUBG → Proxy, no exceptions
// ╚════════════════════════════════════════════════════════════╝

var PROXY  = "SOCKS5 91.106.109.50:1080";
var DIRECT = "DIRECT";


// ═══════════════════════════════════════════════════
//  PUBG DOMAIN & HOST RADAR
//  — بدون dnsResolve، pattern فقط، صفر تأخير
// ═══════════════════════════════════════════════════
function isPubg(host) {

    // ── Core PUBG / Tencent domains ──
    if (dnsDomainIs(host, ".pubgmobile.com"))   return true;
    if (dnsDomainIs(host, ".pubg.com"))          return true;
    if (dnsDomainIs(host, ".igamecj.com"))       return true;
    if (dnsDomainIs(host, ".proximabeta.com"))   return true;
    if (dnsDomainIs(host, ".tencent.com"))       return true;
    if (dnsDomainIs(host, ".qcloud.com"))        return true;
    if (dnsDomainIs(host, ".tencentcs.com"))     return true;
    if (dnsDomainIs(host, ".tencent-cloud.net")) return true;

    // ── Gameserver keyword patterns ──
    if (shExpMatch(host, "*gamesvr*"))    return true;
    if (shExpMatch(host, "*gsvr*"))       return true;
    if (shExpMatch(host, "*battle*"))     return true;
    if (shExpMatch(host, "*match*"))      return true;
    if (shExpMatch(host, "*realtime*"))   return true;
    if (shExpMatch(host, "*classic*"))    return true;
    if (shExpMatch(host, "*arena*"))      return true;
    if (shExpMatch(host, "*royale*"))     return true;
    if (shExpMatch(host, "*lobby*"))      return true;
    if (shExpMatch(host, "*login*"))      return true;
    if (shExpMatch(host, "*gateway*"))    return true;
    if (shExpMatch(host, "*session*"))    return true;
    if (shExpMatch(host, "*relay*"))      return true;
    if (shExpMatch(host, "*turn*"))       return true;
    if (shExpMatch(host, "*stun*"))       return true;
    if (shExpMatch(host, "*p2p*"))        return true;
    if (shExpMatch(host, "*udp*"))        return true;
    if (shExpMatch(host, "*game-*"))      return true;
    if (shExpMatch(host, "*-game*"))      return true;
    if (shExpMatch(host, "*pubg*"))       return true;

    // ── Middle East / Jordan regional gateway patterns ──
    if (shExpMatch(host, "*-me-*"))       return true;
    if (shExpMatch(host, "*-jo-*"))       return true;
    if (shExpMatch(host, "*-me.*"))       return true;
    if (shExpMatch(host, "*-jo.*"))       return true;
    if (shExpMatch(host, "*.me.*"))       return true;
    if (shExpMatch(host, "*middleeast*")) return true;
    if (shExpMatch(host, "*jordan*"))     return true;

    return false;
}


// ═══════════════════════════════════════════════════
//  UDP GAME PORTS
//  PAC لا يتحكم بـ UDP مباشرة لكن نغطي HTTP tunnel
// ═══════════════════════════════════════════════════
function isPubgPort(url) {
    if (shExpMatch(url, "*:10010*")) return true;
    if (shExpMatch(url, "*:10011*")) return true;
    if (shExpMatch(url, "*:10012*")) return true;
    if (shExpMatch(url, "*:10013*")) return true;
    if (shExpMatch(url, "*:17000*")) return true;
    if (shExpMatch(url, "*:17500*")) return true;
    if (shExpMatch(url, "*:20000*")) return true;
    if (shExpMatch(url, "*:7000*"))  return true;
    if (shExpMatch(url, "*:443*") && isPubg(url)) return true;
    return false;
}


// ═══════════════════════════════════════════════════
//  JORDAN ISP IPv4 RANGES
//  Zain · Orange · Umniah · JTC · DAMAMAX
// ═══════════════════════════════════════════════════
function isJordanIP(ip) {
    if (!ip) return false;

    // ── Zain Jordan (AS48832) ──
    if (isInNet(ip, "91.106.96.0",   "255.255.224.0")) return true;
    if (isInNet(ip, "91.106.128.0",  "255.255.128.0")) return true;
    if (isInNet(ip, "188.247.0.0",   "255.255.128.0")) return true;
    if (isInNet(ip, "46.32.0.0",     "255.255.192.0")) return true;
    if (isInNet(ip, "94.137.128.0",  "255.255.128.0")) return true;

    // ── Orange Jordan (AS8376) ──
    if (isInNet(ip, "82.212.64.0",   "255.255.224.0")) return true;
    if (isInNet(ip, "82.212.96.0",   "255.255.224.0")) return true;
    if (isInNet(ip, "176.29.0.0",    "255.255.0.0"))   return true;
    if (isInNet(ip, "185.100.64.0",  "255.255.192.0")) return true;
    if (isInNet(ip, "5.21.0.0",      "255.255.0.0"))   return true;

    // ── Umniah (AS9038) ──
    if (isInNet(ip, "213.6.0.0",     "255.255.0.0"))   return true;
    if (isInNet(ip, "212.34.0.0",    "255.255.0.0"))   return true;
    if (isInNet(ip, "85.159.192.0",  "255.255.192.0")) return true;
    if (isInNet(ip, "37.34.0.0",     "255.255.0.0"))   return true;

    // ── Jordan Telecom / JTC (AS8697) ──
    if (isInNet(ip, "37.98.192.0",   "255.255.192.0")) return true;
    if (isInNet(ip, "193.188.0.0",   "255.255.128.0")) return true;
    if (isInNet(ip, "37.205.32.0",   "255.255.224.0")) return true;
    if (isInNet(ip, "62.135.0.0",    "255.255.128.0")) return true;

    // ── DAMAMAX / VTel (AS47887) ──
    if (isInNet(ip, "217.144.64.0",  "255.255.192.0")) return true;
    if (isInNet(ip, "194.126.0.0",   "255.255.0.0"))   return true;

    return false;
}


// ═══════════════════════════════════════════════════
//  MAIN ROUTER
//  المنطق: PUBG → Proxy دائماً بدون استثناء
//          باقي الترافيك → DIRECT
// ═══════════════════════════════════════════════════
function FindProxyForURL(url, host) {

    // ① PUBG host pattern → Proxy فوراً بدون DNS
    if (isPubg(host)) {
        return PROXY;
    }

    // ② PUBG game ports → Proxy
    if (isPubgPort(url)) {
        return PROXY;
    }

    // ③ IP resolve — لو الـ host حلّ على IP أردني → Proxy
    //    (fallback للـ hosts اللي ما تطابقت بالـ pattern)
    var ip = dnsResolve(host);
    if (ip && isJordanIP(ip)) {
        return PROXY;
    }

    // ④ باقي كل شي → DIRECT
    return DIRECT;
}
