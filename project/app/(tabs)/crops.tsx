import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import {
  Search,
  Filter,
  Star,
  Calendar,
  Droplets,
  Thermometer,
  Sprout,
  TrendingUp,
  X,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import { getThemeColors } from '@/utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { router } from 'expo-router';

const CROP_IMAGES = {
  rice: 'https://images.pexels.com/photos/1029737/pexels-photo-1029737.jpeg?auto=compress&cs=tinysrgb&w=400',
  wheat: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=400',
  cotton: 'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg?auto=compress&cs=tinysrgb&w=400',
  sugarcane: 'https://images.pexels.com/photos/8442186/pexels-photo-8442186.jpeg?auto=compress&cs=tinysrgb&w=400',
  corn: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=400',
  tomato: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
  potato: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400',
  onion: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400',
  soybean: 'https://images.pexels.com/photos/6210449/pexels-photo-6210449.jpeg?auto=compress&cs=tinysrgb&w=400',
  groundnut: 'https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg?auto=compress&cs=tinysrgb&w=400',
};

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
    image: CROP_IMAGES.rice,
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
    image: CROP_IMAGES.cotton,
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
    image: CROP_IMAGES.wheat,
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
    image: CROP_IMAGES.sugarcane,
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
    image: CROP_IMAGES.tomato,
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
    image: CROP_IMAGES.soybean,
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
];

