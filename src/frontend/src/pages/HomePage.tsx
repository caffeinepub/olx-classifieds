import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Car,
  Cpu,
  Flower2,
  Grid3x3,
  Home,
  Plus,
  Search,
  Shirt,
  Tag,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ListingCard from "../components/ListingCard";
import ListingCardSkeleton from "../components/ListingCardSkeleton";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetFeaturedListings, useGetListings } from "../hooks/useQueries";
import { CATEGORIES } from "../utils/format";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Electronics: <Cpu className="w-6 h-6" />,
  Vehicles: <Car className="w-6 h-6" />,
  Property: <Home className="w-6 h-6" />,
  Fashion: <Shirt className="w-6 h-6" />,
  "Home & Garden": <Flower2 className="w-6 h-6" />,
  Jobs: <Briefcase className="w-6 h-6" />,
  Services: <Wrench className="w-6 h-6" />,
  Other: <Grid3x3 className="w-6 h-6" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  Vehicles: "bg-red-50 text-red-600 hover:bg-red-100",
  Property: "bg-green-50 text-green-600 hover:bg-green-100",
  Fashion: "bg-pink-50 text-pink-600 hover:bg-pink-100",
  "Home & Garden": "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  Jobs: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  Services: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  Other: "bg-gray-50 text-gray-600 hover:bg-gray-100",
};

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: featuredListings, isLoading: featuredLoading } =
    useGetFeaturedListings();
  const { data: recentListings, isLoading: recentLoading } = useGetListings(
    null,
    null,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/browse",
      search: {
        keyword: keyword || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        minPrice: undefined,
        maxPrice: undefined,
      },
    });
  };

  const handleCategoryClick = (category: string) => {
    navigate({
      to: "/browse",
      search: {
        category,
        keyword: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      },
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground pt-12 pb-16">
        {/* Decorative background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.72 0.19 52) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.72 0.19 52) 0%, transparent 40%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="container mx-auto px-4 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-brand/20 text-brand px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-brand/30">
              <Tag className="w-3.5 h-3.5" />
              Millions of listings. Yours to discover.
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-background leading-tight mb-4">
              Buy & Sell <span className="text-brand">Anything</span>
              <br />
              Near You
            </h1>
            <p className="text-background/60 text-lg max-w-xl mx-auto">
              Find the best deals in your area or reach thousands of buyers for
              free.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto bg-card rounded-xl p-2 shadow-brand-glow"
          >
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base h-11 placeholder:text-muted-foreground"
              data-ocid="home.search_input"
            />
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40 border-0 bg-muted h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="bg-brand hover:bg-brand-hover text-brand-foreground h-11 px-6 gap-2"
                data-ocid="home.search_button"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl py-10">
        {/* Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">
              Browse Categories
            </h2>
            <Link
              to="/browse"
              search={{}}
              className="text-sm text-brand hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                data-ocid={`home.category.item.${i + 1}`}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${CATEGORY_COLORS[cat.value] || "bg-muted hover:bg-muted/80"}`}
              >
                {CATEGORY_ICONS[cat.value]}
                <span className="text-xs font-semibold text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Featured Listings */}
        {(featuredLoading ||
          (featuredListings && featuredListings.length > 0)) && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <span className="text-brand">★</span> Featured Listings
              </h2>
              <Link
                to="/browse"
                search={{}}
                className="text-sm text-brand hover:underline flex items-center gap-1"
              >
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {featuredLoading ? (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                data-ocid="home.loading_state"
              >
                {Array.from({ length: 5 }, (_, i) => `skel-featured-${i}`).map(
                  (key) => (
                    <ListingCardSkeleton key={key} />
                  ),
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {featuredListings!.map((listing, i) => (
                  <ListingCard
                    key={listing.id.toString()}
                    listing={listing}
                    ocid={`home.listing.item.${i + 1}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent Listings */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Recent Listings</h2>
            <Link
              to="/browse"
              search={{}}
              className="text-sm text-brand hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentLoading ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              data-ocid="home.loading_state"
            >
              {Array.from({ length: 10 }, (_, i) => `skel-recent-${i}`).map(
                (key) => (
                  <ListingCardSkeleton key={key} />
                ),
              )}
            </div>
          ) : recentListings && recentListings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recentListings.slice(0, 20).map((listing, i) => (
                <ListingCard
                  key={listing.id.toString()}
                  listing={listing}
                  ocid={`home.listing.item.${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-xl bg-muted/50 border border-dashed border-border"
              data-ocid="home.empty_state"
            >
              <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-brand" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                No listings yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6 text-center max-w-xs">
                Be the first to post an ad and reach thousands of potential
                buyers.
              </p>
              {isAuthenticated ? (
                <Link to="/post" data-ocid="home.post_ad_button">
                  <Button className="bg-brand hover:bg-brand-hover text-brand-foreground gap-2">
                    <Plus className="w-4 h-4" />
                    Post First Ad
                  </Button>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Login to post your first ad
                </p>
              )}
            </div>
          )}
        </section>

        {/* Post Ad CTA Banner */}
        <section className="rounded-2xl bg-foreground p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 10% 50%, oklch(0.72 0.19 52) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl font-black text-background mb-2">
              Ready to sell?
            </h2>
            <p className="text-background/60">
              Post your ad for free and reach millions of buyers.
            </p>
          </div>
          <div className="relative flex-shrink-0">
            {isAuthenticated ? (
              <Link to="/post" data-ocid="home.post_ad_button">
                <Button className="bg-brand hover:bg-brand-hover text-brand-foreground gap-2 text-base h-12 px-8 shadow-brand-glow">
                  <Plus className="w-5 h-5" />
                  Post Your Ad
                </Button>
              </Link>
            ) : (
              <p className="text-background/60 text-sm">
                Login to post your ad
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
