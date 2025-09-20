import styles from "./AllProperties.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const AllProperties = () => {
    const navigate = useNavigate();
  return (
    <div className={styles.container}>
          {/* View More Properties button */}
      <button
        className={`${styles.button} ${styles.viewMoreButton}`}
        onClick={()=>navigate("/property")}
        aria-label="View more properties"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} /> View More Properties
      </button>
 </div>
  );
};

export default AllProperties;
