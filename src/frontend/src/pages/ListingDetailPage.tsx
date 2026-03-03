import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  MapPin,
  Pencil,
  Phone,
  Star,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteListing,
  useGetListing,
  useMarkAsSold,
} from "../hooks/useQueries";
import { CATEGORIES, formatDate, formatPrice } from "../utils/format";

function getCategoryIcon(category: string) {
  return CATEGORIES.find((c) => c.value === category)?.label || category;
}

export default function ListingDetailPage() {
  const { id } = useParams({ from: "/listing/$id" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [selectedImage, setSelectedImage] = useState(0);

  const listingId = BigInt(id);
  const { data: listing, isLoading, isError } = useGetListing(listingId);
  const deleteMutation = useDeleteListing();
  const markSoldMutation = useMarkAsSold();

  const isAuthenticated = !!identity;
  const isOwner =
    isAuthenticated && listing
      ? listing.seller.toString() === identity!.getPrincipal().toString()
      : false;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(listingId);
      toast.success("Listing deleted successfully");
      navigate({ to: "/my-ads" });
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const handleMarkSold = async () => {
    try {
      await markSoldMutation.mutateAsync(listingId);
      toast.success("Listing marked as sold!");
    } catch {
      toast.error("Failed to mark as sold");
    }
  };

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 max-w-5xl py-8"
        data-ocid="listing.loading_state"
      >
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div
        className="container mx-auto px-4 max-w-5xl py-20 text-center"
        data-ocid="listing.error_state"
      >
        <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
          <Tag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">
          Listing not found
        </h2>
        <p className="text-muted-foreground mb-6">
          This listing may have been removed or doesn't exist.
        </p>
        <Link to="/browse">
          <Button variant="outline">Browse all listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-brand transition-colors">
            Browse
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-48">
            {listing.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => navigate({ to: "/browse", search: {} })}
                className="absolute top-3 left-3 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5 shadow-card hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>

              {listing.isSold && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-destructive text-destructive-foreground uppercase tracking-wide">
                    Sold
                  </Badge>
                </div>
              )}

              {listing.isFeatured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-brand text-brand-foreground gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </Badge>
                </div>
              )}

              {/* Main image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                {listing.imageIds.length > 0 ? (
                  <img
                    src={ExternalBlob.fromURL(
                      listing.imageIds[selectedImage],
                    ).getDirectURL()}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="listing-placeholder w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-muted-foreground"
                          role="img"
                          aria-label="No image available"
                        >
                          <title>No image available</title>
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        No images available
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {listing.imageIds.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.imageIds.map((imgId, i) => (
                    <button
                      type="button"
                      key={imgId}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === i
                          ? "border-brand"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={ExternalBlob.fromURL(imgId).getDirectURL()}
                        alt={`${listing.title} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Price & Title */}
            <div>
              <p className="price-tag text-3xl mb-2">
                {formatPrice(listing.price)}
              </p>
              <h1 className="font-display text-2xl font-bold leading-tight">
                {listing.title}
              </h1>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Tag className="w-4 h-4" />
                {getCategoryIcon(listing.category)}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {listing.location}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatDate(listing.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div className="bg-muted/50 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Contact */}
            <div className="bg-muted/50 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Seller Info
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
                  <User className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-medium text-sm">Verified Seller</p>
                  <p className="text-xs text-muted-foreground">Member on OLX</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{listing.contactInfo}</span>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="border border-border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Manage Listing
                </h3>
                <div className="flex flex-col gap-2">
                  <Link to="/my-ads" data-ocid="listing.edit_button">
                    <Button variant="outline" className="w-full gap-2">
                      <Pencil className="w-4 h-4" />
                      Edit Listing
                    </Button>
                  </Link>
                  {!listing.isSold && (
                    <Button
                      onClick={handleMarkSold}
                      disabled={markSoldMutation.isPending}
                      variant="outline"
                      className="w-full gap-2 text-green-700 border-green-300 hover:bg-green-50"
                      data-ocid="listing.mark_sold_button"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {markSoldMutation.isPending
                        ? "Marking..."
                        : "Mark as Sold"}
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                        data-ocid="listing.delete_button"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Listing
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="listing.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this listing?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The listing will be
                          permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="listing.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          data-ocid="listing.confirm_button"
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
