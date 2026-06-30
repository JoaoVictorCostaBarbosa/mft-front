"use client";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Logo */}
      <div className="flex flex-col items-center gap-5">
        <div
          className="flex size-[56px] items-center justify-center rounded-[18px] bg-primary"
          style={{ boxShadow: "0 6px 24px -6px var(--primary)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary-foreground)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 13l4-1 3 5 3-11 3 7h3" />
          </svg>
        </div>
        <span className="font-display text-[26px] font-bold tracking-[-0.03em] text-foreground">
          fittrack
        </span>
      </div>

      {/* Spinner */}
      <div className="mt-10">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    </div>
  );
}
