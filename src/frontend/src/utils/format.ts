export function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(ts: bigint): string {
  // Motoko timestamps are in nanoseconds
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const CATEGORIES = [
  { value: "Electronics", label: "Electronics" },
  { value: "Vehicles", label: "Vehicles" },
  { value: "Property", label: "Property" },
  { value: "Fashion", label: "Fashion" },
  { value: "Home & Garden", label: "Home & Garden" },
  { value: "Jobs", label: "Jobs" },
  { value: "Services", label: "Services" },
  { value: "Other", label: "Other" },
];
