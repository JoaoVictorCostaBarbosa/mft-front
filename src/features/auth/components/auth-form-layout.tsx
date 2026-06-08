import Link from "next/link";
import * as React from "react";

import { AppLogo } from "@/components/app/app-logo";
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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center bg-background px-5 py-8">
      <section className={cn("grid gap-6", className)}>
        <div className="grid gap-8">
          <AppLogo textClassName="text-2xl" />
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <form
          className="grid gap-4 rounded-lg border border-border bg-background p-4 shadow-sm"
          onSubmit={onSubmit}
        >
          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}
          {success ? (
            <div
              role="status"
              className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success"
            >
              {success}
            </div>
          ) : null}
          {children}
          <Button
            type="submit"
            className="mt-2 h-12 rounded-lg text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Aguarde..." : submitLabel}
          </Button>
        </form>

        {socialAction ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>ou</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            {socialAction}
          </>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link href={footerHref} className="font-semibold text-primary">
            {footerAction}
          </Link>
        </p>
      </section>
    </main>
  );
}
