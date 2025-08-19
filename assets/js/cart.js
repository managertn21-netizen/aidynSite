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
  updateLink() {
    const link = document.getElementById('cart-link');
    if (!link) return;
    const count = this.count();
    link.textContent = `${count} шт`;
  }
};

window.Cart = Cart;
document.addEventListener('DOMContentLoaded', () => Cart.updateLink());