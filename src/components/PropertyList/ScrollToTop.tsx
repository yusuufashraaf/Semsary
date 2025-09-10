import React, { useState, useEffect } from "react";
import styles from "./ScrollToTop.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

// Scroll-to-Top Button Component
const ScrollTopButton: React.FC = () => {
  // State: visibility of the button
  const [isVisible, setIsVisible] = useState(false);

  // Effect: listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100); // show button after 100px scroll
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize visibility on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll smoothly to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render
  return (
    <button
      className={`${styles.scrollTopBtn} ${
        isVisible ? styles.scrollTopBtnVisible : ""
      }`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
};

export default ScrollTopButton;
