import { useState } from "react";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faHeart,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

interface User {
  avatar: string;
  type: string;
  name: string;
  email: string;
}

type NavbarProps = {
  user?: User | null;
};

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsSearchOpen(false);
  };
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  const navItems = ["Buy", "Rent", "Sell", "About Us", "Contact Us"];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark border-bottom">
      <div className="container-fluid px-3">
        {/* Brand */}
        <a
          href="/"
          className={`${styles.navbarBrand} d-flex align-items-center`}
        >
          Semsary
        </a>

        {/* Mobile controls */}
        <div className="d-flex d-lg-none align-items-center ms-auto">
          <button
            className="btn btn-outline-light btn-sm me-2"
            onClick={toggleSearch}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <button className="navbar-toggler border-0" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* Collapsible menu */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          {/* Mobile top buttons */}
          <div className="d-lg-none mb-3 text-center">
            <div className="d-flex justify-content-center mb-2">
              <button
                className={`btn btn-outline-light me-3 ${styles.wishlistBtn}`}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button
                className={`btn btn-outline-light ${styles.notificationBtn}`}
              >
                <FontAwesomeIcon icon={faBell} />
              </button>
            </div>
            {user ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className={`${styles.avatar} rounded-circle`}
                width={40}
                height={40}
              />
            ) : (
              <button className="btn btn-outline-light w-100">Log in</button>
            )}
          </div>

          {/* Navigation links */}
          <ul className="navbar-nav me-auto ms-lg-5 mb-2 mb-lg-0">
            {(!user || user.type === "Owner") && (
              <li className="nav-item me-2">
                <a className={`${styles.navLink} ${styles.highlight}`} href="#">
                  Add Property
                </a>
              </li>
            )}
            {navItems.map((item) => (
              <li className="nav-item me-2" key={item}>
                <a className={styles.navLink} href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop controls */}
          <div className="d-none d-lg-flex align-items-center ms-auto ">
            <input
              type="search"
              className={`${styles.searchBar}`}
              placeholder="Search"
              aria-label="Search"
            />
            <button className={`me-3 ${styles.wishlistBtn}`}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button className={`me-3 ${styles.notificationBtn}`}>
              <FontAwesomeIcon icon={faBell} />
            </button>
            {user ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className={`${styles.avatar} rounded-circle`}
                width={40}
                height={40}
              />
            ) : (
              <button className={`${styles.signInBtn}`}>Log in</button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="d-lg-none mt-2">
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
              />
              <button className="btn btn-outline-secondary" type="button">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
