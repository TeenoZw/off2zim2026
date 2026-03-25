import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';

interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
  seeAllLabel?: string;
}

export function SectionHeader({ 
  title, 
  onSeeAllPress, 
  seeAllLabel = 'See All' 
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAllPress && (
        <Pressable style={styles.seeAllButton} onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>{seeAllLabel}</Text>
          <ChevronRight size={16} color={theme.colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  title: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
    color: theme.colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
});