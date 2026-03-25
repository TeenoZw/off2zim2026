import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, SafeAreaView } from 'react-native';
import { useSearchParams } from 'expo-router';
import { CategoryList } from '@/components/CategoryList';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { theme } from '@/constants/theme';
import { Search, Filter, Map } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { 
  categories, 
  popularDestinations, 
  trendingExperiences, 
  topAccommodations 
} from '@/data/mockData';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const params = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'hotels');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as string);
    }
  }, [params.category]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  const handleCardPress = (id: string, type: string) => {
    router.push(`/(modals)/${type}?id=${id}`);
  };

  const getDataForCategory = () => {
    switch (selectedCategory) {
      case 'hotels':
        return topAccommodations;
      case 'activities':
        return trendingExperiences;
      default:
        return popularDestinations;
    }
  };

  const getCategoryTitle = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.name : 'Destinations';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Header & Search */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>Discover Zimbabwe's treasures</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search destinations, activities, hotels..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable style={styles.filterButton}>
              <Filter size={20} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <CategoryList 
            categories={categories} 
            selectedId={selectedCategory}
            onSelect={handleCategorySelect} 
          />
        </View>

        {/* Map View Button */}
        <View style={styles.mapButtonContainer}>
          <Button 
            title="View on Map"
            variant="outline"
            leftIcon={<Map size={16} color={theme.colors.primary} />}
            onPress={() => router.push('/(modals)/map')}
          />
        </View>

        {/* Category Results */}
        <View style={styles.resultsContainer}>
          <SectionHeader title={getCategoryTitle()} />
          <View style={styles.grid}>
            {getDataForCategory().map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                rating={item.rating}
                price={'price' in item ? item.price : undefined}
                style={styles.card}
                onPress={() => handleCardPress(item.id, selectedCategory === 'hotels' ? 'accommodation' : 'destination')}
              />
            ))}
          </View>
        </View>

        {/* Recommended For You */}
        <View style={styles.section}>
          <SectionHeader title="Recommended For You" />
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
                style={styles.recommendedCard}
                onPress={() => handleCardPress(item.id, 'destination')}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    marginBottom: theme.spacing.m,
  },
  title: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 24,
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
  },
  filterButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.s,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.m,
  },
  mapButtonContainer: {
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  resultsContainer: {
    marginBottom: theme.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
  },
  card: {
    width: '47%',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  horizontalScrollContent: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  recommendedCard: {
    width: 180,
  },
});