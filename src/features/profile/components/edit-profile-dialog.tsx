"use client";

import { ChevronLeft, ChevronRight, KeyRound, UserRound } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useAuthSession } from "@/features/auth";
import {
  sendChangeCode,
  updateUserName,
  updateUserPassword,
} from "@/features/profile/api/profile-api";
import { AvatarUpload } from "@/features/profile/components/avatar-upload";
import { ApiError, getApiErrorMessage } from "@/lib/http";

type View = "menu" | "name" | "password" | "code";

function validateName(value: string) {
  if (!value.trim()) {
    return "Informe o novo nome.";
  }

  return "";
}

function validatePassword(value: string) {
  if (value.trim().length < 8) {
    return "A senha precisa de pelo menos 8 caracteres.";
  }
  if (!/[A-Za-z]/.test(value)) {
    return "A senha precisa de pelo menos 1 letra.";
  }
  if (!/\d/.test(value)) {
    return "A senha precisa de pelo menos 1 número.";
  }

  return "";
}

const viewCopy: Record<View, { title: string; description: string }> = {
  menu: {
    title: "Editar perfil",
    description: "Toque na foto para alterá-la ou escolha um campo para editar.",
  },
  name: {
    title: "Alterar nome",
    description: "Seu nome é exibido no painel e no perfil.",
  },
  password: {
    title: "Alterar senha",
    description: "A alteração é confirmada com um código enviado ao seu e-mail.",
  },
  code: {
    title: "Confirmar alteração",
    description: "Digite o código de 6 dígitos que enviamos para o seu e-mail.",
  },
};

type EditProfileDialogProps = {
  children: React.ReactNode;
};

export function EditProfileDialog({ children }: EditProfileDialogProps) {
  const { user, setAuthenticatedUser } = useAuthSession();
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<View>("menu");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function resetState() {
    setView("menu");
    setName("");
    setPassword("");
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

  function backToMenu() {
    setView("menu");
    setName("");
    setPassword("");
    setCode("");
    setError("");
    setNotice("");
  }

  async function handleSaveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateName(name);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await updateUserName({ name: name.trim() });
      setAuthenticatedUser(updatedUser);
      toast({
        title: "Perfil atualizado",
        description: "Seu nome foi alterado com sucesso.",
      });
      backToMenu();
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const validationError = validatePassword(password);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await sendChangeCode();
      setNotice("Código enviado para o seu e-mail. Vale por 10 minutos.");
      setView("code");
    } catch (error) {
      // 409: já existe um código válido — segue para a etapa de confirmação.
      if (error instanceof ApiError && error.status === 409) {
        setNotice("Um código já foi enviado ao seu e-mail. Use-o abaixo.");
        setView("code");
      } else {
        setError(getApiErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmPassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(code.trim())) {
      setError("Informe o código de 6 dígitos enviado por e-mail.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserPassword({ password, code: Number(code.trim()) });
      toast({
        title: "Perfil atualizado",
        description: "Sua senha foi alterada com sucesso.",
      });
      backToMenu();
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

  const submitHandlers: Partial<
    Record<View, (event: React.FormEvent<HTMLFormElement>) => Promise<void>>
  > = {
    name: handleSaveName,
    password: handleSendCode,
    code: handleConfirmPassword,
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{viewCopy[view].title}</DialogTitle>
          <DialogDescription>{viewCopy[view].description}</DialogDescription>
        </DialogHeader>

        {view === "menu" ? (
          <div className="grid gap-5">
            <div className="flex flex-col items-center gap-2.5">
              <AvatarUpload size="lg" />
              <p className="text-[13px] font-medium text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-border">
              <button
                type="button"
                onClick={() => {
                  setName(user?.name ?? "");
                  setError("");
                  setView("name");
                }}
                className="flex w-full items-center gap-3.5 border-b border-border px-4 py-[13px] text-left transition-colors hover:bg-secondary/60"
              >
                <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-border bg-secondary text-muted-foreground">
                  <UserRound className="size-[18px]" />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-muted-foreground">
                    Nome
                  </span>
                  <span className="block truncate text-[15px] font-semibold text-foreground">
                    {user?.name ?? "—"}
                  </span>
                </span>
                <ChevronRight className="size-[18px] shrink-0 text-faint" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPassword("");
                  setError("");
                  setView("password");
                }}
                className="flex w-full items-center gap-3.5 px-4 py-[13px] text-left transition-colors hover:bg-secondary/60"
              >
                <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-border bg-secondary text-muted-foreground">
                  <KeyRound className="size-[18px]" />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-muted-foreground">
                    Senha
                  </span>
                  <span className="block text-[15px] font-semibold text-foreground">
                    ••••••••
                  </span>
                </span>
                <ChevronRight className="size-[18px] shrink-0 text-faint" />
              </button>
            </div>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={submitHandlers[view]}>
            {error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}

            {notice && view === "code" ? (
              <div className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                {notice}
              </div>
            ) : null}

            {view === "name" ? (
              <div className="grid gap-2">
                <Label htmlFor="edit-profile-name">Novo nome</Label>
                <Input
                  id="edit-profile-name"
                  type="text"
                  placeholder="Como quer ser chamado"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
            ) : null}

            {view === "password" ? (
              <div className="grid gap-2">
                <Label htmlFor="edit-profile-password">Nova senha</Label>
                <Input
                  id="edit-profile-password"
                  type="password"
                  placeholder="Mínimo 8 caracteres, letras e números"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
            ) : null}

            {view === "code" ? (
              <div className="grid gap-2">
                <Label htmlFor="edit-profile-code" className="sr-only">
                  Código de verificação
                </Label>
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
                  autoFocus
                  className="h-14 text-center font-display text-2xl font-semibold tracking-[0.4em]"
                />
              </div>
            ) : null}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                disabled={isSubmitting}
                onClick={() => {
                  if (view === "code") {
                    setView("password");
                    setCode("");
                    setError("");
                  } else {
                    backToMenu();
                  }
                }}
              >
                <ChevronLeft className="size-4" />
                Voltar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {view === "name"
                  ? isSubmitting
                    ? "Salvando..."
                    : "Salvar"
                  : view === "password"
                    ? isSubmitting
                      ? "Enviando código..."
                      : "Enviar código"
                    : isSubmitting
                      ? "Confirmando..."
                      : "Confirmar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
