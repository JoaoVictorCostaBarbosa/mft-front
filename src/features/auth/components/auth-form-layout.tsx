import { Dumbbell } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthFormLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  submitLabel: string;
  footerText: string;
  footerHref: string;
  footerAction: string;
  error?: string;
  success?: string;
  isSubmitting?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  className?: string;
  socialAction?: React.ReactNode;
};

export function AuthFormLayout({
  title,
  description,
  children,
  submitLabel,
  footerText,
  footerHref,
  footerAction,
  error,
  success,
  isSubmitting,
  onSubmit,
  className,
  socialAction,
}: AuthFormLayoutProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center bg-background px-6 py-10">
      <section className={cn("grid gap-7", className)}>
        <div className="grid gap-6">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-[10px] bg-primary">
              <Dumbbell className="size-5 text-primary-foreground stroke-[2.4]" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              fittrack
            </span>
          </div>
          <div className="grid gap-1.5">
            <h1 className="font-display text-[1.75rem] font-bold tracking-[-0.025em] text-foreground">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={onSubmit}>
          {error ? (
            <div
              role="alert"
              className="rounded-[10px] border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}
          {success ? (
            <div
              role="status"
              className="rounded-[10px] border border-primary/30 bg-accent-soft px-3 py-2.5 text-sm text-primary"
            >
              {success}
            </div>
          ) : null}
          {children}
          <Button
            type="submit"
            className="mt-1 h-12 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Aguarde..." : submitLabel}
          </Button>
        </form>

        {socialAction ? (
          <>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>ou continue com</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            {socialAction}
          </>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link href={footerHref} className="font-semibold text-primary hover:underline">
            {footerAction}
          </Link>
        </p>
      </section>
    </main>
  );
}
