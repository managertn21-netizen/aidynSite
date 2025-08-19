document.addEventListener('DOMContentLoaded', () => {
  const data = window.ProductsData;
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
      tr.innerHTML = `<td>${p.sku}</td><td>${p.name}</td><td>${p.stock}</td><td><button class="edit" data-cat="${p.cat}" data-index="${p.index}">Редактировать</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  render();

  searchInput.addEventListener('input', () => render(searchInput.value));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const product = {
      sku: form.sku.value,
      name: form.name.value,
      img: form.img.value,
      stock: parseInt(form.stock.value, 10),
      short: form.short.value,
      desc: form.desc.value,
      addedAt: Date.now()
    };
    const cat = form.cat.value;
    if (editing) {
      const old = data[editing.cat][editing.index];
      product.addedAt = old.addedAt || product.addedAt;
      if (cat === editing.cat) {
        data[cat][editing.index] = product;
      } else {
        data[editing.cat].splice(editing.index, 1);
        data[cat].push(product);
      }
      editing = null;
      form.querySelector('button[type="submit"]').textContent = 'Добавить';
    } else {
      data[cat].push(product);
    }
    Products.save(data);
    render();
    form.reset();
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
    form.short.value = p.short;
    form.desc.value = p.desc;
    form.querySelector('button[type="submit"]').textContent = 'Обновить';
    editing = { cat, index };
  });

  const users = [
    { name: 'user1', action: 'вход' },
    { name: 'user2', action: 'создал заказ' }
  ];
  const userBody = document.querySelector('#users-table tbody');
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.name}</td><td>${u.action}</td>`;
    userBody.appendChild(tr);
  });

  const orders = [
    { id: 1, user: 'user1', total: 1000 },
    { id: 2, user: 'user2', total: 2000 }
  ];
  const ordersList = document.getElementById('orders-list');
  orders.forEach(o => {
    const li = document.createElement('li');
    li.textContent = `Заказ #${o.id} от ${o.user} на сумму ${o.total} тг`;
    ordersList.appendChild(li);
  });
});