import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Bell } from 'lucide-react';
import './Header.css';
import durgarao from '../../assets/images/durgarao.png';
import ProfileEditorModal from './ProfileEditorModal';

const Header: React.FC = () => {
  const { translations, userProfile, isDark, activeTab, setActiveTab } =
    useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleMenuClick = (action: string) => {
    setMenuOpen(false);
    if (action === 'settings') setActiveTab('settings');
    if (action === 'profile') setShowProfileModal(true);
    // Add logic for 'logout' as needed
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home':
        return translations.home;
      case 'location':
        return translations.location;
      case 'crops':
        return translations.crops;
      case 'settings':
        return translations.settings;
      default:
        return translations.home;
    }
  };

  return (
    <header className={`header ${isDark ? 'dark' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">AgroSage</span>
          </div>
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>

        <div className="header-right">
          <button className="notification-btn">
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>

          <div className="user-profile" ref={menuRef}>
            <img
              src={durgarao}
              alt="Profile"
              className="profile-avatar"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => setMenuOpen((open) => !open)}
            />
            {menuOpen && (
              <div className="profile-dropdown">
                <button onClick={() => handleMenuClick('profile')}>
                  {translations.profile}
                </button>
                <button onClick={() => handleMenuClick('settings')}>
                  {translations.settings}
                </button>
                <button onClick={() => handleMenuClick('logout')}>
                  {translations.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ProfileEditorModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};

export default Header;
