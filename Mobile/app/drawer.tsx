import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/hooks/useColorScheme';

import { CustomDrawerContent } from '@/components/DrawerContent';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        swipeEnabled: true,
        drawerStyle: {
          width: '85%',
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          borderRightWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: 'About',
          title: 'About',
        }}
      />
      <Drawer.Screen
        name="cart"
        options={{
          drawerLabel: 'Cart',
          title: 'Cart',
        }}
      />
    </Drawer>
  );
}
