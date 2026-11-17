(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      for (var i = 0; i < regs.length; i++) regs[i].unregister();
    }).catch(function () {});
  }
  window.addEventListener('error', function (e) {
    var t = e && e.target;
    if (t && (t.tagName === 'SCRIPT' || (t.tagName === 'LINK' && t.rel === 'modulepreload'))) {
      var key = 'galata_asset_recover';
      var last = Number(sessionStorage.getItem(key) || '0');
      if (Date.now() - last > 10000) {
        sessionStorage.setItem(key, String(Date.now()));
        var url = new URL(window.location.href);
        url.searchParams.set('_v', String(Date.now()));
        window.location.replace(url.toString());
      }
    }
  }, true);

  // Progressive WebMCP registration for agentic browsers (W3C Community Group draft)
  var mc = document.modelContext || navigator.modelContext;
  if (mc && typeof mc.registerTool === 'function') {
    try {
      mc.registerTool({
        name: 'get_venue_mice_info',
        description: 'Returns MICE capacities, 2nd-degree historic building conservation rules, visiting days, and contact details for Galata Greek School Foundation - Cultural Center.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function () {
          return {
            institution: 'Galata Rum Okulu Vakfi - Kultur Merkezi (Galata Greek School Foundation - Cultural Center)',
            heritageStatus: '2nd-Degree Registered Historic Monument (2. Derece Tescilli Tarihi Eser) — non-invasive ground-support setup required',
            netEventAreaM2: 1060,
            capacities: { cocktail: 850, theater: 650, gala: 450, classroom: 300, boardroom: 150 },
            address: 'Kemankes Karamustafa Pasa Mh., Kemeralti Caddesi No:25, 34425 Karakoy, Beyoglu / Istanbul',
            telephone: '+90 212 244 86 36',
            email: 'info@galatarumokulu.org',
            schoolOpenDays: 'Tuesday-Saturday (closed Sunday-Monday)',
            simoneRestaurantHours: 'Tuesday-Sunday 17:00-00:00 (closed Monday)'
          };
        }
      });
    } catch (_) {}
  }
})();
