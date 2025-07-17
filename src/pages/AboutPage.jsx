import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <>
      {/* Mobile Status Bar */}
      <div className="mobile-status-bar">
        9:41
      </div>
      
      <main>
      {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">About Us</h1>
          <p className="hero-subtitle">Dedicated legal professionals helping mesothelioma patients</p>
      </section>

        {/* About Content */}
        <div className="card">
          <h2 className="card-title">Our Mission</h2>
          <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', lineHeight: '1.6' }}>
            We are committed to helping mesothelioma patients and their families get the compensation they deserve. 
            Our experienced legal team has successfully represented thousands of clients in mesothelioma cases.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Expert Legal Team</h3>
              <p style={{ color: '#666' }}>Specialized attorneys with decades of mesothelioma case experience</p>
                </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Maximum Compensation</h3>
              <p style={{ color: '#666' }}>We fight to ensure you receive the maximum compensation available</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Personal Support</h3>
              <p style={{ color: '#666' }}>Compassionate care and support throughout your legal journey</p>
            </div>
          </div>
          
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Why Choose Us?</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                No upfront costs - we only get paid if you win
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Free case evaluation and consultation
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Nationwide representation
              </li>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Proven track record of success
              </li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/claim-form" className="submit-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Start Your Claim
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default AboutPage; 