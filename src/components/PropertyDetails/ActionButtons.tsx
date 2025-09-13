// Import scoped CSS module for styling
import styles from "./ActionButtons.module.css";

// Import FontAwesome icon renderer
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Import specific solid icons used in the buttons
import {
  faMagnifyingGlass,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

// Import prop types for this component
import { ActionButtonsProps } from "../../types";

// Define the ActionButtons component as a plain function.
// It takes in event handlers and an optional "disabledButton" prop
// which controls which button (contact/viewMore) should be disabled.
function ActionButtons({
  onContact,
  onViewMore,
  disabledButton,
}: ActionButtonsProps) {
  return (
    <div className={styles.container}>
      {/* Contact Host button */}
      <button
        className={`${styles.button} ${styles.contactButton}`}
        onClick={onContact}
        disabled={disabledButton === "contact"}
        aria-label="Contact host"
      >
        <FontAwesomeIcon icon={faComment} /> Contact Host
      </button>

      {/* View More Properties button */}
      <button
        className={`${styles.button} ${styles.viewMoreButton}`}
        onClick={onViewMore}
        disabled={disabledButton === "viewMore"}
        aria-label="View more properties"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} /> View More Properties
      </button>
    </div>
  );
}

// Export default for use in other components
export default ActionButtons;
