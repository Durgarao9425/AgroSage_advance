import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Home, MapPin, Wheat, Settings } from 'lucide-react';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, translations, isDark } = useAppContext();

  const navItems = [
    { id: 'home', label: translations.home, icon: Home },
    { id: 'location', label: translations.location, icon: MapPin },
    { id: 'crops', label: translations.crops, icon: Wheat },
    { id: 'settings', label: translations.settings, icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = navItems.findIndex(item => item.id === activeTab);
    let newIndex;
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
    } else {
      newIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setActiveTab(navItems[newIndex].id);
  };

  React.useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only handle horizontal swipes
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          handleSwipe('right');
        } else {
          handleSwipe('left');
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className={`bottom-nav ${isDark ? 'dark' : ''}`}>
        <div className="nav-container">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleTabChange(item.id)}
              >
                <Icon size={20} strokeWidth={2} />
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="nav-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className={`sidebar-nav ${isDark ? 'dark' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">🌱</div>
              <span className="sidebar-logo-text">AgroSage</span>
            </div>
          </div>
          
          <div className="sidebar-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.id)}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="sidebar-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;