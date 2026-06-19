import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/adminApi';

const AdminLogin = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const trebuchetFont = {
    fontFamily: '"Trebuchet MS", "TrebuchetMS", "TrebuchetMS-Bold", "Trebuchet MS Bold", "TrebuchetMS-Italic", sans-serif',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(token.trim());
      navigate('/admin'); 
    } catch (err) {
      setError(err.message || 'Invalid token. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4" style={trebuchetFont}>
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <svg className="w-16 h-16 mx-auto text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-cream tracking-wide">Admin Panel</h1>
          <p className="text-text-muted mt-2 text-sm">Enter your secure token to access the dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-2 border border-dark-3 rounded-xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
                Security Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-dark border border-dark-3 rounded-md px-4 py-3 text-cream focus:outline-none focus:border-gold transition-colors text-sm tracking-wider"
                placeholder="Enter admin token..."
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-dark font-bold rounded-md hover:bg-gold-light transition-colors uppercase tracking-wider text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          © {new Date().getFullYear()} Royal Football Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;