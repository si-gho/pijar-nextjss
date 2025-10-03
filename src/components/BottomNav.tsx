"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Clock, Package, User } from "lucide-react";

const navItems = [
  { to: "/operations", label: "Operasi", icon: Activity },
  { to: "/operations/histories", label: "Riwayat", icon: Clock },
  { to: "/operations/stocks", label: "Stok", icon: Package },
  { to: "/operations/users", label: "Profil", icon: User },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50 backdrop-blur-lg">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.to || (item.to === "/operations" && pathname === "/operations");
          
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all duration-300 rounded-xl relative group ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"></div>
              )}
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-primary/10 scale-110" 
                  : "group-hover:bg-muted/50 group-hover:scale-105"
              }`}>
                <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              </div>
              <span className={`text-xs font-semibold ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};