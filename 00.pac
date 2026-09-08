// ============================================
// 🔥 ULTIMATE PUBG MOBILE PAC FOR JORDAN ONLY
// ⚡ ZERO COMPROMISE • JORDAN ONLY • NO MIDDLE EAST
// ============================================

function FindProxyForURL(url, host) {
  try {
    // تحويل المضيف إلى نص صغير
    host = host.toLowerCase();
    url = url.toLowerCase();
    
    // قائمة بمجالات وخوادم PUBG Mobile المعروفة
    const pubgDomains = [
      'pubgm.com', 'pubgmobile.com', 'tencent.com', 'krafton.com',
      'cmg.garenanow.com', 'cmg.vivoglobal.com', 'cmg.pubgmobile.com',
      'matchmaking.pubgm.com', 'game.pubgm.com', 'api-pubg.krafton.com'
    ];
    
    // قائمة عناوين IP أردنية معروفة (للتوجيه)
    const jordanIPs = [
      '85.159.217.18', '92.253.2.100', '46.185.128.100',
      '86.108.45.22', '94.249.12.88', '149.200.130.45'
    ];
    
    // فحص إذا كان المضيف تابعاً لـ PUBG
    const isPUBG = pubgDomains.some(domain => host.includes(domain));
    
    // إذا كان طلب PUBG
    if (isPUBG) {
      // توجيه عبر أفضل بروكسي أردني متاح
      // (يمكنك استبدال هذا بروكسي محدد)
      return 'PROXY 85.159.217.18:80';
    }
    
    // بالنسبة للمواقع الأخرى، استخدم بروكسي أردني افتراضي
    return 'PROXY 85.159.217.18:80';
    
  } catch (error) {
    // في حالة الخطأ، استخدم البروكسي الأردني الرئيسي
    return 'PROXY 85.159.217.18:80';
  }
}
