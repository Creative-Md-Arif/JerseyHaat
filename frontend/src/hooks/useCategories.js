import { useState, useEffect } from 'react';
import { getClubs } from '../services/api';

export const useCategories = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getClubs();
        setClubs(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load clubs');
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return { clubs, loading, error };
};

export default useCategories;
