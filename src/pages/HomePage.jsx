import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    jobTitle: '',
    dateOfDiagnosis: '',
    diagnosisType: '',
    story: '',
    captcha: false
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Update time immediately
    updateTime();
    
    // Update time every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  }, [submitError]);

  const validateForm = useCallback(() => {
    const errors = [];
    
    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.phone.trim()) errors.push('Phone number is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.dateOfBirth) errors.push('Date of birth is required');
    if (!formData.jobTitle.trim()) errors.push('Job title is required');
    if (!formData.dateOfDiagnosis) errors.push('Date of diagnosis is required');
    if (!formData.diagnosisType) errors.push('Diagnosis type is required');
    if (!formData.captcha) errors.push('Please verify you are a person');
    
    return errors;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setSubmitError(errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('http://localhost:5004/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          dateOfBirth: '',
          jobTitle: '',
          dateOfDiagnosis: '',
          diagnosisType: '',
          story: '',
          captcha: false
        });
        
        // Navigate to success page after a short delay
        setTimeout(() => {
          navigate('/success');
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error('Form submission failed:', errorData);
        setSubmitError(errorData.message || 'There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.name === 'AbortError') {
        setSubmitError('Request timed out. Please check your connection and try again.');
      } else {
        setSubmitError('There was an error submitting your form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, navigate]);

  return (
    <>
      {/* Mobile Status Bar */}
      <div className="mobile-status-bar">
        <span className="status-time">{currentTime}</span>
        <span className="status-icons">
          <svg width="18" height="10" style={{marginRight: 4}}><rect width="18" height="2" y="8" rx="1" fill="#222"/><rect width="14" height="2" y="5" rx="1" fill="#222"/><rect width="10" height="2" y="2" rx="1" fill="#222"/><rect width="6" height="2" y="0" rx="1" fill="#222"/></svg>
          <svg width="14" height="10" style={{marginRight: 4}}><rect width="14" height="8" y="1" rx="2" fill="#222"/></svg>
          <svg width="24" height="10"><rect width="20" height="8" x="0" y="1" rx="2" fill="#222"/><rect width="2" height="4" x="22" y="3" rx="1" fill="#222"/></svg>
        </span>
      </div>
      <main>
        {/* Hero Section - content removed */}
        <section className="hero-section">
          {/* Hero content removed */}
        </section>

        {/* Cards Container */}
        <div className="cards-container">
          {/* Left side - stacked cards */}
          <div className="left-cards">
            {/* Free Case Review Card */}
            <div className="card free-case-review">
              <h3 className="free-case-title">
                Free<br />
                Case<br />
                Review
              </h3>
              
              <ul className="benefits-list">
                <li>
                  <div className="benefit-icon shield-icon">✓</div>
                  <span>100% Confidential</span>
                </li>
                <li>
                  <div className="benefit-icon check-icon">✓</div>
                  <span>No Win, No Fee</span>
                </li>
                <li>
                  <div className="benefit-icon star-icon">★</div>
                  <span>Free Case Evaluation</span>
                </li>
              </ul>

              <button className="contact-btn" onClick={() => navigate('/contact')}>
                Contact us <span className="arrow">→</span>
              </button>
            </div>

            {/* Mesothelioma Information Card */}
            <div className="card mesothelioma-info">
              <h2 className="card-title">
                Have you or a loved one been affected by Mesothelioma?
              </h2>
              
              <p>
                As a woman, you've carried the weight of care, love, and resilience. 
                Now it's time someone stands with you.
              </p>
              
              <ul className="info-list">
                <li>Secondary Asbestos exposure is common.</li>
                <li>Mesothelioma deaths are more frequent in women.</li>
                <li>Women have won significant legal settlements.</li>
              </ul>
            </div>
          </div>

          {/* Right side - Claim Form Card */}
          <div className="card claim-form-card">
            <h2 className="card-title">Claim Form</h2>
            
            <form className="claim-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                     <input type="text" className="form-input" id="home-first-name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input type="text" className="form-input" id="home-last-name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" className="form-input" id="home-phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email ID *</label>
                  <input type="email" className="form-input" id="home-email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Date of birth *</label>
                  <div className="date-input-wrapper">
                    <input type="date" className="form-input" id="home-date-of-birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" className="form-input" id="home-job-title" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Date of diagnosis *</label>
                  <div className="date-input-wrapper">
                    <input type="date" className="form-input" id="home-date-of-diagnosis" name="dateOfDiagnosis" value={formData.dateOfDiagnosis} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Type of diagnosis *</label>
                  <div className="select-wrapper">
                    <select className="form-input" id="home-diagnosis-type" name="diagnosisType" value={formData.diagnosisType} onChange={handleInputChange} required>
                      <option value="">Select diagnosis type</option>
                      <option value="pleural">Pleural Mesothelioma</option>
                      <option value="peritoneal">Peritoneal Mesothelioma</option>
                      <option value="pericardial">Pericardial Mesothelioma</option>
                      <option value="testicular">Testicular Mesothelioma</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">Tell us your story (optional)</label>
                <textarea className="form-input form-textarea" rows="4" id="home-story" name="story" value={formData.story} onChange={handleInputChange}></textarea>
              </div>
              
              <div className="legal-disclosure">
                I agree to the <span className="legal-links">privacy policy</span> and <span className="legal-links">disclaimer</span> and give my express written consent to be contacted regarding my case options. I understand that I may be contacted by phone, email, or text message. Message and data rates may apply. My consent does not require purchase. This is Legal advertising.
              </div>
              
              <div className="captcha-checkbox">
                <input type="checkbox" id="home-captcha" name="captcha" checked={formData.captcha} onChange={handleInputChange} required />
                <label htmlFor="home-captcha">Please check this box to verify you're a person.</label>
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Start your claim now'}
              </button>
              {submitError && <p className="form-error">{submitError}</p>}
              {submitSuccess && <p className="form-success">Form submitted successfully!</p>}
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage; 