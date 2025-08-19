const CATEGORY_NAMES = {
  paper: 'Бумага и бумажная продукция',
  stationery: 'Канцелярские товары',
  household: 'Хозяйственные товары',
  food: 'Продукты питания',
  tech: 'Техника и электроника',
  toner: 'Картриджи и тонер',
  furniture: 'Мебель и интерьер',
  gifts: 'Подарки и сувиниры',
  creative: 'Товары для творчества и учебы'
};

const Products = {
  async load() {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },
  async save(data) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save products');
  }
};

window.Products = Products;
window.ProductsData = {};
Products.load().then(data => { window.ProductsData = data; });
window.CATEGORY_NAMES = CATEGORY_NAMES;