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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Loader2,
  LogIn,
  MapPin,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Listing, ListingDTO } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteListing,
  useGetUserListings,
  useMarkAsSold,
  useUpdateListing,
} from "../hooks/useQueries";
import { CATEGORIES, formatDate, formatPrice } from "../utils/format";

function EditDialog({
  listing,
  open,
  onClose,
}: {
  listing: Listing;
  open: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price.toString());
  const [category, setCategory] = useState(listing.category);
  const [location, setLocation] = useState(listing.location);
  const [contactInfo, setContactInfo] = useState(listing.contactInfo);
  const updateMutation = useUpdateListing();

  const handleSave = async () => {
    if (!title || !description || !category || !location || !contactInfo) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const dto: ListingDTO = {
        title,
        description,
        price: BigInt(Math.round(Number(price))),
        category,
        location,
        contactInfo,
        imageIds: listing.imageIds,
      };
      await updateMutation.mutateAsync({ id: listing.id, dto });
      toast.success("Listing updated successfully!");
      onClose();
    } catch {
      toast.error("Failed to update listing");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="my_ads.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Edit Listing
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Price (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-7 h-10"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Contact Info</Label>
            <Input
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="my_ads.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-brand hover:bg-brand-hover text-brand-foreground gap-2"
            data-ocid="my_ads.save_button"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdCard({ listing, index }: { listing: Listing; index: number }) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteMutation = useDeleteListing();
  const markSoldMutation = useMarkAsSold();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(listing.id);
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const handleMarkSold = async () => {
    try {
      await markSoldMutation.mutateAsync(listing.id);
      toast.success("Marked as sold!");
    } catch {
      toast.error("Failed to mark as sold");
    }
  };

  const imageUrl =
    listing.imageIds.length > 0
      ? ExternalBlob.fromURL(listing.imageIds[0]).getDirectURL()
      : null;

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200"
      data-ocid={`my_ads.listing.item.${index}`}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="listing-placeholder w-full h-full flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
                role="img"
                aria-label="No image"
              >
                <title>No image</title>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link
              to="/listing/$id"
              params={{ id: listing.id.toString() }}
              className="font-semibold text-sm leading-snug hover:text-brand transition-colors line-clamp-2"
            >
              {listing.title}
            </Link>
            <div className="flex-shrink-0">
              {listing.isSold ? (
                <Badge
                  variant="secondary"
                  className="text-xs bg-muted text-muted-foreground"
                >
                  Sold
                </Badge>
              ) : listing.isFeatured ? (
                <Badge className="text-xs bg-brand text-brand-foreground">
                  Featured
                </Badge>
              ) : (
                <Badge className="text-xs bg-green-100 text-green-700">
                  Active
                </Badge>
              )}
            </div>
          </div>
          <p className="price-tag text-base mb-2">
            {formatPrice(listing.price)}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {listing.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(listing.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 flex-1 sm:flex-none"
          onClick={() => setEditOpen(true)}
          data-ocid={`my_ads.edit_button.${index}`}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Button>
        {!listing.isSold && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 flex-1 sm:flex-none text-green-700 border-green-300 hover:bg-green-50"
            onClick={handleMarkSold}
            disabled={markSoldMutation.isPending}
            data-ocid={`my_ads.mark_sold_button.${index}`}
          >
            {markSoldMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            Mark Sold
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 flex-1 sm:flex-none text-destructive border-destructive/30 hover:bg-destructive/5"
              data-ocid={`my_ads.delete_button.${index}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete listing?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove "{listing.title}". This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <EditDialog
        listing={listing}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}

export default function MyAdsPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: listings, isLoading, isError } = useGetUserListings();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
            <Tag className="w-10 h-10 text-brand" />
          </div>
          <h1 className="font-display text-3xl font-black mb-3">My Ads</h1>
          <p className="text-muted-foreground mb-8">
            Login to view and manage your listings.
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="bg-brand hover:bg-brand-hover text-brand-foreground gap-2 h-12 px-8 text-base"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-black mb-1">My Ads</h1>
            <p className="text-muted-foreground text-sm">
              Manage your active and sold listings
            </p>
          </div>
          <Link to="/post" data-ocid="nav.post_ad_button">
            <Button className="bg-brand hover:bg-brand-hover text-brand-foreground gap-2">
              <Plus className="w-4 h-4" />
              Post New Ad
            </Button>
          </Link>
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="space-y-4" data-ocid="my_ads.loading_state">
            {Array.from({ length: 3 }, (_, i) => `skel-ad-${i}`).map((key) => (
              <div key={key} className="bg-card rounded-xl p-4 flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20" data-ocid="my_ads.error_state">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-destructive" />
            </div>
            <h3 className="font-display text-lg font-bold mb-1">
              Failed to load ads
            </h3>
            <p className="text-muted-foreground text-sm">
              Please refresh the page and try again.
            </p>
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id.toString()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <AdCard listing={listing} index={i + 1} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl bg-muted/50 border border-dashed border-border text-center"
            data-ocid="my_ads.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-brand" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              No ads posted yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Post your first ad and reach thousands of potential buyers for
              free.
            </p>
            <Link to="/post">
              <Button className="bg-brand hover:bg-brand-hover text-brand-foreground gap-2">
                <Plus className="w-4 h-4" />
                Post Your First Ad
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
