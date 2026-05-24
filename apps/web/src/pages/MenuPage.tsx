import { useState } from "react";

const categories = ["All", "Burgers", "Sides", "Drinks", "Desserts"];

const menuItems = [
  { id: 1, name: "Classic Burger",     category: "Burgers",  price: 199, emoji: "🍔", description: "Beef patty, lettuce, tomato, cheese, special sauce",   popular: true  },
  { id: 2, name: "Spicy Chicken",      category: "Burgers",  price: 219, emoji: "🌶️", description: "Crispy chicken, jalapeños, spicy mayo, coleslaw",       popular: true  },
  { id: 3, name: "Veggie Delight",     category: "Burgers",  price: 179, emoji: "🥦", description: "Grilled veggie patty, fresh greens, mustard",           popular: false },
  { id: 4, name: "Double Smash",       category: "Burgers",  price: 279, emoji: "🍔", description: "Double beef patty, double cheese, pickles, onions",     popular: true  },
  { id: 5, name: "French Fries",       category: "Sides",    price:  89, emoji: "🍟", description: "Crispy golden fries with seasoning",                   popular: true  },
  { id: 6, name: "Onion Rings",        category: "Sides",    price:  99, emoji: "🧅", description: "Crispy battered onion rings with dipping sauce",       popular: false },
  { id: 7, name: "Loaded Fries",       category: "Sides",    price: 149, emoji: "🍟", description: "Fries topped with cheese, jalapeños, and sour cream",  popular: true  },
  { id: 8, name: "Coleslaw",           category: "Sides",    price:  69, emoji: "🥗", description: "Creamy homemade coleslaw",                             popular: false },
  { id: 9, name: "Cola",               category: "Drinks",   price:  59, emoji: "🥤", description: "Chilled Coca-Cola, 300ml",                             popular: false },
  { id: 10, name: "Mango Shake",       category: "Drinks",   price:  99, emoji: "🥭", description: "Fresh mango blended with milk and sugar",              popular: true  },
  { id: 11, name: "Lemonade",          category: "Drinks",   price:  79, emoji: "🍋", description: "Fresh squeezed lemonade with mint",                   popular: false },
  { id: 12, name: "Chocolate Shake",   category: "Drinks",   price: 109, emoji: "🍫", description: "Rich chocolate milkshake with whipped cream",         popular: true  },
  { id: 13, name: "Chocolate Brownie", category: "Desserts", price: 129, emoji: "🍫", description: "Warm brownie with vanilla ice cream",                  popular: true  },
  { id: 14, name: "Ice Cream Sundae",  category: "Desserts", price:  99, emoji: "🍨", description: "Vanilla ice cream with chocolate sauce and nuts",      popular: false },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((i) => i.category === activeCategory);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === id);
      if (exists && exists.qty > 1) return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter((c) => c.id !== id);
    });
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-bold text-yellow-400">QuickBite</span>
        </div>
        <div className="flex gap-6 text-sm font-medium items-center">
          <a href="/" className="text-gray-300 hover:text-yellow-400">Home</a>
          <a href="/menu" className="text-yellow-400">Menu</a>
          <a href="/reservation" className="text-gray-300 hover:text-yellow-400">Reservation</a>
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Our Menu</h1>
        <p className="text-gray-800 mt-1">Fresh and delicious — pick your favorites</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 px-8 py-5 overflow-x-auto border-b border-gray-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition
              ${activeCategory === cat
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-8 py-8">
        {filtered.map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition group"
            >
              {/* Dish Image Area */}
              <div className="bg-gray-800 h-36 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                {item.emoji}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  {item.popular && (
                    <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/30">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-bold">₹{item.price}</span>

                  {/* Add / Qty Controls */}
                  {inCart ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-full bg-gray-700 hover:bg-red-500 transition text-white font-bold text-sm"
                      >
                        −
                      </button>
                      <span className="text-white font-bold text-sm w-4 text-center">{inCart.qty}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 rounded-full bg-yellow-400 hover:bg-yellow-300 transition text-gray-900 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full transition"
                    >
                      Add +
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/60"
            onClick={() => setShowCart(false)}
          />
          {/* Drawer */}
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
              <h2 className="font-bold text-white text-lg">🛒 Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-16">
                  <div className="text-5xl mb-3">🛒</div>
                  <p>Your cart is empty</p>
                  <p className="text-sm mt-1">Add items from the menu</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-800 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-white text-sm font-semibold">{item.name}</p>
                        <p className="text-yellow-400 text-xs">₹{item.price} × {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-full bg-gray-700 hover:bg-red-500 text-white text-xs font-bold">−</button>
                        <span className="text-white text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(menuItems.find(m => m.id === item.id)!)} className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total + Checkout */}
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-800">
                <div className="flex justify-between text-white font-bold text-lg mb-4">
                  <span>Total</span>
                  <span className="text-yellow-400">₹{totalPrice}</span>
                </div>
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-full transition">
                  Place Order →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
