import Time "mo:core/Time";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Persistent state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  module Listing {
    public func compareByCreationTime(x : Listing, y : Listing) : { #less; #greater; #equal } {
      Nat.compare(x.createdAt, y.createdAt);
    };
  };

  type ListingDTO = {
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
    location : Text;
    imageIds : [Text];
    contactInfo : Text;
  };

  type Listing = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
    location : Text;
    imageIds : [Text];
    seller : Principal;
    contactInfo : Text;
    createdAt : Nat;
    isSold : Bool;
    isFeatured : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  let listings = Map.empty<Nat, Listing>();
  let categories = Set.empty<Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var listingIdCount = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createListing(dto : ListingDTO) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };

    let listing : Listing = {
      id = listingIdCount;
      seller = caller;
      createdAt = Time.now().toNat();
      isSold = false;
      isFeatured = false;
      title = dto.title;
      description = dto.description;
      price = dto.price;
      category = dto.category;
      location = dto.location;
      imageIds = dto.imageIds;
      contactInfo = dto.contactInfo;
    };

    listings.add(listingIdCount, listing);
    categories.add(dto.category);
    listingIdCount += 1;
    listing.id;
  };

  public query ({ caller }) func getListing(id : Nat) : async ?Listing {
    listings.get(id);
  };

  public query ({ caller }) func getListings(category : ?Text, keyword : ?Text) : async [Listing] {
    let filteredListings = List.empty<Listing>();

    for ((_, listing) in listings.entries()) {
      if (not listing.isSold) {
        switch (category) {
          case (null) {
            switch (keyword) {
              case (null) { filteredListings.add(listing) };
              case (?keyword) {
                if (listing.title.contains(#text keyword) or listing.description.contains(#text keyword)) {
                  filteredListings.add(listing);
                };
              };
            };
          };
          case (?cat) {
            if (listing.category == cat) {
              switch (keyword) {
                case (null) { filteredListings.add(listing) };
                case (?keyword) {
                  if (listing.title.contains(#text keyword) or listing.description.contains(#text keyword)) {
                    filteredListings.add(listing);
                  };
                };
              };
            };
          };
        };
      };
    };

    filteredListings.toArray();
  };

  public shared ({ caller }) func updateListing(id : Nat, dto : ListingDTO) : async () {
    let listing = switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing does not exist") };
      case (?listing) {
        if (listing.seller != caller) {
          Runtime.trap("Unauthorized: Only the listing owner can update the listing");
        };
        listing;
      };
    };

    let updatedListing : Listing = {
      id = listing.id;
      seller = listing.seller;
      createdAt = listing.createdAt;
      isSold = listing.isSold;
      isFeatured = listing.isFeatured;
      title = dto.title;
      description = dto.description;
      price = dto.price;
      category = dto.category;
      location = dto.location;
      imageIds = dto.imageIds;
      contactInfo = dto.contactInfo;
    };

    listings.add(id, updatedListing);
  };

  public shared ({ caller }) func deleteListing(id : Nat) : async () {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing does not exist") };
      case (?listing) {
        if (listing.seller != caller) {
          Runtime.trap("Unauthorized: Only the listing owner can delete the listing");
        };
      };
    };

    listings.remove(id);
  };

  public shared ({ caller }) func markAsSold(id : Nat) : async () {
    let listing = switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing does not exist") };
      case (?listing) {
        if (listing.seller != caller) {
          Runtime.trap("Unauthorized: Only the listing owner can mark the listing as sold");
        };
        listing;
      };
    };

    let updatedListing : Listing = { listing with isSold = true };
    listings.add(id, updatedListing);
  };

  public query ({ caller }) func getUserListings() : async [Listing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their listings");
    };

    let userListings = List.empty<Listing>();
    for ((_, listing) in listings.entries()) {
      if (listing.seller == caller) {
        userListings.add(listing);
      };
    };
    userListings.toArray();
  };

  public query ({ caller }) func getFeaturedListings() : async [Listing] {
    let featuredListings = List.empty<Listing>();
    for ((_, listing) in listings.entries()) {
      if (listing.isFeatured and not listing.isSold) {
        featuredListings.add(listing);
      };
    };
    featuredListings.toArray();
  };
};
