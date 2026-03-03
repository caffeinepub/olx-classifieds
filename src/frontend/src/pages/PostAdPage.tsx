import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Loader2, LogIn, Plus, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateListing } from "../hooks/useQueries";
import { CATEGORIES } from "../utils/format";

export default function PostAdPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const createMutation = useCreateListing();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // hash strings for backend
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]); // blob URLs for preview
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { actor } = useActor();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!actor) {
      toast.error("Please login to upload images");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newIds: string[] = [];
      for (const file of Array.from(files)) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
        // Upload using the actor's internal upload function
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hashBytes = await (actor as any)._uploadFile(blob);
        // Convert hash bytes to hex string
        const hashHex = `sha256:${Array.from(hashBytes as Uint8Array)
          .map((b: number) => b.toString(16).padStart(2, "0"))
          .join("")}`;
        newIds.push(hashHex);
      }
      // Create preview URLs from original files for display
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setUploadedImages((prev) => [...prev, ...newIds]);
      setUploadedPreviews((prev) => [...prev, ...previews]);
      toast.success("Images uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (idx: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
    setUploadedPreviews((prev) => {
      URL.revokeObjectURL(prev[idx] || "");
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    if (!title || !description || !category || !location || !contactInfo) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const id = await createMutation.mutateAsync({
        title,
        description,
        price: price ? BigInt(Math.round(Number(price))) : BigInt(0),
        category,
        location,
        contactInfo,
        imageIds: uploadedImages,
      });
      toast.success("Ad posted successfully!");
      navigate({ to: "/listing/$id", params: { id: id.toString() } });
    } catch {
      toast.error("Failed to post ad. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-brand" />
          </div>
          <h1 className="font-display text-3xl font-black mb-3">
            Post Your Ad
          </h1>
          <p className="text-muted-foreground mb-8">
            Login to post your ad and reach thousands of buyers for free.
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
            {isLoggingIn ? "Logging in..." : "Login to Post"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Post Ad</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-black mb-1">
              Post Your Ad
            </h1>
            <p className="text-muted-foreground">
              Fill in the details below to post your listing for free.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone 14 Pro Max 256GB Space Black"
                required
                maxLength={100}
                className="h-11"
                data-ocid="post.title_input"
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger
                  className="h-11"
                  data-ocid="post.category_select"
                >
                  <SelectValue placeholder="Select a category" />
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

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold">
                Price (USD)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0 for free"
                  className="pl-7 h-11"
                  data-ocid="post.price_input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item in detail — condition, features, reason for selling..."
                required
                rows={5}
                maxLength={2000}
                className="resize-none"
                data-ocid="post.description_textarea"
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, NY"
                required
                className="h-11"
                data-ocid="post.location_input"
              />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-semibold">
                Contact Info <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone number or email"
                required
                className="h-11"
                data-ocid="post.contact_input"
              />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Photos</Label>
              <p className="text-xs text-muted-foreground">
                Upload up to 5 photos of your item
              </p>

              {/* Uploaded image previews */}
              {uploadedPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedPreviews.map((previewUrl, i) => (
                    <div
                      key={previewUrl}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-border"
                    >
                      <img
                        src={previewUrl}
                        alt={`Upload ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 bg-foreground/70 text-background rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedImages.length < 5 && (
                <label
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-brand hover:bg-brand-light/50 transition-colors"
                  data-ocid="post.dropzone"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    data-ocid="post.upload_button"
                  />
                  {isUploading ? (
                    <div className="text-center">
                      <Loader2 className="w-7 h-7 text-brand animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <span className="text-brand font-medium">
                          Click to upload
                        </span>{" "}
                        or drag & drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  !title ||
                  !description ||
                  !category ||
                  !location ||
                  !contactInfo
                }
                className="w-full h-12 bg-brand hover:bg-brand-hover text-brand-foreground text-base gap-2 shadow-brand-glow"
                data-ocid="post.submit_button"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Posting Ad...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Post Ad for Free
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
