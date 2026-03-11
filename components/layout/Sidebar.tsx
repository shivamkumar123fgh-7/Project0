"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Auto collapse on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: "📊", link: "/dashboard" },
    { name: "Weekly", icon: "📅", link: "/weekly" },
    { name: "Monthly", icon: "🗓", link: "/monthly" },
    { name: "Yearly", icon: "📆", link: "/yearly" },
    { name: "Analytics", icon: "📈", link: "/analytics" },
    { name: "Reports", icon: "📑", link: "/reports" },
    { name: "Settings", icon: "⚙️", link: "/settings" },
  ];

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-64"}
        transition-all duration-500 ease-in-out
        bg-[#121212]
        min-h-screen
        border-r border-gray-800
        flex flex-col
        relative
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-yellow-400 font-bold text-xl tracking-wide">
            GrowthOS
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-yellow-400 text-lg hover:scale-110 transition"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col mt-6 space-y-2 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.link;

          return (
            <Link
              key={item.name}
              href={item.link}
              className={`
                group relative
                flex items-center gap-3
                px-4 py-2 rounded-lg
                transition-all duration-300
                ${isActive
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-yellow-400 hover:text-black"}
              `}
            >
              {/* Yellow indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-r"></div>
              )}

              <span className="text-lg">{item.icon}</span>

              {!collapsed && <span>{item.name}</span>}

              {collapsed && (
                <span className="
                  absolute left-20
                  bg-[#1a1a1a]
                  text-white text-sm
                  px-3 py-1 rounded-md
                  opacity-0 group-hover:opacity-100
                  transition
                  pointer-events-none
                  whitespace-nowrap
                ">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}