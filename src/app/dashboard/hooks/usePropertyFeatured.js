'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function usePropertyFeatured() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch featured properties count
  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/property?featured=true');
      const result = await response.json();

      if (response.ok) {
        setFeaturedProperties(result.data || []);
        localStorage.setItem('featuredProperties', JSON.stringify(result.data || []));
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      // Fallback to localStorage
      const cached = localStorage.getItem('featuredProperties');
      if (cached) {
        setFeaturedProperties(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();

    // Listen for updates
    const handleUpdate = () => {
      fetchFeatured();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('propertyFeatured:updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('propertyFeatured:updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  // Toggle featured status of a property
  const toggleFeatured = async (propertyId, currentStatus) => {
    try {
      const response = await fetch(`/api/property/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }

      toast.success(`Property ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
      window.dispatchEvent(new CustomEvent('propertyFeatured:updated'));
      return true;
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
      return false;
    }
  };

  return { featuredProperties, loading, toggleFeatured, fetchFeatured };
}
