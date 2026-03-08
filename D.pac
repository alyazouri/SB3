// ╔════════════════════════════════════════════════════════╗
//        PUBG JORDAN LOBBY MAGNET v2
//        iPad Pro PAC Script
//        Jordan Match Bias Engine
//        Proxy: SOCKS5 91.106.109.50:1080
// ╚════════════════════════════════════════════════════════╝

var PROXY="SOCKS5 91.106.109.50:1080";


// ───────── PUBG DOMAIN RADAR ─────────
function isPubg(host){

return dnsDomainIs(host,".pubgmobile.com") ||
       dnsDomainIs(host,".igamecj.com") ||
       dnsDomainIs(host,".proximabeta.com") ||
       dnsDomainIs(host,".tencent.com") ||
       dnsDomainIs(host,".qcloud.com") ||

       shExpMatch(host,"*gamesvr*") ||
       shExpMatch(host,"*battle*") ||
       shExpMatch(host,"*match*") ||
       shExpMatch(host,"*realtime*") ||
       shExpMatch(host,"*classic*") ||
       shExpMatch(host,"*arena*") ||
       shExpMatch(host,"*royale*") ||

       shExpMatch(host,"*lobby*") ||
       shExpMatch(host,"*login*") ||
       shExpMatch(host,"*gateway*") ||
       shExpMatch(host,"*session*");

}


// ───────── ZAIN PRIORITY NETWORK ─────────
function netZain(ip){

return isInNet(ip,"91.106.96.0","255.255.224.0") ||
       isInNet(ip,"91.106.128.0","255.255.128.0") ||
       isInNet(ip,"188.247.0.0","255.255.128.0") ||
       isInNet(ip,"46.32.0.0","255.255.192.0");

}


// ───────── ORANGE NETWORK ─────────
function netOrange(ip){

return isInNet(ip,"82.212.64.0","255.255.224.0") ||
       isInNet(ip,"82.212.96.0","255.255.224.0") ||
       isInNet(ip,"176.29.0.0","255.255.0.0") ||
       isInNet(ip,"185.100.64.0","255.255.192.0");

}


// ───────── UMNIAH NETWORK ─────────
function netUmniah(ip){

return isInNet(ip,"213.6.0.0","255.255.0.0") ||
       isInNet(ip,"212.34.0.0","255.255.0.0") ||
       isInNet(ip,"85.159.192.0","255.255.192.0");

}


// ───────── JORDAN TELECOM ─────────
function netJTC(ip){

return isInNet(ip,"37.98.192.0","255.255.192.0") ||
       isInNet(ip,"193.188.0.0","255.255.128.0") ||
       isInNet(ip,"37.205.32.0","255.255.224.0");

}


// ───────── MAIN ROUTER ─────────
function FindProxyForURL(url,host){

var ip=dnsResolve(host);


// PUBG traffic
if(isPubg(host)){

if(ip){

if(netZain(ip))
return PROXY;

if(netOrange(ip))
return PROXY;

if(netUmniah(ip))
return PROXY;

if(netJTC(ip))
return PROXY;

}

// حتى لو لم يتم التعرف على الشبكة يبقى عبر البروكسي
return PROXY;

}


// PUBG UDP ports
if(shExpMatch(url,"*:10010*") ||
   shExpMatch(url,"*:10012*") ||
   shExpMatch(url,"*:10013*") ||
   shExpMatch(url,"*:17000*") ||
   shExpMatch(url,"*:17500*") ||
   shExpMatch(url,"*:20000*"))
return PROXY;


// باقي الترافيك
return PROXY;

}
