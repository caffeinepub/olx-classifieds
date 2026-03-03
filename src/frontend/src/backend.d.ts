import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ListingDTO {
    title: string;
    contactInfo: string;
    description: string;
    imageIds: Array<string>;
    category: string;
    price: bigint;
    location: string;
}
export interface Listing {
    id: bigint;
    title: string;
    contactInfo: string;
    createdAt: bigint;
    description: string;
    isSold: boolean;
    seller: Principal;
    imageIds: Array<string>;
    isFeatured: boolean;
    category: string;
    price: bigint;
    location: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createListing(dto: ListingDTO): Promise<bigint>;
    deleteListing(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedListings(): Promise<Array<Listing>>;
    getListing(id: bigint): Promise<Listing | null>;
    getListings(category: string | null, keyword: string | null): Promise<Array<Listing>>;
    getUserListings(): Promise<Array<Listing>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markAsSold(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateListing(id: bigint, dto: ListingDTO): Promise<void>;
}
