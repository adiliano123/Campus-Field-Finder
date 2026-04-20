import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Compass, LogOut, Shield, User as UserIcon } from "lucide-react";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-md gradient-hero flex items-center justify-center shadow-paper">
            <Compass className="w-5 h-5 text-amber" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">FieldFinder</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="hover:text-amber transition-colors" activeProps={{ className: "text-amber" }} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/browse" className="hover:text-amber transition-colors" activeProps={{ className: "text-amber" }}>Browse</Link>
          {user && <Link to="/dashboard" className="hover:text-amber transition-colors" activeProps={{ className: "text-amber" }}>Saved</Link>}
          {isAdmin && (
            <Link to="/admin" className="hover:text-amber transition-colors flex items-center gap-1" activeProps={{ className: "text-amber" }}>
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/profile" })}>
                <UserIcon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate({ to: "/auth" })} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
