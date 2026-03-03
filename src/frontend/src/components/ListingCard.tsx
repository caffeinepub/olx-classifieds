import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Star } from "lucide-react";
import { ExternalBlob } from "../backend";
import type { Listing } from "../backend.d";
import { formatDate, formatPrice } from "../utils/format";

interface ListingCardProps {
  listing: Listing;
  ocid?: string;
}

function ListingImage({ imageIds }: { imageIds: string[] }) {
  if (imageIds.length === 0) {
    return (
      <div className="listing-placeholder w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-muted flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground"
              role="img"
              aria-label="No image available"
            >
              <title>No image available</title>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <span className="text-xs text-muted-foreground">No image</span>
        </div>
      </div>
    );
  }

  const url = ExternalBlob.fromURL(imageIds[0]).getDirectURL();
  return (
    <img
      src={url}
      alt="Listing"
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}

export default function ListingCard({ listing, ocid }: ListingCardProps) {
  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id.toString() }}
      data-ocid={ocid}
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <ListingImage imageIds={listing.imageIds} />
          {listing.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-brand text-brand-foreground text-xs gap-1 py-0.5">
                <Star className="w-2.5 h-2.5" fill="currentColor" />
                Featured
              </Badge>
            </div>
          )}
          {listing.isSold && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Sold
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="price-tag text-lg leading-tight mb-1">
            {formatPrice(listing.price)}
          </p>
          <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-2 mb-2 group-hover:text-brand transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{listing.location}</span>
            </span>
            <span className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Clock className="w-3 h-3" />
              {formatDate(listing.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
