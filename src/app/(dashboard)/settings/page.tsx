import { getUserSettings } from "@/server/actions/settings";
import { SettingsForm } from "@/components/settings/settings-form";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getUserSettings();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
          System <span className="text-muted-foreground italic font-normal">Settings</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and workspace configuration.
        </p>
      </div>

      <SettingsForm user={{
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio
      }} />
    </div>
  );
}
