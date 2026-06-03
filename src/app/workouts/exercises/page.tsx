import { AuthGuard } from "@/features/auth";
import { ExerciseLibraryScreen } from "@/features/workouts";

export default function WorkoutExercisesPage() {
  return (
    <AuthGuard>
      <ExerciseLibraryScreen />
    </AuthGuard>
  );
}
