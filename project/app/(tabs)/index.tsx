import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, SafeAreaView } from 'react-native';
import { ImageCarousel } from '@/components/ImageCarousel';
import { CategoryList } from '@/components/CategoryList';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { Bell, Search, User } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { 
  carouselItems, 
  categories, 
  popularDestinations, 
  trendingExperiences, 
  topAccommodations, 
  upcomingEvents 
} from '@/data/mockData';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('hotels');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    router.push(`/(tabs)/explore?category=${id}`);
  };

  const handleSeeAll = (section: string) => {
    router.push(`/(tabs)/explore?section=${section}`);
  };

  const handleCardPress = (id: string, type: string) => {
    router.push(`/(modals)/${type}?id=${id}`);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={toggleDrawer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' }}
              style={styles.avatar}
            />
          </Pressable>
          <Text style={styles.appName}>Off<Text style={styles.highlight}>2</Text>Zim</Text>
          <View style={styles.headerButtons}>
            <Pressable style={styles.iconButton}>
              <Search size={24} color={theme.colors.text} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Bell size={24} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ImageCarousel data={carouselItems} height={220} />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <SectionHeader title="Explore Zimbabwe" />
          <CategoryList 
            categories={categories} 
            selectedId={selectedCategory}
            onSelect={handleCategorySelect} 
          />
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <SectionHeader 
            title="Popular Destinations" 
            onSeeAllPress={() => handleSeeAll('destinations')} 
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {popularDestinations.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                rating={item.rating}
                style={styles.card}
                onPress={() => handleCardPress(item.id, 'destination')}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trending Experiences */}
        <View style={styles.section}>
          <SectionHeader 
            title="Trending Experiences" 
            onSeeAllPress={() => handleSeeAll('experiences')} 
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {trendingExperiences.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                rating={item.rating}
                price={item.price}
                style={styles.card}
                onPress={() => handleCardPress(item.id, 'experience')}
              />
            ))}
          </ScrollView>
        </View>

        {/* Top Accommodations */}
        <View style={styles.section}>
          <SectionHeader 
            title="Top Accommodations" 
            onSeeAllPress={() => handleSeeAll('accommodations')} 
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {topAccommodations.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                rating={item.rating}
                price={item.price}
                style={styles.card}
                onPress={() => handleCardPress(item.id, 'accommodation')}
              />
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <SectionHeader 
            title="Upcoming Events" 
            onSeeAllPress={() => handleSeeAll('events')} 
          />
          <View style={styles.eventsList}>
            {upcomingEvents.slice(0, 2).map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                variant="horizontal"
                style={styles.eventCard}
                onPress={() => handleCardPress(item.id, 'event')}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Profile Drawer */}
      <ProfileDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.m,
  },
  appName: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 24,
    color: theme.colors.text,
  },
  highlight: {
    color: theme.colors.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: theme.spacing.s,
    padding: theme.spacing.xs,
  },
  carouselContainer: {
    marginBottom: theme.spacing.m,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.l,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  horizontalScrollContent: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
    paddingBottom: theme.spacing.xs,
  },
  card: {
    marginRight: 0,
  },
  eventsList: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
  },
  eventCard: {
    width: '100%',
  },
});