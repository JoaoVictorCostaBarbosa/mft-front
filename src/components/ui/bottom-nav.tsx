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
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/85",
        className,
      )}
      {...props}
    >
      <div
        className="mx-auto grid max-w-md grid-cols-[repeat(var(--bottom-nav-count),minmax(0,1fr))] gap-1"
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
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                isActive && "bg-secondary text-primary",
              )}
            >
              <span className="[&_svg]:size-5">{item.icon}</span>
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { BottomNav, type BottomNavItem };