export default function CropsScreen() {
  const { translations, isDark, location } = useAppContext();
  const colors = getThemeColors(isDark);
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

  const navigateToTab = (tabName: string) => {
    router.push(`/(tabs)/${tabName}`);
  };

  // Swipe gesture for tab navigation
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const threshold = 100;
      const velocity = event.velocityX || 0;
      
      if (velocity > threshold) {
        // Swipe right - go to previous tab (location)
        runOnJS(navigateToTab)('location');
      } else if (velocity < -threshold) {
        // Swipe left - go to next tab (settings)
        runOnJS(navigateToTab)('settings');
      }
    });

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 85) return colors.success;
    if (suitability >= 70) return colors.warning;
    return colors.error;
  };

  const getProfitabilityColor = (profitability: string) => {
    switch(profitability) {
      case 'High': return colors.success;
      case 'Medium': return colors.warning;
      case 'Low': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.filterModal, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Filter Crops
            </Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X color={colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Season Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Season</Text>
              <View style={styles.filterOptions}>
                {seasons.map((season) => (
                  <TouchableOpacity
                    key={season}
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      selectedSeason === season && { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                    ]}
                    onPress={() => setSelectedSeason(season)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: selectedSeason === season ? colors.primary : colors.text }
                    ]}>
                      {season}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Category</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      selectedCategory === category && { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: selectedCategory === category ? colors.primary : colors.text }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Profitability Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Profitability</Text>
              <View style={styles.filterOptions}>
                {profitabilities.map((profitability) => (
                  <TouchableOpacity
                    key={profitability}
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      selectedProfitability === profitability && { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                    ]}
                    onPress={() => setSelectedProfitability(profitability)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: selectedProfitability === profitability ? colors.primary : colors.text }
                    ]}>
                      {profitability}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.border }]}
              onPress={() => {
                setSelectedSeason('All');
                setSelectedCategory('All');
                setSelectedProfitability('All');
              }}
            >
              <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>
                Clear All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderCropDetail = () => (
    <Modal
      visible={!!selectedCrop}
      animationType="slide"
      onRequestClose={() => setSelectedCrop(null)}
    >
      <SafeAreaView style={[styles.detailContainer, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.detailHeader}>
            <TouchableOpacity
              onPress={() => setSelectedCrop(null)}
              style={[styles.backButton, { backgroundColor: colors.surface }]}
            >
              <X color={colors.text} size={24} />
            </TouchableOpacity>
          </View>

          {/* Crop Image */}
          <Image source={{ uri: selectedCrop?.image }} style={styles.detailImage} />

          {/* Crop Info */}
          <View style={[styles.detailContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.detailName, { color: colors.text }]}>
              {selectedCrop?.name}
            </Text>
            <Text style={[styles.detailNameLocal, { color: colors.textSecondary }]}>
              {selectedCrop?.nameLocal}
            </Text>

            {/* Suitability */}
            <View style={styles.suitabilityContainer}>
              <View
                style={[
                  styles.suitabilityBadge,
                  { backgroundColor: getSuitabilityColor(selectedCrop?.suitability || 0) + '15' }
                ]}
              >
                <Star color={getSuitabilityColor(selectedCrop?.suitability || 0)} size={16} />
                <Text style={[
                  styles.suitabilityPercentage,
                  { color: getSuitabilityColor(selectedCrop?.suitability || 0) }
                ]}>
                  {selectedCrop?.suitability}% Suitable
                </Text>
              </View>
              <View style={[styles.profitabilityBadge, { backgroundColor: getProfitabilityColor(selectedCrop?.profitability || '') + '15' }]}>
                <TrendingUp color={getProfitabilityColor(selectedCrop?.profitability || '')} size={16} />
                <Text style={[styles.profitabilityText, { color: getProfitabilityColor(selectedCrop?.profitability || '') }]}>
                  {selectedCrop?.profitability} Profit
                </Text>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
                <Calendar color={colors.primary} size={24} />
                <Text style={[styles.detailCardTitle, { color: colors.text }]}>
                  Sowing Period
                </Text>
                <Text style={[styles.detailCardValue, { color: colors.textSecondary }]}>
                  {selectedCrop?.sowingPeriod}
                </Text>
              </View>

              <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
                <Calendar color={colors.secondary} size={24} />
                <Text style={[styles.detailCardTitle, { color: colors.text }]}>
                  Harvesting
                </Text>
                <Text style={[styles.detailCardValue, { color: colors.textSecondary }]}>
                  {selectedCrop?.harvestingPeriod}
                </Text>
              </View>

              <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
                <Droplets color={colors.info} size={24} />
                <Text style={[styles.detailCardTitle, { color: colors.text }]}>
                  Water Need
                </Text>
                <Text style={[styles.detailCardValue, { color: colors.textSecondary }]}>
                  {selectedCrop?.waterRequirement}
                </Text>
              </View>

              <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
                <Sprout color={colors.success} size={24} />
                <Text style={[styles.detailCardTitle, { color: colors.text }]}>
                  Expected Yield
                </Text>
                <Text style={[styles.detailCardValue, { color: colors.textSecondary }]}>
                  {selectedCrop?.expectedYield}
                </Text>
              </View>
            </View>

            {/* Additional Info */}
            <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Soil Type</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {selectedCrop?.soilType}
              </Text>
            </View>

            <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Market Price</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {selectedCrop?.marketPrice}
              </Text>
            </View>

            <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Recommended Fertilizers</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {selectedCrop?.fertilizers.join(', ')}
              </Text>
            </View>

            <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Common Pests & Diseases</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {selectedCrop?.pestControl.join(', ')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <GestureDetector gesture={swipeGesture}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {translations.crops}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Crops suitable for {location.district}, {location.state}
          </Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface }]}>
            <Search color={colors.textSecondary} size={20} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={translations.searchCrops}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowFilters(true)}
          >
            <Filter color="white" size={20} />
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {filteredCrops.length} crops found
          </Text>
        </View>

        {/* Crops List */}
        <ScrollView style={styles.cropsList} showsVerticalScrollIndicator={false}>
          {filteredCrops.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              style={[styles.cropListItem, { backgroundColor: colors.surface }]}
              onPress={() => setSelectedCrop(crop)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: crop.image }} style={styles.cropListImage} />
              
              <View style={styles.cropListContent}>
                <View style={styles.cropListHeader}>
                  <Text style={[styles.cropListName, { color: colors.text }]}>
                    {crop.name}
                  </Text>
                  <View style={styles.suitabilityBadgeSmall}>
                    <View
                      style={[
                        styles.suitabilityDot,
                        { backgroundColor: getSuitabilityColor(crop.suitability) }
                      ]}
                    />
                    <Text style={[styles.suitabilityTextSmall, { color: colors.text }]}>
                      {crop.suitability}%
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.cropListNameLocal, { color: colors.textSecondary }]}>
                  {crop.nameLocal}
                </Text>
                
                <View style={styles.cropListDetails}>
                  <View style={styles.cropListDetail}>
                    <Calendar color={colors.textSecondary} size={14} />
                    <Text style={[styles.cropListDetailText, { color: colors.textSecondary }]}>
                      {crop.season}
                    </Text>
                  </View>
                  
                  <View style={styles.cropListDetail}>
                    <TrendingUp color={colors.textSecondary} size={14} />
                    <Text style={[styles.cropListDetailText, { color: colors.textSecondary }]}>
                      {crop.expectedYield}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.profitabilityRow}>
                  <View style={[styles.profitabilityTag, { backgroundColor: getProfitabilityColor(crop.profitability) + '15' }]}>
                    <Text style={[styles.profitabilityTagText, { color: getProfitabilityColor(crop.profitability) }]}>
                      {crop.profitability} Profit
                    </Text>
                  </View>
                  <Text style={[styles.cropPrice, { color: colors.primary }]}>
                    {crop.marketPrice}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderFilterModal()}
        {renderCropDetail()}
      </SafeAreaView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  cropsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cropListItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cropListImage: {
    width: 100,
    height: 120,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cropListContent: {
    flex: 1,
    padding: 16,
  },
  cropListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cropListName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  suitabilityBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suitabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  suitabilityTextSmall: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  cropListNameLocal: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  cropListDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  cropListDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropListDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  profitabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitabilityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  profitabilityTagText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  cropPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailImage: {
    width: '100%',
    height: 300,
  },
  detailContent: {
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 1,
  },
  detailName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  detailNameLocal: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  suitabilityContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  suitabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  suitabilityPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  profitabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  profitabilityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  detailCardValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});