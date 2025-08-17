const test = require('node:test');
const assert = require('node:assert');

function setup() {
  const store = {};
  global.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (const key in store) delete store[key]; }
  };

  const cartLink = { textContent: '' };
  global.document = {
    getElementById: (id) => (id === 'cart-link' ? cartLink : null),
    addEventListener: () => {}
  };
  global.window = global;
  global.alert = () => {};

  delete require.cache[require.resolve('../assets/js/cart.js')];
  require('../assets/js/cart.js');
  return { Cart: global.Cart, cartLink };
}

test('Cart.add updates count and link', () => {
  const { Cart, cartLink } = setup();
  Cart.add('sku1', 2);
  assert.deepStrictEqual(Cart.items(), { sku1: 2 });
  assert.strictEqual(Cart.count(), 2);
  assert.strictEqual(cartLink.textContent, '2 шт');
});

test('Cart.set with 0 removes item and updates link', () => {
  const { Cart, cartLink } = setup();
  Cart.add('sku1', 2);
  Cart.set('sku1', 0);
  assert.deepStrictEqual(Cart.items(), {});
  assert.strictEqual(Cart.count(), 0);
  assert.strictEqual(cartLink.textContent, '0 шт');
});