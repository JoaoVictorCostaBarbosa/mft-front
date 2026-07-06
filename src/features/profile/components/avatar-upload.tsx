"use client";

import { Camera, Loader2 } from "lucide-react";
import * as React from "react";

import { toast } from "@/components/ui/toast";
import { useAuthSession } from "@/features/auth";
import { updateUserAvatar } from "@/features/profile/api/profile-api";
import { getApiErrorMessage } from "@/lib/http";
import { cn } from "@/lib/utils";

const MAX_AVATAR_SIZE_BYTES = 2_000_000;
const ACCEPTED_MIME_TYPES = ["image/png", "image/jpeg"];

function getInitials(name?: string | null) {
  if (!name) return "U";
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

export function AvatarUpload() {
  const { user, setAuthenticatedUser } = useAuthSession();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Use uma imagem PNG ou JPEG.",
      });
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast({
        variant: "destructive",
        title: "Imagem muito grande",
        description: "O tamanho máximo é 2 MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const updatedUser = await updateUserAvatar(file);
      setAuthenticatedUser(updatedUser);
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao enviar a foto",
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={isUploading}
      onClick={() => inputRef.current?.click()}
      className="group relative size-[72px] shrink-0 overflow-hidden rounded-full border-[1.5px] border-primary bg-accent-soft"
      aria-label="Alterar foto de perfil"
    >
      {user?.url_img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.url_img}
          alt={user?.name ?? "Foto de perfil"}
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center font-display text-[28px] font-semibold text-primary">
          {getInitials(user?.name)}
        </span>
      )}

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/45 text-white transition-opacity",
          isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        {isUploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Camera className="size-5" />
        )}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
    </button>
  );
}
