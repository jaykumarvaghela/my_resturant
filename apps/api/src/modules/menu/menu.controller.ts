import { Router } from "express";
import { db } from "../../db/index";
import { menuItems } from "../../db/schema";
import { eq } from "drizzle-orm";

export const menuRouter = Router();

// GET all menu items
menuRouter.get("/", async (req, res) => {
  try {
    const items = await db.select().from(menuItems);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch menu" });
  }
});

// GET single menu item
menuRouter.get("/:id", async (req, res) => {
  try {
    const item = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(req.params.id)));

    if (!item.length) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    res.json({ success: true, data: item[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch item" });
  }
});

// PATCH toggle availability (admin)
menuRouter.patch("/:id/availability", async (req, res) => {
  try {
    const { available } = req.body;
    await db
      .update(menuItems)
      .set({ available })
      .where(eq(menuItems.id, parseInt(req.params.id)));

    res.json({ success: true, message: "Availability updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update" });
  }
});
