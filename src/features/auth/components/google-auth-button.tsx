"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/app";
import { signInWithGoogle } from "@/features/auth/api/auth-api";
import type { AuthSession } from "@/features/auth/types";
import { getApiErrorMessage } from "@/lib/http";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleButtonShape = {
  accounts: {
    id: {
      initialize: (options: {
        callback: (response: GoogleCredentialResponse) => void;
        client_id: string;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          shape?: "rectangular" | "pill" | "circle" | "square";
          size?: "large" | "medium" | "small";
          text?: "signin_with" | "signup_with" | "continue_with" | "signin";
          theme?: "outline" | "filled_blue" | "filled_black";
          type?: "standard" | "icon";
          width?: string;
        },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleButtonShape;
  }
}

type GoogleAuthButtonProps = {
  disabled?: boolean;
  onAuthenticated: (session: AuthSession) => void;
  onError: (message: string) => void;
};

const googleScriptId = "google-identity-services";
const googleScriptSrc = "https://accounts.google.com/gsi/client";

export function GoogleAuthButton({
  disabled = false,
  onAuthenticated,
  onError,
}: GoogleAuthButtonProps) {
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const googleClientId = appConfig.googleClientId;

  React.useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const existingScript = document.getElementById(googleScriptId);

    if (window.google) {
      setIsReady(true);
      return;
    }

    function handleLoad() {
      setIsReady(true);
    }

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
    }

    const script = document.createElement("script");
    script.id = googleScriptId;
    script.src = googleScriptSrc;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, [googleClientId]);

  React.useEffect(() => {
    if (!googleClientId || !isReady || !buttonRef.current || !window.google) {
      return;
    }

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response.credential) {
          onError("Não foi possível obter o token do Google.");
          return;
        }

        setIsLoading(true);

        try {
          const session = await signInWithGoogle({
            id_token: response.credential,
          });
          onAuthenticated(session);
        } catch (error) {
          onError(getApiErrorMessage(error));
        } finally {
          setIsLoading(false);
        }
      },
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      shape: "rectangular",
      size: "large",
      text: "continue_with",
      theme: "outline",
      type: "standard",
      width: "400",
    });
  }, [googleClientId, isReady, onAuthenticated, onError]);

  if (!googleClientId) {
    return (
      <Button type="button" variant="outline" className="h-11" disabled>
        Google não configurado
      </Button>
    );
  }

  return (
    <div
      className={
        disabled || isLoading
          ? "pointer-events-none relative opacity-60"
          : "relative"
      }
    >
      <Button
        type="button"
        variant="outline"
        className="pointer-events-none h-11 w-full gap-3 bg-background"
        tabIndex={-1}
      >
        <span className="text-lg font-bold text-primary">G</span>
        {isLoading ? "Aguarde..." : "Continuar com Google"}
      </Button>
      <div
        ref={buttonRef}
        className="absolute inset-0 z-10 h-11 overflow-hidden opacity-0"
      />
    </div>
  );
}
