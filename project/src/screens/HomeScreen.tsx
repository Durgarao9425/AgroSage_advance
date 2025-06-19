import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  Thermometer, 
  Droplets, 
  Cloud, 
  MapPin, 
  Calendar, 
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Star
} from 'lucide-react';
import './HomeScreen.css';

interface Crop {
  id: string;
  name: string;
  nameLocal: string;
  suitability: number;
  season: string;
  image: string;
  expectedYield: string;
  waterRequirement: string;
  soilType: string;
}

const mockCrops: Crop[] = [
  {
    id: '1',
    name: 'Rice',
    nameLocal: 'धान / వరిమ్మ్',
    suitability: 95,
    season: 'Kharif',
    image: 'https://images.pexels.com/photos/1029737/pexels-photo-1029737.jpeg?auto=compress&cs=tinysrgb&w=300',
    expectedYield: '25-30 quintal/acre',
    waterRequirement: 'High',
    soilType: 'Clayey',
  },
  {
    id: '2',
    name: 'Cotton',
    nameLocal: 'कपास / పత్తి',
    suitability: 88,
    season: 'Kharif',
    image: 'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg?auto=compress&cs=tinysrgb&w=300',
    expectedYield: '8-12 quintal/acre',
    waterRequirement: 'Medium',
    soilType: 'Black Cotton',
  },
  {
    id: '3',
    name: 'Wheat',
    nameLocal: 'गेहूं / గోధుమ',
    suitability: 82,
    season: 'Rabi',
    image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=300',
    expectedYield: '18-22 quintal/acre',
    waterRequirement: 'Medium',
    soilType: 'Loamy',
  },
  {
    id: '4',
    name: 'Sugarcane',
    nameLocal: 'गन्ना / చెరకు',
    suitability: 78,
    season: 'Annual',
    image: 'https://images.pexels.com/photos/8442186/pexels-photo-8442186.jpeg?auto=compress&cs=tinysrgb&w=300',
    expectedYield: '300-400 quintal/acre',
    waterRequirement: 'High',
    soilType: 'Rich Loamy',
  },
  {
    id: '5',
    name: 'Tomato',
    nameLocal: 'टमाटर / టమాట',
    suitability: 86,
    season: 'Rabi/Summer',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300',
    expectedYield: '150-200 quintal/acre',
    waterRequirement: 'Medium',
    soilType: 'Well-drained Loamy',
  },
  {
    id: '6',
    name: 'Corn',
    nameLocal: 'मक्का / మొక్కజొన్న',
    suitability: 75,
    season: 'Kharif',
    image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=300',
    expectedYield: '20-25 quintal/acre',
    waterRequirement: 'Medium',
    soilType: 'Well-drained',
  },
];

const HomeScreen: React.FC = () => {
  const { translations, isDark, location, weather, setActiveTab } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 85) return '#10b981';
    if (suitability >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`home-screen ${isDark ? 'dark' : ''}`}>
      <div className="home-container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-header">
            <div className="welcome-text">
              <h1 className="welcome-title">{translations.welcomeToAgroSage}</h1>
              <p className="welcome-subtitle">{translations.smartCropRecommendation}</p>
            </div>
            <div className="time-container">
              <div className="current-time">{formatTime(currentTime)}</div>
              <div className="current-date">{formatDate(currentTime)}</div>
            </div>
          </div>
          
          <button 
            className="location-card"
            onClick={() => setActiveTab('location')}
          >
            <MapPin size={20} />
            <div className="location-info">
              <span className="location-text">{location.district}, {location.state}</span>
              <span className="location-subtext">{translations.currentLocation}</span>
            </div>
            <ArrowRight size={20} />
          </button>
        </section>

        {/* Weather Card */}
        <section className="weather-section">
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="section-title">{translations.weatherToday}</h2>
              <button 
                className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
                onClick={onRefresh}
              >
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div className="weather-content">
              <div className="weather-main">
                <div className="temperature">{weather.temperature}°C</div>
                <div className="weather-condition">{weather.condition}</div>
              </div>
              
              <div className="weather-stats">
                <div className="weather-stat">
                  <Thermometer size={18} color="#ef4444" />
                  <span className="stat-label">{translations.temperature}</span>
                  <span className="stat-value">{weather.temperature}°C</span>
                </div>
                
                <div className="weather-stat">
                  <Droplets size={18} color="#3b82f6" />
                  <span className="stat-label">{translations.humidity}</span>
                  <span className="stat-value">{weather.humidity}%</span>
                </div>
                
                <div className="weather-stat">
                  <Cloud size={18} color="#6b7280" />
                  <span className="stat-label">{translations.rainfall}</span>
                  <span className="stat-value">{weather.rainfall}mm</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Crop Recommendations */}
        <section className="crops-section">
          <div className="section-header">
            <h2 className="section-title">{translations.cropRecommendations}</h2>
            <button 
              className="view-all-btn"
              onClick={() => setActiveTab('crops')}
            >
              <span>{translations.viewAllCrops}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="crops-grid">
            {mockCrops.slice(0, 6).map((crop) => (
              <div key={crop.id} className="crop-card">
                <div className="crop-image-container">
                  <img 
                    src={crop.image} 
                    alt={crop.name}
                    className="crop-image"
                    loading="lazy"
                  />
                  <div className="suitability-badge">
                    <Star size={12} fill="currentColor" />
                    <span>{crop.suitability}%</span>
                  </div>
                </div>
                
                <div className="crop-info">
                  <h3 className="crop-name">{crop.name}</h3>
                  <p className="crop-name-local">{crop.nameLocal}</p>
                  
                  <div className="crop-stats">
                    <div className="crop-stat">
                      <Calendar size={14} />
                      <span>{crop.season}</span>
                    </div>
                    <div className="crop-stat">
                      <TrendingUp size={14} />
                      <span>{crop.expectedYield}</span>
                    </div>
                  </div>
                  
                  <div className="suitability-bar">
                    <div 
                      className="suitability-fill"
                      style={{ 
                        width: `${crop.suitability}%`,
                        backgroundColor: getSuitabilityColor(crop.suitability)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌾</div>
              <div className="stat-number">{mockCrops.length}</div>
              <div className="stat-label">Recommended Crops</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-number">87%</div>
              <div className="stat-label">Average Suitability</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeScreen;