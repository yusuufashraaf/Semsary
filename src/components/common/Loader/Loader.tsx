// Loader.tsx
import styles from "./Loader.module.css";
import { LoaderProps } from "src/types";
/**
 * Loader component
 * - Displays a spinner and an optional loading message
 * - Can be used to indicate loading states in the UI
 */
function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}

export default Loader;
