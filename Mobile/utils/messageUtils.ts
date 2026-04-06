/**
 * Message utility functions for the Messages screen
 */

// Get unique color for each service provider
export const getAvatarColor = (providerId: string): string => {
  const colors: Record<string, string> = {
    VH: '#003366',
    TB: '#8B4513',
    SA: '#228B22',
    EH: '#CD853F',
    ZH: '#4682B4',
    default: '#25D366',
  };
  return colors[providerId] || colors.default;
};

// Generate options text for long press
export const generateOptionsText = (providerName: string): string => {
  return `Options for ${providerName}:\n- Mark as read/unread\n- Archive conversation\n- Delete conversation\n- View provider details`;
};

// Helper function to categorize messages
export const categorizeMessages = (messages: any[]) => {
  return {
    all: messages,
    unread: messages.filter(item => !item.isRead),
  };
};

// Helper function to filter messages by search query
export const filterMessagesBySearch = (messages: any[], searchQuery: string) => {
  if (!searchQuery.trim()) {
    return messages;
  }

  const lowerQuery = searchQuery.toLowerCase();
  return messages.filter(
    item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.message.toLowerCase().includes(lowerQuery)
  );
};
