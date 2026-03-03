import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, Plus, Tag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 group"
            data-ocid="nav.home_link"
          >
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center shadow-brand-glow/50">
              <Tag className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-black tracking-tight text-foreground group-hover:text-brand transition-colors">
              OLX
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/browse"
              search={{}}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath === "/browse"
                  ? "text-brand bg-brand-light"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
              data-ocid="nav.browse_link"
            >
              Browse
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-ads"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === "/my-ads"
                    ? "text-brand bg-brand-light"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="nav.my_ads_link"
              >
                My Ads
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/post" data-ocid="nav.post_ad_button">
              <Button className="bg-brand hover:bg-brand-hover text-brand-foreground gap-2 shadow-sm">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Post Ad
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="gap-2"
              data-ocid={
                isAuthenticated ? "nav.logout_button" : "nav.login_button"
              }
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : isLoggingIn ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  currentPath === "/"
                    ? "text-brand bg-brand-light"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="nav.home_link"
              >
                Home
              </Link>
              <Link
                to="/browse"
                search={{}}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  currentPath === "/browse"
                    ? "text-brand bg-brand-light"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="nav.browse_link"
              >
                Browse
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-ads"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    currentPath === "/my-ads"
                      ? "text-brand bg-brand-light"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`}
                  data-ocid="nav.my_ads_link"
                >
                  My Ads
                </Link>
              )}
              <Link
                to="/post"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.post_ad_button"
              >
                <Button className="w-full bg-brand hover:bg-brand-hover text-brand-foreground gap-2">
                  <Plus className="w-4 h-4" />
                  Post Ad
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="w-full gap-2"
                data-ocid={
                  isAuthenticated ? "nav.logout_button" : "nav.login_button"
                }
              >
                {isAuthenticated ? (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                ) : isLoggingIn ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
