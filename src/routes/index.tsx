import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookmarkCheck, Globe2 } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

type Field = { id: string; name: string; slug: string; description: string | null; icon: string | null };

function Home() {
  const [fields, setFields] = useState<Field[]>([]);
  const [siteCount, setSiteCount] = useState<number>(0);

  useEffect(() => {
    supabase.from("fields").select("*").order("name").then(({ data }) => setFields((data as Field[]) ?? []));
    supabase.from("sites").select("*", { count: "exact", head: true }).then(({ count }) => setSiteCount(count ?? 0));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/20 text-amber border border-amber/30 text-xs font-medium tracking-wider uppercase">
              <Sparkles className="w-3 h-3" /> A directory for students
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-light text-paper text-balance leading-[1.05]">
              Find the right <em className="text-amber not-italic font-normal">internship sites</em> for your field of study.
            </h1>
            <p className="mt-6 text-lg text-paper/80 max-w-xl leading-relaxed">
              A handpicked map of {siteCount}+ trusted job and internship platforms, organized by what you study — so you stop searching and start applying.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-amber text-amber-foreground hover:bg-amber/90 h-12 px-6 text-base">
                <Link to="/browse">Browse the directory <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base bg-paper/5 border-paper/20 text-paper hover:bg-paper/10 hover:text-paper">
                <Link to="/auth">Create a student account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fields grid */}
      <section className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-paper rounded-2xl shadow-elegant p-8 md:p-12">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Browse by</p>
              <h2 className="font-display text-3xl md:text-4xl mt-1">Your field of study</h2>
            </div>
            <Link to="/browse" className="text-sm text-foreground/70 hover:text-amber inline-flex items-center gap-1">
              See all sites <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fields.map((f) => (
              <Link key={f.id} to="/browse" search={{ field: f.slug } as never} className="group block p-5 rounded-xl border border-border hover:border-amber hover:shadow-paper transition-all bg-background/50">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-display text-xl font-medium group-hover:text-amber transition-colors">{f.name}</div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{f.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-6xl mx-auto px-6 mt-24 grid md:grid-cols-3 gap-8">
        {[
          { icon: Globe2, title: "Curated, not crawled", body: "Every site is vetted for legitimate student opportunities — no spam, no broken links." },
          { icon: BookmarkCheck, title: "Save what matters", body: "Bookmark sites for your field and build a personal application shortlist." },
          { icon: Sparkles, title: "Built for your major", body: "Filter by discipline, region, and category. From CS to law to medicine." },
        ].map((v) => (
          <div key={v.title} className="p-6">
            <div className="w-11 h-11 rounded-lg bg-amber/15 text-amber flex items-center justify-center mb-4">
              <v.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl mb-2">{v.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
