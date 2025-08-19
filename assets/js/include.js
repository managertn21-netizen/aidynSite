document.addEventListener("DOMContentLoaded", async () => {
  const slots = document.querySelectorAll("[data-include]");
  for (const el of slots) {
    const name = el.getAttribute("data-include");
    try{
      const res = await fetch(`/partials/${name}.html`);
      const html = await res.text();
      el.innerHTML = html;
    }catch(e){
      el.innerHTML = `<div style="padding:10px;background:#fee2e2;border:1px solid #fecaca;color:#7f1d1d;border-radius:10px">Не удалось загрузить ${name}.html</div>`;
    }
  }

 const adminLink = document.getElementById('admin-link');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const cartLink = document.getElementById('cart-link');

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (adminLink) adminLink.style.display = isAdmin ? 'flex' : 'none';
    if (loginLink) loginLink.style.display = isAdmin ? 'none' : 'flex';
    if (logoutLink) logoutLink.style.display = isAdmin ? 'flex' : 'none';
    if (cartLink) cartLink.style.display = isAdmin ? 'none' : 'flex';

    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isAdmin');
        location.href = '/';
      });
    }

    if (window.Cart && typeof window.Cart.updateLink === 'function') {
      window.Cart.updateLink();
    }
    
    const searchInput = document.getElementById('site-search');
    const searchBtn = document.getElementById('site-search-btn');
    if (searchInput && searchBtn) {
      const runSearch = () => {
        const q = searchInput.value.trim();
        if (q) location.href = `/category.html?search=${encodeURIComponent(q)}`;
      };
      searchBtn.addEventListener('click', runSearch);
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          runSearch();
        }
      });
    }
});