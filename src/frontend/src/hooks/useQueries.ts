import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Listing, ListingDTO } from "../backend.d";
import { useActor } from "./useActor";

// ─── Queries ───────────────────────────────────────────────────────────────

export function useGetListings(
  category: string | null,
  keyword: string | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ["listings", category, keyword],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListings(category, keyword);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedListings() {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ["featuredListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListing(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Listing | null>({
    queryKey: ["listing", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getListing(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetUserListings() {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ["userListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserListings();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ─────────────────────────────────────────────────────────────

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: ListingDTO) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createListing(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
      queryClient.invalidateQueries({ queryKey: ["featuredListings"] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: bigint; dto: ListingDTO }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateListing(id, dto);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", id.toString()] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
      queryClient.invalidateQueries({ queryKey: ["featuredListings"] });
    },
  });
}

export function useMarkAsSold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.markAsSold(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", id.toString()] });
    },
  });
}
