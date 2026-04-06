import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title1" style={styles.title}>
        About Off2Zim
      </ThemedText>
      <ThemedText type="title3" style={styles.subtitle}>
        Version 1.0.0
      </ThemedText>
      <ThemedText type="body" style={styles.description}>
        Off2Zim is your gateway to Zimbabwe. Stay connected with news, culture, and community.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
});
