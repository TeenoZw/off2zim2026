import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, TextInput, SafeAreaView } from 'react-native';
import { theme } from '@/constants/theme';
import { Search, Check, BadgeCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { messages } from '@/data/mockData';

interface MessageItemProps {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  onPress: () => void;
}

function MessageItem({ sender, lastMessage, timestamp, unread, onPress }: MessageItemProps) {
  return (
    <Pressable style={styles.messageItem} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: sender.avatar }} style={styles.avatar} />
        {unread && <View style={styles.unreadIndicator} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.senderName}>{sender.name}</Text>
            {sender.isVerified && (
              <BadgeCheck size={16} color={theme.colors.primary} style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <Text style={[styles.messageText, unread && styles.unreadText]} numberOfLines={2}>
          {lastMessage}
        </Text>
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleMessagePress = (id: string) => {
    router.push(`/(modals)/conversation?id=${id}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Connect with service providers</Text>
      </View>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {/* Message Tabs */}
      <View style={styles.tabs}>
        <Pressable style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>All</Text>
        </Pressable>
        <Pressable style={styles.tab}>
          <Text style={styles.tabText}>Unread</Text>
        </Pressable>
        <Pressable style={styles.tab}>
          <Text style={styles.tabText}>Verified</Text>
        </Pressable>
      </View>
      
      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem
            {...item}
            onPress={() => handleMessagePress(item.id)}
          />
        )}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No messages yet</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  searchBar: {
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  tab: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    marginRight: theme.spacing.s,
    borderRadius: theme.borderRadius.medium,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  messagesList: {
    paddingHorizontal: theme.spacing.m,
  },
  messageItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.m,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.m,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  unreadIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  timestamp: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  messageText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  unreadText: {
    fontFamily: 'Montserrat-Medium',
    color: theme.colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});