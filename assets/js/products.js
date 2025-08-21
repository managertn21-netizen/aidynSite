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

async function request(path, data) {
  const opts = data
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
    : undefined;
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

const Products = {
  load() {
    return request('/api/products');
  },
  save(data) {
return request('/api/products', data);
  }
};

const UsersAPI = {
  load() {
    return request('/api/users');
  },
  save(data) {
    return request('/api/users', data);
  }
};

const OrdersAPI = {
  load() {
    return request('/api/orders');
  },
  save(data) {
    return request('/api/orders', data);
  }
};

window.Products = Products;
window.UsersAPI = UsersAPI;
window.OrdersAPI = OrdersAPI;

// Храним товары и событие загрузки данных в глобальной области
window.ProductsData = {};
window.ProductsDataLoaded = false;

function setProductsData(data) {
  window.ProductsData = data;
  window.ProductsDataLoaded = true;
  // уведомляем слушателей, что данные готовы
  window.dispatchEvent(new Event('products-loaded'));
}

Products.load().then(setProductsData);

// Удобный помощник, чтобы дождаться загрузки данных
window.onProductsLoaded = function (fn) {
  if (window.ProductsDataLoaded) {
    fn();
  } else {
    window.addEventListener('products-loaded', fn, { once: true });
  }
};
window.ProductsLoaded = Products.load().then(data => {
  window.ProductsData = data;
  return data;
});
window.CATEGORY_NAMES = CATEGORY_NAMES;