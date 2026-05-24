// ─── Menu ─────────────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  available: boolean;
  aiDescription?: string;
}

export type MenuCategory = "appetizer" | "main" | "dessert" | "drink" | "special";
export type Allergen = "nuts" | "dairy" | "gluten" | "shellfish" | "eggs" | "soy";
export type DietaryTag = "vegan" | "vegetarian" | "gluten-free" | "halal" | "kosher";

// ─── Order ────────────────────────────────────────
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

// ─── Reservation ─────────────────────────────────
export interface Reservation {
  id: string;
  userId: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  specialRequests?: string;
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

// ─── User ─────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences?: UserPreferences;
}

export type UserRole = "customer" | "staff" | "admin";

export interface UserPreferences {
  dietaryTags: DietaryTag[];
  allergens: Allergen[];
  favoriteItems: string[];
}

// ─── AI ───────────────────────────────────────────
export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIRecommendation {
  itemId: string;
  reason: string;
  confidence: number;
}
