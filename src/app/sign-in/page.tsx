import { PublicAuthGuard, SignInScreen } from "@/features/auth";

export default function SignInPage() {
  return (
    <PublicAuthGuard>
      <SignInScreen />
    </PublicAuthGuard>
  );
}
