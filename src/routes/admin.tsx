import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { useAdminStore } from "@/stores/adminStore";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAdminStore.getState();
    if (!isAuthenticated && location.pathname !== "/admin/login") {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, logout } = useAdminStore();
  const location = useLocation();

  const isLoginPage = location.pathname === "/admin/login";

  if (!isAuthenticated && isLoginPage) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
          <a href="/admin" className="font-display text-xl">
            Glow Up <span className="text-accent">Admin</span>
          </a>
          <nav className="flex items-center gap-4">
            <a href="/admin/produtos" className="text-sm text-foreground/70 hover:text-accent transition-colors">
              Produtos
            </a>
            <a href="/" className="text-sm text-foreground/70 hover:text-accent transition-colors">
              Ver loja
            </a>
            <button
              onClick={logout}
              className="text-sm text-destructive hover:text-destructive/80 transition-colors"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
