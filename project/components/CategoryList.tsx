import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ImageSourcePropType } from 'react-native';
import { theme } from '@/constants/theme';

interface Category {
  id: string;
  name: string;
  icon: ImageSourcePropType | string;
}

interface CategoryListProps {
  categories: Category[];
  onSelect: (id: string) => void;
  selectedId?: string;
}

export function CategoryList({ categories, onSelect, selectedId }: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selectedId === category.id;
        const imageSource = typeof category.icon === 'string' ? { uri: category.icon } : category.icon;
        
        return (
          <Pressable
            key={category.id}
            style={[styles.category, isSelected && styles.selectedCategory]}
            onPress={() => onSelect(category.id)}
          >
            <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
              <Image
                source={imageSource}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.name, isSelected && styles.selectedName]}>
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    gap: theme.spacing.m,
  },
  category: {
    alignItems: 'center',
    width: 80,
  },
  selectedCategory: {
    opacity: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  selectedIconContainer: {
    backgroundColor: theme.colors.primary + '20', // 20% opacity
  },
  icon: {
    width: 28,
    height: 28,
  },
  name: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  selectedName: {
    color: theme.colors.primary,
    fontFamily: 'Montserrat-SemiBold',
  },
});