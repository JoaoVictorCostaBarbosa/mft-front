"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthField } from "@/features/auth/components/auth-field";
import { AuthFormLayout } from "@/features/auth/components/auth-form-layout";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import type { AuthSession } from "@/features/auth/types";
import { signIn } from "@/features/auth/api/auth-api";
import { markAuthEntrySeen } from "@/features/auth/lib/auth-entry-storage";
import { ApiError, getApiErrorMessage } from "@/lib/http";
import { routes } from "@/lib/routes";
import { useAuthSession } from "@/features/auth";

export function SignInScreen() {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuthSession();
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    markAuthEntrySeen();
  }, []);

  const handleGoogleAuthenticated = React.useCallback(
    (session: AuthSession) => {
      markAuthEntrySeen();
      setAuthenticatedUser(session.user);
      router.push(routes.dashboard);
    },
    [router, setAuthenticatedUser],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const session = await signIn({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      markAuthEntrySeen();
      setAuthenticatedUser(session.user);
      router.push(routes.dashboard);
    } catch (error) {
      setError(
        error instanceof ApiError && error.status === 401
          ? "E-mail ou senha inválidos."
          : getApiErrorMessage(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormLayout
      title="Entre na sua conta"
      description="Acesse seus treinos, métricas e progresso em um só lugar."
      submitLabel="Entrar"
      footerText="Ainda não tem conta?"
      footerHref={routes.signUp}
      footerAction="Criar conta"
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      socialAction={
        <GoogleAuthButton
          disabled={isSubmitting}
          onAuthenticated={handleGoogleAuthenticated}
          onError={setError}
        />
      }
    >
      <AuthField label="E-mail" name="email" type="email" autoComplete="email" />
      <AuthField
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <Link
        href="#"
        className="justify-self-end text-xs text-muted-foreground hover:text-primary"
      >
        Esqueceu a senha?
      </Link>
    </AuthFormLayout>
  );
}
