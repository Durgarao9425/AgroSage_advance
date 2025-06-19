import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Droplets, 
  TrendingUp,
  X,
  ChevronDown
} from 'lucide-react';
import './CropsScreen.css';

interface CropDetail {
  id: string;
  name: string;
  nameLocal: string;
  suitability: number;
  season: string;
  image: string;
  sowingPeriod: string;
  harvestingPeriod: string;
  soilType: string;
  waterRequirement: string;
  expectedYield: string;
  fertilizers: string[];
  pestControl: string[];
  marketPrice: string;
  profitability: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Cereal' | 'Cash Crop' | 'Vegetable' | 'Pulse' | 'Oilseed';
}

const mockCropsData: CropDetail[] = [
  {
    id: '1',
    name: 'Rice',
    nameLocal: 'धान / వరిమ్మ్',
    suitability: 95,
    season: 'Kharif',
    image: 'https://images.pexels.com/photos/1029737/pexels-photo-1029737.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'June - July',
    harvestingPeriod: 'November - December',
    soilType: 'Clayey, Alluvial',
    waterRequirement: 'High (1200-1800mm)',
    expectedYield: '25-30 quintal/acre',
    fertilizers: ['NPK 12:32:16', 'Urea', 'DAP'],
    pestControl: ['Brown Plant Hopper', 'Stem Borer', 'Leaf Folder'],
    marketPrice: '₹1,800-2,200/quintal',
    profitability: 'High',
    difficulty: 'Medium',
    category: 'Cereal',
  },
  {
    id: '2',
    name: 'Cotton',
    nameLocal: 'कपास / పత్తి',
    suitability: 88,
    season: 'Kharif',
    image: 'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'May - June',
    harvestingPeriod: 'October - January',
    soilType: 'Black Cotton Soil',
    waterRequirement: 'Medium (600-1200mm)',
    expectedYield: '8-12 quintal/acre',
    fertilizers: ['Complex Fertilizer', 'Potash', 'Boron'],
    pestControl: ['Bollworm', 'Aphids', 'Thrips'],
    marketPrice: '₹5,500-6,200/quintal',
    profitability: 'High',
    difficulty: 'Hard',
    category: 'Cash Crop',
  },
  {
    id: '3',
    name: 'Wheat',
    nameLocal: 'गेहूं / గోధుమ',
    suitability: 82,
    season: 'Rabi',
    image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'November - December',
    harvestingPeriod: 'March - April',
    soilType: 'Loamy, Alluvial',
    waterRequirement: 'Medium (400-600mm)',
    expectedYield: '18-22 quintal/acre',
    fertilizers: ['NPK 20:20:0', 'Urea', 'SSP'],
    pestControl: ['Aphids', 'Rust Disease', 'Termite'],
    marketPrice: '₹2,000-2,400/quintal',
    profitability: 'Medium',
    difficulty: 'Easy',
    category: 'Cereal',
  },
  {
    id: '4',
    name: 'Sugarcane',
    nameLocal: 'गन्ना / చెరకు',
    suitability: 78,
    season: 'Annual',
    image: 'https://images.pexels.com/photos/8442186/pexels-photo-8442186.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'February - March',
    harvestingPeriod: 'December - March',
    soilType: 'Rich Loamy, Alluvial',
    waterRequirement: 'High (1500-2500mm)',
    expectedYield: '300-400 quintal/acre',
    fertilizers: ['FYM', 'NPK 15:15:15', 'Zinc Sulphate'],
    pestControl: ['Early Shoot Borer', 'Pyrilla', 'Red Rot'],
    marketPrice: '₹280-320/quintal',
    profitability: 'High',
    difficulty: 'Hard',
    category: 'Cash Crop',
  },
  {
    id: '5',
    name: 'Tomato',
    nameLocal: 'टमाटर / టమాట',
    suitability: 86,
    season: 'Rabi/Summer',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'October - November',
    harvestingPeriod: 'January - March',
    soilType: 'Well-drained Loamy',
    waterRequirement: 'Medium (400-600mm)',
    expectedYield: '150-200 quintal/acre',
    fertilizers: ['Vermicompost', 'NPK 19:19:19', 'Calcium'],
    pestControl: ['Fruit Borer', 'Leaf Curl Virus', 'Blight'],
    marketPrice: '₹800-1,500/quintal',
    profitability: 'High',
    difficulty: 'Medium',
    category: 'Vegetable',
  },
  {
    id: '6',
    name: 'Soybean',
    nameLocal: 'सोयाबीन / సోయాబీన్',
    suitability: 79,
    season: 'Kharif',
    image: 'https://images.pexels.com/photos/6210449/pexels-photo-6210449.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'June - July',
    harvestingPeriod: 'September - October',
    soilType: 'Well-drained Black Soil',
    waterRequirement: 'Medium (500-700mm)',
    expectedYield: '12-16 quintal/acre',
    fertilizers: ['DAP', 'Rhizobium Culture', 'Potash'],
    pestControl: ['Pod Borer', 'Leaf Eating Caterpillar', 'Rust'],
    marketPrice: '₹3,800-4,200/quintal',
    profitability: 'Medium',
    difficulty: 'Easy',
    category: 'Oilseed',
  },
  {
    id: '7',
    name: 'Potato',
    nameLocal: 'आलू / బంగాళాదుంప',
    suitability: 84,
    season: 'Rabi',
    image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'October - November',
    harvestingPeriod: 'January - February',
    soilType: 'Sandy Loam',
    waterRequirement: 'Medium (500-700mm)',
    expectedYield: '200-250 quintal/acre',
    fertilizers: ['NPK 20:20:0', 'FYM', 'Potash'],
    pestControl: ['Late Blight', 'Aphids', 'Cutworm'],
    marketPrice: '₹800-1,200/quintal',
    profitability: 'Medium',
    difficulty: 'Medium',
    category: 'Vegetable',
  },
  {
    id: '8',
    name: 'Onion',
    nameLocal: 'प्याज / ఉల్లిపాయ',
    suitability: 77,
    season: 'Rabi',
    image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400',
    sowingPeriod: 'November - December',
    harvestingPeriod: 'March - April',
    soilType: 'Well-drained Loamy',
    waterRequirement: 'Medium (350-550mm)',
    expectedYield: '150-200 quintal/acre',
    fertilizers: ['NPK 10:26:26', 'Sulphur', 'Boron'],
    pestControl: ['Thrips', 'Purple Blotch', 'Stemphylium Blight'],
    marketPrice: '₹1,000-2,000/quintal',
    profitability: 'High',
    difficulty: 'Medium',
    category: 'Vegetable',
  },
];

