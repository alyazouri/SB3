// السماح بكل نطاقات IPv6 المدرجة بدون قفل اللوبي أو الماتش على نطاق واحد.
// هذا PAC فقط: لا يفتح منافذ استقبال، ولا يمرر UDP، ولا يضبط DNS الجهاز.
// أبقيت شرط IPv6 مفعلاً. إن أعاد محرك PAC عناوين IPv4 فقط فستُرفض الطلبات.
// تغيير STRICT_LISTED_IPV6 إلى false يلغي فلترة IP لأسماء الدومينات المحددة.
// راجع README-AR.md قبل التركيب؛ لم يُختبر الاتصال على آيفونك فعلياً.
// ============================================================
// Selected-domain / listed-IPv6 PAC - stateless routing
// Based on the user's original PUBG PAC. No /48 or /64 session lock.
// PAC is NOT a firewall, VPN, UDP tunnel, or geographic guarantee.
// The prefix/domain lists below are user-supplied, not verified feeds.
// ============================================================
// iPhone Wi-Fi > Configure DNS > Manual:
//   86.108.8.161
//   94.142.37.179
// These comments do NOT configure DNS. PAC cannot select a resolver.
// The HTTP proxy may resolve destination names using its OWN DNS.
// ============================================================

// Original proxy retained. PROXY means HTTP proxy/CONNECT, not TLS
// to the proxy just because the port is 443. Use your provider's type.
var JORDAN_PROXY = "PROXY 194.165.133.85:443";
var DIRECT = "DIRECT";
// Unreachable-proxy convention, NOT an operating-system firewall.
var BLOCK = "PROXY 127.0.0.1:1";

// true: preserve the original listed-IPv6-only DNS check for selected
//       domain names. Reject an IPv4 answer, an unlisted IPv6 answer,
//       invalid/empty results, or a resolver failure.
//       Some PAC engines expose only IPv4 via dnsResolve(); this can
//       therefore reject ALL selected domains on your device.
// false: route selected names via the proxy WITHOUT an IP allowlist
//        check. This is a different, weaker destination policy.
// Neither mode controls UDP, unknown game endpoints, or proxy-side DNS.
var STRICT_LISTED_IPV6 = true;

// Literal IPv6 URL hosts inside the supplied list also use the proxy.
// This applies to ANY PAC-aware app, not only PUBG. Unlisted literal
// IPs remain DIRECT: PAC has no process identity to identify the game.
var PROXY_LISTED_IPV6_LITERALS = true;

// Explicit domain roots from the original script, with label-boundary
// matching instead of broad substrings such as "na", "eu", or "ace".
// NOT a verified or exhaustive PUBG endpoint list. Shared company
// domains can include non-game services. Review using your own logs.
var PROXY_DOMAINS = [
  "pubg.com",
  "pubgmobile.com",
  "battlegroundsmobile.com",
  "bgmi.com",
  "krafton.com",
  "tencentgames.com",
  "levelinfinite.com",
  "lightspeed.com",
  "intlgame.com",
  "gcloud.com",
  "qcloud.com",
  "anticheatexpert.com",
  "tpns.com",
  "tgpa.com",
  "ace.com"
];

// Add only complete domain roots observed in your connection logs.
// Example syntax: "service.example" (no URL, path, port, or wildcard).
var EXTRA_PROXY_DOMAINS = [];

