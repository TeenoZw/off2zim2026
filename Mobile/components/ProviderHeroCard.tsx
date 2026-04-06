import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as solidHeart, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { StatusPill, type StatusPillProps } from './StatusPill';

export interface ProviderHeroCardProps {
  title: string;
  location?: string;
  rating?: number | string;
  reviewsText?: string;
  onFavoritePress?: () => void;
  onSharePress?: () => void;
  isFavorited?: boolean;
  onDirectionsPress?: () => void;
  directionsLabel?: string;
  onCallPress?: () => void;
  callLabel?: string;
  callDisabled?: boolean;
  onMessagePress?: () => void;
  messageLabel?: string;
  messageDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
  avatarInitial?: string;
  logoUrl?: string;
  locationIconName?: keyof typeof Ionicons.glyphMap;
  ratingIconName?: keyof typeof Ionicons.glyphMap;
  callIconName?: keyof typeof Ionicons.glyphMap;
  messageIconName?: keyof typeof Ionicons.glyphMap;
  locationIconColor?: string;
  ratingIconColor?: string;
  callIconColor?: string;
  messageIconColor?: string;
  statusPillProps?: StatusPillProps;
  ratingAlign?: 'left' | 'right';
}

function ProviderHeroCardComponent({
  title,
  location,
  rating,
  reviewsText,
  onFavoritePress,
  onSharePress,
  isFavorited,
  onDirectionsPress,
  directionsLabel = 'Directions',
  onCallPress,
  callLabel = 'Call',
  callDisabled = false,
  onMessagePress,
  messageLabel = 'Message',
  messageDisabled = false,
  style,
  avatarInitial,
  logoUrl,
  locationIconName = 'location',
  ratingIconName = 'star',
  callIconName = 'call',
  messageIconName = 'chatbubble-ellipses',
  locationIconColor = '#FF3B30',
  ratingIconColor = '#DAA520',
  callIconColor = '#34C759',
  messageIconColor = '#007AFF',
  statusPillProps,
  ratingAlign,
}: ProviderHeroCardProps) {
  const isDark = useColorScheme() === 'dark';

  const cardBackground = isDark ? '#1C1C1E' : '#FFFFFF';
  const cardBorderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const controlBackground = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.04)';
  const subtleBackground = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const accentSurface = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1C1C1E';
  const directionsBackground = isDark ? 'rgba(0,122,255,0.15)' : 'rgba(0,122,255,0.08)';
  const callBackground = isDark ? 'rgba(52,199,89,0.15)' : 'rgba(52,199,89,0.1)';
  const messageBackground = isDark ? 'rgba(0,122,255,0.15)' : 'rgba(0,122,255,0.1)';

  const initial = (avatarInitial ?? title.charAt(0) ?? '').toUpperCase();
  const ratingDisplay =
    rating === undefined
      ? ''
      : typeof rating === 'number'
        ? (Math.round(rating * 10) / 10).toString()
        : rating;
  const hasTopActions = Boolean(onFavoritePress || onSharePress);
  const hasMetaRow = Boolean(onDirectionsPress || rating !== undefined);
  const resolvedRatingAlign = ratingAlign ?? (onDirectionsPress ? 'right' : 'left');
  const hasFooter = Boolean(onCallPress || onMessagePress);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBackground,
          borderColor: cardBorderColor,
          shadowColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(28,28,30,0.12)',
        },
        style,
      ]}
    >
      {hasTopActions ? (
        <View style={styles.actionBar}>
          <View style={styles.actionCluster}>
            {onFavoritePress ? (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: controlBackground }]}
                onPress={onFavoritePress}
                activeOpacity={0.85}
              >
                <FontAwesomeIcon
                  icon={isFavorited ? solidHeart : regularHeart}
                  size={18}
                  color="#FF4757"
                />
              </TouchableOpacity>
            ) : null}

            {onSharePress ? (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: controlBackground }]}
                onPress={onSharePress}
                activeOpacity={0.85}
              >
                <FontAwesomeIcon icon={faShareFromSquare} size={18} color="#FF4757" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}

      <View style={styles.identityRow}>
        <View
          style={[
            styles.profileCircle,
            {
              backgroundColor: logoUrl
                ? 'transparent'
                : isDark
                  ? 'rgba(255, 71, 87, 0.18)'
                  : 'rgba(255, 71, 87, 0.08)',
              borderColor: logoUrl ? 'transparent' : '#FF4757',
              borderWidth: logoUrl ? 0 : 2,
            },
          ]}
        >
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.logoImage} resizeMode="contain" />
          ) : (
            <ThemedText style={styles.profileInitial}>{initial}</ThemedText>
          )}
        </View>

        <View style={styles.identityText}>
          <ThemedText
            style={[styles.titleText, { color: textColor }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
          >
            {title}
          </ThemedText>

          {location || statusPillProps ? (
            <View style={styles.locationStatusRow}>
              {location ? (
                <View style={[styles.locationPill, { backgroundColor: subtleBackground }]}>
                  <View style={[styles.iconBubble, { backgroundColor: accentSurface }]}>
                    <Ionicons name={locationIconName} size={12} color={locationIconColor} />
                  </View>
                  <ThemedText style={[styles.locationText, { color: textColor }]} numberOfLines={1}>
                    {location}
                  </ThemedText>
                </View>
              ) : (
                <View />
              )}

              {statusPillProps
                ? (() => {
                    const { style: statusStyle, ...restStatusProps } = statusPillProps;
                    return (
                      <StatusPill {...restStatusProps} style={[styles.statusInline, statusStyle]} />
                    );
                  })()
                : null}
            </View>
          ) : null}
        </View>
      </View>

      {hasMetaRow ? (
        <View style={styles.metaRow}>
          {onDirectionsPress ? (
            <TouchableOpacity
              style={[styles.directionsPill, { backgroundColor: directionsBackground }]}
              onPress={onDirectionsPress}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBubble, { backgroundColor: accentSurface }]}>
                <Ionicons name="navigate" size={12} color="#0A84FF" />
              </View>
              <ThemedText
                style={[styles.directionsText, { color: isDark ? '#FFFFFF' : '#0A84FF' }]}
                numberOfLines={1}
              >
                {directionsLabel}
              </ThemedText>
            </TouchableOpacity>
          ) : null}

          {rating !== undefined ? (
            <View
              style={[
                styles.ratingPill,
                {
                  backgroundColor: subtleBackground,
                  marginLeft: resolvedRatingAlign === 'right' ? 'auto' : 0,
                },
              ]}
            >
              <View style={[styles.iconBubble, { backgroundColor: accentSurface }]}>
                <Ionicons name={ratingIconName} size={12} color={ratingIconColor} />
              </View>
              <ThemedText style={[styles.ratingText, { color: textColor }]}>
                {ratingDisplay}
              </ThemedText>
              {reviewsText ? (
                <ThemedText style={[styles.reviewsText, { color: textColor }]}>
                  {reviewsText}
                </ThemedText>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      {hasFooter ? (
        <View style={styles.footer}>
          {onCallPress ? (
            <TouchableOpacity
              style={[
                styles.contactPill,
                { backgroundColor: callBackground, opacity: callDisabled ? 0.5 : 1 },
              ]}
              onPress={onCallPress}
              disabled={callDisabled}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBubble, { backgroundColor: accentSurface }]}>
                <Ionicons name={callIconName} size={12} color={callIconColor} />
              </View>
              <ThemedText style={[styles.contactText, { color: textColor }]}>
                {callLabel}
              </ThemedText>
            </TouchableOpacity>
          ) : null}

          {onMessagePress ? (
            <TouchableOpacity
              style={[
                styles.contactPill,
                { backgroundColor: messageBackground, opacity: messageDisabled ? 0.5 : 1 },
              ]}
              onPress={onMessagePress}
              disabled={messageDisabled}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBubble, { backgroundColor: accentSurface }]}>
                <Ionicons name={messageIconName} size={12} color={messageIconColor} />
              </View>
              <ThemedText style={[styles.contactText, { color: textColor }]}>
                {messageLabel}
              </ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export const ProviderHeroCard = memo(ProviderHeroCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 26,
    gap: 18,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 26,
    elevation: 10,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionCluster: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  identityText: {
    flex: 1,
    gap: 8,
  },
  titleText: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: Fonts.bold,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  locationText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    flexShrink: 1,
    letterSpacing: 0.2,
  },
  iconBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  directionsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  directionsText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: Fonts.bold,
    letterSpacing: 0.2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 140,
  },
  ratingText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: Fonts.bold,
    letterSpacing: 0.2,
  },
  reviewsText: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 4,
  },
  statusInline: {
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  contactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    flex: 1,
  },
  contactText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: Fonts.bold,
    letterSpacing: 0.2,
  },
});
