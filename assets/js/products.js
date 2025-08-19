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

const API_BASE = 'http://localhost:3000';

const Products = {
  async load() {
   const res = await fetch('http://localhost:3000/api/products');
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },
  async save(data) {
    const res = await fetch('http://localhost:3000/api/products', {
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