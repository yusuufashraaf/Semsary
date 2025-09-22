import React from "react";
import styles from "./TermsAndCondition.module.css";

const TermsAndConditions: React.FC = () => {
  const lastUpdated = "September 22, 2025";

  const terms = [
    {
      icon: "fas fa-file-signature",
      title: "Agreement to Terms",
      description:
        "By accessing and using our rental platform, you accept and agree to these terms. If you do not agree, please do not use this Service.",
    },
    {
      icon: "fas fa-building",
      title: "Platform Description",
      description:
        "Our platform connects property owners with renters. It supports property discovery, booking, payments, communication, and refunds.",
    },
    {
      icon: "fas fa-user-check",
      title: "User Accounts & Verification",
      description:
        "Users must register with valid details. Roles include Renter, Owner, Agent, and Admin, each with different permissions.",
    },
    {
      icon: "fas fa-calendar-check",
      title: "Booking & Payment",
      description:
        "Bookings require owner approval and timely payment. Payments are held in escrow until checkout, ensuring fairness for both parties.",
    },
    {
      icon: "fas fa-ban",
      title: "Cancellations & Disputes",
      description:
        "Refunds and cancellations depend on timing. Disputes are handled by platform agents, whose decisions are binding.",
    },
    {
      icon: "fas fa-wallet",
      title: "Financial Terms",
      description:
        "Users maintain platform wallets for transactions. Refunds go to wallets, and owners receive payouts after successful checkouts.",
    },
    {
      icon: "fas fa-exclamation-triangle",
      title: "Prohibited Conduct",
      description:
        "No false info, harassment, payment circumvention, multiple accounts, or illegal activity. Violations may suspend accounts.",
    },
    {
      icon: "fas fa-balance-scale",
      title: "Responsibilities & Limitations",
      description:
        "We facilitate connections and tools but are not a party to rental contracts. We do not guarantee outcomes.",
    },
    {
      icon: "fas fa-edit",
      title: "Modifications",
      description:
        "We may update these terms anytime. Users will be notified of significant changes. Continued use means acceptance.",
    },
    {
      icon: "fas fa-headset",
      title: "Contact Us",
      description:
        "For questions, reach us via email (ITI@semsray.com).",
    },
  ];

  return (
    <div className={styles.termsContainer}>
      {/* Header */}
      <section className={styles.headerSection}>
        <div className="container text-center">
          <h1 className={styles.title}>Terms & Conditions</h1>
          <p className={styles.subtitle}>
            Please read these terms carefully before using our rental platform.
          </p>
          <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Terms Cards */}
      <section className={styles.termsSection}>
        <div className="container">
          <div className="row">
            {terms.map((term, index) => (
              <div key={index} className="col-lg-6 col-md-6 mb-4">
                <div className={styles.termCard}>
                  <i className={`${term.icon} ${styles.termIcon}`}></i>
                  <h3 className={styles.termTitle}>{term.title}</h3>
                  <p className={styles.termDescription}>{term.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
