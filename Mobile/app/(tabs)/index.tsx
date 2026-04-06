import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { registerHomeTabNavigation } from '../../components/HomeTabButton';

// Components
import { ThemedView } from '@/components/ThemedView';
import { IOSScreenWrapper } from '@/components/IOSScreenWrapper';
import { CustomHeader } from '@/components';
import { Fonts } from '@/constants/Fonts';

// Hooks & Context
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useOverlayDrawer } from '@/context/OverlayDrawerContext';

// Screens
import Featured from '@/app/screens/Featured';
import DestinationsScreen from '@/app/screens/DestinationsScreen';
import Stays from '@/app/screens/Stays';
import Events from '@/app/screens/Events';
import ThingsToDoScreen from '@/app/screens/ThingsToDoScreen';
import Bus from '@/app/screens/Bus';
import Flights from '@/app/screens/Flights';

const TopTab = createMaterialTopTabNavigator();

const QUICK_ACTIONS = [
  { label: 'Itinerary', icon: 'calendar-outline', route: '/screens/itinerary' as const },
  { label: 'Favorites', icon: 'heart-outline', route: '/likes' as const },
  { label: 'Flights', icon: 'airplane-outline', route: '/flight-search' as const },
  { label: 'Transport', icon: 'bus-outline', route: '/bus-search' as const },
] as const;

// Navigation registration component
function NavigationRegistrar() {
  const navigation = useNavigation();

  useEffect(() => {
    console.log('📱 Registering home tab navigation');
    registerHomeTabNavigation(() => {
      console.log('🎯 Navigation function called, navigating to Featured');
      navigation.navigate('Featured' as never);
    });
  }, [navigation]);

  return null;
}

// Wrapper component for Featured to include navigation registrar
function FeaturedWrapper() {
  return (
    <>
      <NavigationRegistrar />
      <Featured />
    </>
  );
}

// Tab configuration data
const TAB_SCREENS = [
  { name: 'Featured', component: FeaturedWrapper, label: 'Featured' },
  { name: 'Destinations', component: DestinationsScreen, label: 'Destinations' },
  { name: 'Stays', component: Stays, label: 'Stays' },
  { name: 'Events', component: Events, label: 'Events' },
  { name: 'ThingsToDo', component: ThingsToDoScreen, label: 'Experiences' },
  { name: 'Bus', component: Bus, label: 'Transport' },
  { name: 'Flights', component: Flights, label: 'Flights' },
] as const;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // Use our custom drawer context
  const { openDrawer } = useOverlayDrawer();

  const handleItineraryPress = () => {
    router.push('/screens/itinerary');
  };

  // Simple direct drawer handler
  const handleMenuPress = useCallback(() => {
    openDrawer();
  }, [openDrawer]);

  const getTabBarOptions = () => {
    const theme = Colors[colorScheme ?? 'light'];
    const tintColor = isDark ? theme.white : theme.tint;
    const backgroundColor = isDark ? theme.appBackground : theme.appBackground;

    return {
      tabBarScrollEnabled: true,
      tabBarStyle: [styles.tabBar, { backgroundColor }],
      tabBarItemStyle: styles.tabBarItem,
      tabBarLabelStyle: {
        textTransform: 'none' as const,
      },
      tabBarActiveTintColor: tintColor,
      tabBarInactiveTintColor: theme.inactive,
      tabBarIndicatorStyle: {
        ...styles.tabBarIndicator,
        backgroundColor: tintColor,
      },
      tabBarPressColor: 'transparent',
    };
  };

  const actionSurface = isDark ? 'rgba(28, 28, 28, 0.98)' : '#FFFFFF';
  const heroSurface = isDark ? '#1B1B1B' : '#FFFFFF';
  const heroBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,28,0.08)';
  const mutedText = isDark ? 'rgba(236, 237, 238, 0.7)' : 'rgba(17, 24, 28, 0.68)';
  const accent = '#FF3B30';

  return (
    <ThemedView
      style={styles.container}
      lightColor={Colors.light.appBackground}
      darkColor={Colors.dark.appBackground}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <IOSScreenWrapper>
        <View
          style={[
            styles.headerTabBlock,
            { backgroundColor: isDark ? Colors.dark.appBackground : Colors.light.appBackground },
          ]}
        >
          <CustomHeader
            showLogo
            leftAction={{
              icon: 'menu',
              onPress: handleMenuPress,
              color: '#FF3B30',
            }}
            rightAction={{
              icon: 'calendar-outline',
              onPress: handleItineraryPress,
              color: '#FF3B30',
            }}
            style={{ marginBottom: 0 }}
          />

          <View style={styles.tabBarContainer}>
            <View
              style={[
                styles.heroPanel,
                {
                  backgroundColor: heroSurface,
                  borderColor: heroBorder,
                },
              ]}
            >
              <Text style={[styles.heroEyebrow, { color: accent }]}>Explore | Experience | Enjoy</Text>
              <Text style={[styles.heroTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Build every part of your Zimbabwe trip from one place.
              </Text>
              <Text style={[styles.heroSubtitle, { color: mutedText }]}>
                Discover stays, flights, transport, dining, and live experiences.
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionRail}
              >
                {QUICK_ACTIONS.map((action) => (
                  <Pressable
                    key={action.label}
                    onPress={() => router.push(action.route)}
                    style={[
                      styles.actionChip,
                      {
                        backgroundColor: actionSurface,
                        borderColor: heroBorder,
                      },
                    ]}
                  >
                    <Ionicons name={action.icon} size={18} color={accent} />
                    <Text
                      style={[
                        styles.actionLabel,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <TopTab.Navigator initialRouteName="Featured" screenOptions={getTabBarOptions()}>
              {TAB_SCREENS.map(({ name, component, label }) => (
                <TopTab.Screen
                  key={name}
                  name={name}
                  component={component}
                  options={{
                    // Render label inside a Text component to satisfy RN requirement
                    tabBarLabel: ({ focused }) => (
                      <Text
                        style={{
                          color: focused
                            ? isDark
                              ? Colors.dark.tint
                              : Colors.light.tint
                            : Colors[colorScheme ?? 'light'].inactive,
                          fontFamily: focused ? Fonts.bold : Fonts.regular,
                          fontSize: focused ? 22 : 20,
                          textTransform: 'none',
                        }}
                      >
                        {label}
                      </Text>
                    ),
                  }}
                />
              ))}
            </TopTab.Navigator>
          </View>
        </View>
      </IOSScreenWrapper>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  headerTabBlock: {
    flex: 1,
    // backgroundColor will be set dynamically based on theme
  },
  tabBarContainer: {
    flex: 1,
    position: 'relative',
  },
  heroPanel: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 26,
    borderWidth: 1,
  },
  heroEyebrow: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 30,
  },
  heroSubtitle: {
    marginTop: 8,
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  actionRail: {
    gap: 10,
    paddingTop: 16,
    paddingRight: 10,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 13,
  },
  tabBar: {
    // backgroundColor will be set dynamically based on theme
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: 50,
  },
  tabBarItem: {
    paddingVertical: 10,
  },
  tabBarIndicator: {
    height: 4,
    borderRadius: 2,
    bottom: 0,
  },
});
