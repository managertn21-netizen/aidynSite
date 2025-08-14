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

const PLACEHOLDER_IMG = 'https://i.ibb.co/2FsfXqM/sample.jpg';

const defaultProducts = {};
for (const key of Object.keys(CATEGORY_NAMES)) {
  defaultProducts[key] = Array.from({ length: 20 }, (_, i) => ({
    sku: `${key.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
    name: `${CATEGORY_NAMES[key]} ${i + 1}`,
    img: PLACEHOLDER_IMG,
    stock: 100,
    short: 'Краткие характеристики товара',
    desc: 'Описание товара',
    addedAt: Date.now() - i
  }));
}

const Products = {
  load() {
    const stored = JSON.parse(localStorage.getItem('products') || '{}');
    const data = JSON.parse(JSON.stringify(defaultProducts));
    for (const cat in stored) {
      data[cat] = stored[cat];
    }
    return data;
  },
  save(data) {
    localStorage.setItem('products', JSON.stringify(data));
  }
};

window.Products = Products;
window.ProductsData = Products.load();
window.CATEGORY_NAMES = CATEGORY_NAMES;