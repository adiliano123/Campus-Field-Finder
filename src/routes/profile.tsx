import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "My profile — FieldFinder" }] }),
});

function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<{ name: string }[]>([]);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => { supabase.from("fields").select("name").order("name").then(({ data }) => setFields(data ?? [])); }, []);

  if (!user) return null;

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: String(fd.get("full_name") || "").slice(0, 120),
      university: String(fd.get("university") || "").slice(0, 200),
      field_of_study: String(fd.get("field_of_study") || "").slice(0, 120),
      year_of_study: String(fd.get("year_of_study") || "").slice(0, 40),
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    await refreshProfile();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl md:text-5xl font-light mb-2">Your profile</h1>
      <p className="text-muted-foreground mb-8">Tell us about your studies to personalize your shortlist.</p>
      <form onSubmit={save} className="bg-paper rounded-2xl shadow-paper p-8 space-y-5">
        <div><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} maxLength={120} className="mt-1.5" /></div>
        <div><Label htmlFor="university">University / College</Label><Input id="university" name="university" defaultValue={profile?.university ?? ""} maxLength={200} className="mt-1.5" /></div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="field_of_study">Field of study</Label>
            <Input id="field_of_study" name="field_of_study" list="field-options" defaultValue={profile?.field_of_study ?? ""} maxLength={120} className="mt-1.5" placeholder="e.g. Computer Science" />
            <datalist id="field-options">{fields.map((f) => <option key={f.name} value={f.name} />)}</datalist>
          </div>
          <div>
            <Label htmlFor="year_of_study">Year</Label>
            <Input id="year_of_study" name="year_of_study" defaultValue={profile?.year_of_study ?? ""} maxLength={40} className="mt-1.5" placeholder="e.g. 2nd year" />
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Email: {user.email}</div>
        <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">Save profile</Button>
      </form>
    </div>
  );
}
