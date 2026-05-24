import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/cloud_restaurant",
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log("🗄️  Creating tables...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL UNIQUE,
        password   TEXT NOT NULL,
        role       TEXT NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT NOT NULL,
        price       NUMERIC NOT NULL,
        category    TEXT NOT NULL,
        emoji       TEXT NOT NULL DEFAULT '🍔',
        available   BOOLEAN NOT NULL DEFAULT true,
        popular     BOOLEAN NOT NULL DEFAULT false,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id            SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone         TEXT NOT NULL,
        email         TEXT,
        order_type    TEXT NOT NULL DEFAULT 'delivery',
        address       TEXT,
        items         TEXT NOT NULL,
        subtotal      NUMERIC NOT NULL,
        total         NUMERIC NOT NULL,
        status        TEXT NOT NULL DEFAULT 'pending',
        notes         TEXT,
        created_at    TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        phone      TEXT NOT NULL,
        email      TEXT,
        date       TEXT NOT NULL,
        time       TEXT NOT NULL,
        guests     INTEGER NOT NULL,
        occasion   TEXT,
        requests   TEXT,
        status     TEXT NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Tables created!");

    // ── Seed Admin User ───────────────────────────────────────
    console.log("👤 Seeding admin user...");
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.default.hash("admin123", 10);

    await client.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin', 'admin@quickbite.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);

    // ── Seed Menu Items ───────────────────────────────────────
    console.log("🍔 Seeding menu items...");

    const menuItems = [
      { name: "Classic Burger",     desc: "Beef patty, lettuce, tomato, cheese, special sauce",    price: 199, cat: "Burgers",  emoji: "🍔", popular: true  },
      { name: "Spicy Chicken",      desc: "Crispy chicken, jalapeños, spicy mayo, coleslaw",       price: 219, cat: "Burgers",  emoji: "🌶️", popular: true  },
      { name: "Veggie Delight",     desc: "Grilled veggie patty, fresh greens, mustard",           price: 179, cat: "Burgers",  emoji: "🥦", popular: false },
      { name: "Double Smash",       desc: "Double beef patty, double cheese, pickles, onions",     price: 279, cat: "Burgers",  emoji: "🍔", popular: true  },
      { name: "French Fries",       desc: "Crispy golden fries with seasoning",                   price: 89,  cat: "Sides",    emoji: "🍟", popular: true  },
      { name: "Onion Rings",        desc: "Crispy battered onion rings with dipping sauce",       price: 99,  cat: "Sides",    emoji: "🧅", popular: false },
      { name: "Loaded Fries",       desc: "Fries topped with cheese, jalapeños, sour cream",      price: 149, cat: "Sides",    emoji: "🍟", popular: true  },
      { name: "Coleslaw",           desc: "Creamy homemade coleslaw",                             price: 69,  cat: "Sides",    emoji: "🥗", popular: false },
      { name: "Cola",               desc: "Chilled Coca-Cola, 300ml",                             price: 59,  cat: "Drinks",   emoji: "🥤", popular: false },
      { name: "Mango Shake",        desc: "Fresh mango blended with milk and sugar",              price: 99,  cat: "Drinks",   emoji: "🥭", popular: true  },
      { name: "Lemonade",           desc: "Fresh squeezed lemonade with mint",                    price: 79,  cat: "Drinks",   emoji: "🍋", popular: false },
      { name: "Chocolate Shake",    desc: "Rich chocolate milkshake with whipped cream",          price: 109, cat: "Drinks",   emoji: "🍫", popular: true  },
      { name: "Chocolate Brownie",  desc: "Warm brownie with vanilla ice cream",                  price: 129, cat: "Desserts", emoji: "🍫", popular: true  },
      { name: "Ice Cream Sundae",   desc: "Vanilla ice cream with chocolate sauce and nuts",      price: 99,  cat: "Desserts", emoji: "🍨", popular: false },
    ];

    for (const item of menuItems) {
      await client.query(`
        INSERT INTO menu_items (name, description, price, category, emoji, popular)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING;
      `, [item.name, item.desc, item.price, item.cat, item.emoji, item.popular]);
    }

    console.log("✅ Menu items seeded!");
    console.log("");
    console.log("🎉 Database ready!");
    console.log("   Admin: admin@quickbite.com / admin123");

  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
