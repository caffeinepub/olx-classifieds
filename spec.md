# OLX Classifieds Marketplace

## Current State
New project -- no existing code.

## Requested Changes (Diff)

### Add
- Classified ads marketplace where users can post, browse, and manage listings
- Categories: Electronics, Vehicles, Property, Fashion, Home & Garden, Jobs, Services, Other
- Listing features: title, description, price, category, location (text), images (upload), contact info
- Browse/search: filter by category, search by keyword, sort by price or date
- Listing detail page with full info and seller contact
- User listings: view and manage your own posted ads
- Post ad flow: multi-field form with image upload
- Mark listing as sold / delete listing
- Featured/promoted listings display at top

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: data models for Listing (id, title, description, price, category, location, images, seller principal, contact, createdAt, sold status)
2. Backend: CRUD operations -- createListing, getListings (with filters), getListing, updateListing, deleteListing, markAsSold, getUserListings
3. Frontend: Home page with search bar, category grid, featured listings, recent listings
4. Frontend: Browse/search page with filters (category, price range, keyword)
5. Frontend: Post Ad page with form and image upload
6. Frontend: Listing detail page
7. Frontend: My Ads page (user's own listings with manage options)
8. Frontend: Navigation with Post Ad CTA
