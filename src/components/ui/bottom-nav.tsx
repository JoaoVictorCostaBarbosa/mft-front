"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

type BottomNavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

type BottomNavProps = React.ComponentProps<"nav"> & {
  items: BottomNavItem[];
};

function BottomNav({ className, items, ...props }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur supports-[backdrop-filter]:bg-card/85",
        className,
      )}
      {...props}
    >
      <div
        className="mx-auto grid max-w-md grid-cols-[repeat(var(--bottom-nav-count),minmax(0,1fr))]"
        style={
          {
            "--bottom-nav-count": items.length,
          } as React.CSSProperties
        }
      >
        {items.map((item) => {
          const isActive = item.active ?? pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[3rem] flex-col items-center justify-center gap-0.5 rounded-md px-1 transition-colors",
                isActive ? "text-primary" : "text-faint hover:text-muted-foreground",
              )}
            >
              <span className="[&_svg]:size-[22px] [&_svg]:stroke-[2]">{item.icon}</span>
              <span className="text-[9.5px] font-semibold max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { BottomNav, type BottomNavItem };
