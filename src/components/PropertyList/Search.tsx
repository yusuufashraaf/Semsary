import styles from "./Search.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Props interface to define expected props for type safety
interface SearchBarProps {
  searchTerm: string; // current search term from parent
  setSearchTerm: (value: string) => void; // function to update parent state
}

export default function Search({ searchTerm, setSearchTerm }: SearchBarProps) {
  // Local state removed: input updates parent immediately now

  return (
    <div className={styles.searchContainer}>
      <form
        role="search"
        className={styles.searchInputWrapper}
        onSubmit={(e) => e.preventDefault()} // prevent page reload on Enter
      >
        {/* Magnifying glass icon */}
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={styles.searchIcon}
        />

        {/* Controlled input field */}
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by city or address"
          aria-label="Search by city or address"
          value={searchTerm} // directly controlled by parent
          onChange={(e) => setSearchTerm(e.target.value)} // update parent immediately
          onKeyDown={(e) => {
            // Clear input on Escape key
            if (e.key === "Escape") {
              setSearchTerm("");
            }
          }}
        />

        {/* Clear button, shown only if input has value */}
        {searchTerm && (
          <button
            type="button"
            className={styles.clearSearchBtn}
            onClick={() => setSearchTerm("")} // clear parent state
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </form>
    </div>
  );
}
