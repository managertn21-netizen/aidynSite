const Cart = {
  load() {
    return JSON.parse(localStorage.getItem('cart') || '{}');
  },
  save(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },
  add(sku, qty = 1) {
    const cart = this.load();
    cart[sku] = (cart[sku] || 0) + qty;
    this.save(cart);
    this.updateLink();
  
  },
  set(sku, qty) {
    const cart = this.load();
    if (qty <= 0) {
      delete cart[sku];
    } else {
      cart[sku] = qty;
    }
    this.save(cart);
    this.updateLink();
  },
  remove(sku) {
    const cart = this.load();
    delete cart[sku];
    this.save(cart);
    this.updateLink();
  },
   clear() {
    localStorage.removeItem('cart');
    this.updateLink();
  },
  items() {
    return this.load();
  },
   count() {
      return Object.values(this.load()).reduce((a, b) => a + b, 0);
    },
    total() {
      const cart = this.load();
      let sum = 0;
      const data = (typeof window !== 'undefined' && window.ProductsData) || {};
      for (const [sku, qty] of Object.entries(cart)) {
        for (const cat in data) {
          const p = data[cat].find((x) => x.sku === sku);
          if (p) {
            sum += p.price * qty;
            break;
          }
        }
      }
      return sum;
    },
  updateLink() {
    const link = document.getElementById('cart-link');
    if (!link) return;
    const count = this.count();
    const sum = this.total();
    link.textContent = `Корзина: ${count} шт - ${sum} тг`;
  }
};

window.Cart = Cart;
document.addEventListener('DOMContentLoaded', () => Cart.updateLink());
// когда данные товаров подгружены асинхронно, обновляем ссылку ещё раз
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('products-loaded', () => Cart.updateLink());
}
