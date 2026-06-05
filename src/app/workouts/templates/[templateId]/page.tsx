import { AuthGuard } from "@/features/auth";
import { WorkoutTemplateScreen } from "@/features/workouts";

type WorkoutTemplatePageProps = {
  params: Promise<{
    templateId: string;
  }>;
  searchParams: Promise<{
    planId?: string;
  }>;
};

export default async function WorkoutTemplatePage({
  params,
  searchParams,
}: WorkoutTemplatePageProps) {
  const [{ templateId }, { planId }] = await Promise.all([
    params,
    searchParams,
  ]);

  return (
    <AuthGuard>
      <WorkoutTemplateScreen planId={planId} templateId={templateId} />
    </AuthGuard>
  );
}
