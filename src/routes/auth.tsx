import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — FieldFinder" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")), password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  };

  const signUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: String(fd.get("full_name")) },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're in!");
    navigate({ to: "/profile" });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-paper rounded-2xl shadow-elegant p-8">
        <h1 className="font-display text-3xl mb-1">Welcome</h1>
        <p className="text-muted-foreground text-sm mb-6">Save sites to your shortlist and personalize by field.</p>
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4">
              <div><Label htmlFor="si-email">Email</Label><Input id="si-email" name="email" type="email" required className="mt-1.5" /></div>
              <div><Label htmlFor="si-pw">Password</Label><Input id="si-pw" name="password" type="password" required minLength={6} className="mt-1.5" /></div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">Sign in</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4">
              <div><Label htmlFor="su-name">Full name</Label><Input id="su-name" name="full_name" required maxLength={100} className="mt-1.5" /></div>
              <div><Label htmlFor="su-email">Email</Label><Input id="su-email" name="email" type="email" required className="mt-1.5" /></div>
              <div><Label htmlFor="su-pw">Password</Label><Input id="su-pw" name="password" type="password" required minLength={6} className="mt-1.5" /></div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
