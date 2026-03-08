function FindProxyForURL(url, host) {

var proxy = "SOCKS5 91.106.109.50:1080";
var ip = dnsResolve(host);

if (ip && (

isInNet(ip,"5.0.0.0","255.0.0.0") ||

isInNet(ip,"39.0.0.0","255.0.0.0") ||

isInNet(ip,"41.0.0.0","255.0.0.0") ||
isInNet(ip,"102.0.0.0","255.0.0.0") ||

isInNet(ip,"2.0.0.0","255.0.0.0") ||
isInNet(ip,"31.0.0.0","255.0.0.0") ||
isInNet(ip,"37.0.0.0","255.0.0.0") ||
isInNet(ip,"46.0.0.0","255.0.0.0") ||
isInNet(ip,"51.0.0.0","255.0.0.0") ||
isInNet(ip,"57.0.0.0","255.0.0.0") ||
isInNet(ip,"62.0.0.0","255.0.0.0") ||
isInNet(ip,"77.0.0.0","255.0.0.0") ||
isInNet(ip,"78.0.0.0","255.0.0.0") ||
isInNet(ip,"79.0.0.0","255.0.0.0") ||
isInNet(ip,"80.0.0.0","255.0.0.0") ||
isInNet(ip,"81.0.0.0","255.0.0.0") ||
isInNet(ip,"82.0.0.0","255.0.0.0") ||
isInNet(ip,"83.0.0.0","255.0.0.0") ||
isInNet(ip,"84.0.0.0","255.0.0.0") ||
isInNet(ip,"85.0.0.0","255.0.0.0") ||
isInNet(ip,"86.0.0.0","255.0.0.0") ||
isInNet(ip,"87.0.0.0","255.0.0.0") ||
isInNet(ip,"88.0.0.0","255.0.0.0") ||
isInNet(ip,"89.0.0.0","255.0.0.0") ||
isInNet(ip,"90.0.0.0","255.0.0.0") ||
isInNet(ip,"91.0.0.0","255.0.0.0") ||
isInNet(ip,"92.0.0.0","255.0.0.0") ||
isInNet(ip,"93.0.0.0","255.0.0.0") ||
isInNet(ip,"94.0.0.0","255.0.0.0") ||
isInNet(ip,"95.0.0.0","255.0.0.0")

)){
return "BLOCK";
}


if (
dnsDomainIs(host,".pubgmobile.com") ||
dnsDomainIs(host,".igamecj.com") ||
dnsDomainIs(host,".proximabeta.com") ||
dnsDomainIs(host,".tencent.com") ||
dnsDomainIs(host,".qcloud.com") ||
dnsDomainIs(host,".tencent-cloud.net") ||
dnsDomainIs(host,".gcloud.qq.com")
){
return proxy;
}


if (ip && (

isInNet(ip,"43.154.0.0","255.254.0.0") ||
isInNet(ip,"49.51.0.0","255.255.0.0") ||
isInNet(ip,"129.226.0.0","255.255.0.0") ||
isInNet(ip,"129.204.0.0","255.255.0.0") ||
isInNet(ip,"150.109.0.0","255.255.0.0") ||
isInNet(ip,"170.106.0.0","255.255.0.0")

)){
return proxy;
}


if (
shExpMatch(host,"gamesvr") ||
shExpMatch(host,"realtime") ||
shExpMatch(host,"relay") ||
shExpMatch(host,"battle") ||
shExpMatch(host,"classic") ||
shExpMatch(host,"arena") ||
shExpMatch(host,"royale")
){
return proxy;
}


if (
shExpMatch(host,"lobby") ||
shExpMatch(host,"matchmaking") ||
shExpMatch(host,"queue") ||
shExpMatch(host,"login") ||
shExpMatch(host,"gateway") ||
shExpMatch(host,"session")
){
return proxy;
}

if (

shExpMatch(url,":10010*") ||
shExpMatch(url,":10012") ||
shExpMatch(url,":10013") ||

shExpMatch(url,":17000*") ||
shExpMatch(url,":17500") ||
shExpMatch(url,":20000") ||
shExpMatch(url,":20001") ||
shExpMatch(url,":20002")

){
return proxy;
}


if (ip && (

isInNet(ip,"82.212.64.0","255.255.224.0") ||
isInNet(ip,"176.29.0.0","255.255.0.0") ||
isInNet(ip,"213.6.0.0","255.255.0.0") ||
isInNet(ip,"188.247.0.0","255.255.128.0") ||
isInNet(ip,"91.106.96.0","255.255.224.0")

)){
return proxy;
}

if (ip && (

isInNet(ip,"15.184.0.0","255.248.0.0") ||
isInNet(ip,"15.185.0.0","255.255.0.0") ||
isInNet(ip,"157.175.0.0","255.255.0.0")

)){
return proxy;
}

return proxy;

}
