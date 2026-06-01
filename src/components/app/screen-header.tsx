import * as React from "react";

import { cn } from "@/lib/utils";

type ScreenHeaderProps = React.ComponentProps<"header"> & {
  title: string;
  description?: string;
};

export function ScreenHeader({
  className,
  title,
  description,
  ...props
}: ScreenHeaderProps) {
  return (
    <header className={cn("mb-6 grid gap-1.5", className)} {...props}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      {description ? (
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
