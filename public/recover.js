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
})();
