import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Navigation from './Navigation';
import Header from './Header';
import HomeScreen from '../screens/HomeScreen';
import LocationScreen from '../screens/LocationScreen';
import CropsScreen from '../screens/CropsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import './Layout.css';

const Layout: React.FC = () => {
  const { activeTab, isDark } = useAppContext();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'location':
        return <LocationScreen />;
      case 'crops':
        return <CropsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className={`app-container ${isDark ? 'dark' : ''}`}>
      <Header />
      <main className="main-content">
        {renderActiveScreen()}
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;