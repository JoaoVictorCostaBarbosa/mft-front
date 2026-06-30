import * as React from "react";

import { AppBottomNav } from "@/components/app/app-bottom-nav";
import { cn } from "@/lib/utils";

type AppScreenProps = React.ComponentProps<"main"> & {
  withBottomNav?: boolean;
};

export function AppScreen({
  className,
  children,
  withBottomNav = true,
  ...props
}: AppScreenProps) {
  return (
    <>
      <main
        className={cn(
          "mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-[calc(env(safe-area-inset-top)+3.25rem)]",
          className,
        )}
        {...props}
      >
        {children}
      </main>
      {withBottomNav ? <AppBottomNav /> : null}
    </>
  );
}
