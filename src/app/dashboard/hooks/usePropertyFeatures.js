'use client';

import { useState, useEffect } from 'react';

export function usePropertyFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturesFromAPI();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = () => loadFeaturesFromAPI();
    const handleFocus = () => loadFeaturesFromAPI();
    const handleFeatureUpdate = () => loadFeaturesFromAPI();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('propertyFeatures:updated', handleFeatureUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('propertyFeatures:updated', handleFeatureUpdate);
    };
  };

  const loadFeaturesFromAPI = async () => {
    try {
      const response = await fetch('/api/features', { cache: 'no-cache' });
      const result = await response.json();

      if (response.ok && result.data) {
        setFeatures(result.data);
        localStorage.setItem('propertyFeatures', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Error loading features from API:', error);
      // Fallback to localStorage or default features
      loadFeaturesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturesFromLocalStorage = () => {
    const saved = localStorage.getItem('propertyFeatures');
    if (saved) {
      try {
        const savedFeatures = JSON.parse(saved);
        setFeatures(savedFeatures);
      } catch (error) {
        console.error('Error parsing features from storage:', error);
        setFeatures([]);
      }
    }
    setLoading(false);
  };

  return { features, loading };
}
