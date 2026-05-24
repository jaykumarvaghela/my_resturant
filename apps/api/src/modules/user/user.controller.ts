import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../db/index";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const userRouter = Router();

// POST /api/users/register
userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields required" });
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role: "customer" })
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

    // Generate token
    const token = jwt.sign(
      { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
      process.env.JWT_SECRET || "quickbite-secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      data: { user: newUser[0], token },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// POST /api/users/login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user.length) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role },
      process.env.JWT_SECRET || "quickbite-secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          role: user[0].role,
        },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// GET /api/users/me (get current user)
userRouter.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "quickbite-secret") as any;

    const user = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user.length) return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, data: user[0] });
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});
