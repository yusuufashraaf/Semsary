import React, { useState } from "react";
import './ContactUs.css';
const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setShowAlert(false), 5000);
  };

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Visit Us",
      details: ["Cairo, Egypt", "Postal Code: 12345"]
    },
    {
      icon: "fas fa-phone",
      title: "Call Us",
      details: ["+20 123 456 7890", "+20 987 654 3210", "Mon-Fri 9AM-6PM"]
    },
    {
      icon: "fas fa-envelope",
      title: "Email Us",
      details: ["info@realestate.com", "support@realestate.com", "24/7 Support"]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--primary-bg)',
      fontFamily: '"Public Sans", sans-serif'
    }}>
      {/* Contact Section */}
    <section className="contact-section">
    <div className="container">
        <div className="row align-items-center">
        <div className="col-lg-6">
            <div className="contact-content">
            <h1 className="contact-title">Get In Touch</h1>
            <p className="contact-description">
                Have questions about our properties or services? We're here to help. 
                Reach out to us and let's start a conversation about your real estate needs.
            </p>
            
            <div className="contact-features">
                <div className="contact-feature">
                <div className="contact-feature-icon">
                    <i className="fas fa-phone"></i>
                </div>
                <div className="contact-feature-text">
                    <h6 className="contact-feature-title">Quick Response</h6>
                    <p className="contact-feature-desc">Get answers within 24 hours</p>
                </div>
                </div>
                
                <div className="contact-feature">
                <div className="contact-feature-icon">
                    <i className="fas fa-user-tie"></i>
                </div>
                <div className="contact-feature-text">
                    <h6 className="contact-feature-title">Expert Guidance</h6>
                    <p className="contact-feature-desc">Professional consultation</p>
                </div>
                </div>
                
                <div className="contact-feature">
                <div className="contact-feature-icon">
                    <i className="fas fa-calendar"></i>
                </div>
                <div className="contact-feature-text">
                    <h6 className="contact-feature-title">Flexible Schedule</h6>
                    <p className="contact-feature-desc">Available when you need us</p>
                </div>
                </div>
                
                <div className="contact-feature">
                <div className="contact-feature-icon">
                    <i className="fas fa-shield-alt"></i>
                </div>
                <div className="contact-feature-text">
                    <h6 className="contact-feature-title">Trusted Service</h6>
                    <p className="contact-feature-desc">Reliable and secure</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div className="col-lg-6">
            <div className="contact-image-container">
            <img 
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&h=400&fit=crop"
                alt="Contact Us"
                className="contact-image"
            />
            </div>
        </div>
        </div>
    </div>
    </section>

    {/* Contact Info */}
    <section className="contact-info-section">
    <div className="container">
        <div className="row">
            {contactInfo.map((info, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="contact-info-card">
                <div>
                    <i className={`${info.icon} contact-info-icon`}></i>
                </div>
                <h5 className="contact-info-title">
                    {info.title}
                </h5>
                {info.details.map((detail, idx) => (
                    <p key={idx} className="contact-info-detail">{detail}</p>
                ))}
                </div>
            </div>
            ))}
        </div>
    </div>
    </section>

    {/* Contact Form Section */}
    <section className="contact-form-section">
    <div className="container">
        <div className="row">
            <div className="col-lg-8 mx-auto">
                <div className="contact-form-container">
                <div className="form-header">
                    <h2 className="form-title">Send Us A Message</h2>
                    <p className="form-subtitle">
                    Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                </div>

                {showAlert && (
                    <div className="success-alert">
                    <i className="fas fa-check-circle alert-icon"></i>
                    Thank you for your message! We'll get back to you soon.
                    </div>
                )}

                <form>
                    <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                        <label className="form-label">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                        <label className="form-label">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        </div>
                    </div>
                    </div>

                    <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                        <label className="form-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                        />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                        <label className="form-label">
                            Subject *
                        </label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">Select a subject</option>
                            <option value="property-inquiry">Property Inquiry</option>
                            <option value="general-question">General Question</option>
                            <option value="support">Support</option>
                            <option value="partnership">Partnership</option>
                            <option value="other">Other</option>
                        </select>
                        </div>
                    </div>
                    </div>

                    <div className="form-group-full">
                    <label className="form-label">
                        Message *
                    </label>
                    <textarea
                        rows={6}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your inquiry or how we can help you..."
                        className="form-textarea"
                    />
                    </div>

                    <div className="submit-container">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="submit-button"
                    >
                        <i className="fas fa-paper-plane button-icon"></i>
                        Send Message
                    </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
    </section>

     
    </div>
  );
};
export default ContactUs;
