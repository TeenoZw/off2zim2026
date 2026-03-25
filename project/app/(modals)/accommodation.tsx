import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, SafeAreaView } from 'react-native';
import { useSearchParams, useRouter, Stack } from 'expo-router';
import { theme } from '@/constants/theme';
import { Star, MapPin, Calendar, ArrowLeft, Heart, Share2, Users, Wifi, Coffee, Briefcase, Snowflake } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ImageCarousel } from '@/components/ImageCarousel';
import { topAccommodations } from '@/data/mockData';

const amenities = [
  { icon: <Wifi size={20} color={theme.colors.text} />, name: 'Free WiFi' },
  { icon: <Coffee size={20} color={theme.colors.text} />, name: 'Breakfast' },
  { icon: <Briefcase size={20} color={theme.colors.text} />, name: 'Business Center' },
  { icon: <Snowflake size={20} color={theme.colors.text} />, name: 'Air Conditioning' },
];

export default function AccommodationDetailsScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the accommodation by id
  const accommodation = topAccommodations.find(item => item.id === params.id);
  
  if (!accommodation) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Accommodation not found</Text>
      </SafeAreaView>
    );
  }
  
  // Create image array for carousel
  const images = [
    { id: '1', image: accommodation.image },
    { id: '2', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' },
    { id: '3', image: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg' },
    { id: '4', image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg' },
  ];
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleBookNow = () => {
    router.push(`/(modals)/booking?id=${accommodation.id}&type=accommodation`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false
      }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ImageCarousel data={images} height={300} />
          <View style={styles.backButtonContainer}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          <View style={styles.actionButtonsContainer}>
            <Pressable 
              style={styles.actionButton} 
              onPress={toggleFavorite}
            >
              <Heart 
                size={20} 
                color="#FFFFFF" 
                fill={isFavorite ? '#FFFFFF' : 'transparent'} 
              />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Share2 size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{accommodation.title}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.colors.textSecondary} />
              <Text style={styles.location}>{accommodation.subtitle}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
              <Text style={styles.rating}>{accommodation.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>(124 reviews)</Text>
            </View>
          </View>
          
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{accommodation.price}</Text>
            <Text style={styles.priceSubtext}>per night</Text>
          </View>
          
          {/* Divider */}
          <View style={styles.divider} />
          
          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  {amenity.icon}
                  <Text style={styles.amenityName}>{amenity.name}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              Experience luxury and comfort at {accommodation.title}, located in the heart of {accommodation.subtitle}. 
              Our elegant rooms offer stunning views and modern amenities to make your stay unforgettable.
              The hotel features a restaurant, swimming pool, and is conveniently located near major attractions.
            </Text>
          </View>
          
          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg' }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </View>
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
                  style={styles.reviewerAvatar}
                />
                <View>
                  <Text style={styles.reviewerName}>Michael Johnson</Text>
                  <Text style={styles.reviewDate}>October 12, 2023</Text>
                </View>
                <View style={styles.reviewRating}>
                  <Star size={12} color={theme.colors.warning} fill={theme.colors.warning} />
                  <Text style={styles.reviewRatingText}>4.8</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>
                The hotel exceeded my expectations! The room was clean and spacious, and the staff was incredibly friendly and helpful. The location is perfect, close to all major attractions.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Booking Bar */}
      <View style={styles.bookingBar}>
        <View>
          <Text style={styles.bookingBarPrice}>{accommodation.price}</Text>
          <Text style={styles.bookingBarSubtext}>per night</Text>
        </View>
        <Button 
          title="Book Now" 
          onPress={handleBookNow}
          rightIcon={<Calendar size={16} color="#FFFFFF" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  backButtonContainer: {
    position: 'absolute',
    top: theme.spacing.l,
    left: theme.spacing.m,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.xs,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: theme.spacing.l,
    right: theme.spacing.m,
    zIndex: 10,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.s,
  },
  content: {
    padding: theme.spacing.m,
  },
  headerInfo: {
    marginBottom: theme.spacing.m,
  },
  title: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  location: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: theme.colors.primary,
  },
  priceSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.m,
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  sectionTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  seeAllText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: theme.spacing.m,
  },
  amenityName: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.medium,
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.s,
  },
  reviewerName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
  },
  reviewDate: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  reviewRatingText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 2,
  },
  reviewText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  bookingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bookingBarPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: theme.colors.primary,
  },
  bookingBarSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});