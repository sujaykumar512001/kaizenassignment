import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AdminPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_ENDPOINTS.FORM_SUBMISSION}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.data.submissions);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        setError('Failed to fetch submissions');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FORM_STATS);
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDiagnosisTypeLabel = (type) => {
    const types = {
      pleural: 'Pleural Mesothelioma',
      peritoneal: 'Peritoneal Mesothelioma',
      pericardial: 'Pericardial Mesothelioma',
      testicular: 'Testicular Mesothelioma'
    };
    return types[type] || type;
  };

  if (loading && submissions.length === 0) {
    return (
      <>
        <div className="mobile-status-bar">
          9:41
        </div>
        <main>
          <div className="admin-page">
            <div className="loading-spinner">Loading...</div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="mobile-status-bar">
        9:41
      </div>
      <main>
        <div className="admin-page">
          <div className="admin-header">
            <h1>Form Submissions Admin</h1>
            <p>Manage and view mesothelioma claim form submissions</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Submissions</h3>
                <div className="stat-number">{stats.totalSubmissions}</div>
              </div>
              <div className="stat-card">
                <h3>This Month</h3>
                <div className="stat-number">{stats.thisMonth}</div>
              </div>
              <div className="stat-card">
                <h3>This Week</h3>
                <div className="stat-number">{stats.thisWeek}</div>
              </div>
              <div className="stat-card">
                <h3>Today</h3>
                <div className="stat-number">{stats.today}</div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="admin-controls">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            <div className="sort-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="created_at">Date</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
              </select>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="sort-select"
              >
                <option value="DESC">Newest First</option>
                <option value="ASC">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Submissions Table */}
          <div className="submissions-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Job Title</th>
                  <th>Diagnosis</th>
                  <th>Date of Diagnosis</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <div className="name-cell">
                        <strong>{submission.firstName} {submission.lastName}</strong>
                        <div className="age-info">
                          Age: {submission.dateOfBirth ? 
                            Math.floor((new Date() - new Date(submission.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <div>{submission.phone}</div>
                        <div>{submission.email}</div>
                      </div>
                    </td>
                    <td>{submission.jobTitle}</td>
                    <td>
                      <span className="diagnosis-badge">
                        {getDiagnosisTypeLabel(submission.diagnosisType)}
                      </span>
                    </td>
                    <td>{submission.dateOfDiagnosis ? formatDate(submission.dateOfDiagnosis) : 'N/A'}</td>
                    <td>{formatDate(submission.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {submissions.length === 0 && !loading && (
              <div className="no-submissions">
                No submissions found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}

          {/* Refresh Button */}
          <div className="refresh-section">
            <button onClick={fetchSubmissions} className="refresh-btn">
              Refresh Data
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminPage; 