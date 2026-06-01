import { AuthGuard } from "@/features/auth";
import { ProfileScreen } from "@/features/profile";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileScreen />
    </AuthGuard>
  );
}
