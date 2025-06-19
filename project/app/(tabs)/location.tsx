import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import {
  MapPin,
  Navigation,
  Search,
  Check,
  ChevronRight,
  Loader,
  RefreshCw,
} from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import { getThemeColors } from '@/utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { router } from 'expo-router';

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

export default function LocationScreen() {
  const { translations, isDark, location, setLocation } = useAppContext();
  const colors = getThemeColors(isDark);
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to get your current location.'
        );
        setIsLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocoding to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const state = address.region || 'Unknown State';
        const district = address.district || address.city || 'Unknown District';

        setSelectedState(state);
        setSelectedDistrict(district);
        
        // Update context
        setLocation({
          state,
          district,
          coordinates: { latitude, longitude },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const saveLocation = () => {
    setLocation({
      state: selectedState,
      district: selectedDistrict,
    });
    Alert.alert(
      translations.confirm,
      `Location updated to ${selectedDistrict}, ${selectedState}`,
      [{ text: 'OK' }]
    );
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
        // Swipe right - go to previous tab (home)
        runOnJS(navigateToTab)('index');
      } else if (velocity < -threshold) {
        // Swipe left - go to next tab (crops)
        runOnJS(navigateToTab)('crops');
      }
    });

  const renderStatePicker = () => (
    <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.pickerHeader}>
        <Text style={[styles.pickerTitle, { color: colors.text }]}>
          {translations.selectLocation} - {translations.state}
        </Text>
        <TouchableOpacity
          onPress={() => setShowStatePicker(false)}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, { color: colors.primary }]}>
            {translations.cancel}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <Search color={colors.textSecondary} size={20} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search states..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView style={styles.pickerList}>
        {filteredStates.map((state) => (
          <TouchableOpacity
            key={state}
            style={[
              styles.pickerItem,
              { borderBottomColor: colors.border },
              selectedState === state && { backgroundColor: colors.primary + '15' }
            ]}
            onPress={() => {
              setSelectedState(state);
              setSelectedDistrict(INDIAN_STATES_DISTRICTS[state as keyof typeof INDIAN_STATES_DISTRICTS][0]);
              setShowStatePicker(false);
              setSearchQuery('');
            }}
          >
            <Text style={[styles.pickerItemText, { color: colors.text }]}>
              {state}
            </Text>
            {selectedState === state && (
              <Check color={colors.primary} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDistrictPicker = () => (
    <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.pickerHeader}>
        <Text style={[styles.pickerTitle, { color: colors.text }]}>
          {translations.selectLocation} - {translations.district}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDistrictPicker(false)}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, { color: colors.primary }]}>
            {translations.cancel}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <Search color={colors.textSecondary} size={20} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search districts..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView style={styles.pickerList}>
        {filteredDistricts.map((district) => (
          <TouchableOpacity
            key={district}
            style={[
              styles.pickerItem,
              { borderBottomColor: colors.border },
              selectedDistrict === district && { backgroundColor: colors.primary + '15' }
            ]}
            onPress={() => {
              setSelectedDistrict(district);
              setShowDistrictPicker(false);
              setSearchQuery('');
            }}
          >
            <Text style={[styles.pickerItemText, { color: colors.text }]}>
              {district}
            </Text>
            {selectedDistrict === district && (
              <Check color={colors.primary} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (showStatePicker) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {renderStatePicker()}
      </SafeAreaView>
    );
  }

  if (showDistrictPicker) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {renderDistrictPicker()}
      </SafeAreaView>
    );
  }

  return (
    <GestureDetector gesture={swipeGesture}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {translations.selectLocation}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Choose your location for personalized crop recommendations
            </Text>
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            style={[styles.gpsButton, { backgroundColor: colors.primary }]}
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <Loader color="white" size={24} />
            ) : (
              <Navigation color="white" size={24} />
            )}
            <Text style={styles.gpsButtonText}>
              {isLoadingLocation ? translations.loading : translations.useGPS}
            </Text>
          </TouchableOpacity>

          {/* Manual Selection */}
          <View style={[styles.manualSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Manual Selection
            </Text>

            {/* State Selector */}
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowStatePicker(true)}
            >
              <View style={styles.selectorContent}>
                <MapPin color={colors.primary} size={20} />
                <View style={styles.selectorText}>
                  <Text style={[styles.selectorLabel, { color: colors.textSecondary }]}>
                    {translations.state}
                  </Text>
                  <Text style={[styles.selectorValue, { color: colors.text }]}>
                    {selectedState}
                  </Text>
                </View>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>

            {/* District Selector */}
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowDistrictPicker(true)}
            >
              <View style={styles.selectorContent}>
                <MapPin color={colors.secondary} size={20} />
                <View style={styles.selectorText}>
                  <Text style={[styles.selectorLabel, { color: colors.textSecondary }]}>
                    {translations.district}
                  </Text>
                  <Text style={[styles.selectorValue, { color: colors.text }]}>
                    {selectedDistrict}
                  </Text>
                </View>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>

          {/* Current Selection Summary */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              {translations.currentLocation}
            </Text>
            <View style={styles.summaryContent}>
              <MapPin color={colors.primary} size={24} />
              <View style={styles.summaryText}>
                <Text style={[styles.summaryLocation, { color: colors.text }]}>
                  {selectedDistrict}, {selectedState}
                </Text>
                <Text style={[styles.summaryNote, { color: colors.textSecondary }]}>
                  Crop recommendations will be based on this location
                </Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary },
              (selectedState === location.state && selectedDistrict === location.district) && 
              { backgroundColor: colors.textSecondary }
            ]}
            onPress={saveLocation}
            disabled={selectedState === location.state && selectedDistrict === location.district}
          >
            <Text style={styles.saveButtonText}>
              {translations.save} {translations.location}
            </Text>
          </TouchableOpacity>

          {/* Location Info */}
          <View style={styles.infoSection}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Why Location Matters?
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              • Climate conditions vary by region{'\n'}
              • Soil types differ across locations{'\n'}
              • Seasonal patterns are location-specific{'\n'}
              • Local market demand influences recommendations
            </Text>
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gpsButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
  },
  manualSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    marginLeft: 12,
    flex: 1,
  },
  selectorLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLocation: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  summaryNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  pickerContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  pickerList: {
    flex: 1,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});