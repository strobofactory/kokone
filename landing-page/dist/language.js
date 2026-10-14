/* Locale routes work without JavaScript; storage is optional. */
(() => {
  const supported = ['ja', 'en', 'es', 'zh', 'ko'];
  const route = location.pathname.split('/')[1];
  const current = supported.includes(route) ? route : 'ja';
  try {
    const saved = localStorage.getItem('kokone-language');
    if ((location.pathname === '/' || location.pathname === '/index.html') && supported.includes(saved) && saved !== 'ja') {
      location.replace('/' + saved + '/' + location.search + location.hash);
    }
  } catch (_) { /* Private browsing may disable storage. */ }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language]').forEach(link => {
      link.addEventListener('click', () => {
        try { localStorage.setItem('kokone-language', link.dataset.language); } catch (_) {}
      });
    });
    const menu = document.querySelector('.language-menu');
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
    document.addEventListener('click', e => { if (!menu.contains(e.target)) menu.open = false; });
  });
})();
