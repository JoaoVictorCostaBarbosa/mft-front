import { PublicAuthGuard } from "@/features/auth";
import { OnboardingScreen } from "@/features/onboarding";

export default function Home() {
  return (
    <PublicAuthGuard>
      <OnboardingScreen />
    </PublicAuthGuard>
  );
}
