import { Router } from "express";
import { db } from "../../db/index";
import { orders } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

// ── ORDERS ────────────────────────────────────────────────────
export const orderRouter = Router();

// POST /api/orders — place a new order
orderRouter.post("/", async (req, res) => {
  try {
    const { customerName, phone, email, orderType, address, items, subtotal, total, notes } = req.body;

    if (!customerName || !phone || !items) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const newOrder = await db
      .insert(orders)
      .values({
        customerName,
        phone,
        email,
        orderType: orderType || "delivery",
        address,
        items: JSON.stringify(items),
        subtotal: subtotal.toString(),
        total: total.toString(),
        notes,
        status: "pending",
      })
      .returning();

    res.status(201).json({ success: true, data: newOrder[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to place order" });
  }
});

// GET /api/orders — get all orders (admin)
orderRouter.get("/", async (req, res) => {
  try {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    res.json({ success: true, data: allOrders });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

// PATCH /api/orders/:id/status — update order status
orderRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, parseInt(req.params.id)));

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update status" });
  }
});