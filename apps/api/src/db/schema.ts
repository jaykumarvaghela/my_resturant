import { pgTable, serial, text, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";

// ── Users ─────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  email:     text("email").notNull().unique(),
  password:  text("password").notNull(),
  role:      text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Menu Items ────────────────────────────────────────────────
export const menuItems = pgTable("menu_items", {
  id:          serial("id").primaryKey(),
  name:        text("name").notNull(),
  description: text("description").notNull(),
  price:       numeric("price").notNull(),
  category:    text("category").notNull(),
  emoji:       text("emoji").notNull().default("🍔"),
  available:   boolean("available").notNull().default(true),
  popular:     boolean("popular").notNull().default(false),
  createdAt:   timestamp("created_at").defaultNow(),
});

// ── Orders ────────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id:          serial("id").primaryKey(),
  customerName:text("customer_name").notNull(),
  phone:       text("phone").notNull(),
  email:       text("email"),
  orderType:   text("order_type").notNull().default("delivery"),
  address:     text("address"),
  items:       text("items").notNull(), // JSON string
  subtotal:    numeric("subtotal").notNull(),
  total:       numeric("total").notNull(),
  status:      text("status").notNull().default("pending"),
  notes:       text("notes"),
  createdAt:   timestamp("created_at").defaultNow(),
});

// ── Reservations ──────────────────────────────────────────────
export const reservations = pgTable("reservations", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  phone:     text("phone").notNull(),
  email:     text("email"),
  date:      text("date").notNull(),
  time:      text("time").notNull(),
  guests:    integer("guests").notNull(),
  occasion:  text("occasion"),
  requests:  text("requests"),
  status:    text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});
