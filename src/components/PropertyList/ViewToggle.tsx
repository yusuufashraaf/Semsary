/* ViewToggle Component */
import React from "react";
import styles from "./ViewToggle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";

/* Props for the component */
interface ViewToggleProps {
  viewMode: "grid" | "list"; // current view mode
  setViewMode: (mode: "grid" | "list") => void; // function to change view mode
  resultsCount: number; // total number of results
  shownCount: number; // number of results currently displayed
}

/* Options for toggle buttons */
const viewOptions = [
  { mode: "grid" as const, label: "Grid", icon: faThLarge },
  { mode: "list" as const, label: "List", icon: faList },
];

/* Main ViewToggle Component */
const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
  resultsCount,
  shownCount,
}) => {
  return (
    /* Container: flex layout with responsive behavior */
    <div
      className={`${styles.viewToggle} d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2`}
    >
      {/* Show number of results */}
      <div className={`${styles.showResult}`}>
        <small>
          Showing <strong>{shownCount}</strong> of{" "}
          <strong>{resultsCount}</strong> results
        </small>
      </div>

      {/* Toggle buttons for grid/list */}
      <div
        className="d-flex gap-2"
        role="group"
        aria-label="Toggle between grid and list view"
      >
        {viewOptions.map(({ mode, label, icon }) => (
          /* Each button represents a view mode */
          <button
            key={mode}
            className={`${styles.toggleBtn} ${
              viewMode === mode ? styles.active : ""
            }`}
            aria-pressed={viewMode === mode} // accessibility
            onClick={() => setViewMode(mode)}
          >
            <FontAwesomeIcon icon={icon} className="me-1" /> {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewToggle;
