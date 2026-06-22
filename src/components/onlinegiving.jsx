import React, { useState } from 'react';

function OnlineGiving() {
  const [amount, setAmount] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // PayPal/Chapa donation links - Update these with your actual links
  const donationLinks = {
    chapa: 'https://chapa.link/donate/yourchurch',
    paypal: 'https://paypal.me/yourchurch',
    telebirr: 'https://telebirr.com/donate/yourchurch'
  };

  return (
    <div className="bg-gradient-to-r from-church-purple to-church-blue text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Support Our Ministry</h2>
        <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
          Your generous giving helps us continue serving our community and spreading God's love.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={donationLinks.chapa}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-church-gold text-church-purple px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            💳 Donate via Chapa
          </a>
          <a
            href={donationLinks.paypal}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-church-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            PayPal
          </a>
          <a
            href={donationLinks.telebirr}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            📱 Telebirr
          </a>
        </div>
        
        <p className="text-xs text-gray-300 mt-6">
          Your donations are tax-deductible. Thank you for your support! 🙏
        </p>
      </div>
    </div>
  );
}

export default OnlineGiving;