// Original IPv6 prefixes retained. Membership is a policy input,
// not proof of Jordanian location, residential use, or PUBG ownership.
var JORDAN_V6_CIDRS = [
  "2a03:6b01:4000::/34","2a03:6b01::/34","2a03:6b01:4000::/38","2a03:6b01:4400::/38",
  "2a03:6b01:6000::/38","2a03:6b01:6400::/38","2a01:9700:1700::/40","2a01:9700:1c00::/40",
  "2a01:9700:3100::/40","2a01:9700:3200::/40","2a01:9700:3300::/40","2a01:9700:3400::/40",
  "2a01:9700:3500::/40","2a01:9700:3800::/40","2a01:9700:3900::/40","2a01:9700:3a00::/40",
  "2a01:9700:3b00::/40","2a01:9700:3c00::/40","2a01:9700:3d00::/40","2a01:9700:3e00::/40",
  "2a01:9700:3f00::/40","2a01:9700:4000::/40","2a01:9700:4100::/40","2a01:9700:4200::/40",
  "2a01:9700:4300::/40","2a01:9700:4400::/40","2a01:9700:4500::/40","2a01:9700:4600::/40",
  "2a01:9700:4700::/40","2a01:9700:4800::/40","2a01:9700:4900::/40","2a01:9700:4a00::/40",
  "2a01:9700:4b00::/40","2a01:9700:4d00::/40","2a01:9700:4e00::/40","2a01:9700:4f00::/40",
  "2a01:9700:5000::/40","2a01:9700:5100::/40","2a01:9700:5200::/40","2a01:9700:5300::/40",
  "2a01:9700:5400::/40","2a01:9700:5500::/40","2a01:9700:5600::/40","2a01:9700:5700::/40",
  "2a01:9700:5800::/40","2a01:9700:5900::/40","2a01:9700:5a00::/40","2a01:9700:5b00::/40",
  "2a01:9700:5c00::/40","2a01:9700:5e00::/40","2a01:9700:6000::/40","2a01:9700:6100::/40",
  "2a01:9700:6200::/40","2a01:9700:6300::/40","2a01:9700:6400::/40","2a01:9700:6500::/40",
  "2a01:9700:6700::/40","2a01:9700:6800::/40","2a01:9700:6900::/40","2a01:9700:6a00::/40",
  "2a01:9700:6b00::/40","2a01:9700:6c00::/40","2a01:9700:6e00::/40","2a01:9700:6f00::/40",
  "2a01:9700:7000::/40","2a01:9700:7100::/40","2a01:9700:7200::/40","2a01:9700:7300::/40",
  "2a01:9700:7400::/40","2a01:9700:7600::/40","2a01:9700:7a00::/40","2a01:9700:8000::/40",
  "2a01:9700:8100::/40","2a01:9700:8500::/40","2a01:9700:8600::/40","2a01:9700:9000::/40",
  "2a01:9700:9100::/40","2a01:9700:9200::/40","2a01:9700:9300::/40","2a01:9700:9400::/40",
  "2a03:6b00::/40","2a00:18d8:100::/44","2a00:18d8:110::/44","2a00:18d8:120::/44",
  "2a00:18d8:130::/44","2a00:18d8:140::/44","2a00:18d8:150::/44","2a00:18d8:160::/44",
  "2a00:18d8:170::/44","2a00:18d8:40::/44","2a00:18d8:50::/44","2a00:18d8:60::/44",
  "2a00:18d8:70::/44","2a00:18d8:80::/44","2a00:18d8:90::/44","2a00:18d8:c0::/44",
  "2a00:18d8:d0::/44","2a00:18d8:e0::/44","2a00:18d8:f0::/44","2a01:9700:17a0::/44",
  "2a01:9700:17b0::/44","2a01:9700:17c0::/44","2a01:9700:17d0::/44","2a01:9700:17e0::/44",
  "2a01:9700:1c70::/44","2a01:9700:1c90::/44","2a01:9700:1ca0::/44","2a01:9700:1cb0::/44",
  "2a01:9700:1cc0::/44","2a01:9700:1cd0::/44","2a01:9700:1ce0::/44","2a01:9700:1cf0::/44",
  "2a01:9700:3190::/44","2a01:9700:31a0::/44","2a01:9700:31b0::/44","2a01:9700:31c0::/44",
  "2a01:9700:31d0::/44","2a01:9700:32a0::/44","2a01:9700:32b0::/44","2a01:9700:32c0::/44",
  "2a01:9700:32d0::/44","2a01:9700:32e0::/44","2a01:9700:32f0::/44","2a01:9700:3330::/44",
  "2a01:9700:3340::/44","2a01:9700:3350::/44","2a01:9700:3360::/44","2a01:9700:3460::/44",
  "2a01:9700:3470::/44","2a01:9700:3480::/44","2a01:9700:3490::/44","2a01:9700:34a0::/44",
  "2a01:9700:34b0::/44","2a01:9700:34c0::/44","2a01:9700:34d0::/44","2a01:9700:3510::/44",
  "2a01:9700:3520::/44","2a01:9700:3530::/44","2a01:9700:3540::/44","2a01:9700:3550::/44",
  "2a01:9700:3560::/44","2a01:9700:3570::/44","2a01:9700:3580::/44","2a01:9700:3800::/44",
  "2a01:9700:3810::/44","2a01:9700:3820::/44","2a01:9700:3830::/44","2a01:9700:3840::/44",
  "2a01:9700:3850::/44","2a01:9700:3860::/44","2a01:9700:3870::/44","2a01:9700:3880::/44",
  "2a01:9700:3890::/44","2a01:9700:38a0::/44","2a01:9700:38b0::/44","2a01:9700:38c0::/44",
  "2a01:9700:38d0::/44","2a01:9700:38e0::/44","2a01:9700:38f0::/44","2a01:9700:3930::/44",
  "2a01:9700:3940::/44","2a01:9700:3950::/44","2a01:9700:3960::/44","2a01:9700:3970::/44",
  "2a01:9700:3980::/44","2a01:9700:3990::/44","2a01:9700:39a0::/44","2a01:9700:39b0::/44",
  "2a01:9700:3a10::/44","2a01:9700:3a20::/44","2a01:9700:3a30::/44","2a01:9700:3a40::/44",
  "2a01:9700:3a50::/44","2a01:9700:3b10::/44","2a01:9700:3b20::/44","2a01:9700:3c00::/44",
  "2a01:9700:3c10::/44","2a01:9700:3ce0::/44","2a01:9700:3cf0::/44","2a01:9700:3d40::/44",
  "2a01:9700:3d50::/44","2a01:9700:3d60::/44","2a01:9700:3d70::/44","2a01:9700:3d80::/44",
  "2a01:9700:3e70::/44","2a01:9700:3e80::/44","2a01:9700:3e90::/44","2a01:9700:3ea0::/44",
  "2a01:9700:3eb0::/44","2a01:9700:3ec0::/44","2a01:9700:3f00::/44","2a01:9700:3f10::/44",
  "2a01:9700:3f20::/44","2a01:9700:3f30::/44","2a01:9700:3f40::/44","2a01:9700:3f50::/44",
  "2a01:9700:3f60::/44","2a01:9700:3f70::/44","2a01:9700:3f80::/44","2a01:9700:4000::/44",
  "2a01:9700:4010::/44","2a01:9700:4020::/44","2a01:9700:40a0::/44","2a01:9700:40b0::/44",
  "2a01:9700:40c0::/44","2a01:9700:40d0::/44","2a01:9700:40e0::/44","2a01:9700:40f0::/44",
  "2a01:9700:4100::/44","2a01:9700:4110::/44","2a01:9700:4190::/44","2a01:9700:41a0::/44",
  "2a01:9700:41b0::/44","2a01:9700:41c0::/44","2a01:9700:41d0::/44","2a01:9700:41e0::/44",
  "2a01:9700:41f0::/44","2a01:9700:4200::/44","2a01:9700:4210::/44","2a01:9700:4220::/44",
  "2a01:9700:4230::/44","2a01:9700:4240::/44","2a01:9700:4250::/44","2a01:9700:4290::/44",
  "2a01:9700:42a0::/44","2a01:9700:42b0::/44","2a01:9700:42c0::/44","2a01:9700:42d0::/44",
  "2a01:9700:42e0::/44","2a01:9700:42f0::/44","2a01:9700:4300::/44","2a01:9700:4310::/44",
  "2a01:9700:4320::/44","2a01:9700:4330::/44","2a01:9700:4340::/44","2a01:9700:43f0::/44",
  "2a01:9700:4480::/44","2a01:9700:4490::/44","2a01:9700:44a0::/44","2a01:9700:4520::/44",
  "2a01:9700:4530::/44","2a01:9700:4540::/44","2a01:9700:4550::/44","2a01:9700:4600::/44",
  "2a01:9700:4610::/44","2a01:9700:4620::/44","2a01:9700:46f0::/44","2a01:9700:4700::/44",
  "2a01:9700:47c0::/44","2a01:9700:47d0::/44","2a01:9700:47e0::/44","2a01:9700:47f0::/44",
  "2a01:9700:4800::/44","2a01:9700:4810::/44","2a01:9700:4820::/44","2a01:9700:4830::/44",
  "2a01:9700:4840::/44","2a01:9700:4850::/44","2a01:9700:4900::/44","2a01:9700:4910::/44",
  "2a01:9700:4920::/44","2a01:9700:49f0::/44","2a01:9700:4a50::/44","2a01:9700:4a60::/44",
  "2a01:9700:4a70::/44","2a01:9700:4a80::/44","2a01:9700:4bb0::/44","2a01:9700:4bc0::/44",
  "2a01:9700:4bd0::/44","2a01:9700:4be0::/44","2a01:9700:4d00::/44","2a01:9700:4d10::/44",
  "2a01:9700:4e00::/44","2a01:9700:4f00::/44","2a01:9700:4f10::/44","2a01:9700:4f20::/44",
  "2a01:9700:5000::/44","2a01:9700:5010::/44","2a01:9700:5020::/44","2a01:9700:5030::/44",
  "2a01:9700:5040::/44","2a01:9700:5050::/44","2a01:9700:5060::/44","2a01:9700:5070::/44",
  "2a01:9700:5080::/44","2a01:9700:5090::/44","2a01:9700:50a0::/44","2a01:9700:50b0::/44",
  "2a01:9700:50c0::/44","2a01:9700:50d0::/44","2a01:9700:50e0::/44","2a01:9700:50f0::/44",
  "2a01:9700:5100::/44","2a01:9700:5110::/44","2a01:9700:5120::/44","2a01:9700:5160::/44",
  "2a01:9700:5170::/44","2a01:9700:5180::/44","2a01:9700:5190::/44","2a01:9700:51a0::/44",
  "2a01:9700:51b0::/44","2a01:9700:51c0::/44","2a01:9700:51d0::/44","2a01:9700:51e0::/44",
  "2a01:9700:51f0::/44","2a01:9700:5210::/44","2a01:9700:5220::/44","2a01:9700:5230::/44",
  "2a01:9700:5240::/44","2a01:9700:5300::/44","2a01:9700:5310::/44","2a01:9700:5320::/44",
  "2a01:9700:5420::/44","2a01:9700:5430::/44","2a01:9700:5440::/44","2a01:9700:5450::/44",
  "2a01:9700:5460::/44","2a01:9700:5470::/44","2a01:9700:5480::/44","2a01:9700:5560::/44",
  "2a01:9700:5570::/44","2a01:9700:5580::/44","2a01:9700:5610::/44","2a01:9700:5620::/44",
  "2a01:9700:5630::/44","2a01:9700:5640::/44","2a01:9700:5710::/44","2a01:9700:5720::/44",
  "2a01:9700:5730::/44","2a01:9700:5860::/44","2a01:9700:5870::/44","2a01:9700:5900::/44",
  "2a01:9700:5910::/44","2a01:9700:5920::/44","2a01:9700:5930::/44","2a01:9700:5940::/44",
  "2a01:9700:5950::/44","2a01:9700:5960::/44","2a01:9700:5970::/44","2a01:9700:5980::/44",
  "2a01:9700:5a00::/44","2a01:9700:5ae0::/44","2a01:9700:5af0::/44","2a01:9700:5ba0::/44",
  "2a01:9700:5bb0::/44","2a01:9700:5bc0::/44","2a01:9700:5bd0::/44","2a01:9700:5be0::/44",
  "2a01:9700:5c50::/44","2a01:9700:5c60::/44","2a01:9700:5c70::/44","2a01:9700:5c80::/44",
  "2a01:9700:5ea0::/44","2a01:9700:6010::/44","2a01:9700:6100::/44","2a01:9700:6290::/44",
  "2a01:9700:62a0::/44","2a01:9700:62b0::/44","2a01:9700:62c0::/44","2a01:9700:6320::/44",
  "2a01:9700:6330::/44","2a01:9700:6340::/44","2a01:9700:6350::/44","2a01:9700:6360::/44",
  "2a01:9700:6370::/44","2a01:9700:6380::/44","2a01:9700:6420::/44","2a01:9700:6430::/44",
  "2a01:9700:6440::/44","2a01:9700:6450::/44","2a01:9700:6460::/44","2a01:9700:6500::/44",
  "2a01:9700:6510::/44","2a01:9700:65a0::/44","2a01:9700:65b0::/44","2a01:9700:65c0::/44",
  "2a01:9700:65d0::/44","2a01:9700:65e0::/44","2a01:9700:65f0::/44","2a01:9700:6740::/44",
  "2a01:9700:6750::/44","2a01:9700:6800::/44","2a01:9700:6910::/44","2a01:9700:6920::/44",
  "2a01:9700:6a10::/44","2a01:9700:6a20::/44","2a01:9700:6a30::/44","2a01:9700:6a40::/44",
  "2a01:9700:6a50::/44","2a01:9700:6b80::/44","2a01:9700:6b90::/44","2a01:9700:6ba0::/44",
  "2a01:9700:6ca0::/44","2a01:9700:6e40::/44","2a01:9700:6f00::/44","2a01:9700:7060::/44",
  "2a01:9700:7110::/44","2a01:9700:7200::/44","2a01:9700:7360::/44","2a01:9700:7370::/44",
  "2a01:9700:7380::/44","2a01:9700:7400::/44","2a01:9700:7600::/44","2a01:9700:7a30::/44",
  "2a01:9700:9000::/44","2a01:9700:9010::/44","2a01:9700:9020::/44","2a01:9700:9030::/44",
  "2a01:9700:9040::/44","2a01:9700:9050::/44","2a01:9700:9060::/44","2a01:9700:9070::/44",
  "2a01:9700:9080::/44","2a01:9700:9090::/44","2a01:9700:90a0::/44","2a01:9700:90b0::/44",
  "2a01:9700:90d0::/44","2a01:9700:90f0::/44","2a01:9700:9100::/44","2a01:9700:9110::/44",
  "2a01:9700:9120::/44","2a01:9700:9130::/44","2a01:9700:9140::/44","2a01:9700:9150::/44",
  "2a01:9700:9160::/44","2a01:9700:9170::/44","2a01:9700:9180::/44","2a01:9700:9190::/44",
  "2a01:9700:91a0::/44","2a01:9700:91b0::/44","2a01:9700:91c0::/44","2a01:9700:9200::/44",
  "2a01:9700:9210::/44","2a01:9700:9220::/44","2a01:9700:9230::/44","2a01:9700:9240::/44",
  "2a01:9700:9250::/44","2a01:9700:9270::/44","2a01:9700:9290::/44","2a01:9700:92a0::/44",
  "2a01:9700:92b0::/44","2a01:9700:92c0::/44","2a01:9700:9330::/44","2a01:9700:93a0::/44",
  "2a01:9700:9400::/44","2a01:9700:9410::/44","2a01:9700:9440::/44","2a01:9700:9450::/44",
  "2a01:9700:9460::/44","2a00:18d8:3c::/47","2a00:18d8:3e::/47","2a00:18d8:2::/48",
  "2a00:18d8:3::/48","2a00:18d8:4001::/48","2a00:18d8:4002::/48","2a00:18d8:4::/48",
  "2a00:18d8:5::/48","2a00:18d8::/48","2a01:9700::/48","2a03:6b02:2000::/48"
];

