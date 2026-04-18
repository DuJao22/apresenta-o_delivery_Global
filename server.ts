import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import db, { initDb } from "./database";
import { FALLBACK_MENU } from "./src/data/fallback";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB with fallback support
  try {
    initDb();
  } catch (error) {
    console.warn("Database initialization skipped or failed. Using fallback data mode.");
  }

  app.use(express.json());

  // API Routes
  app.get("/api/tenant", (req, res) => {
    try {
      const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get('default');
      res.json(tenant || { name: 'Global Burger', id: 'default' });
    } catch {
      res.json({ name: 'Global Burger', id: 'default' });
    }
  });

  app.get("/api/menu", (req, res) => {
    try {
      const categories = db.prepare('SELECT * FROM categories WHERE tenant_id = ? ORDER BY sort_order').all('default');
      const products = db.prepare(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        WHERE c.tenant_id = ? AND p.available = 1
      `).all('default');

      const options = db.prepare('SELECT * FROM product_options').all();
      
      const productsWithOpts = products.map((p: any) => ({
        ...p,
        options: options.filter((o: any) => o.product_id === p.id)
      }));

      if (categories.length === 0) return res.json(FALLBACK_MENU);
      res.json({ categories, products: productsWithOpts });
    } catch (error) {
      console.warn("Serving fallback menu due to DB failure");
      res.json(FALLBACK_MENU);
    }
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    try {
      const { status } = req.body;
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "DB Error" });
    }
  });

  app.get("/api/orders", (req, res) => {
    try {
      const orders = db.prepare('SELECT * FROM orders WHERE tenant_id = ? ORDER BY created_at DESC').all('default');
      res.json(orders);
    } catch {
      res.json([]);
    }
  });

  app.post("/api/orders", (req, res) => {
    try {
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
    } catch (error) {
      console.error("Order creation failed", error);
      res.json({ success: false, error: "Database error during order creation" });
    }
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
