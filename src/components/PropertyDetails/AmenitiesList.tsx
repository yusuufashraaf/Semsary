import { ReactNode } from "react";
import styles from "./AmenitiesList.module.css";
import {
  Wifi,
  Snowflake,
  Utensils,
  WashingMachine,
  Car,
  Home,
} from "lucide-react";
import { AmenitiesListProps } from "src/types";

/* Constants */
// Set a single icon size for consistency
const ICON_SIZE = 30;

/* Icon Map */
// Maps normalized amenity names to their respective icons
const iconMap: Record<string, ReactNode> = {
  wifi: <Wifi size={ICON_SIZE} />,
  ac: <Snowflake size={ICON_SIZE} />,
  airconditioning: <Snowflake size={ICON_SIZE} />,
  kitchen: <Utensils size={ICON_SIZE} />,
  washer: <WashingMachine size={ICON_SIZE} />,
  parking: <Car size={ICON_SIZE} />,
  freeparking: <Car size={ICON_SIZE} />,
};

// Default fallback icon for unrecognized amenities
const defaultIcon = <Home size={ICON_SIZE} />;

/* Helpers */
// Normalizes keys (removes spaces/dashes, lowercases)
const normalizeKey = (key: string) => key.replace(/[\s-]/g, "").toLowerCase();

/* Component */
function AmenitiesList({ amenities }: AmenitiesListProps) {
  return (
    <ul className={styles.grid}>
      {amenities.map((amenity) => {
        const key = normalizeKey(amenity);
        const icon = iconMap[key] || defaultIcon;

        return (
          <li key={key} className={styles.item}>
            <span className={styles.icon} role="img" aria-label={amenity}>
              {icon}
            </span>
            <span title={amenity}>{amenity}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default AmenitiesList;
