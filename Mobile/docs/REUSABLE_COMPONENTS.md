# Reusable UI Components

This document describes the reusable UI components extracted from the messages page that can be used throughout the application.

## Components Overview

### 1. SearchBar

A reusable search input component with clear functionality.

**Props:**

- `value: string` - Current search value
- `onChangeText: (text: string) => void` - Callback when text changes
- `placeholder?: string` - Placeholder text (default: "Search")
- `style?: any` - Custom styles for the input wrapper
- `containerStyle?: any` - Custom styles for the container

**Usage:**

```tsx
<SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search messages..." />
```

### 2. FilterBar

A horizontal scrollable filter component with smooth animations.

**Props:**

- `options: FilterOption[]` - Array of filter options
- `activeFilter: string` - Currently active filter key
- `onFilterChange: (filter: string) => void` - Callback when filter changes
- `style?: any` - Custom styles for scroll content
- `containerStyle?: any` - Custom styles for the container

**FilterOption interface:**

```tsx
interface FilterOption {
  key: string;
  label: string;
}
```

**Usage:**

```tsx
<FilterBar
  options={[
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
  ]}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

### 3. CustomHeader

A customizable header component with optional left and right actions.

**Props:**

- `title: string` - Header title
- `leftAction?: HeaderAction` - Optional left action button
- `rightAction?: HeaderAction` - Optional right action button
- `style?: any` - Custom styles for the header container
- `titleStyle?: any` - Custom styles for the title

**HeaderAction interface:**

```tsx
interface HeaderAction {
  icon: string;
  onPress: () => void;
  color?: string;
}
```

**Usage:**

```tsx
<CustomHeader
  title="Messages"
  rightAction={{
    icon: 'trash-outline',
    onPress: handleDeleteAll,
    color: '#FF3B30',
  }}
/>
```

### 4. EmptyState

A component to display when there's no content to show.

**Props:**

- `icon: string` - Ionicons icon name
- `title: string` - Main title text
- `description: string` - Description text
- `style?: any` - Custom styles for the container
- `iconSize?: number` - Icon size (default: 60)

**Usage:**

```tsx
<EmptyState
  icon="chatbubbles-outline"
  title="No Messages"
  description="Messages will appear here when you receive them."
/>
```

### 5. MessageItem

A reusable message/item component with swipe actions and customization.

**Props:**

- `item: MessageData` - The message data object
- `onPress: () => void` - Callback when item is pressed
- `onLongPress?: () => void` - Optional long press callback
- `swipeActions?: SwipeAction[]` - Array of swipe actions
- `swipeableRef?: (ref: Swipeable | null) => void` - Ref callback for swipeable
- `onSwipeStart?: () => void` - Callback when swipe starts
- `onSwipeOpen?: () => void` - Callback when swipe opens
- `getAvatarColor?: (avatar: string) => string` - Function to get avatar color
- `style?: any` - Custom styles for the item

**MessageData interface:**

```tsx
interface MessageData {
  id: string;
  name: string;
  message: string;
  time: string;
  isRead: boolean;
  unreadCount?: number;
  avatar: string;
  status: 'sent' | 'delivered' | 'read' | 'received';
}
```

**Usage:**

```tsx
<MessageItem
  item={messageData}
  onPress={() => markAsRead(messageData.id)}
  swipeActions={[
    {
      icon: 'trash-outline',
      onPress: () => deleteMessage(messageData.id),
      isDestructive: true,
    },
  ]}
/>
```

### 6. SwipeActions

A component that renders swipe actions with animations.

**Props:**

- `actions: SwipeAction[]` - Array of swipe actions
- `progress: Animated.AnimatedInterpolation` - Animation progress value
- `containerWidth?: number` - Container width (default: 120)

**SwipeAction interface:**

```tsx
interface SwipeAction {
  icon: string;
  color?: string;
  backgroundColor?: string;
  onPress: () => void;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmButtonText?: string;
  isDestructive?: boolean;
}
```

**Usage:**

```tsx
const swipeActions: SwipeAction[] = [
  {
    icon: 'flag',
    onPress: () => reportItem(),
    confirmTitle: 'Report Item',
    confirmMessage: 'Are you sure?',
    isDestructive: true,
  },
];
```

## Component Features

### Accessibility

- All components include proper accessibility labels
- Keyboard navigation support where applicable
- Screen reader friendly

### Animations

- Smooth transitions and micro-interactions
- Haptic feedback on iOS
- Platform-specific animations

### Theming

- Automatic dark/light mode support
- Consistent with app's color scheme
- Customizable styling

### Performance

- Optimized for large lists
- Minimal re-renders
- Native animations where possible

## Best Practices

1. **Import components efficiently:**

   ```tsx
   import { SearchBar, FilterBar, CustomHeader } from '@/components';
   ```

2. **Use TypeScript interfaces:**

   ```tsx
   import type { MessageData, SwipeAction } from '@/components';
   ```

3. **Customize appropriately:**

   ```tsx
   <SearchBar
     value={query}
     onChangeText={setQuery}
     placeholder="Search notifications..."
     containerStyle={{ marginHorizontal: 16 }}
   />
   ```

4. **Handle async operations:**
   ```tsx
   const handleDelete = async (id: string) => {
     try {
       await deleteItem(id);
       setItems(prev => prev.filter(item => item.id !== id));
     } catch (error) {
       Alert.alert('Error', 'Failed to delete item');
     }
   };
   ```

## Examples

See `/docs/ComponentUsageExamples.tsx` for complete usage examples showing how to integrate these components in different scenarios.

## Migration from Hardcoded Components

When migrating existing screens to use these components:

1. Replace hardcoded headers with `CustomHeader`
2. Replace search inputs with `SearchBar`
3. Replace filter tabs with `FilterBar`
4. Replace empty states with `EmptyState`
5. Replace list items with `MessageItem` (adapt data structure as needed)
6. Replace swipe actions with `SwipeActions`

This approach provides:

- ✅ Consistent UI across the app
- ✅ Reduced code duplication
- ✅ Easier maintenance
- ✅ Better testing capabilities
- ✅ Improved accessibility
