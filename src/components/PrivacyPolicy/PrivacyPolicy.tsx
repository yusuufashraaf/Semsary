import React from "react";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "September 22, 2025";

  const policies = [
    {
      icon: "fas fa-user-shield",
      title: "Information We Collect",
      description:
        "We collect account details, transaction history, communications, and technical data to provide and secure our services.",
    },
    {
      icon: "fas fa-cogs",
      title: "How We Use Your Information",
      description:
        "Your data enables account management, bookings, secure payments, fraud prevention, and customer communication.",
    },
    {
      icon: "fas fa-share-alt",
      title: "Information Sharing",
      description:
        "We share necessary details between renters and owners, service providers, or when legally required.",
    },
    {
      icon: "fas fa-lock",
      title: "Data Storage & Security",
      description:
        "We use encryption, secure authentication, and data retention policies to keep your information safe.",
    },
    {
      icon: "fas fa-user-check",
      title: "Your Privacy Rights",
      description:
        "You can view, update, download, or delete your personal data and manage your communication preferences anytime.",
    },
    {
      icon: "fas fa-cookie-bite",
      title: "Cookies & Tracking",
      description:
        "We use secure cookies for authentication and analytics to improve user experience and platform performance.",
    },
    {
      icon: "fas fa-plug",
      title: "Third-Party Integrations",
      description:
        "We integrate with services like Google Sign-In and payment gateways. Sensitive payment data is never stored by us.",
    },
    {
      icon: "fas fa-globe",
      title: "International Data Transfers",
      description:
        "Your data may be processed outside your country of residence with safeguards for compliance and security.",
    },
    {
      icon: "fas fa-child",
      title: "Children’s Privacy",
      description:
        "Our services are not intended for users under 18, and we do not knowingly collect data from minors.",
    },
    {
      icon: "fas fa-edit",
      title: "Changes to This Policy",
      description:
        "We may update this Privacy Policy and notify you of significant changes. Continued use means acceptance.",
    },
    {
      icon: "fas fa-envelope",
      title: "Contact Us",
      description:
        "Reach us at ITI@semsary.com, through account settings, support chat, or contact our Data Protection Officer.",
    },
  ];

  return (
    <div className={styles.privacyContainer}>
      {/* Header */}
      <section className={styles.headerSection}>
        <div className="container text-center">
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Your privacy is important to us. This policy explains how we collect,
            use, and protect your personal information.
          </p>
          <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Policy Cards */}
      <section className={styles.policySection}>
        <div className="container">
          <div className="row">
            {policies.map((policy, index) => (
              <div key={index} className="col-lg-6 col-md-6 mb-4">
                <div className={styles.policyCard}>
                  <i className={`${policy.icon} ${styles.policyIcon}`}></i>
                  <h3 className={styles.policyTitle}>{policy.title}</h3>
                  <p className={styles.policyDescription}>
                    {policy.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
