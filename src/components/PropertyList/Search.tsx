import { useEffect, useState } from "react";
import styles from "./Search.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Props interface to define expected props for type safety
interface SearchBarProps {
  searchTerm: string; // current search term from parent
  setSearchTerm: (value: string) => void; // function to update parent state
}

export default function Search({ searchTerm, setSearchTerm }: SearchBarProps) {
  // Local state to hold input value before sending to parent (for debouncing)
  const [localValue, setLocalValue] = useState(searchTerm);

  // useEffect for debouncing input updates to parent
  useEffect(() => {
    // Delay updating parent state by 300ms after user stops typing
    const handler = setTimeout(() => {
      // Trim spaces and normalize multiple spaces
      setSearchTerm(localValue.trim().replace(/\s+/g, " "));
    }, 300);

    // Cleanup previous timeout on each change
    return () => clearTimeout(handler);
  }, [localValue, setSearchTerm]);

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
          value={localValue} // controlled input
          onChange={(e) => setLocalValue(e.target.value)} // update local state
          onKeyDown={(e) => {
            // Clear input on Escape key
            if (e.key === "Escape") {
              setLocalValue("");
              setSearchTerm("");
            }
          }}
        />

        {/* Clear button, shown only if input has value */}
        {localValue && (
          <button
            type="button"
            className={styles.clearSearchBtn}
            onClick={() => {
              setLocalValue(""); // clear local state
              setSearchTerm(""); // clear parent state
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </form>
    </div>
  );
}
