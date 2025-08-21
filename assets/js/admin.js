document.addEventListener('DOMContentLoaded', () => {
  let data = {};
  const form = document.getElementById('add-form');
  const tableBody = document.querySelector('#prod-table tbody');
  const searchInput = document.getElementById('search');
  let editing = null;

  function allProducts() {
    const res = [];
    for (const cat in data) {
      data[cat].forEach((p, idx) => res.push({ ...p, cat, index: idx }));
    }
    return res;
  }

  function render(filter = '') {
    const f = filter.toLowerCase();
    const list = allProducts()
      .filter(p =>
        p.name.toLowerCase().includes(f) ||
        p.sku.toLowerCase().includes(f) ||
        p.desc.toLowerCase().includes(f)
      )
      .sort((a, b) => a.sku.localeCompare(b.sku));
    tableBody.innerHTML = '';
    list.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p.sku}</td><td>${p.name}</td><td>${p.price}</td><td>${p.stock}</td><td><button class="edit" data-cat="${p.cat}" data-index="${p.index}">Редактировать</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  async function loadProducts() {
    try {
      data = await Products.load();
      window.ProductsData = data;
      render();
    } catch (err) {
      alert('Не удалось загрузить товары: ' + err.message);
    }
  }

  loadProducts();

  searchInput.addEventListener('input', () => render(searchInput.value));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const product = {
      sku: form.sku.value,
      name: form.name.value,
      img: form.img.value,
      stock: parseInt(form.stock.value, 10),
      price: parseFloat(form.price.value),
      short: form.short.value,
      desc: form.desc.value,
      addedAt: Date.now()
    };
    if (isNaN(product.price)) {
      alert('Укажите корректную цену');
      return;
    }
    const cat = form.cat.value;
    if (editing) {
      const old = data[editing.cat][editing.index];
      product.addedAt = old.addedAt || product.addedAt;
      if (cat === editing.cat) {
        data[cat][editing.index] = product;
      } else {
        data[editing.cat].splice(editing.index, 1);
        if (!data[cat]) data[cat] = [];
        data[cat].push(product);
      }
      editing = null;
      form.querySelector('button[type="submit"]').textContent = 'Добавить';
    } else {
      if (!data[cat]) data[cat] = [];
      data[cat].push(product);
    }
    try {
      await Products.save(data);
      render();
      form.reset();
    } catch (err) {
      alert('Ошибка сохранения: ' + err.message);
    }
  });

  tableBody.addEventListener('click', e => {
    if (!e.target.classList.contains('edit')) return;
    const cat = e.target.dataset.cat;
    const index = parseInt(e.target.dataset.index, 10);
    const p = data[cat][index];
    form.cat.value = cat;
    form.sku.value = p.sku;
    form.name.value = p.name;
    form.img.value = p.img;
    form.stock.value = p.stock;
    form.price.value = p.price;
    form.short.value = p.short;
    form.desc.value = p.desc;
    form.querySelector('button[type="submit"]').textContent = 'Обновить';
    editing = { cat, index };
  });

  // Users module
  let usersData = [];
  const userForm = document.getElementById('user-form');
  const usersBody = document.querySelector('#users-table tbody');

  function renderUsers() {
    usersBody.innerHTML = '';
    usersData.forEach((u, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.name}</td><td><button class="del-user" data-index="${idx}">Удалить</button></td>`;
      usersBody.appendChild(tr);
    });
  }

  UsersAPI.load().then(d => { usersData = d; renderUsers(); });

  userForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = { name: userForm.name.value };
    usersData.push(user);
    try {
      await UsersAPI.save(usersData);
      renderUsers();
      userForm.reset();
    } catch (err) {
      alert('Ошибка сохранения пользователя: ' + err.message);
    }
  });

  usersBody.addEventListener('click', async e => {
    if (!e.target.classList.contains('del-user')) return;
    const idx = parseInt(e.target.dataset.index, 10);
    usersData.splice(idx, 1);
    try {
      await UsersAPI.save(usersData);
      renderUsers();
    } catch (err) {
      alert('Ошибка удаления пользователя: ' + err.message);
    }
  });

  // Orders module
  let ordersData = [];
  const orderForm = document.getElementById('order-form');
  const ordersList = document.getElementById('orders-list');

  function renderOrders() {
    ordersList.innerHTML = '';
    ordersData.forEach((o, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `Заказ #${o.id} от ${o.user} на сумму ${o.total} тг <button class="del-order" data-index="${idx}">×</button>`;
      ordersList.appendChild(li);
    });
  }

  OrdersAPI.load().then(d => { ordersData = d; renderOrders(); });

  orderForm.addEventListener('submit', async e => {
    e.preventDefault();
    const order = {
      id: Date.now(),
      user: orderForm.user.value,
      total: parseFloat(orderForm.total.value)
    };
    if (isNaN(order.total)) {
      alert('Некорректная сумма');
      return;
    }
    ordersData.push(order);
    try {
      await OrdersAPI.save(ordersData);
      renderOrders();
      orderForm.reset();
    } catch (err) {
      alert('Ошибка сохранения заказа: ' + err.message);
    }
  });

  ordersList.addEventListener('click', async e => {
    if (!e.target.classList.contains('del-order')) return;
    const idx = parseInt(e.target.dataset.index, 10);
    ordersData.splice(idx, 1);
    try {
      await OrdersAPI.save(ordersData);
      renderOrders();
    } catch (err) {
      alert('Ошибка удаления заказа: ' + err.message);
    }
  });
});