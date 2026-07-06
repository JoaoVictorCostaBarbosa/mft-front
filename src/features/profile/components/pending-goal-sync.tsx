"use client";

import * as React from "react";

import { useAuthSession } from "@/features/auth";
import { updateUserGoal } from "@/features/profile/api/profile-api";
import {
  clearPendingGoal,
  readPendingGoal,
} from "@/features/profile/lib/pending-goal";

/**
 * Aplica o objetivo escolhido no onboarding (guardado em localStorage antes
 * do cadastro) assim que o usuário estiver autenticado. Um objetivo já salvo
 * na conta tem prioridade: nesse caso o pendente é descartado.
 */
export function PendingGoalSync() {
  const { status, user, setAuthenticatedUser } = useAuthSession();
  const isSyncingRef = React.useRef(false);

  React.useEffect(() => {
    if (status !== "authenticated" || !user || isSyncingRef.current) {
      return;
    }

    const pendingGoal = readPendingGoal();

    if (!pendingGoal) {
      return;
    }

    if (user.goal) {
      clearPendingGoal();
      return;
    }

    isSyncingRef.current = true;

    updateUserGoal(pendingGoal)
      .then((updatedUser) => {
        clearPendingGoal();
        setAuthenticatedUser(updatedUser);
      })
      .catch(() => {
        // Mantém o pendente para tentar de novo na próxima sessão.
      })
      .finally(() => {
        isSyncingRef.current = false;
      });
  }, [status, user, setAuthenticatedUser]);

  return null;
}
