import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Fake Data (replace with real API later) ──────────────────
const stats = [
  { label: "Today's Orders",    value: "24",    icon: "🛒", change: "+3 from yesterday" },
  { label: "Today's Revenue",   value: "₹4,280", icon: "💰", change: "+₹320 from yesterday" },
  { label: "Reservations Today",value: "8",     icon: "📅", change: "2 pending confirmation" },
  { label: "Menu Items",        value: "14",    icon: "🍔", change: "2 unavailable" },
];

const recentOrders = [
  { id: "#001", customer: "Rahul Sharma",  items: "Classic Burger, Fries, Cola",       total: "₹347", status: "delivered",  time: "9:15 AM" },
  { id: "#002", customer: "Priya Patel",   items: "Spicy Chicken, Mango Shake",        total: "₹318", status: "preparing",  time: "9:32 AM" },
  { id: "#003", customer: "Amit Kumar",    items: "Double Smash, Loaded Fries",        total: "₹428", status: "pending",    time: "9:45 AM" },
  { id: "#004", customer: "Sneha Verma",   items: "Veggie Delight, Lemonade",          total: "₹258", status: "ready",      time: "9:52 AM" },
  { id: "#005", customer: "Vikram Singh",  items: "Classic Burger x2, Onion Rings",   total: "₹487", status: "delivered",  time: "10:01 AM" },
];

const reservations = [
  { id: "R001", name: "Sharma Family",  date: "Today",    time: "1:00 PM", guests: 4, status: "confirmed" },
  { id: "R002", name: "Priya Mehta",    date: "Today",    time: "2:30 PM", guests: 2, status: "confirmed" },
  { id: "R003", name: "Office Lunch",   date: "Today",    time: "1:30 PM", guests: 8, status: "pending"   },
  { id: "R004", name: "Raj & Family",   date: "Tomorrow", time: "7:00 PM", guests: 5, status: "confirmed" },
  { id: "R005", name: "Birthday Party", date: "Tomorrow", time: "8:00 PM", guests: 12, status: "pending"  },
];

const menuItems = [
  { id: 1,  name: "Classic Burger",     category: "Burgers",  price: 199, available: true  },
  { id: 2,  name: "Spicy Chicken",      category: "Burgers",  price: 219, available: true  },
  { id: 3,  name: "Veggie Delight",     category: "Burgers",  price: 179, available: false },
  { id: 4,  name: "Double Smash",       category: "Burgers",  price: 279, available: true  },
  { id: 5,  name: "French Fries",       category: "Sides",    price: 89,  available: true  },
  { id: 6,  name: "Onion Rings",        category: "Sides",    price: 99,  available: true  },
  { id: 7,  name: "Loaded Fries",       category: "Sides",    price: 149, available: true  },
  { id: 8,  name: "Coleslaw",           category: "Sides",    price: 69,  available: false },
  { id: 9,  name: "Cola",               category: "Drinks",   price: 59,  available: true  },
  { id: 10, name: "Mango Shake",        category: "Drinks",   price: 99,  available: true  },
  { id: 11, name: "Lemonade",           category: "Drinks",   price: 79,  available: true  },
  { id: 12, name: "Chocolate Shake",    category: "Drinks",   price: 109, available: true  },
  { id: 13, name: "Chocolate Brownie",  category: "Desserts", price: 129, available: true  },
  { id: 14, name: "Ice Cream Sundae",   category: "Desserts", price: 99,  available: true  },
];

// ── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    preparing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    pending:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    ready:     "bg-purple-500/20 text-purple-400 border-purple-500/30",
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${styles[status] ?? ""}`}>
      {status}
    </span>
  );
}

// ── Sidebar Nav ───────────────────────────────────────────────
const navItems = [
  { id: "overview",      label: "Overview",      icon: "📊" },
  { id: "orders",        label: "Orders",        icon: "🛒" },
  { id: "reservations",  label: "Reservations",  icon: "📅" },
  { id: "menu",          label: "Menu",          icon: "🍔" },
];

// ── Main Component ────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [items, setItems] = useState(menuItems);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Protect the page
  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    if (!auth) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    navigate("/login");
  };

  const toggleAvailability = (id: number) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, available: !item.available } : item)
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-16"} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 fixed h-full z-40`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <span className="text-2xl">🍔</span>
          {sidebarOpen && <span className="text-yellow-400 font-bold text-sm">QuickBite Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition w-full text-left
                ${activeTab === item.id
                  ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-gray-800 flex flex-col gap-2">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition"
          >
            <span>🌐</span>
            {sidebarOpen && <span>View Site</span>}
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-sm transition w-full text-left"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-56" : "ml-16"} transition-all duration-300`}>

        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition text-xl"
            >
              ☰
            </button>
            <h1 className="text-white font-bold capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Today: {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold text-sm">A</div>
          </div>
        </header>

        <div className="p-6">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <p className="text-gray-500 text-sm mb-6">Welcome back! Here's what's happening today.</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                  <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-gray-400 text-xs mt-1">{s.label}</div>
                    <div className="text-green-400 text-xs mt-2">{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-bold">Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} className="text-yellow-400 text-xs hover:underline">View all →</button>
                </div>
                <div className="flex flex-col gap-3">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-white text-sm font-medium">{order.customer} <span className="text-gray-600 font-normal">{order.id}</span></p>
                        <p className="text-gray-500 text-xs mt-0.5">{order.items}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 text-sm font-bold">{order.total}</span>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Reservations */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-bold">Upcoming Reservations</h2>
                  <button onClick={() => setActiveTab("reservations")} className="text-yellow-400 text-xs hover:underline">View all →</button>
                </div>
                <div className="flex flex-col gap-3">
                  {reservations.slice(0, 3).map((r) => (
                    <div key={r.id} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-white text-sm font-medium">{r.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{r.date} at {r.time} · {r.guests} guests</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div>
              <p className="text-gray-500 text-sm mb-6">Manage and track all customer orders.</p>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">ORDER</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">CUSTOMER</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4 hidden md:table-cell">ITEMS</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">TOTAL</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">TIME</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="px-5 py-4 text-yellow-400 text-sm font-mono">{order.id}</td>
                        <td className="px-5 py-4 text-white text-sm">{order.customer}</td>
                        <td className="px-5 py-4 text-gray-400 text-xs hidden md:table-cell max-w-xs truncate">{order.items}</td>
                        <td className="px-5 py-4 text-white text-sm font-bold">{order.total}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{order.time}</td>
                        <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── RESERVATIONS ── */}
          {activeTab === "reservations" && (
            <div>
              <p className="text-gray-500 text-sm mb-6">View and manage table reservations.</p>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">ID</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">NAME</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">DATE</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">TIME</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">GUESTS</th>
                      <th className="text-left text-gray-500 text-xs font-semibold px-5 py-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="px-5 py-4 text-yellow-400 text-sm font-mono">{r.id}</td>
                        <td className="px-5 py-4 text-white text-sm font-medium">{r.name}</td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{r.date}</td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{r.time}</td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{r.guests} 👥</td>
                        <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── MENU ── */}
          {activeTab === "menu" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500 text-sm">Toggle item availability in real time.</p>
                <div className="text-xs text-gray-500">
                  {items.filter(i => !i.available).length} items unavailable
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-900 border rounded-2xl p-4 flex justify-between items-center transition
                      ${item.available ? "border-gray-800" : "border-red-500/30 opacity-60"}`}
                  >
                    <div>
                      <p className={`font-semibold text-sm ${item.available ? "text-white" : "text-gray-500"}`}>
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.category} · ₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300
                        ${item.available ? "bg-yellow-400" : "bg-gray-700"}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300
                          ${item.available ? "left-7" : "left-1"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
