import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import HomePage from "./pages/HomePage";
import ListingDetailPage from "./pages/ListingDetailPage";
import MyAdsPage from "./pages/MyAdsPage";
import PostAdPage from "./pages/PostAdPage";

// ─── Layout ────────────────────────────────────────────────────────────────

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

// ─── Routes ────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/browse",
  component: BrowsePage,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    keyword?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  } => ({
    keyword: search.keyword as string | undefined,
    category: search.category as string | undefined,
    minPrice: search.minPrice as string | undefined,
    maxPrice: search.maxPrice as string | undefined,
  }),
});

const listingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listing/$id",
  component: ListingDetailPage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post",
  component: PostAdPage,
});

const myAdsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-ads",
  component: MyAdsPage,
});

// ─── Router ────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  homeRoute,
  browseRoute,
  listingRoute,
  postRoute,
  myAdsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
