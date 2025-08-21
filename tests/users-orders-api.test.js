const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs/promises');
const path = require('node:path');
const server = require('../server/index.js');

function startServer() {return new Promise(resolve => {
    const srv = server.listen(0, () => {
      resolve({ srv, port: srv.address().port });
    });
  });
}

const usersFile = path.join(__dirname, '..', 'server', 'data', 'users.json');
const ordersFile = path.join(__dirname, '..', 'server', 'data', 'orders.json');

let usersOrig;
let ordersOrig;

test('GET /api/users returns JSON', async t => {
  const { srv, port } = await startServer();
  t.after(() => srv.close());
  const res = await fetch(`http://localhost:${port}/api/users`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
});

test('POST /api/users overwrites file', async t => {
  const { srv, port } = await startServer();
  usersOrig = await fs.readFile(usersFile, 'utf8');
  t.after(async () => {
    await fs.writeFile(usersFile, usersOrig);
    srv.close();
  });
  const newData = [{ name: 'test' }];
  const res = await fetch(`http://localhost:${port}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData)
  });
  assert.strictEqual(res.status, 200);
  const saved = JSON.parse(await fs.readFile(usersFile, 'utf8'));
  assert.deepStrictEqual(saved, newData);
});

test('GET /api/orders returns JSON', async t => {
  const { srv, port } = await startServer();
  t.after(() => srv.close());
  const res = await fetch(`http://localhost:${port}/api/orders`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
});

test('POST /api/orders overwrites file', async t => {
  const { srv, port } = await startServer();
  ordersOrig = await fs.readFile(ordersFile, 'utf8');
  t.after(async () => {
    await fs.writeFile(ordersFile, ordersOrig);
    srv.close();
  });
  const newData = [{ id: 1, user: 't', total: 1 }];
  const res = await fetch(`http://localhost:${port}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData)
  });
  assert.strictEqual(res.status, 200);
  const saved = JSON.parse(await fs.readFile(ordersFile, 'utf8'));
  assert.deepStrictEqual(saved, newData);
});