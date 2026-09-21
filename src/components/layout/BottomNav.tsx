"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./navConfig";
import { cn } from "@/lib/utils";

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const primaryItems = items.filter((i) => i.primary).slice(0, 5);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg-secondary/90 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const itemClass = cn(
            "flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
            active ? "text-blue-bright" : "text-text-secondary",
            item.disabled && "opacity-40"
          );

          if (item.disabled) {
            return (
              <li key={item.label} className="flex-1">
                <button type="button" disabled className={itemClass}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={itemClass}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
