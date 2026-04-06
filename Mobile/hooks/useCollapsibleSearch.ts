import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

interface UseCollapsibleSearchParams {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  refreshing?: boolean;
  disableAutoReveal?: boolean;
}

interface UseCollapsibleSearchResult {
  searchFilterHeight: Animated.Value;
  handleScroll: (event: ScrollEvent) => void;
  handleMomentumScrollEnd: (event: ScrollEvent) => void;
  handleSearchChange: (text: string) => void;
  showSearchFilter: () => void;
  hideSearchFilter: () => void;
}

const SHOW_DURATION = 320;
const HIDE_DURATION = 280;

export function useCollapsibleSearch({
  searchQuery,
  setSearchQuery,
  refreshing = false,
  disableAutoReveal = false,
}: UseCollapsibleSearchParams): UseCollapsibleSearchResult {
  const searchFilterHeight = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const isScrollingDown = useRef(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRevealTimeout = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  }, []);

  const animateToValue = useCallback(
    (toValue: 0 | 1) => {
      Animated.timing(searchFilterHeight, {
        toValue,
        duration: toValue === 1 ? SHOW_DURATION : HIDE_DURATION,
        easing: toValue === 1 ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start();
    },
    [searchFilterHeight]
  );

  const showSearchFilter = useCallback(() => {
    animateToValue(1);
  }, [animateToValue]);

  const hideSearchFilter = useCallback(() => {
    animateToValue(0);
  }, [animateToValue]);

  const scheduleReveal = useCallback(() => {
    if (disableAutoReveal) return; // Skip auto-reveal if disabled

    clearRevealTimeout();

    if (searchQuery.length === 0) {
      revealTimeoutRef.current = setTimeout(() => {
        showSearchFilter();
        revealTimeoutRef.current = null;
      }, 1200);
    }
  }, [clearRevealTimeout, searchQuery, showSearchFilter, disableAutoReveal]);

  useEffect(() => {
    return () => {
      clearRevealTimeout();
    };
  }, [clearRevealTimeout]);

  const handleScroll = useCallback(
    (event: ScrollEvent) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      const isAtBottom = contentHeight - scrollViewHeight <= currentScrollY + 20;

      if (refreshing) {
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY <= 5 || searchQuery.length > 0) {
        showSearchFilter();
        lastScrollY.current = currentScrollY;
        if (searchQuery.length === 0) {
          scheduleReveal();
        } else {
          clearRevealTimeout();
        }
        return;
      }

      if (isAtBottom) {
        lastScrollY.current = currentScrollY;
        return;
      }

      const scrollingDown = currentScrollY > lastScrollY.current;

      if (
        scrollingDown !== isScrollingDown.current ||
        Math.abs(currentScrollY - lastScrollY.current) > 10
      ) {
        isScrollingDown.current = scrollingDown;

        if (!scrollingDown && searchQuery.length === 0) {
          showSearchFilter();
        } else if (scrollingDown && searchQuery.length === 0) {
          hideSearchFilter();
        }
      }

      lastScrollY.current = currentScrollY;
      scheduleReveal();
    },
    [
      clearRevealTimeout,
      hideSearchFilter,
      refreshing,
      scheduleReveal,
      searchQuery,
      showSearchFilter,
    ]
  );

  const handleMomentumScrollEnd = useCallback(
    (event: ScrollEvent) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      const isAtBottom = contentHeight - scrollViewHeight <= currentY + 20;

      lastScrollY.current = currentY;

      if (currentY <= 5 && !isAtBottom) {
        showSearchFilter();
      }

      if (searchQuery.length === 0) {
        scheduleReveal();
      } else {
        clearRevealTimeout();
      }
    },
    [clearRevealTimeout, scheduleReveal, searchQuery, showSearchFilter]
  );

  const handleSearchChange = useCallback(
    (text: string) => {
      if (text.length > 0 && searchQuery.length === 0) {
        showSearchFilter();
      }

      setSearchQuery(text);

      if (text.length > 0) {
        clearRevealTimeout();
      } else {
        scheduleReveal();
      }
    },
    [clearRevealTimeout, scheduleReveal, searchQuery, setSearchQuery, showSearchFilter]
  );

  return {
    searchFilterHeight,
    handleScroll,
    handleMomentumScrollEnd,
    handleSearchChange,
    showSearchFilter,
    hideSearchFilter,
  };
}
