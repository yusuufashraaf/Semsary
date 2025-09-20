import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./AddToWishlist.module.css";
import { AddToWishlistProps } from "src/types";

/**
 * AddToWishlist component
 * - Heart button for adding/removing items from wishlist
 * - Works on both desktop and mobile
 */
function AddToWishlist({ isSaved, onClick }: AddToWishlistProps) {
  return (
    <button
      type="button"
      className={`${styles.saveBtn} ${isSaved ? styles.savedBtn : ""}`}
      onClick={(e) => {
        e.preventDefault(); 
        onClick(e);
      }}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      // make touch responsive on mobile
      style={{ touchAction: "manipulation" }}
    >
      <FontAwesomeIcon icon={faHeart} />
    </button>
  );
}

export default AddToWishlist;
