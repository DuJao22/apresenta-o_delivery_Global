import Database from 'better-sqlite3';

let db: any;

try {
  db = new Database('delivery.db');
  db.pragma('journal_mode = WAL');
} catch (error) {
  console.warn("Could not create persistent database file, falling back to in-memory database.");
  db = new Database(':memory:');
}

export function initDb() {
  try {
    db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT,
      contact_phone TEXT,
      delivery_fee INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY(tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image_url TEXT,
      available INTEGER DEFAULT 1,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS product_options (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER DEFAULT 0,
      is_required INTEGER DEFAULT 0,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total INTEGER NOT NULL,
      delivery_fee INTEGER DEFAULT 0,
      change_for INTEGER,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      observation TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);

  // Seed default tenant if not exists
  const tenantExists = db.prepare('SELECT id FROM tenants WHERE id = ?').get('default');
  if (!tenantExists) {
    db.prepare('INSERT INTO tenants (id, name, contact_phone, delivery_fee) VALUES (?, ?, ?, ?)')
      .run('default', 'Sistema de Delivery Exemplo', '11999999999', 500);

    // Initial Categories
    const categories = [
      { id: 'cat1', name: 'Hambúrgueres', order: 1 },
      { id: 'cat2', name: 'Bebidas', order: 2 },
      { id: 'cat3', name: 'Acompanhamentos', order: 3 }
    ];

    const insertCat = db.prepare('INSERT INTO categories (id, tenant_id, name, sort_order) VALUES (?, ?, ?, ?)');
    categories.forEach(c => insertCat.run(c.id, 'default', c.name, c.order));

    // Initial Products
    const products = [
      { id: 'p1', cat: 'cat1', name: 'Global Burger Clássico', desc: 'Pão brioche, carne 180g, queijo cheddar, alface e tomate.', price: 3200, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=400' },
      { id: 'p2', cat: 'cat1', name: 'Monster Green', desc: 'Blend especial, bacon crocante, maionese verde e cebola roxa.', price: 4500, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&h=400' },
      { id: 'p3', cat: 'cat2', name: 'Coca-Cola 350ml', desc: 'Geladinha.', price: 600, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&h=400' },
      { id: 'p4', cat: 'cat3', name: 'Batata Rústica', desc: 'Crocante por fora, macia por dentro.', price: 1800, img: 'https://images.unsplash.com/photo-1573016608964-b49ca021ca66?auto=format&fit=crop&w=400&h=400' }
    ];

    const insertProd = db.prepare('INSERT INTO products (id, category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    products.forEach(p => insertProd.run(p.id, p.cat, p.name, p.desc, p.price, p.img));

    // Initial Options
    const options = [
      { id: 'opt1', prod: 'p1', name: 'Extra Queijo', price: 300 },
      { id: 'opt2', prod: 'p1', name: 'Bacon Extra', price: 450 },
      { id: 'opt3', prod: 'p2', name: 'Ovo Frito', price: 250 },
      { id: 'opt4', prod: 'p2', name: 'Pimenta Jalapeño', price: 200 }
    ];

    const insertOpt = db.prepare('INSERT INTO product_options (id, product_id, name, price) VALUES (?, ?, ?, ?)');
    options.forEach(o => insertOpt.run(o.id, o.prod, o.name, o.price));
  }

  // Force update existing images to ensure users see Burgers instead of Mountains
  const updatePromises = [
    { id: 'p1', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=400' },
    { id: 'p2', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&h=400' },
    { id: 'p3', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&h=400' },
    { id: 'p4', img: 'https://images.unsplash.com/photo-1573016608964-b49ca021ca66?auto=format&fit=crop&w=400&h=400' }
  ];
  
  const updateStmt = db.prepare('UPDATE products SET image_url = ? WHERE id = ?');
  updatePromises.forEach(p => updateStmt.run(p.img, p.id));
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
}

export default db;
