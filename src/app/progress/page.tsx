import { AuthGuard } from "@/features/auth";
import { ProgressScreen } from "@/features/progress";

export default function ProgressPage() {
  return (
    <AuthGuard>
      <ProgressScreen />
    </AuthGuard>
  );
}
