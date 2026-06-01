import { AlertTriangle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type ErrorStateProps = React.ComponentProps<"section"> & {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

function ErrorState({
  className,
  title = "Algo deu errado",
  description,
  action,
  ...props
}: ErrorStateProps) {
  return (
    <section
      data-slot="error-state"
      className={cn(
        "flex min-h-64 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/40 bg-destructive/10 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
        <AlertTriangle className="size-6" />
      </div>
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </section>
  );
}

export { ErrorState };