// ES3-style syntax; no typed arrays, BigInt, or modern JS dependencies.
function trimText(value) {
  if (value === null || typeof value == "undefined") return "";
  return ("" + value).replace(/^\s+|\s+$/g, "");
}

function normalizeHost(value) {
  var host = trimText(value).toLowerCase();
  if (host.charAt(0) == "[" && host.charAt(host.length - 1) == "]") {
    host = host.substring(1, host.length - 1);
  }
  // Normalize a DNS root dot; do not modify an IPv6 literal.
  if (host.indexOf(":") == -1 && host.charAt(host.length - 1) == ".") {
    host = host.substring(0, host.length - 1);
  }
  return host;
}

function parseIPv4(address) {
  var parts = address.split(".");
  var values = [];
  var i, value;
  if (parts.length != 4) return null;
  for (i = 0; i < 4; i++) {
    if (!/^(0|[1-9][0-9]{0,2})$/.test(parts[i])) return null;
    value = parseInt(parts[i], 10);
    if (value > 255) return null;
    values[values.length] = value;
  }
  return values;
}

// Returns eight validated 16-bit words, or null. Supports compression,
// brackets, uppercase, and an embedded IPv4 tail. Zone IDs are rejected.
function parseIPv6(value) {
  var address = trimText(value).toLowerCase();
  var parts, left, right, groups, words, tail, pos, missing, i;
  if (address.charAt(0) == "[" && address.charAt(address.length - 1) == "]") {
    address = address.substring(1, address.length - 1);
  }
  if (address.indexOf(":") == -1 || address.indexOf("%") != -1) return null;

  if (address.indexOf(".") != -1) {
    pos = address.lastIndexOf(":");
    tail = parseIPv4(address.substring(pos + 1));
    if (!tail) return null;
    address = address.substring(0, pos + 1) +
      (tail[0] * 256 + tail[1]).toString(16) + ":" +
      (tail[2] * 256 + tail[3]).toString(16);
  }

  parts = address.split("::");
  if (parts.length > 2) return null;
  if (parts.length == 2) {
    left = parts[0] === "" ? [] : parts[0].split(":");
    right = parts[1] === "" ? [] : parts[1].split(":");
    missing = 8 - left.length - right.length;
    if (missing < 1) return null;
    groups = [];
    for (i = 0; i < left.length; i++) groups[groups.length] = left[i];
    for (i = 0; i < missing; i++) groups[groups.length] = "0";
    for (i = 0; i < right.length; i++) groups[groups.length] = right[i];
  } else {
    groups = address.split(":");
    if (groups.length != 8) return null;
  }

  words = [];
  for (i = 0; i < 8; i++) {
    if (!/^[0-9a-f]{1,4}$/.test(groups[i])) return null;
    words[words.length] = parseInt(groups[i], 16);
  }
  return words;
}

