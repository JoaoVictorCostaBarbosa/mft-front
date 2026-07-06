import { AuthGuard } from "@/features/auth";
import { BodyMetricsScreen } from "@/features/body-metrics";

export default function BodyMetricsPage() {
  return (
    <AuthGuard>
      <BodyMetricsScreen />
    </AuthGuard>
  );
}
