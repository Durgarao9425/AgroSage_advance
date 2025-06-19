import React, { useState } from 'react';
import { useAppContext, Language, Theme, UserProfile } from '../contexts/AppContext';
import { 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  FileText, 
  Info, 
  ChevronRight,
  Check,
  Moon,
  Sun,
  Smartphone,
  User,
  Edit3,
  Save,
  X
} from 'lucide-react';
import './SettingsScreen.css';

const SettingsScreen: React.FC = () => {
  const { 
    translations, 
    isDark, 
    language, 
    setLanguage, 
    theme, 
    setTheme,
    userProfile,
    setUserProfile
  } = useAppContext();
  
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editingProfile, setEditingProfile] = useState<UserProfile>(userProfile);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  ];

  const themes: { code: Theme; name: string; icon: any }[] = [
    { code: 'light', name: 'Light', icon: Sun },
    { code: 'dark', name: 'Dark', icon: Moon },
    { code: 'system', name: 'System', icon: Smartphone },
  ];

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setShowLanguagePicker(false);
    alert(`Language changed to ${languages.find(l => l.code === newLanguage)?.name}`);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setShowThemePicker(false);
  };

  const handleProfileSave = () => {
    setUserProfile(editingProfile);
    setShowProfileEditor(false);
    alert('Profile updated successfully!');
  };

  const getCurrentLanguageName = () => {
    return languages.find(l => l.code === language)?.nativeName || 'English';
  };

  const getCurrentThemeName = () => {
    return themes.find(t => t.code === theme)?.name || 'System';
  };

  const renderProfileEditor = () => (
    <div className="modal-overlay">
      <div className={`modal-container ${isDark ? 'dark' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{translations.editProfile}</h2>
          <button
            className="close-btn"
            onClick={() => {
              setShowProfileEditor(false);
              setEditingProfile(userProfile);
            }}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <User size={32} />
            </div>
            <button className="change-avatar-btn">Change Photo</button>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">{translations.personalInfo}</h3>
            
            <div className="form-group">
              <label className="form-label">{translations.name}</label>
              <input
                type="text"
                className="form-input"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{translations.email}</label>
              <input
                type="email"
                className="form-input"
                value={editingProfile.email}
                onChange={(e) => setEditingProfile({...editingProfile, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{translations.phone}</label>
              <input
                type="tel"
                className="form-input"
                value={editingProfile.phone}
                onChange={(e) => setEditingProfile({...editingProfile, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">{translations.farmInfo}</h3>
            
            <div className="form-group">
              <label className="form-label">{translations.farmSize}</label>
              <input
                type="text"
                className="form-input"
                value={editingProfile.farmSize}
                onChange={(e) => setEditingProfile({...editingProfile, farmSize: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{translations.experience}</label>
              <input
                type="text"
                className="form-input"
                value={editingProfile.experience}
                onChange={(e) => setEditingProfile({...editingProfile, experience: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={() => {
              setShowProfileEditor(false);
              setEditingProfile(userProfile);
            }}
          >
            {translations.cancel}
          </button>
          <button
            className="save-btn"
            onClick={handleProfileSave}
          >
            <Save size={16} />
            {translations.saveProfile}
          </button>
        </div>
      </div>
    </div>
  );

  const renderLanguagePicker = () => (
    <div className="modal-overlay">
      <div className={`modal-container ${isDark ? 'dark' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{translations.language}</h2>
          <button
            className="close-btn"
            onClick={() => setShowLanguagePicker(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="picker-list">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`picker-item ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <div className="language-info">
                <span className="language-name">{lang.name}</span>
                <span className="language-native">{lang.nativeName}</span>
              </div>
              {language === lang.code && <Check size={20} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderThemePicker = () => (
    <div className="modal-overlay">
      <div className={`modal-container ${isDark ? 'dark' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{translations.themeMode}</h2>
          <button
            className="close-btn"
            onClick={() => setShowThemePicker(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="picker-list">
          {themes.map((themeOption) => (
            <button
              key={themeOption.code}
              className={`picker-item ${theme === themeOption.code ? 'active' : ''}`}
              onClick={() => handleThemeChange(themeOption.code)}
            >
              <div className="theme-info">
                <themeOption.icon size={20} />
                <span className="theme-name">{themeOption.name}</span>
              </div>
              {theme === themeOption.code && <Check size={20} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (showProfileEditor) {
    return renderProfileEditor();
  }

  if (showLanguagePicker) {
    return renderLanguagePicker();
  }

  if (showThemePicker) {
    return renderThemePicker();
  }

  return (
    <div className={`settings-screen ${isDark ? 'dark' : ''}`}>
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <h1 className="settings-title">{translations.settings}</h1>
          <p className="settings-subtitle">Customize your AgroSage experience</p>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{userProfile.name}</h3>
              <p className="profile-email">{userProfile.email}</p>
              <p className="profile-details">
                {userProfile.farmSize} • {userProfile.experience} experience
              </p>
            </div>
            <button
              className="edit-profile-btn"
              onClick={() => setShowProfileEditor(true)}
            >
              <Edit3 size={16} />
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="settings-sections">
          {/* Account Settings */}
          <div className="settings-section">
            <h2 className="section-title">{translations.accountSettings}</h2>
            <div className="settings-group">
              <button
                className="setting-item"
                onClick={() => setShowProfileEditor(true)}
              >
                <div className="setting-icon">
                  <User size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{translations.profile}</span>
                  <span className="setting-subtitle">Manage your personal information</span>
                </div>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* App Preferences */}
          <div className="settings-section">
            <h2 className="section-title">{translations.appPreferences}</h2>
            <div className="settings-group">
              <button
                className="setting-item"
                onClick={() => setShowLanguagePicker(true)}
              >
                <div className="setting-icon">
                  <Globe size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{translations.language}</span>
                  <span className="setting-subtitle">{getCurrentLanguageName()}</span>
                </div>
                <ChevronRight size={20} />
              </button>

              <button
                className="setting-item"
                onClick={() => setShowThemePicker(true)}
              >
                <div className="setting-icon">
                  <Palette size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{translations.themeMode}</span>
                  <span className="setting-subtitle">{getCurrentThemeName()}</span>
                </div>
                <ChevronRight size={20} />
              </button>

              <div className="setting-item">
                <div className="setting-icon">
                  <Bell size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{translations.notifications}</span>
                  <span className="setting-subtitle">Push notifications</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="settings-section">
            <h2 className="section-title">{translations.helpSupport}</h2>
            <div className="settings-group">
              <button
                className="setting-item"
                onClick={() => alert('About AgroSage\n\nAgroSage is a smart crop recommendation system that helps farmers make informed decisions based on location, weather, and soil conditions.\n\nVersion 1.0.0\nDeveloped with ❤️ for farmers')}
              >
                <div className="setting-icon">
                  <Info size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{translations.aboutUs}</span>
                  <span className="setting-subtitle">Learn more about AgroSage</span>
                </div>
                <ChevronRight size={20} />
              </button>

              <button
                className="setting-item"
                onClick={() => alert('Privacy Policy\n\nYour privacy is important to us. We collect minimal data required for providing crop recommendations and never share your personal information without consent.')}
              >
                <div className="setting-icon">
                  <Shield size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{translations.privacyPolicy}</span>
                  <span className="setting-subtitle">How we protect your data</span>
                </div>
                <ChevronRight size={20} />
              </button>

              <button
                className="setting-item"
                onClick={() => alert('Terms of Service\n\nBy using AgroSage, you agree to our terms of service. The recommendations provided are for guidance only and actual results may vary based on various factors.')}
              >
                <div className="setting-icon">
                  <FileText size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{translations.termsOfService}</span>
                  <span className="setting-subtitle">Terms and conditions</span>
                </div>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* App Version */}
        <div className="app-version">
          <p className="version-text">AgroSage v1.0.0</p>
          <p className="version-subtext">Made with ❤️ for farmers</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;