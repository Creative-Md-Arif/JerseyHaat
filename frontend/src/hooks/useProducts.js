import { useState, useEffect, useCallback } from "react";
import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getProducts,
  getProductsByClub,
  getProductsByType,
  getProductBySlug,
  getClubBySlug as apiGetClubBySlug,
} from "../services/api";

export const useClubBySlug = (slug) => {
  const [club, setClub] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchClub = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiGetClubBySlug(slug);
        setClub(response.data?.club || null);
        setProducts(response.data?.products || []);
      } catch (err) {
        setError(err.message || "Failed to load club");
        setClub(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [slug]);

  return { club, products, loading, error };
};

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFeaturedProducts();
        setProducts(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load featured products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNewArrivals();
        setProducts(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load new arrivals");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useBestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBestSellers();
        setProducts(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load best sellers");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useProductList = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── BUG FIX ──
  // আগে useCallback-এর dependency ছিল `params` object।
  // ShopPage প্রতি রেন্ডারে নতুন object পাঠাত, ফলে fetchProducts বারবার
  // re-create হয়ে infinite loop তৈরি করত আর loading কখনো শেষ হতো না।
  // এখন object-কে string-এ serialize করে compare করছি (stable dependency)।
  const paramsKey = JSON.stringify(params);

  const fetchProducts = useCallback(
    async (newParams = {}) => {
      try {
        setLoading(true);
        setError(null);
        const baseParams = JSON.parse(paramsKey);
        const response = await getProducts({ ...baseParams, ...newParams });
        setProducts(response.data || []);
        setPagination({
          total: response.total || 0,
          totalPages: response.totalPages || 0,
          currentPage: response.currentPage || 1,
        });
      } catch (err) {
        setError(err.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [paramsKey],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, pagination, loading, error, refetch: fetchProducts };
};

export const useProductsByClub = (clubSlug) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clubSlug) {
      setLoading(false);
      return;
    }
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProductsByClub(clubSlug);
        setProducts(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load club products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [clubSlug]);

  return { products, loading, error };
};

export const useProductsByType = (type) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type) {
      setLoading(false);
      return;
    }
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProductsByType(type);
        setProducts(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [type]);

  return { products, loading, error };
};

export const useProductDetail = (slug) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProductBySlug(slug);
        setProduct(response.data?.product || null);
        setRelatedProducts(response.data?.relatedProducts || []);
      } catch (err) {
        setError(err.message || "Failed to load product details");
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  return { product, relatedProducts, loading, error };
};

export default useProductList;
