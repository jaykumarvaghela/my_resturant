import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────
interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

// ── Sample cart data (later will come from cartStore) ─────────
const sampleCart: CartItem[] = [
  { id: 1, name: "Classic Burger",  price: 199, qty: 2, emoji: "🍔" },
  { id: 5, name: "French Fries",    price: 89,  qty: 1, emoji: "🍟" },
  { id: 10, name: "Mango Shake",    price: 99,  qty: 2, emoji: "🥭" },
];

// ── Step Indicator ────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ["Cart", "Details", "Payment", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition
            ${i + 1 < step  ? "bg-green-500 text-white" :
              i + 1 === step ? "bg-yellow-400 text-gray-900" :
                               "bg-gray-800 text-gray-500"}`}>
            {i + 1 < step ? "✓" : i + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:block
            ${i + 1 === step ? "text-yellow-400" : "text-gray-500"}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px ${i + 1 < step ? "bg-green-500" : "bg-gray-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function OrderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>(sampleCart);

  // Step 2 form
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    orderType: "delivery",
    address: "", instructions: "",
  });

  // Step 3
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderId] = useState(`QB${Math.floor(Math.random() * 9000) + 1000}`);

  // ── Cart Calculations ───────────────────────────────────────
  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery   = form.orderType === "delivery" ? 49 : 0;
  const taxes      = Math.round(subtotal * 0.05);
  const total      = subtotal + delivery + taxes;
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setStep(4);
    }, 1500);
  };

  // ── Order Summary (shown on right always) ──────────────────
  const OrderSummary = () => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sticky top-24">
      <h3 className="text-white font-bold mb-4">Order Summary</h3>

      {/* Items */}
      <div className="flex flex-col gap-3 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.emoji}</span>
              <div>
                <p className="text-white text-sm">{item.name}</p>
                <p className="text-gray-500 text-xs">₹{item.price} × {item.qty}</p>
              </div>
            </div>
            <span className="text-yellow-400 text-sm font-bold">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-4" />

      {/* Totals */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal ({totalItems} items)</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Delivery fee</span>
          <span>{delivery === 0 ? <span className="text-green-400">Free</span> : `₹${delivery}`}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>GST (5%)</span>
          <span>₹{taxes}</span>
        </div>
        <div className="border-t border-gray-800 mt-2 pt-2 flex justify-between text-white font-bold text-base">
          <span>Total</span>
          <span className="text-yellow-400">₹{total}</span>
        </div>
      </div>

      {/* Order type badge */}
      <div className="mt-4 bg-gray-800 rounded-xl px-3 py-2 text-xs text-gray-400 flex items-center gap-2">
        {form.orderType === "delivery" ? "🛵 Delivery" : "🏃 Pickup"}
        <span className="ml-auto text-gray-600">Est. 25–35 min</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-bold text-yellow-400">QuickBite</span>
        </Link>
        <Link to="/menu" className="text-gray-400 hover:text-yellow-400 text-sm transition">
          ← Back to Menu
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-white mb-2">Checkout</h1>
        <p className="text-gray-500 text-sm mb-6">Complete your order in a few easy steps</p>

        <StepIndicator step={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Steps */}
          <div className="lg:col-span-2">

            {/* ── STEP 1: Cart ── */}
            {step === 1 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5">🛒 Your Cart</h2>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-3">🛒</div>
                    <p className="text-gray-400">Your cart is empty</p>
                    <Link to="/menu" className="text-yellow-400 text-sm mt-2 inline-block hover:underline">
                      Browse Menu →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-800 last:border-0">
                          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            {item.emoji}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{item.name}</p>
                            <p className="text-yellow-400 text-sm mt-0.5">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-500 text-white font-bold transition"
                            >−</button>
                            <span className="text-white font-bold w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold transition"
                            >+</button>
                          </div>
                          <span className="text-white font-bold text-sm w-16 text-right">
                            ₹{item.price * item.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={cart.length === 0}
                      className="w-full mt-6 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-xl transition"
                    >
                      Continue to Details →
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── STEP 2: Details ── */}
            {step === 2 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5">📋 Your Details</h2>

                <div className="flex flex-col gap-4">

                  {/* Order Type */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Order Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["delivery", "pickup"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setForm((p) => ({ ...p, orderType: type }))}
                          className={`py-3 rounded-xl border text-sm font-semibold transition capitalize
                            ${form.orderType === type
                              ? "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                            }`}
                        >
                          {type === "delivery" ? "🛵 Delivery" : "🏃 Pickup"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Full Name *</label>
                    <input
                      name="name" value={form.name} onChange={handleFormChange}
                      placeholder="Your name"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Phone Number *</label>
                    <input
                      name="phone" value={form.phone} onChange={handleFormChange}
                      placeholder="+91 9876543210"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Email</label>
                    <input
                      name="email" value={form.email} onChange={handleFormChange}
                      placeholder="you@email.com"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
                    />
                  </div>

                  {/* Address (only for delivery) */}
                  {form.orderType === "delivery" && (
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Delivery Address *</label>
                      <textarea
                        name="address" value={form.address} onChange={handleFormChange}
                        placeholder="House no, Street, Area, City"
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600 resize-none"
                      />
                    </div>
                  )}

                  {/* Special Instructions */}
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Special Instructions</label>
                    <textarea
                      name="instructions" value={form.instructions} onChange={handleFormChange}
                      placeholder="Extra sauce, no onions, etc."
                      rows={2}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600 resize-none"
                    />
                  </div>

                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-bold py-3 rounded-xl transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.name || !form.phone || (form.orderType === "delivery" && !form.address)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/40 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 3 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5">💳 Payment</h2>

                {/* Payment Methods */}
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    { id: "card",  label: "Credit / Debit Card", icon: "💳" },
                    { id: "upi",   label: "UPI",                 icon: "📱" },
                    { id: "cash",  label: "Cash on Delivery",    icon: "💵" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition
                        ${paymentMethod === method.id
                          ? "bg-yellow-400/10 border-yellow-400"
                          : "bg-gray-800 border-gray-700 hover:border-gray-600"
                        }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className={`font-semibold text-sm ${paymentMethod === method.id ? "text-yellow-400" : "text-gray-300"}`}>
                        {method.label}
                      </span>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${paymentMethod === method.id ? "border-yellow-400" : "border-gray-600"}`}>
                        {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Card Fields */}
                {paymentMethod === "card" && (
                  <div className="flex flex-col gap-3 mb-6 bg-gray-800 rounded-xl p-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Card Number</label>
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder-gray-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Expiry</label>
                        <input placeholder="MM/YY" className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder-gray-500" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">CVV</label>
                        <input placeholder="•••" type="password" maxLength={3} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder-gray-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI */}
                {paymentMethod === "upi" && (
                  <div className="mb-6 bg-gray-800 rounded-xl p-4">
                    <label className="text-gray-400 text-xs mb-1 block">UPI ID</label>
                    <input placeholder="yourname@upi" className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder-gray-500" />
                  </div>
                )}

                {/* COD notice */}
                {paymentMethod === "cash" && (
                  <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
                    💵 Pay ₹{total} in cash when your order arrives.
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-bold py-3 rounded-xl transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/60 text-gray-900 font-bold py-3 rounded-xl transition"
                  >
                    {placing ? "Placing Order..." : `Place Order ₹${total} →`}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Confirmed ── */}
            {step === 4 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-extrabold text-white mb-2">Order Confirmed!</h2>
                <p className="text-gray-400 mb-4">
                  Thank you <span className="text-yellow-400 font-semibold">{form.name}</span>! Your order is being prepared.
                </p>

                <div className="bg-gray-800 rounded-2xl px-6 py-4 inline-block mb-6">
                  <p className="text-gray-500 text-xs mb-1">Order ID</p>
                  <p className="text-yellow-400 font-bold text-xl font-mono">#{orderId}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                  {[
                    { icon: "✅", label: "Order Placed", done: true  },
                    { icon: "👨‍🍳", label: "Preparing",   done: false },
                    { icon: "🛵", label: "On the Way",  done: false },
                  ].map((s) => (
                    <div key={s.label} className={`p-3 rounded-xl border ${s.done ? "border-green-500/40 bg-green-500/10" : "border-gray-700 bg-gray-800"}`}>
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <p className={`text-xs font-medium ${s.done ? "text-green-400" : "text-gray-500"}`}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <Link to="/" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition text-sm">
                    Back to Home
                  </Link>
                  <Link to="/menu" className="border border-gray-700 text-gray-400 hover:text-white font-bold px-6 py-3 rounded-xl transition text-sm">
                    Order More
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          {step < 4 && (
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
