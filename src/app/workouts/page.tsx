import { AuthGuard } from "@/features/auth";
import { WorkoutsScreen } from "@/features/workouts";

export default function WorkoutsPage() {
  return (
    <AuthGuard>
      <WorkoutsScreen />
    </AuthGuard>
  );
}
