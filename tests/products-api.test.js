const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs/promises');
const path = require('node:path');
const server = require('../server/index.js');

function startServer() {
  return new Promise(resolve => {
    const srv = server.listen(0, () => {
      resolve({ srv, port: srv.address().port });
    });
  });
}

const dataFile = path.join(__dirname, '..', 'server', 'data', 'products.json');

let originalData;

test('GET /api/products returns JSON', async t => {
  const { srv, port } = await startServer();
  t.after(() => srv.close());
  const res = await fetch(`http://localhost:${port}/api/products`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.paper);
});

test('POST /api/products overwrites file', async t => {
  const { srv, port } = await startServer();
  originalData = await fs.readFile(dataFile, 'utf8');
  t.after(async () => {
    await fs.writeFile(dataFile, originalData);
    srv.close();
  });
  const newData = { test: [{ sku: 'T-1', name: 'Test', img: '', stock: 1, price: 1, short: '', desc: '', addedAt: 0 }] };
  const res = await fetch(`http://localhost:${port}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData)
  });
  assert.strictEqual(res.status, 200);
  const saved = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  assert.deepStrictEqual(saved, newData);
});