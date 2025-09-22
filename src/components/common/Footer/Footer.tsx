import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.linkContainer}>
          <a href="/about" className={styles.link}>
            About
          </a>
          <a href="/contact" className={styles.link}>
            Contact
          </a>
          <a href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </a>
          <a href="/terms-and-conditions" className={styles.link}>
            Terms of Service
          </a>
        </nav>
        <p className={styles.copyright}>© 2025 ITI. Buy smart, rent easy.</p>
      </div>
    </footer>
  );
};

export default Footer;
