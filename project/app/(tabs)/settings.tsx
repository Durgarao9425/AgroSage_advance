import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
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
} from 'lucide-react-native';
import { useAppContext, Language, Theme } from '@/contexts/AppContext';
import { getThemeColors } from '@/utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { router } from 'expo-router';

interface SettingItem {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const { 
    translations, 
    isDark, 
    language, 
    setLanguage, 
    theme, 
    setTheme 
  } = useAppContext();
  const colors = getThemeColors(isDark);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const navigateToTab = (tabName: string) => {
    router.push(`/(tabs)/${tabName}`);
  };

  // Swipe gesture for tab navigation
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const threshold = 100;
      const velocity = event.velocityX || 0;
      
      if (velocity > threshold) {
        // Swipe right - go to previous tab (crops)
        runOnJS(navigateToTab)('crops');
      } else if (velocity < -threshold) {
        // Swipe left - go to next tab (home)
        runOnJS(navigateToTab)('index');
      }
    });

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setShowLanguagePicker(false);
    Alert.alert(
      'Language Changed',
      `Language has been changed to ${languages.find(l => l.code === newLanguage)?.name}`,
      [{ text: 'OK' }]
    );
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setShowThemePicker(false);
  };

  const getCurrentLanguageName = () => {
    return languages.find(l => l.code === language)?.nativeName || 'English';
  };

  const getCurrentThemeName = () => {
    return themes.find(t => t.code === theme)?.name || 'System';
  };

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Globe,
          title: translations.language,
          subtitle: getCurrentLanguageName(),
          onPress: () => setShowLanguagePicker(true),
          showChevron: true,
        },
        {
          icon: Palette,
          title: translations.themeMode,
          subtitle: getCurrentThemeName(),
          onPress: () => setShowThemePicker(true),
          showChevron: true,
        },
        {
          icon: Bell,
          title: translations.notifications,
          subtitle: 'Push notifications',
          onPress: () => {},
          rightComponent: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={notificationsEnabled ? colors.primary : colors.textSecondary}
            />
          ),
        },
      ] as SettingItem[],
    },
    {
      title: 'About',
      items: [
        {
          icon: Info,
          title: translations.aboutUs,
          subtitle: 'Learn more about AgroSage',
          onPress: () => {
            Alert.alert(
              'About AgroSage',
              'AgroSage is a smart crop recommendation system that helps farmers make informed decisions based on location, weather, and soil conditions.\n\nVersion 1.0.0\nDeveloped with ❤️ for farmers'
            );
          },
          showChevron: true,
        },
        {
          icon: Shield,
          title: translations.privacyPolicy,
          subtitle: 'How we protect your data',
          onPress: () => {
            Alert.alert(
              'Privacy Policy',
              'Your privacy is important to us. We collect minimal data required for providing crop recommendations and never share your personal information without consent.'
            );
          },
          showChevron: true,
        },
        {
          icon: FileText,
          title: translations.termsOfService,
          subtitle: 'Terms and conditions',
          onPress: () => {
            Alert.alert(
              'Terms of Service',
              'By using AgroSage, you agree to our terms of service. The recommendations provided are for guidance only and actual results may vary based on various factors.'
            );
          },
          showChevron: true,
        },
      ] as SettingItem[],
    },
  ];

  const renderLanguagePicker = () => (
    <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.pickerHeader}>
        <Text style={[styles.pickerTitle, { color: colors.text }]}>
          {translations.language}
        </Text>
        <TouchableOpacity
          onPress={() => setShowLanguagePicker(false)}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, { color: colors.primary }]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.pickerList}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.pickerItem,
              { borderBottomColor: colors.border },
              language === lang.code && { backgroundColor: colors.primary + '15' }
            ]}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: colors.text }]}>
                {lang.name}
              </Text>
              <Text style={[styles.languageNative, { color: colors.textSecondary }]}>
                {lang.nativeName}
              </Text>
            </View>
            {language === lang.code && (
              <Check color={colors.primary} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderThemePicker = () => (
    <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.pickerHeader}>
        <Text style={[styles.pickerTitle, { color: colors.text }]}>
          {translations.themeMode}
        </Text>
        <TouchableOpacity
          onPress={() => setShowThemePicker(false)}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, { color: colors.primary }]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.pickerList}>
        {themes.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.code}
            style={[
              styles.pickerItem,
              { borderBottomColor: colors.border },
              theme === themeOption.code && { backgroundColor: colors.primary + '15' }
            ]}
            onPress={() => handleThemeChange(themeOption.code)}
          >
            <View style={styles.themeInfo}>
              <themeOption.icon color={colors.textSecondary} size={20} />
              <Text style={[styles.themeName, { color: colors.text }]}>
                {themeOption.name}
              </Text>
            </View>
            {theme === themeOption.code && (
              <Check color={colors.primary} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (showLanguagePicker) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {renderLanguagePicker()}
      </SafeAreaView>
    );
  }

  if (showThemePicker) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {renderThemePicker()}
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
              {translations.settings}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Customize your AgroSage experience
            </Text>
          </View>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                {section.title}
              </Text>
              
              <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      { borderBottomColor: colors.border },
                      itemIndex === section.items.length - 1 && styles.lastSettingItem,
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.settingItemLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                        <item.icon color={colors.primary} size={20} strokeWidth={2} />
                      </View>
                      <View style={styles.settingItemText}>
                        <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                          {item.title}
                        </Text>
                        {item.subtitle && (
                          <Text style={[styles.settingItemSubtitle, { color: colors.textSecondary }]}>
                            {item.subtitle}
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.settingItemRight}>
                      {item.rightComponent}
                      {item.showChevron && (
                        <ChevronRight color={colors.textSecondary} size={20} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
              AgroSage v1.0.0
            </Text>
            <Text style={[styles.versionSubtext, { color: colors.textTertiary }]}>
              Made with ❤️ for farmers
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionContent: {
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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
  pickerList: {
    flex: 1,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
  },
});