import React, { useState, useEffect } from 'react';
import { getSocialLinks, saveSocialLinks } from '../services/localStorageService';

function SocialLinks() {
  const [links, setLinks] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editLinks, setEditLinks] = useState({});

  useEffect(() => {
    const savedLinks = getSocialLinks();
    setLinks(savedLinks);
    setEditLinks(savedLinks);
  }, []);

  const handleSave = () => {
    saveSocialLinks(editLinks);
    setLinks(editLinks);
    setIsEditing(false);
    alert('Social media links updated!');
  };

  const socialIcons = {
    facebook: '📘 Facebook',
    youtube: '📺 YouTube',
    telegram: '✈️ Telegram',
    instagram: '📸 Instagram',
    tiktok: '🎵 TikTok'
  };

  // Check if user is admin (has token)
  const isAdmin = localStorage.getItem('token');

  return (
    <div className="bg-church-purple py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 items-center">
          {Object.entries(links).map(([platform, url]) => {
            if (!url) return null;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-church-gold transition flex items-center gap-2"
              >
                <span className="text-xl">{socialIcons[platform]?.split(' ')[0] || '🔗'}</span>
                <span>{socialIcons[platform]?.split(' ')[1] || platform}</span>
              </a>
            );
          })}
          
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white text-sm hover:text-church-gold border-l border-white/30 pl-4 ml-4"
            >
              ⚙️ Edit Links
            </button>
          )}
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-church-purple mb-4">Edit Social Media Links</h2>
              <div className="space-y-3">
                {Object.keys(socialIcons).map(platform => (
                  <div key={platform}>
                    <label className="block text-gray-700 mb-1">{socialIcons[platform]}</label>
                    <input
                      type="url"
                      placeholder={`https://${platform}.com/yourchurch`}
                      className="w-full px-3 py-2 border rounded-lg"
                      value={editLinks[platform] || ''}
                      onChange={(e) => setEditLinks({...editLinks, [platform]: e.target.value})}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="bg-church-purple text-white px-4 py-2 rounded-lg flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SocialLinks;