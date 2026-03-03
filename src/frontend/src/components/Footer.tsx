import { Link } from "@tanstack/react-router";
import { Heart, Tag } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center">
                <Tag className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-black text-background">
                OLX
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              The trusted marketplace for buying and selling in your community.
              Find great deals or reach millions of buyers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-background mb-4">
              Browse
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Electronics",
                "Vehicles",
                "Property",
                "Fashion",
                "Home & Garden",
                "Jobs",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/browse"
                    search={{
                      category: cat,
                      keyword: undefined,
                      minPrice: undefined,
                      maxPrice: undefined,
                    }}
                    className="text-background/60 hover:text-brand transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-bold text-background mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-background/60 hover:text-brand transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  search={{}}
                  className="text-background/60 hover:text-brand transition-colors"
                >
                  Browse Ads
                </Link>
              </li>
              <li>
                <Link
                  to="/post"
                  className="text-background/60 hover:text-brand transition-colors"
                >
                  Post an Ad
                </Link>
              </li>
              <li>
                <Link
                  to="/my-ads"
                  className="text-background/60 hover:text-brand transition-colors"
                >
                  My Ads
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/40">
          <span>© {year} OLX Marketplace. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-brand fill-brand" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand/80 transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
