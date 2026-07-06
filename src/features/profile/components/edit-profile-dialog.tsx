"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useAuthSession } from "@/features/auth";
import {
  sendChangeCode,
  updateUserEmail,
  updateUserName,
  updateUserPassword,
} from "@/features/profile/api/profile-api";
import { ApiError, getApiErrorMessage } from "@/lib/http";

type EditableField = "name" | "email" | "password";

type Step = "value" | "code";

const fieldOptions: Array<{ value: EditableField; label: string }> = [
  { value: "name", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "password", label: "Senha" },
];

const fieldInputProps: Record<
  EditableField,
  { label: string; type: string; placeholder: string; autoComplete: string }
> = {
  name: {
    label: "Novo nome",
    type: "text",
    placeholder: "Como quer ser chamado",
    autoComplete: "name",
  },
  email: {
    label: "Novo e-mail",
    type: "email",
    placeholder: "voce@exemplo.com",
    autoComplete: "email",
  },
  password: {
    label: "Nova senha",
    type: "password",
    placeholder: "Mínimo 8 caracteres, letras e números",
    autoComplete: "new-password",
  },
};

function validateValue(field: EditableField, value: string) {
  if (field === "name" && !value.trim()) {
    return "Informe o novo nome.";
  }

  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Informe um e-mail válido.";
  }

  if (field === "password") {
    if (value.trim().length < 8) {
      return "A senha precisa de pelo menos 8 caracteres.";
    }
    if (!/[A-Za-z]/.test(value)) {
      return "A senha precisa de pelo menos 1 letra.";
    }
    if (!/\d/.test(value)) {
      return "A senha precisa de pelo menos 1 número.";
    }
  }

  return "";
}

type EditProfileDialogProps = {
  children: React.ReactNode;
};

export function EditProfileDialog({ children }: EditProfileDialogProps) {
  const { setAuthenticatedUser } = useAuthSession();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>("value");
  const [field, setField] = React.useState<EditableField>("name");
  const [value, setValue] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function resetState() {
    setStep("value");
    setField("name");
    setValue("");
    setCode("");
    setError("");
    setNotice("");
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);

    if (!isOpen) {
      resetState();
    }
  }

  async function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const validationError = validateValue(field, value);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await sendChangeCode();
      setNotice("Código enviado para o seu e-mail atual. Vale por 10 minutos.");
      setStep("code");
    } catch (error) {
      // 409: já existe um código válido — segue para a etapa de confirmação.
      if (error instanceof ApiError && error.status === 409) {
        setNotice("Um código já foi enviado ao seu e-mail. Use-o abaixo.");
        setStep("code");
      } else {
        setError(getApiErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedCode = Number(code.trim());

    if (!/^\d{6}$/.test(code.trim())) {
      setError("Informe o código de 6 dígitos enviado por e-mail.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (field === "name") {
        const updatedUser = await updateUserName({
          name: value.trim(),
          code: parsedCode,
        });
        setAuthenticatedUser(updatedUser);
      } else if (field === "email") {
        const updatedUser = await updateUserEmail({
          email: value.trim(),
          code: parsedCode,
        });
        setAuthenticatedUser(updatedUser);
      } else {
        await updateUserPassword({ password: value, code: parsedCode });
      }

      toast({
        title: "Perfil atualizado",
        description:
          field === "password"
            ? "Sua senha foi alterada com sucesso."
            : `Seu ${field === "name" ? "nome" : "e-mail"} foi alterado com sucesso.`,
      });
      setOpen(false);
      resetState();
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setError("Código incorreto ou expirado. Confira o e-mail e tente novamente.");
      } else {
        setError(getApiErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputProps = fieldInputProps[field];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            {step === "value"
              ? "Alterações são confirmadas com um código enviado ao seu e-mail."
              : "Digite o código de 6 dígitos que enviamos para o seu e-mail."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={step === "value" ? handleSendCode : handleConfirm}
        >
          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          {notice && step === "code" ? (
            <div className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
              {notice}
            </div>
          ) : null}

          {step === "value" ? (
            <>
              <div className="grid gap-2">
                <Label>O que deseja alterar?</Label>
                <Select
                  value={field}
                  onValueChange={(newField) => {
                    setField(newField as EditableField);
                    setValue("");
                    setError("");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-profile-value">{inputProps.label}</Label>
                <Input
                  id="edit-profile-value"
                  type={inputProps.type}
                  placeholder={inputProps.placeholder}
                  autoComplete={inputProps.autoComplete}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="edit-profile-code">Código de verificação</Label>
              <Input
                id="edit-profile-code"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, ""))
                }
                disabled={isSubmitting}
              />
            </div>
          )}

          <DialogFooter>
            {step === "code" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  setStep("value");
                  setCode("");
                  setError("");
                }}
              >
                Voltar
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {step === "value"
                ? isSubmitting
                  ? "Enviando código..."
                  : "Enviar código"
                : isSubmitting
                  ? "Confirmando..."
                  : "Confirmar alteração"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
