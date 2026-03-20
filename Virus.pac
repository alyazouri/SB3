function FindProxyForURL(url, host) {

    // ===== تجاهل IPv6 literals =====
    if (host.charAt(0) === "[") return "DIRECT";

    // ===== الشبكة المحلية دائماً DIRECT =====
    if (isPlainHostName(host))                      return "DIRECT";
    if (host === "localhost")                        return "DIRECT";

    // RFC 1918 - النطاقات الخاصة الداخلية
    if (isInNet(host, "10.0.0.0",      "255.0.0.0"))       return "DIRECT";
    if (isInNet(host, "172.16.0.0",    "255.240.0.0"))      return "DIRECT";
    if (isInNet(host, "192.168.0.0",   "255.255.0.0"))      return "DIRECT";
    if (isInNet(host, "127.0.0.0",     "255.0.0.0"))        return "DIRECT";
    if (isInNet(host, "169.254.0.0",   "255.255.0.0"))      return "DIRECT"; // Link-local

    // ===== كل حركة الإنترنت الخارجية: BLOCK =====
    return "PROXY 127.0.0.1:1"; // بروكسي وهمي = حجب فعّال
}
