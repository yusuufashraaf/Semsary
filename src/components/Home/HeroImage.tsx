import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeroImage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function HeroImage() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/property?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <section className={`hero-section text-white ${styles.heroImage}`}>
      <div className="container">
        <div className="row justify-content-end">
          <div className="col-12 col-md-10 col-lg-8 text-start">
            <div className={styles.heroContent}>
              <h1 className="display-4 fw-bold mb-3">Find your dream home</h1>
              <p className="lead mb-4">
                Explore a wide range of properties for sale and rent in your
                desired location.
              </p>

              {/* Search Box */}
              <div className={styles.searchContainer}>
                <div className="input-group input-group-lg w-100 w-md-75 w-lg-50">
                  <span className={styles.searchIconWrapper}>
                    <FontAwesomeIcon
                      className={styles.searchIcon}
                      icon={faMagnifyingGlass}
                    />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${styles.searchInput}`}
                    placeholder="Enter city or type"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    className={`btn px-4 ${styles.searchButton}`}
                    type="button"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
