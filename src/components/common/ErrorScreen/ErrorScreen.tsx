import styles from "./ErrorScreen.module.css";
import { ErrorScreenProps } from "src/types";

/**
 * ErrorScreen component
 * - Displays a full-page error message with optional icon, title, description, and action button
 * - Calls onAction callback or navigates to a default link when button is clicked
 */
function ErrorScreen({
  title = "Something Went Wrong",
  message = "We couldn't load this page. Please try again later.",
  actionLabel = "Go Home",
  actionHref = "/",
  onAction,
}: ErrorScreenProps) {
  function handleClick() {
    if (onAction) {
      onAction();
    } else {
      window.location.href = actionHref;
    }
  }

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <img src="src/assets/errorLogo.png" alt="" style={{height:"30rem"}}/>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className={styles.btnReturn} onClick={handleClick}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export default ErrorScreen;
