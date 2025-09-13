import styles from "./LocationMap.module.css";
import { LocationMapProps } from "src/types";

function LocationMap({ lat, lng, height = 320 }: LocationMapProps) {
  if (isNaN(lat) || isNaN(lng)) {
    return <p>Invalid location data</p>;
  }

  return (
    <div className={styles.mapContainer} style={{ height }}>
      <h3 className="h5">📍 Location</h3>
      <iframe
        title="Google Map Location"
        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

export default LocationMap;
