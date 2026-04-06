import { LayoutAnimation } from 'react-native';

export const messageAnimations = {
  // Standard smooth transition for general list changes
  smooth: {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
      duration: 200,
    },
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
      duration: 350,
    },
  },

  // Enhanced animation for message deletion with spring physics
  deletion: {
    duration: 400,
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.8,
      initialVelocity: 0.2,
    },
    delete: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.85,
      initialVelocity: 0.2,
      property: LayoutAnimation.Properties.opacity,
    },
  },

  // Batch operations (clear all)
  batchOperation: {
    duration: 500,
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.8,
      initialVelocity: 0.3,
    },
    delete: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.8,
      initialVelocity: 0.3,
      property: LayoutAnimation.Properties.opacity,
    },
    create: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.8,
      initialVelocity: 0.3,
      property: LayoutAnimation.Properties.opacity,
    },
  },
} as const;

export const filterTransition = {
  duration: 300,
  easing: 'easeInEaseOut',
} as const;
