import styles from "./PopularCategories.module.css";
import CategoryCard from "./CategoryCard";
import useCategories from "@hooks/useCategories";
import { CategoryCardProps } from "src/types";
import Loader from "@components/common/Loader/Loader";
import ErrorMessage from "@components/common/ErrorMessage/ErrorMessage";

export default function PopularCategories() {
  const { categories, loading, error } = useCategories();

  if (loading) return <Loader message="Loading categories..."/>
  if (error) return  <ErrorMessage message={error} />
  return (
    <section className={styles.categoriesSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Popular Categories</h2>

        <div className="row g-4">
          {categories.map((category: CategoryCardProps) => (
            <div key={category.id ?? category.type} className="col-6 col-lg-3">
              {/*  spread props instead of passing `category` */}
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
