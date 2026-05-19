import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [submittingItem, setSubmittingItem] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const response = await api.get('/api/items');
      setItems(response.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
      setActionError("Unable to retrieve items. Please try again.");
    } finally {
      setLoadingItems(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (!title.trim()) {
      setActionError('Title is required');
      return;
    }

    setSubmittingItem(true);
    try {
      const response = await api.post('/api/items', {
        title: title.trim(),
        description: description.trim() || null,
      });
      setItems((prevItems) => [response.data, ...prevItems]);
      setTitle('');
      setDescription('');
      setActionSuccess('Item created successfully!');
      
      // Auto-hide success message
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error("Failed to create item", err);
      setActionError(err.response?.data?.detail || "Could not create item");
    } finally {
      setSubmittingItem(false);
    }
  };

  const handleDeleteItem = async (id) => {
    setActionError('');
    try {
      await api.delete(`/api/items/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setActionSuccess('Item deleted.');
      setTimeout(() => setActionSuccess(''), 2000);
    } catch (err) {
      console.error("Failed to delete item", err);
      setActionError("Could not delete item. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="dashboard-container">
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="user-welcome">
          <h2>Hello, {user?.full_name || 'User'}</h2>
          <p>Manage your custom items and details below</p>
        </div>
        <button onClick={logout} className="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </header>

      {/* Stats Row */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Items</h3>
            <p>{items.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Account Email</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Form Column */}
        <section className="dashboard-section">
          <h3 className="section-title">Add New Item</h3>
          
          {actionError && (
            <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <span>{actionError}</span>
            </div>
          )}

          {actionSuccess && (
            <div className="alert alert-success" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <span>{actionSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateItem}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Item Title</label>
              <input
                type="text"
                id="title"
                className="input-field"
                placeholder="e.g. Plan deployment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submittingItem}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="input-field"
                placeholder="Additional details (optional)..."
                rows="4"
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submittingItem}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={submittingItem}
            >
              {submittingItem ? 'Saving...' : 'Add Item'}
            </button>
          </form>
        </section>

        {/* List Column */}
        <section className="dashboard-section">
          <h3 className="section-title">Your Stored Items</h3>

          {loadingItems ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ width: '36px', height: '36px' }}></div>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h4>No items found</h4>
              <p style={{ marginTop: '0.5rem' }}>Create your first item using the form on the left.</p>
            </div>
          ) : (
            <div className="items-list">
              {items.map((item) => (
                <div className="item-card" key={item.id}>
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: '0.5rem' }}>
                      Created on {formatDate(item.created_at)}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.5rem', borderRadius: '8px' }}
                    title="Delete item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
