function findProduct(sku) {
  for (const cat in window.ProductsData) {
    const p = window.ProductsData[cat].find(x => x.sku === sku);
    if (p) return p;
  }
  return null;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cart-container');
  const form = document.getElementById('checkout-form');
  renderCart();

  function renderCart() {
    const cart = Cart.items();
    const rows = [];
    for (const [sku, qty] of Object.entries(cart)) {
      const p = findProduct(sku);
      if (!p) continue;
      rows.push(`<tr data-sku="${sku}"><td>${p.name}</td><td><input type="number" class="qty" min="1" value="${qty}"></td><td><button class="remove">✕</button></td></tr>`);
    }
    if (rows.length) {
      container.innerHTML = `<table style="width:100%;max-width:600px"><thead><tr><th>Товар</th><th>Кол-во</th><th></th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
    } else {
      container.textContent = 'Корзина пуста';
    }
  }

  container.addEventListener('input', e => {
    if (e.target.classList.contains('qty')) {
      const tr = e.target.closest('tr');
      const sku = tr.dataset.sku;
      const qty = parseInt(e.target.value, 10) || 0;
      Cart.set(sku, qty);
      if (qty <= 0) tr.remove();
      if (!Object.keys(Cart.items()).length) container.textContent = 'Корзина пуста';
    }
  });

  container.addEventListener('click', e => {
    if (e.target.classList.contains('remove')) {
      const tr = e.target.closest('tr');
      const sku = tr.dataset.sku;
      Cart.remove(sku);
      tr.remove();
      if (!Object.keys(Cart.items()).length) container.textContent = 'Корзина пуста';
    }
  });

  document.getElementById('print-order').addEventListener('click', () => window.print());

  document.getElementById('send-whatsapp').addEventListener('click', () => {
    const cart = Cart.items();
    if (!Object.keys(cart).length) {
      alert('Корзина пуста');
      return;
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fio = data.get('fio');
    const phone = data.get('phone');
    const email = data.get('email');
    const orderId = 'ORD-' + Date.now();
    let msg = `Заказ ${orderId}\n`;
    for (const [sku, qty] of Object.entries(cart)) {
      const p = findProduct(sku);
      msg += `${p ? p.name : sku} (${sku}) x ${qty}\n`;
    }
    msg += `\nФИО: ${fio}\nТелефон: ${phone}\nEmail: ${email}`;
    const url = `https://wa.me/77773131366?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
});