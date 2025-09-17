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
      details: ["123 Real Estate Street", "Cairo, Egypt", "Postal Code: 12345"]
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
      {/* Hero Section */}
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
      <section style={{padding: '80px 0', backgroundColor: 'var(--background-dark)'}}>
        <div className="container">
          <div className="row">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '2rem',
                  textAlign: 'center',
                  height: '100%',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{marginBottom: '1.5rem'}}>
                    <i className={info.icon} style={{
                      fontSize: '2.5rem',
                      color: 'var(--primary-color)'
                    }}></i>
                  </div>
                  <h5 style={{
                    marginBottom: '1rem',
                    color: 'var(--primary-color)',
                    fontWeight: 'bold'
                  }}>
                    {info.title}
                  </h5>
                  {info.details.map((detail, idx) => (
                    <p key={idx} style={{
                      marginBottom: '0.25rem',
                      color: '#6c757d',
                      fontSize: 'var(--font-size-base)'
                    }}>{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{padding: '80px 0'}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div style={{
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                padding: '3rem'
              }}>
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                  <h2 style={{
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: 'var(--primary-color)'
                  }}>Send Us A Message</h2>
                  <p style={{color: '#6c757d', marginBottom: '0'}}>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                {showAlert && (
                  <div style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    border: '1px solid #c3e6cb'
                  }}>
                    <i className="fas fa-check-circle" style={{marginRight: '0.5rem'}}></i>
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <div onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          color: 'var(--primary-color)',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          display: 'block'
                        }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--primary-border)',
                            padding: 'var(--spacing-lg)',
                            fontSize: 'var(--font-size-base)',
                            outline: 'none',
                            transition: 'border-color 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--primary-border)'}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          color: 'var(--primary-color)',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          display: 'block'
                        }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--primary-border)',
                            padding: 'var(--spacing-lg)',
                            fontSize: 'var(--font-size-base)',
                            outline: 'none',
                            transition: 'border-color 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--primary-border)'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          color: 'var(--primary-color)',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          display: 'block'
                        }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--primary-border)',
                            padding: 'var(--spacing-lg)',
                            fontSize: 'var(--font-size-base)',
                            outline: 'none',
                            transition: 'border-color 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--primary-border)'}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          color: 'var(--primary-color)',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          display: 'block'
                        }}>
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--primary-border)',
                            padding: 'var(--spacing-lg)',
                            fontSize: 'var(--font-size-base)',
                            outline: 'none',
                            transition: 'border-color 0.3s ease',
                            backgroundColor: 'var(--white)'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--primary-border)'}
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

                  <div style={{marginBottom: '2rem'}}>
                    <label style={{
                      color: 'var(--primary-color)',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      display: 'block'
                    }}>
                      Message *
                    </label>
                    <textarea
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your inquiry or how we can help you..."
                      style={{
                        width: '100%',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary-border)',
                        padding: 'var(--spacing-lg)',
                        fontSize: 'var(--font-size-base)',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--primary-border)'}
                    />
                  </div>

                  <div style={{textAlign: 'center'}}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--spacing-lg) 2rem',
                        fontSize: 'var(--font-size-md)',
                        fontWeight: '500',
                        color: 'var(--white)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                      }}
                    >
                      <i className="fas fa-paper-plane" style={{marginRight: '0.5rem'}}></i>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};
export default ContactUs;
