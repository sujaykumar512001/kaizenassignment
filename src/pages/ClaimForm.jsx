import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const ClaimForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

      const response = await fetch(API_ENDPOINTS.FORM_SUBMISSION, {
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
        9:41
      </div>
      
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">File Your Claim</h1>
          <p className="hero-subtitle">Get the compensation you deserve</p>
        </section>

        {/* Claim Form Card */}
        <div className="card claim-form-card">
          <h2 className="card-title">Claim Form</h2>
          
          <form className="claim-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email ID *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date of birth *</label>
                <div className="date-input-wrapper">
                  <input 
                    type="date" 
                    className="form-input" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date of diagnosis *</label>
                <div className="date-input-wrapper">
                  <input 
                    type="date" 
                    className="form-input" 
                    name="dateOfDiagnosis"
                    value={formData.dateOfDiagnosis}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Type of diagnosis *</label>
                <div className="select-wrapper">
                  <select 
                    className="form-input" 
                    name="diagnosisType"
                    value={formData.diagnosisType}
                    onChange={handleInputChange}
                    required
                  >
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
              <textarea 
                className="form-input form-textarea" 
                rows="4"
                name="story"
                value={formData.story}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <div className="legal-disclosure">
              I agree to the <span className="legal-links">privacy policy</span> and <span className="legal-links">disclaimer</span> and give my express written consent to be contacted regarding my case options. I understand that I may be contacted by phone, email, or text message. Message and data rates may apply. My consent does not require purchase. This is Legal advertising.
            </div>
            
            <div className="captcha-checkbox">
              <input 
                type="checkbox" 
                id="captcha" 
                name="captcha"
                checked={formData.captcha}
                onChange={handleInputChange}
                required 
              />
              <label htmlFor="captcha">Please check this box to verify you're a person.</label>
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Start your claim now'}
            </button>
            {submitError && <p className="form-error">{submitError}</p>}
            {submitSuccess && <p className="form-success">Form submitted successfully!</p>}
          </form>
        </div>
      </main>
    </>
  );
};

export default ClaimForm; 