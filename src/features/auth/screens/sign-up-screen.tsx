"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { signUp, verifyAccount } from "@/features/auth/api/auth-api";
import { AuthField } from "@/features/auth/components/auth-field";
import { AuthFormLayout } from "@/features/auth/components/auth-form-layout";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/http";
import { routes } from "@/lib/routes";
import { useAuthSession } from "@/features/auth";

export function SignUpScreen() {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuthSession();
  const [emailToVerify, setEmailToVerify] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const email = String(formData.get("email") ?? "");

      await signUp({
        name: String(formData.get("name") ?? ""),
        email,
        password: String(formData.get("password") ?? ""),
      });
      setEmailToVerify(email);
      setSuccess("Enviamos um código de 6 dígitos para o seu e-mail.");
    } catch (error) {
      setError(getApiErrorMessage(error));
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
