import React, { useState, useEffect } from 'react';
import { getAllClubsAdmin, createClub, updateClub, deleteClub } from '../services/adminApi';

const ClubManage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    league: '',
    country: '',
    color: '#c9a84c',
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const trebuchetFont = {
    fontFamily: '"Trebuchet MS", "TrebuchetMS", "TrebuchetMS-Bold", "Trebuchet MS Bold", sans-serif',
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await getAllClubsAdmin();
    
      console.log(response);
  
      // Backend sends { success: true, data: [...] }, so we need response.data.data
      const fetchedClubs = response.data?.data || response.data || [];
      setClubs(fetchedClubs);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch clubs');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      league: '',
      country: '',
      color: '#c9a84c',
      isActive: true,
    });
    setLogoFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic Validation
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError('Club Name and Slug are required.');
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        // Convert boolean to string explicitly for FormData
        if (typeof formData[key] === 'boolean') {
          data.append(key, formData[key].toString());
        } else {
          data.append(key, formData[key]);
        }
      });
      
      if (logoFile) {
        data.append('logo', logoFile);
      }

      if (isEditing && editingId) {
        await updateClub(editingId, data);
        setSuccess('Club updated successfully!');
      } else {
        await createClub(data);
        setSuccess('Club created successfully!');
      }

      resetForm();
      fetchClubs();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save club');
    }
  };

  const handleEdit = (club) => {
    setFormData({
      name: club.name || '',
      slug: club.slug || '',
      league: club.league || '',
      country: club.country || '',
      color: club.color || '#c9a84c',
      isActive: club.isActive,
    });
    setIsEditing(true);
    setEditingId(club._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await deleteClub(id);
      setSuccess('Club deleted successfully!');
      fetchClubs();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete club');
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Reusable input classes
  const inputClass = "w-full bg-dark border border-dark-3 rounded-md px-3 py-2.5 text-cream focus:outline-none focus:border-gold transition-colors text-sm";
  const labelClass = "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6" style={trebuchetFont}>
      <h1 className="text-2xl md:text-3xl text-cream mb-6 border-b border-dark-3 pb-4 font-bold tracking-wide">
        Manage Clubs
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-md text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-dark-2 border border-dark-3 rounded-xl p-5 md:p-8 mb-8 shadow-lg">
        <h2 className="text-lg text-gold font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-5 bg-gold rounded-full"></span>
          {isEditing ? 'Edit Club' : 'Add New Club'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Club Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  name,
                  slug: isEditing ? prev.slug : generateSlug(name),
                }));
              }}
              className={inputClass}
              required
              placeholder="e.g., Real Madrid"
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className={inputClass}
              required
              placeholder="e.g., real-madrid"
            />
          </div>
          <div>
            <label className={labelClass}>League</label>
            <input
              type="text"
              value={formData.league}
              onChange={(e) => setFormData((prev) => ({ ...prev, league: e.target.value }))}
              className={inputClass}
              placeholder="e.g., La Liga"
            />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
              className={inputClass}
              placeholder="e.g., Spain"
            />
          </div>
          <div>
            <label className={labelClass}>Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                className="w-12 h-10 rounded border border-dark-3 cursor-pointer bg-dark p-1"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Logo Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-dark file:bg-gold file:cursor-pointer hover:file:bg-gold-light cursor-pointer"
            />
          </div>
          
          <div className="sm:col-span-2 flex items-center gap-3 mt-2 bg-dark p-3 rounded-md border border-dark-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-dark-3 bg-dark-2 text-gold focus:ring-gold cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm text-cream cursor-pointer select-none">
              Is Active? (Show on website)
            </label>
          </div>
          
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-gold text-dark font-bold rounded-md hover:bg-gold-light transition-colors uppercase tracking-wider text-sm shadow-md"
            >
              {isEditing ? 'Update Club' : 'Create Club'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-6 py-2.5 bg-dark-3 text-cream font-medium rounded-md hover:bg-dark border border-dark-3 transition-colors uppercase tracking-wider text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Clubs List Section */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-2 border-dark-3 border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="text-text-muted mt-3 text-sm">Loading clubs...</p>
        </div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-dark-3 rounded-xl">
          <p className="text-text-muted">No clubs found. Add your first club!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-hidden border border-dark-3 rounded-xl bg-dark-2">
            <table className="w-full text-left">
              <thead className="bg-dark border-b border-dark-3">
                <tr>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Logo</th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Slug</th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">League</th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <tr key={club._id} className="border-b border-dark-3 last:border-0 hover:bg-dark-3/30 transition-colors">
                    <td className="p-4">
                      {club.logo ? (
                        <img src={club.logo} alt={club.name} className="w-10 h-10 object-contain rounded-full bg-dark p-1" />
                      ) : (
                        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: club.color }} />
                      )}
                    </td>
                    <td className="p-4 font-medium text-cream">{club.name}</td>
                    <td className="p-4 text-text-muted text-sm">{club.slug}</td>
                    <td className="p-4 text-text-muted text-sm">{club.league || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${club.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {club.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(club)}
                          className="p-2 text-gold hover:bg-gold/10 rounded-md transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(club._id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Visible on mobile) */}
          <div className="md:hidden space-y-4">
            {clubs.map((club) => (
              <div key={club._id} className="bg-dark-2 border border-dark-3 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {club.logo ? (
                    <img src={club.logo} alt={club.name} className="w-12 h-12 object-contain rounded-full bg-dark p-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-full" style={{ backgroundColor: club.color }} />
                  )}
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-medium text-cream truncate">{club.name}</h3>
                    <p className="text-xs text-text-muted truncate">{club.league || 'N/A'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${club.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {club.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-dark-3 pt-3 mt-1">
                  <button
                    onClick={() => handleEdit(club)}
                    className="flex-1 py-2 text-gold bg-gold/10 hover:bg-gold/20 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(club._id)}
                    className="flex-1 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClubManage;