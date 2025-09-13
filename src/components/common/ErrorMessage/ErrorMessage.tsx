import styles from "./ErrorMessage.module.css";
import { ErrorMessageProps } from "src/types";

/**
 * ErrorMessage component
 * - Displays an error message in a styled container
 * - Only visible if `message` exists and `visible` is true
 * - Uses role="alert" for accessibility
 */
function ErrorMessage({ message, visible = true }: ErrorMessageProps) {
  if (!message || !visible) return null;

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage} role="alert">
        {message}
      </div>
    </div>
  );
}

export default ErrorMessage;
