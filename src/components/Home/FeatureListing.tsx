// FeatureListing.tsx
import ListingCard from "./ListingCard";
import styles from "./FeatureListing.module.css";
import { Listing } from "src/types";
export default function FeatureListing() {
  const featuredListings: Listing[] = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      title: "Spacious Family Home",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2500,
      price: 450000,
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
      title: "Cozy Apartment with City Views",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      price: 32000,
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
      title: "Luxury Villa with Pool",
      bedrooms: 5,
      bathrooms: 4,
      sqft: 4000,
      price: 875000,
    },
  ];

  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Featured Listings</h2>

        <div className="row g-4">
          {featuredListings.map((listing) => (
            <div key={listing.id} className="col-12 col-md-6 col-xl-4">
              <ListingCard {...listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
