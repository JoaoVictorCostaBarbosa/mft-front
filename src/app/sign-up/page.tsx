import { PublicAuthGuard, SignUpScreen } from "@/features/auth";

export default function SignUpPage() {
  return (
    <PublicAuthGuard>
      <SignUpScreen />
    </PublicAuthGuard>
  );
}
