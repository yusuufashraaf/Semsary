import { useState, useCallback } from "react";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHeart, faBell } from "@fortawesome/free-solid-svg-icons";
import AvatarDropdown from "./AvatarDropDownMenu/AvatarDropDownMenu";
import { useAppSelector } from "@store/hook";
import { useNavigate, useLocation } from "react-router-dom";
import logoo from "../../assets/logoo.png"
export default function Navbar() {
  const user = useAppSelector((state) => state.Authslice.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Enhanced navigation handler
  const handleNavClick = useCallback((url: string) => {
    if (isNavigating) return; // Prevent multiple rapid clicks
    
    // Close mobile menu if open
    setIsMenuOpen(false);
    
    // For property routes, handle differently to avoid state conflicts
    if (url.includes('/property')) {
      setIsNavigating(true);
      
      // Small delay to show loading state, then navigate
      setTimeout(() => {
        window.location.href = url;
      }, 100);
    } else {
      // For other routes, use normal React Router navigation
      navigate(url, { replace: true });
    }
  }, [navigate, isNavigating]);

  const navItems = [
    { 
      label: "Buy", 
      url: "/property?price_type=FullPay&page=1&sortBy=created_at&sortOrder=desc" 
    },
    { 
      label: "Rent", 
      url: "/property?price_type=Daily&page=1&sortBy=created_at&sortOrder=desc" 
    },
    { label: "About Us", url: "/about" },
    { label: "Contact Us", url: "/contact" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark border-bottom">
      <div className="container-fluid px-4">
        {/* Brand */}
        <span
          onClick={() => handleNavClick("/")}
          className={`${styles.navbarBrand} d-flex align-items-center`}
          style={{ cursor: "pointer" }}
        >
          <img 
            src={logoo} 
            alt="Semsary Logo" 
            style={{ height: "4rem", width: "auto", objectFit: "contain"}} 
          />
        </span>

        {/* Mobile controls */}
        <div className="d-flex d-lg-none align-items-center ms-auto">
          <button 
            className={`navbar-toggler border-0 ${styles.barsBtn}`} 
            onClick={toggleMenu}
            disabled={isNavigating}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* Collapsible menu */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          {/* Mobile top buttons */}
          <div className="d-lg-none mb-3 text-center">
            <div className="d-flex justify-content-center mb-2">
              <button 
                className={`${styles.wishlistBtn} me-3`}
                onClick={() => handleNavClick("/profile/wishlist")}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button 
                className={styles.notificationBtn}
                onClick={() => handleNavClick("/profile/notifications")}
              >
                <FontAwesomeIcon icon={faBell} />
              </button>
            </div>

            {/* Avatar */}
            <AvatarDropdown user={user} />
          </div>

          {/* Navigation links */}
          <ul className="navbar-nav me-auto ms-lg-5 mb-2 mb-lg-0">
            {(user?.status === "active") && (
              <li className="nav-item me-2">
                <span
                  className={`${styles.navLink} ${styles.highlight}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavClick("/profile/owner-dashboard")}
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
            <button 
              className={`me-3 ${styles.wishlistBtn}`} 
              onClick={() => handleNavClick("/profile/wishlist")}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button 
              className={`me-3 ${styles.notificationBtn}`} 
              onClick={() => handleNavClick("/profile/notifications")}
            >
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