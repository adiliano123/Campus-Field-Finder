import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, BookmarkCheck, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

type Field = { id: string; name: string; slug: string; icon: string | null };
type Site = {
  id: string; field_id: string; name: string; url: string;
  description: string | null; category: string | null; region: string | null; is_free: boolean | null;
};

export const Route = createFileRoute("/browse")({
  validateSearch: (s: Record<string, unknown>) => ({
    field: typeof s.field === "string" ? s.field : "",
    q: typeof s.q === "string" ? s.q : "",
  }),
  component: Browse,
  head: () => ({
    meta: [
      { title: "Browse internship sites by field — FieldFinder" },
      { name: "description", content: "Browse curated job and internship sites organized by academic field." },
    ],
  }),
});

function Browse() {
  const { field, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const { user } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [favs, setFavs] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from("fields").select("id,name,slug,icon").order("name").then(({ data }) => setFields((data as Field[]) ?? []));
    supabase.from("sites").select("*").order("name").then(({ data }) => setSites((data as Site[]) ?? []));
  }, []);

  useEffect(() => {
    if (!user) { setFavs(new Set()); return; }
    supabase.from("favorites").select("site_id").eq("user_id", user.id).then(({ data }) => {
      setFavs(new Set((data ?? []).map((d) => d.site_id as string)));
    });
  }, [user]);

  const filtered = useMemo(() => {
    const byField = field ? sites.filter((s) => fields.find((f) => f.id === s.field_id)?.slug === field) : sites;
    const ql = q.toLowerCase().trim();
    return ql ? byField.filter((s) => s.name.toLowerCase().includes(ql) || s.description?.toLowerCase().includes(ql) || s.category?.toLowerCase().includes(ql)) : byField;
  }, [sites, fields, field, q]);

  const toggleFav = async (siteId: string) => {
    if (!user) {
      toast.info("Sign in to save sites");
      navigate({ to: "/auth" } as never);
      return;
    }
    if (favs.has(siteId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("site_id", siteId);
      setFavs((p) => { const n = new Set(p); n.delete(siteId); return n; });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, site_id: siteId });
      setFavs((p) => new Set(p).add(siteId));
      toast.success("Saved to your shortlist");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-light">The directory</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} sites · curated for university and college students</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sites, categories…"
            value={q}
            onChange={(e) => navigate({ search: { field, q: e.target.value } })}
            className="pl-10 h-11 bg-paper"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => navigate({ search: (p: { field: string; q: string }) => ({ ...p, field: "" }) })}
          className={`px-4 py-1.5 rounded-full text-sm border transition-all ${!field ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-amber"}`}
        >All fields</button>
        {fields.map((f) => (
          <button key={f.id}
            onClick={() => navigate({ search: (p: { field: string; q: string }) => ({ ...p, field: f.slug }) })}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all inline-flex items-center gap-1.5 ${field === f.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-amber"}`}
          >
            <span>{f.icon}</span> {f.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((s) => {
          const f = fields.find((x) => x.id === s.field_id);
          const saved = favs.has(s.id);
          return (
            <article key={s.id} className="group p-6 rounded-xl bg-paper border border-border hover:border-amber/60 shadow-paper transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{f?.icon}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{f?.name}</span>
                </div>
                <button onClick={() => toggleFav(s.id)} className="text-muted-foreground hover:text-amber transition-colors" aria-label="Save">
                  {saved ? <BookmarkCheck className="w-5 h-5 text-amber" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>
              <h3 className="font-display text-2xl font-medium leading-tight">{s.name}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{s.description}</p>
              <div className="flex items-center gap-2 mt-4 text-xs">
                {s.category && <span className="px-2 py-0.5 rounded bg-secondary">{s.category}</span>}
                {s.region && <span className="px-2 py-0.5 rounded bg-secondary">{s.region}</span>}
                {s.is_free === false && <span className="px-2 py-0.5 rounded bg-amber/20 text-amber">paid</span>}
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-amber">
                Visit site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-16 text-muted-foreground">No sites match your filters yet.</div>
        )}
      </div>
    </div>
  );
}
