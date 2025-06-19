import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, LogOut, Bell, Shield, FileText, Info } from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import { getThemeColors } from '@/utils/theme';

interface ProfileMenuProps {
  onClose: () => void;
}

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  const { translations, isDark } = useAppContext();
  const colors = getThemeColors(isDark);

  const menuItems = [
    {
      icon: User,
      label: translations.profile,
      onPress: () => {
        // Navigate to profile
        onClose();
      },
    },
    {
      icon: Bell,
      label: translations.notifications,
      onPress: () => {
        // Navigate to notifications
        onClose();
      },
    },
    {
      icon: Shield,
      label: translations.privacyPolicy,
      onPress: () => {
        // Navigate to privacy policy
        onClose();
      },
    },
    {
      icon: FileText,
      label: translations.termsOfService,
      onPress: () => {
        // Navigate to terms
        onClose();
      },
    },
    {
      icon: Info,
      label: translations.aboutUs,
      onPress: () => {
        // Navigate to about
        onClose();
      },
    },
    {
      icon: LogOut,
      label: translations.logout,
      onPress: () => {
        // Handle logout
        onClose();
      },
      isDestructive: true,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.arrow, { borderBottomColor: colors.surface }]} />
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            { borderBottomColor: colors.border },
            index === menuItems.length - 1 && styles.lastMenuItem,
          ]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <item.icon
            color={item.isDestructive ? colors.error : colors.textSecondary}
            size={20}
            strokeWidth={2}
          />
          <Text
            style={[
              styles.menuText,
              {
                color: item.isDestructive ? colors.error : colors.text,
                fontFamily: 'Inter-Medium',
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
  arrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
  },
});