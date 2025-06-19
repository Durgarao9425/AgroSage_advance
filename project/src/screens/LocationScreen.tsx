import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { MapPin, Navigation, Search, Check, ChevronRight } from 'lucide-react';
import './LocationScreen.css';

const INDIAN_STATES_DISTRICTS = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar', 'Nalgonda', 'Adilabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bharatpur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 'Kharagpur'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Hoshiarpur'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Begusarai'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Baripada'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram'],
};

const LocationScreen: React.FC = () => {
  const { translations, isDark, location, setLocation } = useAppContext();
  const [selectedState, setSelectedState] = useState(location.state);
  const [selectedDistrict, setSelectedDistrict] = useState(location.district);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);

  const states = Object.keys(INDIAN_STATES_DISTRICTS);
  const districts = INDIAN_STATES_DISTRICTS[selectedState as keyof typeof INDIAN_STATES_DISTRICTS] || [];

  const filteredStates = states.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDistricts = districts.filter(district =>
    district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Mock reverse geocoding - in real app, use a geocoding service
            const mockStates = ['Telangana', 'Karnataka', 'Maharashtra', 'Tamil Nadu'];
            const mockDistricts = ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai'];
            
            const randomIndex = Math.floor(Math.random() * mockStates.length);
            const state = mockStates[randomIndex];
            const district = mockDistricts[randomIndex];

            setSelectedState(state);
            setSelectedDistrict(district);
            
            setLocation({
              state,
              district,
              coordinates: { latitude, longitude },
            });
            
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Failed to get current location. Please try again.');
            setIsLoadingLocation(false);
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get current location. Please try again.');
      setIsLoadingLocation(false);
    }
  };

  const saveLocation = () => {
    setLocation({
      state: selectedState,
      district: selectedDistrict,
    });
    alert(`Location updated to ${selectedDistrict}, ${selectedState}`);
  };

  const renderStatePicker = () => (
    <div className="picker-overlay">
      <div className={`picker-container ${isDark ? 'dark' : ''}`}>
        <div className="picker-header">
          <h2 className="picker-title">{translations.selectLocation} - {translations.state}</h2>
          <button
            className="close-btn"
            onClick={() => {
              setShowStatePicker(false);
              setSearchQuery('');
            }}
          >
            {translations.cancel}
          </button>
        </div>
        
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search states..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="picker-list">
          {filteredStates.map((state) => (
            <button
              key={state}
              className={`picker-item ${selectedState === state ? 'active' : ''}`}
              onClick={() => {
                setSelectedState(state);
                setSelectedDistrict(INDIAN_STATES_DISTRICTS[state as keyof typeof INDIAN_STATES_DISTRICTS][0]);
                setShowStatePicker(false);
                setSearchQuery('');
              }}
            >
              <span className="picker-item-text">{state}</span>
              {selectedState === state && <Check size={20} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDistrictPicker = () => (
    <div className="picker-overlay">
      <div className={`picker-container ${isDark ? 'dark' : ''}`}>
        <div className="picker-header">
          <h2 className="picker-title">{translations.selectLocation} - {translations.district}</h2>
          <button
            className="close-btn"
            onClick={() => {
              setShowDistrictPicker(false);
              setSearchQuery('');
            }}
          >
            {translations.cancel}
          </button>
        </div>
        
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="picker-list">
          {filteredDistricts.map((district) => (
            <button
              key={district}
              className={`picker-item ${selectedDistrict === district ? 'active' : ''}`}
              onClick={() => {
                setSelectedDistrict(district);
                setShowDistrictPicker(false);
                setSearchQuery('');
              }}
            >
              <span className="picker-item-text">{district}</span>
              {selectedDistrict === district && <Check size={20} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (showStatePicker) {
    return renderStatePicker();
  }

  if (showDistrictPicker) {
    return renderDistrictPicker();
  }

  return (
    <div className={`location-screen ${isDark ? 'dark' : ''}`}>
      <div className="location-container">
        {/* Header */}
        <div className="location-header">
          <h1 className="location-title">{translations.selectLocation}</h1>
          <p className="location-subtitle">
            Choose your location for personalized crop recommendations
          </p>
        </div>

        {/* Current Location Button */}
        <button
          className="gps-button"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Navigation size={24} />
          <span>{isLoadingLocation ? translations.loading : translations.useGPS}</span>
        </button>

        {/* Manual Selection */}
        <div className="manual-section">
          <h2 className="section-title">Manual Selection</h2>

          {/* State Selector */}
          <button
            className="selector"
            onClick={() => setShowStatePicker(true)}
          >
            <div className="selector-content">
              <MapPin size={20} color="#22c55e" />
              <div className="selector-text">
                <span className="selector-label">{translations.state}</span>
                <span className="selector-value">{selectedState}</span>
              </div>
            </div>
            <ChevronRight size={20} />
          </button>

          {/* District Selector */}
          <button
            className="selector"
            onClick={() => setShowDistrictPicker(true)}
          >
            <div className="selector-content">
              <MapPin size={20} color="#10b981" />
              <div className="selector-text">
                <span className="selector-label">{translations.district}</span>
                <span className="selector-value">{selectedDistrict}</span>
              </div>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Current Selection Summary */}
        <div className="summary-card">
          <h3 className="summary-title">{translations.currentLocation}</h3>
          <div className="summary-content">
            <MapPin size={24} color="#22c55e" />
            <div className="summary-text">
              <span className="summary-location">{selectedDistrict}, {selectedState}</span>
              <span className="summary-note">
                Crop recommendations will be based on this location
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          className={`save-button ${
            (selectedState === location.state && selectedDistrict === location.district) 
              ? 'disabled' : ''
          }`}
          onClick={saveLocation}
          disabled={selectedState === location.state && selectedDistrict === location.district}
        >
          {translations.save} {translations.location}
        </button>

        {/* Location Info */}
        <div className="info-section">
          <h3 className="info-title">Why Location Matters?</h3>
          <ul className="info-list">
            <li>Climate conditions vary by region</li>
            <li>Soil types differ across locations</li>
            <li>Seasonal patterns are location-specific</li>
            <li>Local market demand influences recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationScreen;