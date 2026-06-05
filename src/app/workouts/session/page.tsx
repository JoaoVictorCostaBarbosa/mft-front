import { AuthGuard } from "@/features/auth";
import { WorkoutSessionScreen } from "@/features/workout-sessions";

export default function WorkoutSessionPage() {
  return (
    <AuthGuard>
      <WorkoutSessionScreen />
    </AuthGuard>
  );
}
