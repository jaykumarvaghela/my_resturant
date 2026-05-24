import { useState } from "react";
import { Link } from "react-router-dom";

// ── Available Time Slots ──────────────────────────────────────
const timeSlots = [
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM",
];

// ── Booked slots (simulate already taken) ────────────────────
const bookedSlots = ["01:00 PM", "07:30 PM", "09:00 PM"];

// ── Guest options ─────────────────────────────────────────────
const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    phone: "",
    email: "",
    occasion: "",
    requests: "",
  });
  const [bookingId] = useState(`RES${Math.floor(Math.random() * 9000) + 1000}`);

  // ── Get today's date as min ───────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isStep1Valid = form.date && form.time && form.guests;
  const isStep2Valid = form.name && form.phone;

  // ── Step Indicator ────────────────────────────────────────
  const steps = ["Date & Time", "Your Details", "Confirmed"];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-bold text-yellow-400">QuickBite</span>
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="text-gray-300 hover:text-yellow-400">Home</Link>
          <Link to="/menu" className="text-gray-300 hover:text-yellow-400">Menu</Link>
          <Link to="/reservation" className="text-yellow-400">Reservation</Link>
          <Link to="/order" className="text-gray-300 hover:text-yellow-400">Order</Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 px-8 py-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Book a Table</h1>
        <p className="text-gray-800 mt-1 text-sm">Reserve your spot at QuickBite — quick and easy</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition
                  ${i + 1 < step  ? "bg-green-500 text-white" :
                    i + 1 === step ? "bg-yellow-400 text-gray-900" :
                                     "bg-gray-800 text-gray-500"}`}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block
                  ${i + 1 === step ? "text-yellow-400" : "text-gray-500"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-10 h-px ${i + 1 < step ? "bg-green-500" : "bg-gray-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Date, Time, Guests ── */}
        {step === 1 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6">📅 Choose Date & Time</h2>

            <div className="flex flex-col gap-5">

              {/* Date Picker */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Select Date *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  min={today}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              {/* Guest Count */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Number of Guests *</label>
                <div className="grid grid-cols-4 gap-2">
                  {guestOptions.map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm((p) => ({ ...p, guests: g }))}
                      className={`py-3 rounded-xl text-sm font-bold border transition
                        ${form.guests === g
                          ? "bg-yellow-400 text-gray-900 border-yellow-400"
                          : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500"
                        }`}
                    >
                      {g} {g === 1 ? "👤" : "👥"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Select Time *</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = form.time === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setForm((p) => ({ ...p, time: slot }))}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition
                          ${isBooked
                            ? "bg-gray-800 text-gray-600 border-gray-800 cursor-not-allowed line-through"
                            : isSelected
                              ? "bg-yellow-400 text-gray-900 border-yellow-400"
                              : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-400 hover:text-yellow-400"
                          }`}
                      >
                        {isBooked ? `${slot}` : slot}
                        {isBooked && <span className="block text-[10px] text-gray-600">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Occasion (Optional)</label>
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition"
                >
                  <option value="">Select occasion</option>
                  <option value="birthday">🎂 Birthday</option>
                  <option value="anniversary">💑 Anniversary</option>
                  <option value="business">💼 Business Lunch</option>
                  <option value="date">❤️ Date Night</option>
                  <option value="family">👨‍👩‍👧 Family Gathering</option>
                  <option value="other">✨ Other</option>
                </select>
              </div>

            </div>

            {/* Summary Preview */}
            {form.date && form.time && (
              <div className="mt-5 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-3 text-sm">
                <p className="text-yellow-400 font-semibold mb-1">📋 Your Selection</p>
                <p className="text-gray-300">
                  {new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  {" "} at {form.time} · {form.guests} guest{form.guests > 1 ? "s" : ""}
                  {form.occasion && ` · ${form.occasion}`}
                </p>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="w-full mt-6 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/30 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Personal Details ── */}
        {step === 2 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6">👤 Your Details</h2>

            {/* Booking Preview */}
            <div className="bg-gray-800 rounded-xl px-4 py-3 mb-5 text-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-yellow-400 font-semibold">
                    {new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" "} at {form.time}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {form.guests} guest{form.guests > 1 ? "s" : ""}
                    {form.occasion && ` · ${form.occasion}`}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-yellow-400 transition"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">

              {/* Name */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Full Name *</label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Phone Number *</label>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Email (for confirmation)</label>
                <input
                  name="email" value={form.email} onChange={handleChange}
                  placeholder="you@email.com"
                  type="email"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Special Requests</label>
                <textarea
                  name="requests" value={form.requests} onChange={handleChange}
                  placeholder="Wheelchair access, high chair, window seat, allergies..."
                  rows={3}
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
                disabled={!isStep2Valid}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/30 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition"
              >
                Confirm Booking →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirmed ── */}
        {step === 3 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
              ✅
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              See you soon, <span className="text-yellow-400 font-semibold">{form.name}</span>!
              {form.email && ` A confirmation has been sent to ${form.email}.`}
            </p>

            {/* Booking Card */}
            <div className="bg-gray-800 rounded-2xl p-5 text-left mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500 text-xs font-semibold">BOOKING ID</p>
                <p className="text-yellow-400 font-bold font-mono text-lg">#{bookingId}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "📅 Date",   value: new Date(form.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) },
                  { label: "🕐 Time",   value: form.time },
                  { label: "👥 Guests", value: `${form.guests} guest${form.guests > 1 ? "s" : ""}` },
                  { label: "📍 Place",  value: "QuickBite Restaurant" },
                  ...(form.occasion ? [{ label: "🎉 Occasion", value: form.occasion }] : []),
                  ...(form.requests  ? [{ label: "📝 Requests", value: form.requests  }] : []),
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-gray-500 text-xs">{item.label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-3 text-sm text-yellow-400 mb-6 text-left">
              ℹ️ Please arrive 5 minutes early. Call us if you need to cancel or modify.
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Link
                to="/"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition text-sm"
              >
                Back to Home
              </Link>
              <Link
                to="/menu"
                className="border border-gray-700 text-gray-400 hover:text-white font-bold px-6 py-3 rounded-xl transition text-sm"
              >
                View Menu
              </Link>
              <button
                onClick={() => { setStep(1); setForm({ date: "", time: "", guests: 2, name: "", phone: "", email: "", occasion: "", requests: "" }); }}
                className="border border-gray-700 text-gray-400 hover:text-white font-bold px-6 py-3 rounded-xl transition text-sm"
              >
                New Booking
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-800">
        © 2026 QuickBite. All rights reserved.
      </footer>
    </div>
  );
}
