import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export function AppLogo({
  className,
  markClassName,
  textClassName,
  showText = true,
}: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex size-10 items-center justify-center", markClassName)}>
        <ChevronRight className="absolute size-10 translate-x-[-6px] text-primary" strokeWidth={4} />
        <ChevronRight className="absolute size-10 translate-x-[6px] text-primary" strokeWidth={4} />
      </div>
      {showText ? (
        <span className={cn("text-3xl font-bold tracking-tight text-foreground", textClassName)}>
          myFitTracker
        </span>
      ) : null}
    </div>
  );
}
