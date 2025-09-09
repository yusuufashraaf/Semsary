// FeatureListing.tsx
import ListingCard from "./ListingCard";
import styles from "./FeatureListing.module.css";
import { Listing } from "src/types";
export default function FeatureListing() {
  const featuredListings: Listing[] = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      title: "Spacious Family Home",
      beds: 4,
      baths: 3,
      sqft: "2,500 sq ft",
      price: "450,000 L.E",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
      title: "Cozy Apartment with City Views",
      beds: 2,
      baths: 2,
      sqft: "1,200 sq ft",
      price: "325,000 L.E",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
      title: "Luxury Villa with Pool",
      beds: 5,
      baths: 4,
      sqft: "4,000 sq ft",
      price: "875,000 L.E",
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
