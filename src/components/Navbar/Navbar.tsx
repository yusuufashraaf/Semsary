import { useState } from "react";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHeart, faBell } from "@fortawesome/free-solid-svg-icons";
import AvatarDropdown from "./AvatarDropDownMenu/AvatarDropDownMenu";
import { useAppSelector } from "@store/hook";

export default function Navbar() {
  const user = useAppSelector((state) => state.Authslice.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };


  const navItems = [
    { label: "Buy", url: "/property?price_type=FullPay&page=1" },
    { label: "Rent", url: "/property?price_type=Daily&page=1" },
    { label: "About Us", url: "/about" },
    { label: "Contact Us", url: "/contact" },
  ];

  const handleNavClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark border-bottom">
      <div className="container-fluid px-3">
        {/* Brand */}
        <span
          onClick={() => handleNavClick("/")}
          className={`${styles.navbarBrand} d-flex align-items-center`}
          style={{ cursor: "pointer" }}
        >
          Semsary
        </span>

        {/* Mobile controls */}
        <div className="d-flex d-lg-none align-items-center ms-auto">
          <button className={`navbar-toggler border-0 ${styles.barsBtn}`} onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* Collapsible menu */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          {/* Mobile top buttons */}
          <div className="d-lg-none mb-3 text-center">
            <div className="d-flex justify-content-center mb-2">
              <button className={`${styles.wishlistBtn} me-3`}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button className={styles.notificationBtn}>
                <FontAwesomeIcon icon={faBell} />
              </button>
            </div>

            {/* Avatar */}
            <AvatarDropdown user={user} />
          </div>

          {/* Navigation links */}
          <ul className="navbar-nav me-auto ms-lg-5 mb-2 mb-lg-0">
            {(user?.role === "user" || user?.role === "Owner") && (
              <li className="nav-item me-2">
                <span
                  className={`${styles.navLink} ${styles.highlight}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavClick("/owner-dashboard/add-property")}
                >
                  Add Property
                </span>
              </li>
            )}
            {navItems.map((item) => (
              <li className="nav-item me-2" key={item.label}>
                <span
                  className={styles.navLink}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavClick(item.url)}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Desktop controls */}
          <div className="d-none d-lg-flex align-items-center ms-auto">
            <button className={`me-3 ${styles.wishlistBtn}`} onClick={() => handleNavClick("/profile/wishlist")}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button className={`me-3 ${styles.notificationBtn}`}>
              <FontAwesomeIcon icon={faBell} />
            </button>

            {/* Avatar */}
            <AvatarDropdown user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
