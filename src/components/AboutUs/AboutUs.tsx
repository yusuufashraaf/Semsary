import React from "react";
import './AboutUs.css';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: "Ahmed Kamel",
      image: "#"
    },
    {
      name: "Mohamed Mostafa",
      image: "#"
    },
    {
      name: "Mahmoud Abdelhalem",
      image: "#"
    },
    {
      name: "Yara Mohamed",
      image: "#"
    },
    {
      name: "Youssef Ashraf",
      image: "#"
    }
  ];

  const values = [
    {
      icon: "fas fa-handshake",
      title: "Trust & Transparency",
      description: "We believe in honest dealings and transparent processes in every transaction."
    },
    {
      icon: "fas fa-users",
      title: "Customer First",
      description: "Our clients' satisfaction and success are at the heart of everything we do."
    },
    {
      icon: "fas fa-award",
      title: "Excellence",
      description: "We strive for excellence in service delivery and property management."
    },
    {
      icon: "fas fa-globe",
      title: "Innovation",
      description: "We embrace technology and innovation to enhance the real estate experience."
    }
  ];

  return (
    <div className="about-us-container">
    <section className="contact-section">
    <div className="container">
        <div className="row align-items-center">
        <div className="col-lg-6">
            <div className="contact-content">
            <h1 className="contact-title">About Our Project</h1>
            <p className="contact-description">
                Our platform was created to make property management and discovery easier, faster, 
                and more accessible. We aim to connect property owners with potential tenants and buyers 
                through a seamless digital experience. The project focuses on solving real problems like 
                finding trusted listings, managing property details, and improving communication between 
                owners and clients.
            </p>
            </div>
        </div>
        <div className="col-lg-6">
            <div className="contact-image-container">
            <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"
                    alt="Project Concept"
                    className="hero-image"
            />
            </div>
        </div>
        </div>
    </div>
    </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-5">
              <div className="mission-vision-card">
                <div>
                  <i className="fas fa-bullseye mission-vision-icon"></i>
                </div>
                <h3 className="mission-vision-title">Our Mission</h3>
                <p className="mission-vision-text">
                  To simplify the real estate experience by providing exceptional service, 
                  innovative solutions, and expert guidance to help our clients achieve 
                  their property goals with confidence and ease.
                </p>
              </div>
            </div>
            <div className="col-lg-6 mb-5">
              <div className="mission-vision-card">
                <div>
                  <i className="fas fa-eye mission-vision-icon"></i>
                </div>
                <h3 className="mission-vision-title">Our Vision</h3>
                <p className="mission-vision-text">
                  To be the leading real estate platform that transforms how people 
                  buy, sell, and manage properties through technology, trust, and 
                  unparalleled customer service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>
          <div className="row">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="value-card">
                  <div>
                    <i className={`${value.icon} value-icon`}></i>
                  </div>
                  <h5 className="value-title">
                    {value.title}
                  </h5>
                  <p className="value-description">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              The experts behind your real estate success
            </p>
          </div>
          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="team-card">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="team-image"
                  />
                  <h5 className="team-name">
                    {member.name}
                  </h5>
                  <h6 className="team-position">Developer</h6>
                  <p className="team-description">
                    Passionate about creating innovative solutions for real estate challenges.
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

export default AboutUs;