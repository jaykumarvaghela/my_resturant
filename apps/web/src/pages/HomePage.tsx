import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-bold text-yellow-400">QuickBite</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="text-yellow-400">Home</Link>
          <Link to="/menu" className="text-gray-300 hover:text-yellow-400">Menu</Link>
          <Link to="/reservation" className="text-gray-300 hover:text-yellow-400">Reservation</Link>
          <Link to="/order" className="text-gray-300 hover:text-yellow-400">Order</Link>
          <Link to="/login" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-4 py-1.5 rounded-full transition text-xs">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <span className="text-7xl mb-6">🍔</span>
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
          Welcome to QuickBite
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-8">
          Fresh, fast, and delicious. Order your favorite meals online or book a table — ready in minutes.
        </p>
        <div className="flex gap-4">
          <Link
            to="/menu"
            className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition"
          >
            View Menu
          </Link>
          <Link
            to="/reservation"
            className="border border-yellow-400 text-yellow-400 font-bold px-8 py-3 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition"
          >
            Book a Table
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-16 max-w-5xl mx-auto">
        {[
          { icon: "⚡", title: "Fast Delivery", desc: "Get your food delivered in under 30 minutes" },
          { icon: "🥗", title: "Fresh Ingredients", desc: "All dishes made with locally sourced ingredients" },
          { icon: "💳", title: "Easy Payment", desc: "Pay online with card or cash on delivery" },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-800">
        © 2026 QuickBite. All rights reserved.
      </footer>
    </div>
  );
}
