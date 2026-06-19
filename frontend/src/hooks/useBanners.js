import { useState, useEffect } from 'react';
import { getBanners } from '../services/api';

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBanners();
        setBanners(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load banners');
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return { banners, loading, error };
};

export default useBanners;
