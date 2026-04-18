import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import db, { initDb } from "./database";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initDb();

  app.use(express.json());

  // API Routes
  app.get("/api/tenant", (req, res) => {
    const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get('default');
    res.json(tenant);
  });

  app.get("/api/menu", (req, res) => {
    const categories = db.prepare('SELECT * FROM categories WHERE tenant_id = ? ORDER BY sort_order').all('default');
    const products = db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE c.tenant_id = ? AND p.available = 1
    `).all('default');

    const options = db.prepare('SELECT * FROM product_options').all();
    
    // Attach options to products
    const productsWithOpts = products.map((p: any) => ({
      ...p,
      options: options.filter((o: any) => o.product_id === p.id)
    }));

    res.json({ categories, products: productsWithOpts });
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/orders", (req, res) => {
    const orders = db.prepare('SELECT * FROM orders WHERE tenant_id = ? ORDER BY created_at DESC').all('default');
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    const { customer_name, customer_phone, address, payment_method, total, items } = req.body;
    const orderId = `ORD-${Date.now()}`;

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, tenant_id, customer_name, customer_phone, address, payment_method, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, price, observation)
      VALUES (?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertOrder.run(orderId, 'default', customer_name, customer_phone, address, payment_method, total);
      for (const item of items) {
        insertItem.run(orderId, item.product_id, item.quantity, item.price, item.observation || null);
      }
    });

    transaction();
    res.json({ success: true, orderId });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
