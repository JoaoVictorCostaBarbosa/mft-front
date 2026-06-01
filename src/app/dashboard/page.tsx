import { AuthGuard } from "@/features/auth";
import { DashboardScreen } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardScreen />
    </AuthGuard>
  );
}
