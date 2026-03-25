import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Image, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { Search, Filter, ShoppingBag, Heart } from 'lucide-react-native';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { shopProducts } from '@/data/mockData';

const shopCategories = [
  { id: 'all', name: 'All' },
  { id: 'crafts', name: 'Crafts' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'food', name: 'Food' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'art', name: 'Art' },
];

export default function ShopScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const featuredProducts = [
    {
      id: 'fp1',
      title: 'Zimbabwe Craft Collection',
      image: 'https://images.pexels.com/photos/2187601/pexels-photo-2187601.jpeg',
      price: '$125',
    },
    {
      id: 'fp2',
      title: 'Exclusive Safari Gear',
      image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg',
      price: '$85',
    },
  ];
  
  const handleProductPress = (id: string) => {
    router.push(`/(modals)/product?id=${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shop</Text>
          <Text style={styles.subtitle}>Authentic Zimbabwean treasures</Text>
        </View>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable style={styles.filterButton}>
            <Filter size={20} color={theme.colors.text} />
          </Pressable>
        </View>
        
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesContainer}
        >
          {shopCategories.map((category) => (
            <Pressable 
              key={category.id} 
              style={[
                styles.categoryItem, 
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text 
                style={[
                  styles.categoryText, 
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        
        {/* Featured Products */}
        <View style={styles.section}>
          <SectionHeader title="Featured Collections" />
          <View style={styles.featuredContainer}>
            {featuredProducts.map((product) => (
              <Pressable 
                key={product.id} 
                style={styles.featuredProduct}
                onPress={() => handleProductPress(product.id)}
              >
                <Image source={{ uri: product.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredTitle}>{product.title}</Text>
                  <Text style={styles.featuredPrice}>{product.price}</Text>
                  <Button 
                    title="Shop Now" 
                    size="small"
                    onPress={() => handleProductPress(product.id)} 
                    style={styles.shopButton}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        
        {/* All Products */}
        <View style={styles.section}>
          <SectionHeader title="All Products" />
          <View style={styles.productsGrid}>
            {shopProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Pressable 
                  style={styles.productImageContainer}
                  onPress={() => handleProductPress(product.id)}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <Pressable style={styles.favoriteButton}>
                    <Heart size={16} color={theme.colors.text} />
                  </Pressable>
                </Pressable>
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                  <Text style={styles.productSubtitle}>{product.subtitle}</Text>
                  <View style={styles.productBottom}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <Pressable 
                      style={styles.addToCartButton}
                      onPress={() => router.push(`/(modals)/cart`)}
                    >
                      <ShoppingBag size={16} color="#FFFFFF" />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
  header: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
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
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
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
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    flexDirection: 'row',
  },
  categoryItem: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    marginRight: theme.spacing.s,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: '#F5F5F5',
  },
  selectedCategory: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  featuredContainer: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
  },
  featuredProduct: {
    height: 180,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: theme.spacing.m,
  },
  featuredTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  featuredPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginVertical: theme.spacing.xs,
  },
  shopButton: {
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  productsGrid: {
    paddingHorizontal: theme.spacing.m,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  productImageContainer: {
    position: 'relative',
    height: 150,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.xs,
  },
  productInfo: {
    padding: theme.spacing.m,
  },
  productTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  productSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: theme.colors.primary,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    padding: 8,
  },
});