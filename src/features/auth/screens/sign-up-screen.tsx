"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { signUp, verifyAccount } from "@/features/auth/api/auth-api";
import { AuthField } from "@/features/auth/components/auth-field";
import { AuthFormLayout } from "@/features/auth/components/auth-form-layout";
import { markAuthEntrySeen } from "@/features/auth/lib/auth-entry-storage";
import { Button } from "@/components/ui/button";
import { ApiError, getApiErrorMessage } from "@/lib/http";
import { routes } from "@/lib/routes";
import { useAuthSession } from "@/features/auth";

export function SignUpScreen() {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuthSession();
  const [emailToVerify, setEmailToVerify] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    markAuthEntrySeen();
  }, []);

  function validatePassword(password: string): string | null {
    if (password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres.";
    }

    if (!/[A-Z]/.test(password)) {
      return "A senha deve conter ao menos uma letra maiúscula.";
    }

    if (!/[0-9]/.test(password)) {
      return "A senha deve conter ao menos um número.";
    }

    return null;
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        name: String(formData.get("name") ?? ""),
        email,
        password: String(formData.get("password") ?? ""),
      });
      setEmailToVerify(email);
      setSuccess("Enviamos um código de 6 dígitos para o seu e-mail.");
    } catch (error) {
      setError(
        error instanceof ApiError && error.status === 409
          ? "Este e-mail já está em uso."
          : getApiErrorMessage(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const code = Number(String(formData.get("code") ?? "").trim());

    try {
      const session = await verifyAccount({
        email: emailToVerify,
        code,
      });
      markAuthEntrySeen();
      setAuthenticatedUser(session.user);
      router.push(routes.dashboard);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (emailToVerify) {
    return (
      <AuthFormLayout
        key="verify"
        title="Confirme seu e-mail"
        description={`Digite o código de 6 dígitos enviado para ${emailToVerify}.`}
        submitLabel="Confirmar código"
        footerText="Informou o e-mail errado?"
        footerHref={routes.signUp}
        footerAction="Voltar"
        error={error}
        success={success}
        isSubmitting={isSubmitting}
        onSubmit={handleVerify}
      >
        <AuthField
          label="Código"
          name="code"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
        />
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => {
            setEmailToVerify("");
            setError("");
            setSuccess("");
          }}
        >
          Trocar e-mail
        </Button>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      key="signup"
      title="Crie sua conta"
      description="Comece a organizar treinos e acompanhar sua evolução física."
      submitLabel="Criar conta"
      footerText="Já tem conta?"
      footerHref={routes.signIn}
      footerAction="Entrar"
      error={error}
      success={success}
      isSubmitting={isSubmitting}
      onSubmit={handleSignUp}
    >
      <AuthField label="Nome" name="name" autoComplete="name" />
      <AuthField label="E-mail" name="email" type="email" autoComplete="email" />
      <AuthField
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
      />
    </AuthFormLayout>
  );
}
