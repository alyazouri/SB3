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
"2a01:9700:1700::/40","2a00:18d8:4001::/48"
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
