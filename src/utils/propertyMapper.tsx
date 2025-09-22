import { Property } from "src/types";

export function mapListingToProperty(listing: any): Property {
  return {
    id: listing.id?.toString() ?? "0",
    title: listing.title ?? "Untitled Property",
    address: [listing.address, listing.city, listing.state, listing.zip]
      .filter(Boolean)
      .join(", "),
    price: listing.price ?? 0,
    type: listing.type ?? "Unknown",
    bedrooms: listing.bedrooms ?? 0,
    bathrooms: listing.bathrooms ?? 0,
    sqft: listing.sqft ?? 0,
    description: listing.description ?? "",
    amenities: listing.amenities ?? [],
    images: listing.images || [],
    coordinates: listing.coordinates || { lat: 0, lng: 0 },
    rating: listing.rating ?? 0,
    reviewCount: listing.reviewCount ?? 0,
    price_type: listing.price_type ?? "Unknown",
    host: {
      name: listing.host?.name || "Unknown",
      avatar: listing.host?.avatar || "UH",
      joinDate: listing.host?.joinDate
        ? `Joined in ${listing.host.joinDate}`
        : "Unknown",
    },
        status: listing.status,              

  };
}
