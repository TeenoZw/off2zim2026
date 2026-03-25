import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { User, Wallet, Settings, LogOut, Heart, HelpCircle, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ visible, onClose }: ProfileDrawerProps) {
  const router = useRouter();
  
  if (!visible) return null;
  
  const handleNavigate = (route: string) => {
    onClose();
    router.push(route);
  };
  
  const menuItems = [
    { icon: <User size={20} color={theme.colors.text} />, label: 'My Profile', route: '/(modals)/profile' },
    { icon: <Wallet size={20} color={theme.colors.text} />, label: 'My Wallet', route: '/(modals)/wallet' },
    { icon: <Heart size={20} color={theme.colors.text} />, label: 'Favorites', route: '/(modals)/favorites' },
    { icon: <Settings size={20} color={theme.colors.text} />, label: 'Settings', route: '/(modals)/settings' },
    { icon: <HelpCircle size={20} color={theme.colors.text} />, label: 'Help & Support', route: '/(modals)/help' },
    { icon: <ShieldCheck size={20} color={theme.colors.text} />, label: 'Privacy & Terms', route: '/(modals)/privacy' },
  ];
  
  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.drawer}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>johndoe@example.com</Text>
        </View>
        
        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
              style={styles.menuItem}
              onPress={() => handleNavigate(item.route)}
            >
              {item.icon}
              <Text style={styles.menuItemText}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        
        <Pressable 
          style={styles.logoutButton}
          onPress={() => handleNavigate('/(auth)/login')}
        >
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: '75%',
    backgroundColor: theme.colors.background,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: theme.spacing.m,
    height: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.s,
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 2,
  },
  email: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.m,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    marginTop: theme.spacing.l,
  },
  logoutText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: theme.colors.error,
    marginLeft: theme.spacing.m,
  },
});