import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  Thermometer,
  Droplets,
  Cloud,
  Wheat,
  ArrowRight,
  MapPin,
  Calendar,
  TrendingUp,
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
};

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
    image: CROP_IMAGES.rice,
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
    image: CROP_IMAGES.cotton,
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
    image: CROP_IMAGES.wheat,
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
    image: CROP_IMAGES.sugarcane,
    expectedYield: '300-400 quintal/acre',
    waterRequirement: 'High',
    soilType: 'Rich Loamy',
  },
];

export default function HomeScreen() {
  const { translations, isDark, location, weather } = useAppContext();
  const colors = getThemeColors(isDark);
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
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const navigateToTab = (tabName: string) => {
    router.push(`/(tabs)/${tabName}`);
  };

  // Swipe gesture for tab navigation
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const threshold = 100;
      const velocity = event.velocityX || 0;
      
      if (velocity > threshold) {
        // Swipe right - go to previous tab (settings)
        runOnJS(navigateToTab)('settings');
      } else if (velocity < -threshold) {
        // Swipe left - go to next tab (location)
        runOnJS(navigateToTab)('location');
      }
    });

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 85) return colors.success;
    if (suitability >= 70) return colors.warning;
    return colors.error;
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
    <GestureDetector gesture={swipeGesture}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Welcome Section */}
          <View style={[styles.welcomeSection, { backgroundColor: colors.surface }]}>
            <View style={styles.welcomeHeader}>
              <View>
                <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                  {translations.welcomeToAgroSage}
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                  {translations.smartCropRecommendation}
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={[styles.timeText, { color: colors.text }]}>
                  {formatTime(currentTime)}
                </Text>
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                  {formatDate(currentTime)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.locationCard, { backgroundColor: colors.primary + '15' }]}
              onPress={() => navigateToTab('location')}
            >
              <MapPin color={colors.primary} size={20} />
              <View style={styles.locationInfo}>
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {location.district}, {location.state}
                </Text>
                <Text style={[styles.locationSubtext, { color: colors.textSecondary }]}>
                  {translations.currentLocation}
                </Text>
              </View>
              <ArrowRight color={colors.primary} size={20} />
            </TouchableOpacity>
          </View>

          {/* Weather Card */}
          <View style={[styles.weatherCard, { backgroundColor: colors.weatherCard }]}>
            <View style={styles.weatherHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {translations.weatherToday}
              </Text>
              <Cloud color={colors.info} size={24} />
            </View>
            
            <View style={styles.weatherContent}>
              <View style={styles.weatherMain}>
                <Text style={[styles.temperature, { color: colors.text }]}>
                  {weather.temperature}°C
                </Text>
                <Text style={[styles.weatherCondition, { color: colors.textSecondary }]}>
                  {weather.condition}
                </Text>
              </View>
              
              <View style={styles.weatherStats}>
                <View style={styles.weatherStat}>
                  <Thermometer color={colors.error} size={18} />
                  <Text style={[styles.weatherStatLabel, { color: colors.textSecondary }]}>
                    {translations.temperature}
                  </Text>
                  <Text style={[styles.weatherStatValue, { color: colors.text }]}>
                    {weather.temperature}°C
                  </Text>
                </View>
                
                <View style={styles.weatherStat}>
                  <Droplets color={colors.info} size={18} />
                  <Text style={[styles.weatherStatLabel, { color: colors.textSecondary }]}>
                    {translations.humidity}
                  </Text>
                  <Text style={[styles.weatherStatValue, { color: colors.text }]}>
                    {weather.humidity}%
                  </Text>
                </View>
                
                <View style={styles.weatherStat}>
                  <Cloud color={colors.secondary} size={18} />
                  <Text style={[styles.weatherStatLabel, { color: colors.textSecondary }]}>
                    {translations.rainfall}
                  </Text>
                  <Text style={[styles.weatherStatValue, { color: colors.text }]}>
                    {weather.rainfall}mm
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Crop Recommendations */}
          <View style={styles.cropsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {translations.cropRecommendations}
              </Text>
              <TouchableOpacity 
                onPress={() => navigateToTab('crops')}
                style={styles.viewAllButton}
              >
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  {translations.viewAllCrops}
                </Text>
                <ArrowRight color={colors.primary} size={16} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cropsScrollContainer}
            >
              {mockCrops.map((crop) => (
                <TouchableOpacity
                  key={crop.id}
                  style={[styles.cropCard, { backgroundColor: colors.surface }]}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: crop.image }} style={styles.cropImage} />
                  
                  <View style={styles.cropInfo}>
                    <Text style={[styles.cropName, { color: colors.text }]}>
                      {crop.name}
                    </Text>
                    <Text style={[styles.cropNameLocal, { color: colors.textSecondary }]}>
                      {crop.nameLocal}
                    </Text>
                    
                    <View style={styles.cropStats}>
                      <View style={styles.suitabilityContainer}>
                        <View
                          style={[
                            styles.suitabilityIndicator,
                            { backgroundColor: getSuitabilityColor(crop.suitability) },
                          ]}
                        />
                        <Text style={[styles.suitabilityText, { color: colors.text }]}>
                          {crop.suitability}% {translations.suitable}
                        </Text>
                      </View>
                      
                      <View style={styles.cropDetail}>
                        <Calendar color={colors.textSecondary} size={14} />
                        <Text style={[styles.cropDetailText, { color: colors.textSecondary }]}>
                          {crop.season}
                        </Text>
                      </View>
                      
                      <View style={styles.cropDetail}>
                        <TrendingUp color={colors.textSecondary} size={14} />
                        <Text style={[styles.cropDetailText, { color: colors.textSecondary }]}>
                          {crop.expectedYield}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Wheat color={colors.primary} size={32} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {mockCrops.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Recommended Crops
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <TrendingUp color={colors.success} size={32} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                87%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Average Suitability
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  locationSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  weatherCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherMain: {
    flex: 1,
  },
  temperature: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  weatherStats: {
    flex: 1,
  },
  weatherStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    flex: 1,
  },
  weatherStatValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  cropsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  cropsScrollContainer: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  cropCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cropImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cropInfo: {
    padding: 16,
  },
  cropName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  cropNameLocal: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  cropStats: {
    gap: 8,
  },
  suitabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suitabilityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  suitabilityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  cropDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});