import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Chrome as Home, MapPin, Wheat, Settings, User, Menu, X } from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ProfileMenu } from '@/components/ProfileMenu';
import { getThemeColors } from '@/utils/theme';

export default function TabLayout() {
  const { translations, isDark } = useAppContext();
  const colors = getThemeColors(isDark);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuAnimation = useSharedValue(0);

  const toggleProfileMenu = () => {
    const newValue = showProfileMenu ? 0 : 1;
    profileMenuAnimation.value = withTiming(newValue, { duration: 300 });
    setShowProfileMenu(!showProfileMenu);
  };

  const profileMenuStyle = useAnimatedStyle(() => {
    return {
      opacity: profileMenuAnimation.value,
      transform: [
        {
          scale: interpolate(profileMenuAnimation.value, [0, 1], [0.9, 1]),
        },
        {
          translateY: interpolate(profileMenuAnimation.value, [0, 1], [-20, 0]),
        },
      ],
      pointerEvents: profileMenuAnimation.value > 0 ? 'auto' : 'none',
    };
  });

  // Swipe gesture for tab navigation
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const threshold = 50;
      if (Math.abs(event.velocityX || 0) > threshold) {
        // Handle swipe navigation here
        // This would require access to navigation state which is complex in this context
        // For now, we'll implement this in individual screens
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Custom Header */}
        <View
          style={{
            height: Platform.OS === 'ios' ? 100 : 80,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingTop: Platform.OS === 'ios' ? 50 : 30,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 4,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={toggleProfileMenu}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: colors.primary + '15',
            }}
          >
            {showProfileMenu ? (
              <X color={colors.primary} size={24} />
            ) : (
              <User color={colors.primary} size={24} />
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Menu Overlay */}
        {showProfileMenu && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: Platform.OS === 'ios' ? 100 : 80,
                right: 20,
                zIndex: 1000,
              },
              profileMenuStyle,
            ]}
          >
            <ProfileMenu onClose={() => setShowProfileMenu(false)} />
          </Animated.View>
        )}

        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              paddingBottom: Platform.OS === 'ios' ? 25 : 10,
              paddingTop: 10,
              height: Platform.OS === 'ios' ? 90 : 70,
              elevation: 8,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
              fontFamily: 'Inter-Medium',
              fontSize: 12,
              marginTop: 4,
            },
            tabBarIconStyle: {
              marginBottom: 2,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: translations.home,
              tabBarIcon: ({ color, size }) => (
                <Home color={color} size={size} strokeWidth={2} />
              ),
            }}
          />
          <Tabs.Screen
            name="location"
            options={{
              title: translations.location,
              tabBarIcon: ({ color, size }) => (
                <MapPin color={color} size={size} strokeWidth={2} />
              ),
            }}
          />
          <Tabs.Screen
            name="crops"
            options={{
              title: translations.crops,
              tabBarIcon: ({ color, size }) => (
                <Wheat color={color} size={size} strokeWidth={2} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: translations.settings,
              tabBarIcon: ({ color, size }) => (
                <Settings color={color} size={size} strokeWidth={2} />
              ),
            }}
          />
        </Tabs>
      </View>
    </GestureDetector>
  );
}