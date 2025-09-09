import { Link } from "react-router-dom";
import styles from "./PopularCategories.module.css";

type CategoryCardProps = {
  name: string;
  image: string;
  link: string;
};

export default function CategoryCard({ name, image, link }: CategoryCardProps) {
  return (
    <Link
      to={link}
      className={`${styles.categoryCard} card h-100 shadow-sm text-decoration-none text-white`}
    >
      <div className="position-relative">
        <img src={image} className={styles.categoryImage} alt={name} />
        <div className={styles.overlay}>
          <h5 className={styles.categoryName}>{name}</h5>
        </div>
      </div>
    </Link>
  );
}
