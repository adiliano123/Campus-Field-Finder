import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Shield } from "lucide-react";
import { toast } from "sonner";

type Field = { id: string; name: string; slug: string; icon: string | null; description: string | null };
type Site = { id: string; field_id: string; name: string; url: string; description: string | null; category: string | null; region: string | null };

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — FieldFinder" }] }),
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => { if (!loading && (!user || !isAdmin)) navigate({ to: "/" }); }, [loading, user, isAdmin, navigate]);

  const refresh = async () => {
    const [{ data: f }, { data: s }] = await Promise.all([
      supabase.from("fields").select("*").order("name"),
      supabase.from("sites").select("*").order("name"),
    ]);
    setFields((f as Field[]) ?? []);
    setSites((s as Site[]) ?? []);
  };
  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <Shield className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl">Admin only</h2>
        <p className="text-muted-foreground text-sm mt-2">
          You need admin role. Set yourself as admin in the database: insert a row into <code className="bg-secondary px-1.5 py-0.5 rounded">user_roles</code> with your user id and role <code>admin</code>.
        </p>
      </div>
    );
  }

  const addField = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabase.from("fields").insert({ name, slug, icon: String(fd.get("icon") || "📌"), description: String(fd.get("description") || "") });
    if (error) return toast.error(error.message);
    (e.currentTarget as HTMLFormElement).reset();
    toast.success("Field added");
    refresh();
  };

  const delField = async (id: string) => {
    if (!confirm("Delete this field and all its sites?")) return;
    const { error } = await supabase.from("fields").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const addSite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("sites").insert({
      field_id: String(fd.get("field_id")),
      name: String(fd.get("name") || "").slice(0, 200),
      url: String(fd.get("url") || ""),
      description: String(fd.get("description") || "").slice(0, 500),
      category: String(fd.get("category") || "").slice(0, 60),
      region: String(fd.get("region") || "").slice(0, 60),
    });
    if (error) return toast.error(error.message);
    (e.currentTarget as HTMLFormElement).reset();
    toast.success("Site added");
    refresh();
  };

  const delSite = async (id: string) => {
    if (!confirm("Delete this site?")) return;
    const { error } = await supabase.from("sites").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-light">Admin</h1>
        <p className="text-muted-foreground mt-2">Manage fields and sites in the directory.</p>
      </div>

      <section>
        <h2 className="font-display text-2xl mb-4">Fields</h2>
        <form onSubmit={addField} className="bg-paper rounded-xl p-5 shadow-paper grid sm:grid-cols-12 gap-3 mb-4">
          <div className="sm:col-span-3"><Label>Name</Label><Input name="name" required maxLength={80} /></div>
          <div className="sm:col-span-2"><Label>Icon</Label><Input name="icon" defaultValue="📌" maxLength={4} /></div>
          <div className="sm:col-span-5"><Label>Description</Label><Input name="description" maxLength={200} /></div>
          <div className="sm:col-span-2 flex items-end"><Button type="submit" className="w-full bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" />Add</Button></div>
        </form>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fields.map((f) => (
            <div key={f.id} className="p-4 bg-paper rounded-lg border border-border flex items-start justify-between">
              <div><div className="text-xl">{f.icon}</div><div className="font-medium">{f.name}</div><div className="text-xs text-muted-foreground">{f.slug}</div></div>
              <button onClick={() => delField(f.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">Sites</h2>
        <form onSubmit={addSite} className="bg-paper rounded-xl p-5 shadow-paper grid sm:grid-cols-12 gap-3 mb-4">
          <div className="sm:col-span-3"><Label>Name</Label><Input name="name" required /></div>
          <div className="sm:col-span-3"><Label>URL</Label><Input name="url" type="url" required /></div>
          <div className="sm:col-span-3">
            <Label>Field</Label>
            <select name="field_id" required className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
              {fields.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><Label>Category</Label><Input name="category" placeholder="job-board" /></div>
          <div className="sm:col-span-1"><Label>Region</Label><Input name="region" placeholder="Global" /></div>
          <div className="sm:col-span-10"><Label>Description</Label><Textarea name="description" rows={2} /></div>
          <div className="sm:col-span-2 flex items-end"><Button type="submit" className="w-full bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" />Add</Button></div>
        </form>
        <div className="space-y-2">
          {sites.map((s) => (
            <div key={s.id} className="p-4 bg-paper rounded-lg border border-border flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><span className="font-medium">{s.name}</span><span className="text-xs text-muted-foreground">{fields.find((f) => f.id === s.field_id)?.name}</span>{s.category && <span className="text-xs px-1.5 rounded bg-secondary">{s.category}</span>}</div>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-amber truncate block">{s.url}</a>
              </div>
              <button onClick={() => delSite(s.id)} className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