function compileCIDRs(cidrs) {
  var result = [];
  var i, fields, words, bits;
  for (i = 0; i < cidrs.length; i++) {
    fields = cidrs[i].split("/");
    if (fields.length != 2 || !/^[0-9]{1,3}$/.test(fields[1])) return null;
    words = parseIPv6(fields[0]);
    bits = parseInt(fields[1], 10);
    if (!words || bits > 128) return null;
    result[result.length] = { words: words, bits: bits };
  }
  return result;
}

function matchesPrefix(words, network) {
  var full = Math.floor(network.bits / 16);
  var extra = network.bits % 16;
  var i, mask;
  for (i = 0; i < full; i++) {
    if (words[i] != network.words[i]) return false;
  }
  if (extra) {
    mask = (65535 << (16 - extra)) & 65535;
    if ((words[full] & mask) != (network.words[full] & mask)) return false;
  }
  return true;
}

// Immutable policy data only: there is no session, lobby, or match state.
var COMPILED_V6_CIDRS = compileCIDRs(JORDAN_V6_CIDRS);

function isListedIPv6Words(words) {
  var i;
  if (!words || !COMPILED_V6_CIDRS) return false;
  for (i = 0; i < COMPILED_V6_CIDRS.length; i++) {
    if (matchesPrefix(words, COMPILED_V6_CIDRS[i])) return true;
  }
  return false;
}

