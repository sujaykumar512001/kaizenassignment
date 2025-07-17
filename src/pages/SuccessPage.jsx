import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <>
      {/* Mobile Status Bar */}
      <div className="mobile-status-bar">
        9:41
      </div>
      
      <main>
        <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h1 className="card-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Thank You!
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            Your claim has been successfully submitted. Our legal team will review your information 
            and contact you within 24-48 hours to discuss your case.
          </p>
          
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>What happens next?</h3>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Case review by our legal experts
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Initial consultation call
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Detailed case evaluation
              </li>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                Legal strategy development
              </li>
            </ul>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="contact-btn" style={{ textDecoration: 'none' }}>
              Return Home
            </Link>
            <Link to="/contact" className="contact-btn" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default SuccessPage; 