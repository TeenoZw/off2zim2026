import React, { useCallback, useMemo } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { useCollapsibleSearch } from '@/hooks/useCollapsibleSearch';

export interface CollapsibleFilterOption {
  key: string;
  label: string;
}

export interface SearchBarOverrides {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  title?: string;
}

export interface FilterBarOverrides {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export interface UseCollapsibleSearchSectionParams {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  refreshing?: boolean;
  filterOptions: CollapsibleFilterOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  searchBarOverrides?: SearchBarOverrides;
  filterBarOverrides?: FilterBarOverrides;
  sortDirection?: 'asc' | 'desc';
  onSortDirectionChange?: (direction: 'asc' | 'desc') => void;
  sortToggleFilters?: string[];
  maxExpandedHeight?: number;
  disableAutoReveal?: boolean;
}

export interface UseCollapsibleSearchSectionResult {
  searchSection: React.ReactElement;
  handleScroll: ReturnType<typeof useCollapsibleSearch>['handleScroll'];
  handleMomentumScrollEnd: ReturnType<typeof useCollapsibleSearch>['handleMomentumScrollEnd'];
  handleSearchChange: ReturnType<typeof useCollapsibleSearch>['handleSearchChange'];
  showSearchFilter: ReturnType<typeof useCollapsibleSearch>['showSearchFilter'];
  hideSearchFilter: ReturnType<typeof useCollapsibleSearch>['hideSearchFilter'];
}

export function useCollapsibleSearchSection(
  params: UseCollapsibleSearchSectionParams
): UseCollapsibleSearchSectionResult {
  const {
    searchQuery,
    setSearchQuery,
    refreshing = false,
    filterOptions,
    activeFilter,
    onFilterChange,
    containerStyle,
    searchBarOverrides,
    filterBarOverrides,
    sortDirection,
    onSortDirectionChange,
    sortToggleFilters,
    maxExpandedHeight = 120,
    disableAutoReveal = false,
  } = params;

  const {
    searchFilterHeight,
    handleScroll,
    handleMomentumScrollEnd,
    handleSearchChange,
    showSearchFilter,
    hideSearchFilter,
  } = useCollapsibleSearch({
    searchQuery,
    setSearchQuery,
    refreshing,
    disableAutoReveal,
  });

  const shouldShowSortToggle = useMemo(() => {
    if (!onSortDirectionChange) {
      return false;
    }

    if (!sortToggleFilters || sortToggleFilters.length === 0) {
      return true;
    }

    return sortToggleFilters.includes(activeFilter);
  }, [activeFilter, onSortDirectionChange, sortToggleFilters]);

  const handleFilterSelect = useCallback(
    (filter: string) => {
      showSearchFilter();
      onFilterChange(filter);
    },
    [onFilterChange, showSearchFilter]
  );

  const searchSection = (
    <Animated.View
      style={[
        styles.container,
        {
          maxHeight: searchFilterHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, maxExpandedHeight],
          }),
          opacity: searchFilterHeight,
        },
        containerStyle,
      ]}
    >
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder={searchBarOverrides?.placeholder ?? 'Search'}
        title={searchBarOverrides?.title}
        containerStyle={searchBarOverrides?.containerStyle}
        style={searchBarOverrides?.style}
      />

      <FilterBar
        options={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterSelect}
        containerStyle={filterBarOverrides?.containerStyle}
        style={filterBarOverrides?.style}
        sortDirection={sortDirection}
        onSortDirectionChange={onSortDirectionChange}
        showSortToggle={shouldShowSortToggle}
      />
    </Animated.View>
  );

  return {
    searchSection,
    handleScroll,
    handleMomentumScrollEnd,
    handleSearchChange,
    showSearchFilter,
    hideSearchFilter,
  };
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
});
