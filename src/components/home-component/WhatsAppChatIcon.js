'use client'

import React, { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import Image from 'next/image'

export default function WhatsAppChatIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const whatsappNumber = '353872482181'
  const whatsappMessage = 'Hi Impact Home Real Estate, I would like to inquire about your services.'

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-8 left-3 md:left-8 z-40">
      {/* Message Bubble */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl p-4 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-900 font-semibold text-sm">Impact Home Real Estate</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            👋 Hello! Have any questions? We're here to help. Chat with us on WhatsApp!
          </p>
          
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Image src="/img/whatsappicon.svg" alt="WhatsApp" width={20} height={20} className="w-5 h-5" />
            Chat on WhatsApp
          </button>
        </div>
      )}

      {/* WhatsApp Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
        title="Chat with us on WhatsApp"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <Image src="/img/whatsappicon.svg" alt="WhatsApp" width={20} height={20} className="w-10 h-10" />
            {/* Notification Dot */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </>
        )}
      </button>

      {/* Floating Animation Background */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        button:hover {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
