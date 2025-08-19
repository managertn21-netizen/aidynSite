document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat');
 const search = params.get('search');
  let products = [];
  if (search) {
    const all = Object.values(window.ProductsData).flat();
    const q = search.toLowerCase();
    products = all.filter(p =>
      p.sku.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
  } else if (cat && window.ProductsData[cat]) {
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
      <div>В наличии: ${p.stock}</div>
      <div class="price">${p.price} тг</div>
      <div class="actions" style="display:flex;gap:8px;align-items:center;margin-top:4px">
        <div class="qty-group">
          <button class="qty-minus">-</button>
          <input type="number" class="qty" min="1" max="${p.stock}" value="1">
          <button class="qty-plus">+</button>
        </div>
        <button class="add" data-sku="${p.sku}">В корзину</button>
        <button class="details" data-sku="${p.sku}">Подробнее</button>
      </div>`;
    grid.appendChild(article);
  });

  grid.addEventListener('click', e => {
    if (e.target.classList.contains('qty-minus') || e.target.classList.contains('qty-plus')) {
      const card = e.target.closest('.card');
      const qtyInput = card.querySelector('.qty');
      let qty = parseInt(qtyInput.value, 10) || 1;
      if (e.target.classList.contains('qty-minus') && qty > 1) qty--;
      if (e.target.classList.contains('qty-plus')) qty++;
      qtyInput.value = qty;
      return;
    }
    const sku = e.target.getAttribute('data-sku');
    if (!sku) return;
    const product = products.find(p => p.sku === sku);
    if (e.target.classList.contains('add')) {
      const card = e.target.closest('.card');
      const qtyInput = card.querySelector('.qty');
      const qty = parseInt(qtyInput.value, 10) || 1;
      Cart.add(sku, qty);
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
   modal.addEventListener('click', e => {
    if (e.target.classList.contains('qty-minus') || e.target.classList.contains('qty-plus')) {
      const qtyInput = modal.querySelector('.qty');
      let qty = parseInt(qtyInput.value, 10) || 1;
      if (e.target.classList.contains('qty-minus') && qty > 1) qty--;
      if (e.target.classList.contains('qty-plus')) qty++;
      qtyInput.value = qty;
    }
  });
});

function openModal(p) {
  const modal = document.getElementById('product-modal');
  modal.querySelector('.modal-img').src = p.img;
  modal.querySelector('.modal-title').textContent = p.name;
  modal.querySelector('.modal-sku').textContent = p.sku;
  modal.querySelector('.modal-stock').textContent = p.stock;
  modal.querySelector('.modal-price').textContent = p.price;
  modal.querySelector('.modal-short').textContent = p.short;
  modal.querySelector('.modal-desc').textContent = p.desc;
  modal.querySelector('.qty').value = 1;
  modal.dataset.sku = p.sku;
  modal.style.display = 'flex';
}