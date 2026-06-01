import { LoaderCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type LoadingStateProps = React.ComponentProps<"section"> & {
  title?: string;
  description?: string;
};

function LoadingState({
  className,
  title = "Carregando",
  description,
  ...props
}: LoadingStateProps) {
  return (
    <section
      data-slot="loading-state"
      className={cn(
        "flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      <LoaderCircle className="size-7 animate-spin text-primary" />
      <div className="grid gap-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </section>
  );
}

export { LoadingState };