function matchesDomainList(host, domains) {
  var i, domain, suffix;
  for (i = 0; i < domains.length; i++) {
    domain = normalizeHost(domains[i]);
    if (!domain || domain.indexOf(":") != -1 || domain.indexOf("/") != -1 ||
        domain.indexOf("*") != -1) continue;
    if (host == domain) return true;
    suffix = "." + domain;
    if (host.length > suffix.length &&
        host.substring(host.length - suffix.length) == suffix) return true;
  }
  return false;
}

function isSelectedDomain(host) {
  return matchesDomainList(host, PROXY_DOMAINS) ||
    matchesDomainList(host, EXTRA_PROXY_DOMAINS);
}

function resolveVisibleAddresses(host) {
  var text = "";
  // Optional extension. Its availability on iOS is NOT assumed.
  // Do not hide an empty/failing extended result by taking a different
  // resolver snapshot: the strict policy rejects it.
  try {
    if (typeof dnsResolveEx == "function") {
      text = trimText(dnsResolveEx(host));
    } else if (typeof dnsResolve == "function") {
      text = trimText(dnsResolve(host));
    }
  } catch (error) {
    return [];
  }
  if (!text) return [];
  // Extended PAC resolvers conventionally separate addresses with ';'.
  // Whitespace/newline/comma separators are also accepted. Any invalid
  // nonempty token is rejected later instead of silently ignored.
  return text.split(/[\s;,]+/);
}

