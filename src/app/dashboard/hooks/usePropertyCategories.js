import { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = [
  { id: 'residential', name: 'Residential', description: 'Houses, apartments, and condos for living' },
  { id: 'commercial', name: 'Commercial', description: 'Office spaces, retail locations, and business properties' },
  { id: 'industrial', name: 'Industrial', description: 'Warehouses, factories, and industrial facilities' },
  { id: 'land', name: 'Land', description: 'Vacant land and lots for development' },
  { id: 'investment', name: 'Investment', description: 'Properties for investment and rental income' }
];

export const usePropertyCategories = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      // Try to fetch from API
      const response = await fetch('/api/categories');
      
      if (response.ok) {
        const result = await response.json();
        const apiCategories = result.data || [];
        
        // Save to localStorage for caching
        localStorage.setItem('propertyCategories', JSON.stringify(apiCategories));
        
        setCategories(apiCategories);
      } else {
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading categories from API:', error);
      // Fallback to localStorage if API call fails
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('propertyCategories');
      if (saved) {
        const savedCategories = JSON.parse(saved);
        setCategories(savedCategories);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error('Error loading categories from localStorage:', error);
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  useEffect(() => {
    // Load categories from API
    loadCategories();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'propertyCategories' || e.key === null) {
        loadFromLocalStorage();
      }
    };

    // Listen for custom storage sync events
    const handleSyncEvent = () => {
      loadCategories();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('propertyCategories:updated', handleSyncEvent);

    // Refresh on window focus
    const handleFocus = () => {
      loadCategories();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propertyCategories:updated', handleSyncEvent);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { categories, loading };
};
