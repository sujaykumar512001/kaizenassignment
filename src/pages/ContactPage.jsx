import React from 'react';

const ContactPage = () => {
  return (
    <>
      {/* Mobile Status Bar */}
      <div className="mobile-status-bar">
        9:41
      </div>
      
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">Get in touch with our legal team</p>
        </section>

        {/* Contact Content */}
        <div className="card">
          <h2 className="card-title">Get Your Free Consultation</h2>
          <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', lineHeight: '1.6' }}>
            Our experienced legal team is here to help you understand your rights and get the compensation you deserve. 
            Contact us today for a free, confidential consultation.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Call Us</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>79-49068000</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Available 24/7</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Email Us</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>contactblr9@kaizentek.co.in</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Response within 24 hours</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Live Chat</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>Available on website</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Instant response</p>
            </div>
          </div>
          
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>What to Expect</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Free, confidential consultation
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                No obligation to proceed
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Expert legal advice
              </li>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Clear next steps
              </li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <a href="tel:79-49068000" className="submit-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Call Now
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactPage; 