import { AuthGuard } from "@/features/auth";
import { WorkoutPlanScreen } from "@/features/workouts";

type WorkoutPlanPageProps = {
  params: Promise<{
    planId: string;
  }>;
};

export default async function WorkoutPlanPage({ params }: WorkoutPlanPageProps) {
  const { planId } = await params;

  return (
    <AuthGuard>
      <WorkoutPlanScreen planId={planId} />
    </AuthGuard>
  );
}
