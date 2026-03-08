'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function usePropertyStatuses() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatuses();

    // Listen for updates from other tabs/components
    const handleStorageChange = () => {
      loadStatuses();
    };

    const handleStatusUpdate = () => {
      loadStatuses();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('propertyStatuses:updated', handleStatusUpdate);
    window.addEventListener('focus', handleStatusUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propertyStatuses:updated', handleStatusUpdate);
      window.removeEventListener('focus', handleStatusUpdate);
    };
  }, []);

  const loadStatuses = async () => {
    try {
      setLoading(true);

      // Try to fetch from API first
      const response = await fetch('/api/statuses', {
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statuses');
      }

      const result = await response.json();
      const statusesData = result.data || [];

      // Cache in localStorage
      localStorage.setItem('propertyStatuses', JSON.stringify(statusesData));
      setStatuses(statusesData);
    } catch (error) {
      console.error('Error fetching statuses:', error);

      // Fallback to localStorage
      const cached = localStorage.getItem('propertyStatuses');
      if (cached) {
        try {
          const parsedStatuses = JSON.parse(cached);
          setStatuses(parsedStatuses);
        } catch (parseError) {
          console.error('Error parsing cached statuses:', parseError);
          // Use default statuses as last resort
          const defaultStatuses = [
            { id: 'available', name: 'Available', color: '#10b981' },
            { id: 'sold', name: 'Sold', color: '#ef4444' },
            { id: 'rented', name: 'Rented', color: '#3b82f6' },
            { id: 'pending', name: 'Pending', color: '#f59e0b' },
            { id: 'off-market', name: 'Off Market', color: '#8b5cf6' }
          ];
          setStatuses(defaultStatuses);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { statuses, loading };
}
