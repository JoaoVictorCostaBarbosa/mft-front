"use client";

import * as React from "react";

import { signUp } from "@/features/auth/api/auth-api";
import { AuthField } from "@/features/auth/components/auth-field";
import { AuthFormLayout } from "@/features/auth/components/auth-form-layout";
import { getApiErrorMessage } from "@/lib/http";
import { routes } from "@/lib/routes";

export function SignUpScreen() {
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await signUp({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      setSuccess("Conta criada. Verifique seu e-mail para continuar.");
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
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
      onSubmit={handleSubmit}
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
