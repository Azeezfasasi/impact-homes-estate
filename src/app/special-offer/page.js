'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import MainNav from '@/components/home-component/MainNav';

export default function SpecialOfferPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/special-offers?isActive=true', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainNav />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Special Offers
            </h1>
            <p className="text-lg text-gray-600">
              We're excited to introduce our exclusive research offers for our diverse projects across Abuja. 
              For any enquiries, please tap on the WhatsApp icon, or we are happy to answer any questions you might have.
            </p>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={40} className="text-impact-gold animate-spin" />
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No active offers at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-200">
                    {offer.imageUrl && (
                      <Image
                        src={offer.imageUrl}
                        alt={offer.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <div className="bg-white p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {offer.projectLocation}
                    </p>

                    {offer.discountPercentage > 0 && (
                      <div className="inline-block bg-impact-gold text-white px-4 py-2 rounded-lg font-semibold mb-4">
                        {offer.discountPercentage}% Off
                      </div>
                    )}

                    <p className="text-gray-700 text-sm line-clamp-3">
                      {offer.description}
                    </p>

                    {offer.endDate && (
                      <p className="text-xs text-gray-500 mt-4">
                        Offer ends:{' '}
                        {new Date(offer.endDate).toLocaleDateString('en-NG')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
