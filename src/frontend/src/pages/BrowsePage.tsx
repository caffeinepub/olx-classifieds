import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Grid2x2, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import ListingCardSkeleton from "../components/ListingCardSkeleton";
import { useGetListings } from "../hooks/useQueries";
import { CATEGORIES } from "../utils/format";

type BrowseSearch = {
  keyword?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default function BrowsePage() {
  const search = useSearch({ from: "/browse" }) as BrowseSearch;
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState(search.keyword || "");
  const [category, setCategory] = useState(search.category || "all");
  const [minPrice, setMinPrice] = useState(search.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(search.maxPrice || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Active filters for query
  const [activeKeyword, setActiveKeyword] = useState(search.keyword || null);
  const [activeCategory, setActiveCategory] = useState(search.category || null);

  const {
    data: listings,
    isLoading,
    isError,
  } = useGetListings(activeCategory, activeKeyword);

  // Filter by price client-side
  const filteredListings = (listings || []).filter((l) => {
    const price = Number(l.price);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  });

  useEffect(() => {
    setKeyword(search.keyword || "");
    setCategory(search.category || "all");
    setActiveKeyword(search.keyword || null);
    setActiveCategory(search.category || null);
  }, [search.keyword, search.category]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const newCategory = category !== "all" ? category : null;
    setActiveKeyword(keyword || null);
    setActiveCategory(newCategory);
    navigate({
      to: "/browse",
      search: {
        keyword: keyword || undefined,
        category: newCategory || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      },
    });
  };

  const clearFilters = () => {
    setKeyword("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setActiveKeyword(null);
    setActiveCategory(null);
    navigate({
      to: "/browse",
      search: {
        keyword: undefined,
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      },
    });
  };

  const hasActiveFilters =
    activeKeyword || activeCategory || minPrice || maxPrice;

  return (
    <div className="min-h-screen">
      {/* Top filter bar */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          <form
            onSubmit={handleSearch}
            className="flex flex-wrap gap-2 items-center"
          >
            {/* Keyword */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search listings..."
                className="pl-9 h-9"
                data-ocid="browse.keyword_input"
              />
            </div>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className="w-44 h-9"
                data-ocid="browse.category_select"
              >
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

            {/* Price filters toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {(minPrice || maxPrice) && (
                <span className="w-4 h-4 rounded-full bg-brand text-brand-foreground text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>

            <Button
              type="submit"
              size="sm"
              className="h-9 bg-brand hover:bg-brand-hover text-brand-foreground gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </Button>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 gap-1 text-muted-foreground hover:text-foreground"
                onClick={clearFilters}
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </Button>
            )}

            {/* View mode */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Price range inputs (expandable) */}
          {filtersOpen && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Price range:
              </span>
              <Input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-32 h-8 text-sm"
                data-ocid="browse.price_min_input"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-32 h-8 text-sm"
                data-ocid="browse.price_max_input"
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-6">
        {/* Active filter badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeCategory && (
              <Badge variant="secondary" className="gap-1">
                {activeCategory}
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setActiveCategory(null);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeKeyword && (
              <Badge variant="secondary" className="gap-1">
                "{activeKeyword}"
                <button
                  type="button"
                  onClick={() => {
                    setKeyword("");
                    setActiveKeyword(null);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {minPrice && (
              <Badge variant="secondary" className="gap-1">
                Min: ${minPrice}
                <button type="button" onClick={() => setMinPrice("")}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {maxPrice && (
              <Badge variant="secondary" className="gap-1">
                Max: ${maxPrice}
                <button type="button" onClick={() => setMaxPrice("")}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-bold">
            {activeCategory ? activeCategory : "All Listings"}
          </h1>
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {filteredListings.length} result
              {filteredListings.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Listings */}
        {isLoading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "grid grid-cols-1 gap-3"
            }
            data-ocid="browse.loading_state"
          >
            {Array.from({ length: 12 }, (_, i) => `skel-browse-${i}`).map(
              (key) => (
                <ListingCardSkeleton key={key} />
              ),
            )}
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="browse.error_state"
          >
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <X className="w-7 h-7 text-destructive" />
            </div>
            <h3 className="font-display text-lg font-bold mb-1">
              Failed to load listings
            </h3>
            <p className="text-muted-foreground text-sm">
              Please try refreshing the page.
            </p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl bg-muted/50 border border-dashed border-border text-center"
            data-ocid="browse.empty_state"
          >
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">
              No listings found
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your search filters or browse all categories.
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "grid grid-cols-1 gap-3"
            }
          >
            {filteredListings.map((listing, i) => (
              <ListingCard
                key={listing.id.toString()}
                listing={listing}
                ocid={`browse.listing.item.${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
