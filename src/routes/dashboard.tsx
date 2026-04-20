import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Bookmark, ExternalLink, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

type Row = {
  site_id: string;
  sites: { id: string; name: string; url: string; description: string | null; category: string | null; region: string | null; field_id: string } | null;
};
type Field = { id: string; name: string; icon: string | null };

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "My shortlist — FieldFinder" }] }),
});

function Dashboard() {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Row[]>([]);
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("favorites").select("site_id, sites(id,name,url,description,category,region,field_id)").eq("user_id", user.id)
      .then(({ data }) => setItems((data as unknown as Row[]) ?? []));
    supabase.from("fields").select("id,name,icon").then(({ data }) => setFields((data as Field[]) ?? []));
  }, [user]);

  const remove = async (siteId: string) => {
    if (!user) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("site_id", siteId);
    setItems((p) => p.filter((r) => r.site_id !== siteId));
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</p>
        <h1 className="font-display text-4xl md:text-5xl font-light mt-1">Your shortlist</h1>
        <p className="text-muted-foreground mt-2">Sites you've saved for {profile?.field_of_study || "your studies"}.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-paper rounded-2xl shadow-paper p-12 text-center">
          <Compass className="w-10 h-10 text-amber mx-auto mb-4" />
          <h3 className="font-display text-2xl mb-2">Nothing saved yet</h3>
          <p className="text-muted-foreground mb-6">Browse the directory and bookmark sites for later.</p>
          <Button asChild className="bg-primary text-primary-foreground"><Link to="/browse">Browse sites</Link></Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((row) => row.sites && (
            <article key={row.site_id} className="p-6 rounded-xl bg-paper border border-border shadow-paper">
              <div className="flex items-center gap-2 mb-2">
                <span>{fields.find((f) => f.id === row.sites!.field_id)?.icon}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{fields.find((f) => f.id === row.sites!.field_id)?.name}</span>
              </div>
              <h3 className="font-display text-2xl">{row.sites.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{row.sites.description}</p>
              <div className="flex items-center justify-between mt-5">
                <a href={row.sites.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-amber">
                  Visit <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => remove(row.site_id)} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"><Bookmark className="w-3 h-3" /> Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
