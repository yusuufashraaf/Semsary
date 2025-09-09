import styles from "./PopularCategories.module.css";
import CategoryCard from "./CategoryCard";
import { CategoryCardProps } from "src/types";

export default function PopularCategories() {
  const categories: CategoryCardProps[] = [
    {
      name: "Houses",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop",
      link: "/houses",
    },
    {
      name: "Apartments",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop",
      link: "/apartments",
    },
    {
      name: "Condos",
      image:
        "https://images.unsplash.com/photo-1719884630688-45ca69d68870?q=80&w=1170&auto=format&fit=crop",
      link: "/condos",
    },
    {
      name: "Townhouses",
      image:
        "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=300&h=200&fit=crop",
      link: "/townhouses",
    },
  ];

  return (
    <section className={styles.categoriesSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Popular Categories</h2>

        <div className="row g-4">
          {categories.map((category, index) => (
            <div key={index} className="col-6 col-lg-3">
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
