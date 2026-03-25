import { View, Text, StyleSheet, Image, ViewStyle, ImageSourcePropType, Pressable } from 'react-native';
import React from 'react';
import { theme } from '@/constants/theme';
import { Star } from 'lucide-react-native';

interface CardProps {
  title: string;
  subtitle?: string;
  image: ImageSourcePropType | string;
  rating?: number;
  price?: string;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'horizontal';
}

export function Card({
  title,
  subtitle,
  image,
  rating,
  price,
  style,
  onPress,
  variant = 'default',
}: CardProps) {
  const imageSource = typeof image === 'string' ? { uri: image } : image;
  
  const cardContent = (
    <>
      <Image 
        source={imageSource} 
        style={variant === 'horizontal' ? styles.horizontalImage : styles.image} 
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text 
          style={styles.title} 
          numberOfLines={variant === 'horizontal' ? 1 : 2}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            style={styles.subtitle} 
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
        <View style={styles.footer}>
          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          )}
          {price && (
            <Text style={styles.price}>{price}</Text>
          )}
        </View>
      </View>
    </>
  );

  return onPress ? (
    <Pressable 
      style={[
        styles.container,
        variant === 'horizontal' ? styles.horizontalContainer : null,
        style
      ]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
    >
      {cardContent}
    </Pressable>
  ) : (
    <View 
      style={[
        styles.container, 
        variant === 'horizontal' ? styles.horizontalContainer : null,
        style
      ]}
    >
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    width: 200,
    ...theme.shadows.small,
  },
  horizontalContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
  },
  image: {
    height: 120,
    width: '100%',
  },
  horizontalImage: {
    height: '100%',
    width: 100,
  },
  content: {
    padding: theme.spacing.s,
    flex: 1,
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 4,
  },
  price: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: theme.colors.primary,
  },
});