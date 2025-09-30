import Loader from "../Loader/Loader";
import styles from "./LoadingScreen.module.css";
import { LoadingScreenProps } from "src/types";

/**
 * LoadingScreen component
 * - Displays a full-page loading spinner with optional message and property ID
 * - Can be used while fetching property details or other data
 */
function LoadingScreen({
  message = "Loading, please wait...",
}: LoadingScreenProps) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <img src="src/assets/logoo.png" alt="" style={{height:"30rem"}}/>
        <Loader message="" />
        <h3>{message}</h3>
      </div>
    </div>
  );
}

export default LoadingScreen;
