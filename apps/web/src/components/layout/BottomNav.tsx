import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/",           icon: "🏠", label: "Home"    },
  { path: "/menu",       icon: "🍔", label: "Menu"    },
  { path: "/reservation",icon: "📅", label: "Book"    },
  { path: "/order",      icon: "🛒", label: "Order"   },
];

export default function BottomNav() {
  const location = useLocation();

  // Hide on admin and login pages
  if (location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/login")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-yellow-400/20 text-yellow-400"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              <span className={`text-2xl transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-semibold ${isActive ? "text-yellow-400" : "text-gray-500"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-yellow-400" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area for phones with home indicator */}
      <div className="h-safe-area-inset-bottom bg-gray-900" />
    </nav>
  );
}
