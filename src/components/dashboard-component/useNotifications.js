'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const useNotifications = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        setLoading(true);

        // Fetch pending quotes
        const quotesRes = await axios.get('/api/quote');
        const quotes = quotesRes.data.quotes || [];
        const pendingQuotes = quotes.filter(q => q.status?.toLowerCase() === 'pending');

        // Fetch contact form responses
        const contactsRes = await axios.get('/api/contact');
        const contacts = contactsRes.data.contacts || [];
        const pendingContacts = contacts.filter(
          c => c.status?.toLowerCase() === 'pending' || !c.status
        );

        // Fetch pending inspection requests
        const inspectionRes = await axios.get('/api/inspection-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const inspections = Array.isArray(inspectionRes.data) ? inspectionRes.data : inspectionRes.data.inspectionRequests || [];
        const pendingInspections = inspections.filter(i => i.status?.toLowerCase() === 'pending');

        // Fetch pending partner applications
        const partnerRes = await axios.get('/api/partner-applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const partners = partnerRes.data.applications || [];
        const pendingPartners = partners.filter(p => p.status?.toLowerCase() === 'pending');

        // Combine notifications
        const combinedNotifications = [
          ...pendingQuotes.map(quote => ({
            id: `quote-${quote._id}`,
            type: 'quote',
            title: 'Pending Quote Request',
            message: `Quote request from ${quote.fullName || 'Unknown'}`,
            time: new Date(quote.createdAt).toLocaleDateString(),
            link: '/dashboard/quote-requests',
            icon: '📋',
          })),
          ...pendingContacts.map(contact => ({
            id: `contact-${contact._id}`,
            type: 'contact',
            title: 'Pending Contact Response',
            message: `Message from ${contact.fullName || contact.name || 'Unknown'}`,
            time: new Date(contact.createdAt).toLocaleDateString(),
            link: '/dashboard/contact-form-responses',
            icon: '💬',
          })),
          ...pendingInspections.map(inspection => ({
            id: `inspection-${inspection._id}`,
            type: 'inspection',
            title: 'Pending Inspection Request',
            message: `Inspection request from ${inspection.firstName} ${inspection.lastName}`,
            time: new Date(inspection.createdAt).toLocaleDateString(),
            link: '/dashboard/inspection-requests',
            icon: '🔍',
          })),
          ...pendingPartners.map(partner => ({
            id: `partner-${partner._id}`,
            type: 'partner',
            title: 'Pending Partner Application',
            message: `${partner.type === 'corporate' ? partner.companyName : `${partner.firstName} ${partner.lastName}`} partnership application`,
            time: new Date(partner.createdAt).toLocaleDateString(),
            link: '/dashboard/manage-partner-application',
            icon: '🤝',
          })),
        ];

        // Sort by most recent
        combinedNotifications.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        setNotifications(combinedNotifications.slice(0, 10)); // Show last 10
        setUnreadCount(combinedNotifications.length);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
  };
};

export default useNotifications;
