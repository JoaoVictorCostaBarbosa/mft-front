import { PublicAuthGuard } from "@/features/auth";
import { OnboardingScreen } from "@/features/onboarding";

export default function OnboardingPage() {
  return (
    <PublicAuthGuard>
      <OnboardingScreen />
    </PublicAuthGuard>
  );
}
