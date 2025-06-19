import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Bell } from 'lucide-react';
import './Header.css';
import durgarao from '../../assets/images/durgarao.png';

const Header: React.FC = () => {
  const { translations, userProfile, isDark, setActiveTab } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
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
    // Add logic for 'profile' and 'logout' as needed
  };

  const getPageTitle = () => {
    // If you want to show a title, you can use a default or remove this function if not needed
    return translations.home;
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
    </header>
  );
};

export default Header;