function allVisibleAddressesAllowed(host) {
  var addresses = resolveVisibleAddresses(host);
  var words, i;
  if (!addresses.length || !COMPILED_V6_CIDRS) return false;
  for (i = 0; i < addresses.length; i++) {
    words = parseIPv6(addresses[i]);
    if (!words || !isListedIPv6Words(words)) return false;
  }
  return true;
}

function FindProxyForURL(url, host) {
  var normalized = normalizeHost(host);
  var words;
  if (!normalized) return DIRECT;

  // Check literal IPv6 BEFORE any plain-hostname/domain-name bypass.
  words = parseIPv6(normalized);
  if (words) {
    if (PROXY_LISTED_IPV6_LITERALS && isListedIPv6Words(words)) {
      return JORDAN_PROXY;
    }
    return DIRECT;
  }

  // Unknown names and IPv4 literals stay outside this selective policy.
  // A PAC cannot know that an otherwise unknown IP belongs to PUBG.
  if (!isSelectedDomain(normalized)) return DIRECT;

  if (STRICT_LISTED_IPV6 && !allVisibleAddressesAllowed(normalized)) {
    return BLOCK;
  }

  // Every allowed request uses the same proxy. No /48 or /64 binding,
  // no URL-word guessing, no separate send/receive rules, and no DIRECT
  // fallback advertised for a selected request.
  return JORDAN_PROXY;
}
