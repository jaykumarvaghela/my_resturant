import { Router } from "express";
import { db } from "../../db/index";
import { reservations } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const reservationRouter = Router();

// POST /api/reservations
reservationRouter.post("/", async (req, res) => {
  try {
    const { name, phone, email, date, time, guests, occasion, requests } = req.body;

    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const newReservation = await db
      .insert(reservations)
      .values({ name, phone, email, date, time, guests, occasion, requests, status: "confirmed" })
      .returning();

    res.status(201).json({ success: true, data: newReservation[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create reservation" });
  }
});

// GET /api/reservations
reservationRouter.get("/", async (req, res) => {
  try {
    const all = await db
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt));

    res.json({ success: true, data: all });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch reservations" });
  }
});

// PATCH /api/reservations/:id/status
reservationRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await db
      .update(reservations)
      .set({ status })
      .where(eq(reservations.id, parseInt(req.params.id)));

    res.json({ success: true, message: "Updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update" });
  }
});