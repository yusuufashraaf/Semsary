import styles from "./BreadCrumb.module.css";
import { BreadcrumbProps } from "src/types";

function BreadCrumb({ propertyId }: BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <div className={styles.container}>
        <a href="/">🏠 Home</a>
        <span className={styles.separator}>›</span>
        <span className={styles.current}>Property #{propertyId}</span>
      </div>
    </nav>
  );
}

export default BreadCrumb;
