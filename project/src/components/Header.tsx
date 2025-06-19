import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Bell, User } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const { translations, userProfile, isDark, activeTab, setActiveTab } =
    useAppContext();

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

          <button
            className="profile-btn"
            onClick={() => setActiveTab('settings')}
          >
            <div className="profile-avatar">
              <User size={14} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
