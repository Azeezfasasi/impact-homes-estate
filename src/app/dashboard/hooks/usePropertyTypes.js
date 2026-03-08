'use client';

import { useState, useEffect } from 'react';

export function usePropertyTypes() {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPropertyTypesFromAPI();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = () => loadPropertyTypesFromAPI();
    const handleFocus = () => loadPropertyTypesFromAPI();
    const handlePropertyTypeUpdate = () => loadPropertyTypesFromAPI();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('propertyTypes:updated', handlePropertyTypeUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('propertyTypes:updated', handlePropertyTypeUpdate);
    };
  };

  const loadPropertyTypesFromAPI = async () => {
    try {
      const response = await fetch('/api/property-types', { cache: 'no-cache' });
      const result = await response.json();

      if (response.ok && result.data) {
        setPropertyTypes(result.data);
        localStorage.setItem('propertyTypes', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Error loading property types from API:', error);
      // Fallback to localStorage or default types
      loadPropertyTypesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadPropertyTypesFromLocalStorage = () => {
    const saved = localStorage.getItem('propertyTypes');
    if (saved) {
      try {
        const savedPropertyTypes = JSON.parse(saved);
        setPropertyTypes(savedPropertyTypes);
      } catch (error) {
        console.error('Error parsing property types from storage:', error);
        setPropertyTypes([]);
      }
    }
    setLoading(false);
  };

  return { propertyTypes, loading };
}
