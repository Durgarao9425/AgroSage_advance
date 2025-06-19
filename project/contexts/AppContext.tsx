import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type Language = 'en' | 'hi' | 'te';
export type Theme = 'light' | 'dark' | 'system';

export interface Location {
  state: string;
  district: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  icon: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  location: Location;
  setLocation: (location: Location) => void;
  weather: WeatherData;
  updateWeather: (location: Location) => void;
  translations: Record<string, string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  en: {
    home: 'Home',
    location: 'Location',
    crops: 'Crops',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    recommendedCrops: 'Recommended Crops',
    currentWeather: 'Current Weather',
    temperature: 'Temperature',
    humidity: 'Humidity',
    rainfall: 'Rainfall',
    selectLocation: 'Select Location',
    state: 'State',
    district: 'District',
    useGPS: 'Use GPS Location',
    cropDetails: 'Crop Details',
    sowingPeriod: 'Sowing Period',
    harvestingPeriod: 'Harvesting Period',
    soilType: 'Soil Type',
    waterRequirement: 'Water Requirement',
    fertilizers: 'Recommended Fertilizers',
    pestControl: 'Pest Control',
    expectedYield: 'Expected Yield',
    language: 'Language',
    themeMode: 'Theme Mode',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    notifications: 'Notifications',
    aboutUs: 'About Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    version: 'Version',
    welcomeToAgroSage: 'Welcome to AgroSage',
    smartCropRecommendation: 'Smart Crop Recommendation System',
    getPersonalizedRecommendations: 'Get personalized crop recommendations based on your location and current weather conditions.',
    weatherToday: 'Weather Today',
    cropRecommendations: 'Crop Recommendations',
    viewAllCrops: 'View All Crops',
    searchCrops: 'Search crops...',
    noDataAvailable: 'No data available',
    errorLoadingData: 'Error loading data',
    locationPermissionDenied: 'Location permission denied',
    locationNotAvailable: 'Location not available',
    kg: 'kg',
    tons: 'tons',
    perAcre: 'per acre',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    sandy: 'Sandy',
    loamy: 'Loamy',
    clayey: 'Clayey',
    alluvial: 'Alluvial',
    organic: 'Organic',
    suitable: 'Suitable',
    notSuitable: 'Not Suitable',
    currentLocation: 'Current Location',
    changeLocation: 'Change Location',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    retry: 'Retry',
    refresh: 'Refresh',
    updated: 'Updated',
    lastUpdated: 'Last updated',
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
  },
  hi: {
    home: 'होम',
    location: 'स्थान',
    crops: 'फसलें',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',
    recommendedCrops: 'अनुशंसित फसलें',
    currentWeather: 'वर्तमान मौसम',
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    rainfall: 'वर्षा',
    selectLocation: 'स्थान चुनें',
    state: 'राज्य',
    district: 'जिला',
    useGPS: 'जीपीएस स्थान का उपयोग करें',
    cropDetails: 'फसल विवरण',
    sowingPeriod: 'बुआई अवधि',
    harvestingPeriod: 'कटाई अवधि',
    soilType: 'मिट्टी का प्रकार',
    waterRequirement: 'पानी की आवश्यकता',
    fertilizers: 'अनुशंसित उर्वरक',
    pestControl: 'कीट नियंत्रण',
    expectedYield: 'अपेक्षित उत्पादन',
    language: 'भाषा',
    themeMode: 'थीम मोड',
    light: 'प्रकाश',
    dark: 'डार्क',
    system: 'सिस्टम',
    notifications: 'सूचनाएं',
    aboutUs: 'हमारे बारे में',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    version: 'संस्करण',
    welcomeToAgroSage: 'AgroSage में आपका स्वागत है',
    smartCropRecommendation: 'स्मार्ट फसल सिफारिश सिस्टम',
    getPersonalizedRecommendations: 'अपने स्थान और वर्तमान मौसम की स्थिति के आधार पर व्यक्तिगत फसल सिफारिशें प्राप्त करें।',
    weatherToday: 'आज का मौसम',
    cropRecommendations: 'फसल सिफारिशें',
    viewAllCrops: 'सभी फसलें देखें',
    searchCrops: 'फसलें खोजें...',
    noDataAvailable: 'कोई डेटा उपलब्ध नहीं',
    errorLoadingData: 'डेटा लोड करने में त्रुटि',
    locationPermissionDenied: 'स्थान अनुमति अस्वीकृत',
    locationNotAvailable: 'स्थान उपलब्ध नहीं',
    kg: 'किग्रा',
    tons: 'टन',
    perAcre: 'प्रति एकड़',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कम',
    sandy: 'रेतीली',
    loamy: 'दोमट',
    clayey: 'चिकनी',
    alluvial: 'जलोढ़',
    organic: 'जैविक',
    suitable: 'उपयुक्त',
    notSuitable: 'उपयुक्त नहीं',
    currentLocation: 'वर्तमान स्थान',
    changeLocation: 'स्थान बदलें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',
    retry: 'पुनः प्रयास करें',
    refresh: 'ताज़ा करें',
    updated: 'अपडेट किया गया',
    lastUpdated: 'अंतिम अपडेट',
    justNow: 'अभी',
    minutesAgo: 'मिनट पहले',
    hoursAgo: 'घंटे पहले',
    daysAgo: 'दिन पहले',
  },
  te: {
    home: 'హోమ్',
    location: 'స్థానం',
    crops: 'పంటలు',
    settings: 'సెట్టింగ్స్',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్ అవుట్',
    recommendedCrops: 'సిఫార్సు చేయబడిన పంటలు',
    currentWeather: 'ప్రస్తుత వాతావరణం',
    temperature: 'ఉష్ణోగ్రత',
    humidity: 'తేమ',
    rainfall: 'వర్షపాతం',
    selectLocation: 'స్థానం ఎంచుకోండి',
    state: 'రాష్ట్రం',
    district: 'జిల్లా',
    useGPS: 'GPS లొకేషన్ ఉపయోగించండి',
    cropDetails: 'పంట వివరాలు',
    sowingPeriod: 'విత్తన కాలం',
    harvestingPeriod: 'కోత కాలం',
    soilType: 'మట్టి రకం',
    waterRequirement: 'నీటి అవసరం',
    fertilizers: 'సిఫార్సు చేయబడిన ఎరువులు',
    pestControl: 'పురుగుల నియంత్రణ',
    expectedYield: 'ఆశించిన దిగుబడి',
    language: 'భాష',
    themeMode: 'థీమ్ మోడ్',
    light: 'లైట్',
    dark: 'డార్క్',
    system: 'సిస్టమ్',
    notifications: 'నోటిఫికేషన్లు',
    aboutUs: 'మా గురించి',
    privacyPolicy: 'గోప్యతా విధానం',
    termsOfService: 'సేవా నిబంధనలు',
    version: 'వెర్షన్',
    welcomeToAgroSage: 'AgroSage కు స్వాగతం',
    smartCropRecommendation: 'స్మార్ట్ క్రాప్ రికమండేషన్ సిస్టమ్',
    getPersonalizedRecommendations: 'మీ స్థానం మరియు ప్రస్తుత వాతావరణ పరిస్థితుల ఆధారంగా వ్యక్తిగతీకరించిన పంట సిఫార్సులను పొందండి.',
    weatherToday: 'ఈరోజు వాతావరణం',
    cropRecommendations: 'పంట సిఫార్సులు',
    viewAllCrops: 'అన్ని పంటలు చూడండి',
    searchCrops: 'పంటలను వెతకండి...',
    noDataAvailable: 'డేటా అందుబాటులో లేదు',
    errorLoadingData: 'డేటా లోడ్ చేయడంలో లోపం',
    locationPermissionDenied: 'స్థాన అనుమతి తిరస్కరించబడింది',
    locationNotAvailable: 'స్థానం అందుబాటులో లేదు',
    kg: 'కిలోలు',
    tons: 'టన్నులు',
    perAcre: 'ఎకరకు',
    high: 'అధిక',
    medium: 'మధ్యమ',
    low: 'తక్కువ',
    sandy: 'ఇసుక',
    loamy: 'లోమీ',
    clayey: 'బంకమట్టి',
    alluvial: 'వరద',
    organic: 'సేంద్రీయ',
    suitable: 'అనుకూలమైన',
    notSuitable: 'అనుకూలం కాని',
    currentLocation: 'ప్రస్తుత స్థానం',
    changeLocation: 'స్థానం మార్చు',
    save: 'సేవ్',
    cancel: 'రద్దు',
    confirm: 'నిర్ధారించు',
    loading: 'లోడ్ అవుతోంది...',
    retry: 'మళ్లీ ప్రయత్నించు',
    refresh: 'రిఫ్రెష్',
    updated: 'అప్‌డేట్ చేయబడింది',
    lastUpdated: 'చివరిసారి అప్‌డేట్',
    justNow: 'ఇప్పుడే',
    minutesAgo: 'నిమిషాల క్రితం',
    hoursAgo: 'గంటల క్రితం',
    daysAgo: 'రోజుల క్రితం',
  },
};

const mockWeatherData: WeatherData = {
  temperature: 28,
  humidity: 65,
  rainfall: 12,
  condition: 'Partly Cloudy',
  icon: 'partly-cloudy',
};

export function AppContextProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('system');
  const [location, setLocation] = useState<Location>({
    state: 'Telangana',
    district: 'Hyderabad',
  });
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);

  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  const updateWeather = (newLocation: Location) => {
    // Mock weather update based on location
    const mockData = {
      ...mockWeatherData,
      temperature: 25 + Math.floor(Math.random() * 10),
      humidity: 50 + Math.floor(Math.random() * 30),
      rainfall: Math.floor(Math.random() * 20),
    };
    setWeather(mockData);
  };

  useEffect(() => {
    updateWeather(location);
  }, [location]);

  const contextValue: AppContextType = {
    language,
    setLanguage,
    theme,
    setTheme,
    isDark,
    location,
    setLocation,
    weather,
    updateWeather,
    translations: translations[language],
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}