const CropsScreen: React.FC = () => {
  const { translations, isDark, location } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropDetail | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProfitability, setSelectedProfitability] = useState<string>('All');

  const seasons = ['All', 'Kharif', 'Rabi', 'Summer', 'Annual'];
  const categories = ['All', 'Cereal', 'Cash Crop', 'Vegetable', 'Pulse', 'Oilseed'];
  const profitabilities = ['All', 'High', 'Medium', 'Low'];

  const filteredCrops = useMemo(() => {
    return mockCropsData.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.nameLocal.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeason = selectedSeason === 'All' || crop.season === selectedSeason;
      const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
      const matchesProfitability = selectedProfitability === 'All' || crop.profitability === selectedProfitability;
      
      return matchesSearch && matchesSeason && matchesCategory && matchesProfitability;
    });
  }, [searchQuery, selectedSeason, selectedCategory, selectedProfitability]);

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 85) return '#10b981';
    if (suitability >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getProfitabilityColor = (profitability: string) => {
    switch(profitability) {
      case 'High': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#ef4444';
      default: return '#64748b';
    }
  };

  const renderFilterModal = () => (
    <div className="filter-overlay">
      <div className={`filter-modal ${isDark ? 'dark' : ''}`}>
        <div className="filter-header">
          <h2 className="filter-title">Filter Crops</h2>
          <button 
            className="close-btn"
            onClick={() => setShowFilters(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="filter-content">
          {/* Season Filter */}
          <div className="filter-section">
            <h3 className="filter-label">Season</h3>
            <div className="filter-options">
              {seasons.map((season) => (
                <button
                  key={season}
                  className={`filter-option ${selectedSeason === season ? 'active' : ''}`}
                  onClick={() => setSelectedSeason(season)}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h3 className="filter-label">Category</h3>
            <div className="filter-options">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Profitability Filter */}
          <div className="filter-section">
            <h3 className="filter-label">Profitability</h3>
            <div className="filter-options">
              {profitabilities.map((profitability) => (
                <button
                  key={profitability}
                  className={`filter-option ${selectedProfitability === profitability ? 'active' : ''}`}
                  onClick={() => setSelectedProfitability(profitability)}
                >
                  {profitability}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button
            className="clear-btn"
            onClick={() => {
              setSelectedSeason('All');
              setSelectedCategory('All');
              setSelectedProfitability('All');
            }}
          >
            Clear All
          </button>
          <button
            className="apply-btn"
            onClick={() => setShowFilters(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  const renderCropDetail = () => (
    <div className="crop-detail-overlay">
      <div className={`crop-detail-modal ${isDark ? 'dark' : ''}`}>
        <div className="crop-detail-header">
          <button
            className="back-btn"
            onClick={() => setSelectedCrop(null)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="crop-detail-content">
          <img 
            src={selectedCrop?.image} 
            alt={selectedCrop?.name}
            className="crop-detail-image"
          />

          <div className="crop-detail-info">
            <h1 className="crop-detail-name">{selectedCrop?.name}</h1>
            <p className="crop-detail-name-local">{selectedCrop?.nameLocal}</p>

            <div className="crop-badges">
              <div 
                className="suitability-badge"
                style={{ backgroundColor: getSuitabilityColor(selectedCrop?.suitability || 0) + '20' }}
              >
                <Star size={16} fill="currentColor" />
                <span style={{ color: getSuitabilityColor(selectedCrop?.suitability || 0) }}>
                  {selectedCrop?.suitability}% Suitable
                </span>
              </div>
              <div 
                className="profitability-badge"
                style={{ backgroundColor: getProfitabilityColor(selectedCrop?.profitability || '') + '20' }}
              >
                <TrendingUp size={16} />
                <span style={{ color: getProfitabilityColor(selectedCrop?.profitability || '') }}>
                  {selectedCrop?.profitability} Profit
                </span>
              </div>
            </div>

            <div className="crop-details-grid">
              <div className="detail-card">
                <Calendar size={24} color="#22c55e" />
                <h3>Sowing Period</h3>
                <p>{selectedCrop?.sowingPeriod}</p>
              </div>

              <div className="detail-card">
                <Calendar size={24} color="#10b981" />
                <h3>Harvesting</h3>
                <p>{selectedCrop?.harvestingPeriod}</p>
              </div>

              <div className="detail-card">
                <Droplets size={24} color="#3b82f6" />
                <h3>Water Need</h3>
                <p>{selectedCrop?.waterRequirement}</p>
              </div>

              <div className="detail-card">
                <TrendingUp size={24} color="#10b981" />
                <h3>Expected Yield</h3>
                <p>{selectedCrop?.expectedYield}</p>
              </div>
            </div>

            <div className="crop-info-sections">
              <div className="info-section">
                <h3>Soil Type</h3>
                <p>{selectedCrop?.soilType}</p>
              </div>

              <div className="info-section">
                <h3>Market Price</h3>
                <p>{selectedCrop?.marketPrice}</p>
              </div>

              <div className="info-section">
                <h3>Recommended Fertilizers</h3>
                <p>{selectedCrop?.fertilizers.join(', ')}</p>
              </div>

              <div className="info-section">
                <h3>Common Pests & Diseases</h3>
                <p>{selectedCrop?.pestControl.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`crops-screen ${isDark ? 'dark' : ''}`}>
      <div className="crops-container">
        {/* Header */}
        <div className="crops-header">
          <h1 className="crops-title">{translations.crops}</h1>
          <p className="crops-subtitle">
            Crops suitable for {location.district}, {location.state}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-container">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              className="search-input"
              placeholder={translations.searchCrops}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="filter-btn"
            onClick={() => setShowFilters(true)}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <span className="results-count">{filteredCrops.length} crops found</span>
        </div>

        {/* Crops Grid */}
        <div className="crops-grid">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="crop-card"
              onClick={() => setSelectedCrop(crop)}
            >
              <div className="crop-image-container">
                <img 
                  src={crop.image} 
                  alt={crop.name}
                  className="crop-image"
                  loading="lazy"
                />
                <div className="crop-suitability">
                  <div 
                    className="suitability-dot"
                    style={{ backgroundColor: getSuitabilityColor(crop.suitability) }}
                  />
                  <span>{crop.suitability}%</span>
                </div>
              </div>
              
              <div className="crop-card-content">
                <h3 className="crop-card-name">{crop.name}</h3>
                <p className="crop-card-name-local">{crop.nameLocal}</p>
                
                <div className="crop-card-details">
                  <div className="crop-detail">
                    <Calendar size={14} />
                    <span>{crop.season}</span>
                  </div>
                  <div className="crop-detail">
                    <TrendingUp size={14} />
                    <span>{crop.expectedYield}</span>
                  </div>
                </div>
                
                <div className="crop-card-footer">
                  <div 
                    className="profitability-tag"
                    style={{ backgroundColor: getProfitabilityColor(crop.profitability) + '20' }}
                  >
                    <span style={{ color: getProfitabilityColor(crop.profitability) }}>
                      {crop.profitability} Profit
                    </span>
                  </div>
                  <span className="crop-price">{crop.marketPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🌾</div>
            <h3>No crops found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {showFilters && renderFilterModal()}
      {selectedCrop && renderCropDetail()}
    </div>
  );
};

export default CropsScreen;