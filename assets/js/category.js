document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat');
  let products = [];
  if (cat && window.ProductsData[cat]) {
    products = window.ProductsData[cat];
  } else {
    const all = Object.values(window.ProductsData).flat();
    products = all
      .filter(p => p.addedAt)
      .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))
      .slice(0, 20);
  }
  const grid = document.querySelector('.grid-products');
  if (!grid) return;
  grid.innerHTML = '';
  products.forEach(p => {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="title">${p.name}</div>
      <div class="actions">
        <button class="details" data-sku="${p.sku}">Подробнее</button>
        <button class="add" data-sku="${p.sku}">В корзину</button>
      </div>`;
    grid.appendChild(article);
  });

  grid.addEventListener('click', e => {
    const sku = e.target.getAttribute('data-sku');
    if (!sku) return;
    const product = products.find(p => p.sku === sku);
    if (e.target.classList.contains('add')) {
      Cart.add(sku, 1);
    } else if (e.target.classList.contains('details')) {
      openModal(product);
    }
  });

  const modal = document.getElementById('product-modal');
  modal.querySelector('.close').addEventListener('click', () => modal.style.display = 'none');
  modal.querySelector('.add-to-cart').addEventListener('click', () => {
    const sku = modal.dataset.sku;
    const qty = parseInt(modal.querySelector('.qty').value, 10) || 1;
    Cart.add(sku, qty);
    modal.style.display = 'none';
  });
});

function openModal(p) {
  const modal = document.getElementById('product-modal');
  modal.querySelector('.modal-img').src = p.img;
  modal.querySelector('.modal-title').textContent = p.name;
  modal.querySelector('.modal-sku').textContent = p.sku;
  modal.querySelector('.modal-stock').textContent = p.stock;
  modal.querySelector('.modal-short').textContent = p.short;
  modal.querySelector('.modal-desc').textContent = p.desc;
  modal.querySelector('.qty').value = 1;
  modal.dataset.sku = p.sku;
  modal.style.display = 'flex';
}