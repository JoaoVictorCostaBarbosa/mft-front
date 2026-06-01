import * as React from "react";

import { cn } from "@/lib/utils";

function PageContainer({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="page-container"
      className={cn(
        "mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+5rem)] pt-[calc(env(safe-area-inset-top)+1rem)]",
        className,
      )}
      {...props}
    />
  );
}

export { PageContainer };
