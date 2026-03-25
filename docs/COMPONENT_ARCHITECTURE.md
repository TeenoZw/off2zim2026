# Component Architecture Documentation

This document outlines the React component architecture and design patterns for the Off2Zim travel platform.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Hierarchy](#component-hierarchy)
3. [Design Patterns](#design-patterns)
4. [Component Categories](#component-categories)
5. [State Management](#state-management)
6. [Component Guidelines](#component-guidelines)
7. [File Structure](#file-structure)
8. [Component Examples](#component-examples)
9. [Styling Patterns](#styling-patterns)
10. [Performance Considerations](#performance-considerations)

## Architecture Overview

### Design Philosophy

- **Component-Based**: Modular, reusable components
- **Composition over Inheritance**: Favor component composition
- **Single Responsibility**: Each component has one clear purpose
- **Prop Drilling Avoidance**: Use context and state management
- **Type Safety**: Full TypeScript integration
- **Accessibility First**: WCAG 2.1 compliance built-in

### Architecture Layers

```
┌─────────────────────────────────────┐
│            Pages (App Router)       │
├─────────────────────────────────────┤
│            Layout Components        │
├─────────────────────────────────────┤
│            Feature Components       │
├─────────────────────────────────────┤
│            UI Components            │
├─────────────────────────────────────┤
│            Base Components          │
└─────────────────────────────────────┘
```

## Component Hierarchy

### Top-Level Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── hotels/            # Hotel pages
│   ├── activities/        # Activity pages
│   ├── destinations/      # Destination pages
│   └── user/              # User pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── features/         # Feature components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── hooks/                # Custom hooks
├── lib/                  # Utilities and configurations
├── store/                # State management
└── types/                # TypeScript definitions
```

### Component Categories

#### 1. Layout Components

```typescript
// Layout wrapper for consistent page structure
interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {header && <Header />}
      <main className="flex-1 flex">
        {sidebar && <Sidebar />}
        <div className="flex-1">{children}</div>
      </main>
      {footer && <Footer />}
    </div>
  );
};
```

#### 2. Feature Components

```typescript
// Hotel search feature component
interface HotelSearchProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  defaultValues?: Partial<SearchParams>;
}

const HotelSearch: React.FC<HotelSearchProps> = ({
  onSearch,
  loading = false,
  defaultValues,
}) => {
  // Component implementation
};
```

#### 3. UI Components

```typescript
// Base button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  ...props
}) => {
  // Component implementation
};
```

## Design Patterns

### 1. Compound Components

```typescript
// Card compound component
const Card = {
  Root: ({ children, className, ...props }: CardProps) => (
    <div className={cn("card", className)} {...props}>
      {children}
    </div>
  ),

  Header: ({ children, className, ...props }: CardHeaderProps) => (
    <div className={cn("card-header", className)} {...props}>
      {children}
    </div>
  ),

  Body: ({ children, className, ...props }: CardBodyProps) => (
    <div className={cn("card-body", className)} {...props}>
      {children}
    </div>
  ),

  Footer: ({ children, className, ...props }: CardFooterProps) => (
    <div className={cn("card-footer", className)} {...props}>
      {children}
    </div>
  ),
};

// Usage
<Card.Root>
  <Card.Header>Hotel Information</Card.Header>
  <Card.Body>Hotel details...</Card.Body>
  <Card.Footer>Booking actions</Card.Footer>
</Card.Root>;
```

### 2. Render Props Pattern

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

const DataFetcher = <T>({ url, children }: DataFetcherProps<T>) => {
  const { data, loading, error, refetch } = useFetch<T>(url);

  return <>{children({ data, loading, error, refetch })}</>;
};

// Usage
<DataFetcher<Hotel[]> url="/api/hotels">
  {({ data, loading, error }) => (
    <div>
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      {data && <HotelList hotels={data} />}
    </div>
  )}
</DataFetcher>;
```

### 3. Higher-Order Components (HOCs)

```typescript
// Authentication HOC
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!user) return <LoginPrompt />;

    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedBookingPage = withAuth(BookingPage);
```

### 4. Custom Hooks Pattern

```typescript
// Hotel search hook
interface UseHotelSearchOptions {
  initialParams?: SearchParams;
  autoSearch?: boolean;
}

const useHotelSearch = (options: UseHotelSearchOptions = {}) => {
  const [params, setParams] = useState(options.initialParams);
  const [results, setResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (searchParams: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/hotels/search", {
        method: "POST",
        body: JSON.stringify(searchParams),
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    params,
    setParams,
    results,
    loading,
    error,
    search,
  };
};
```

## Component Categories

### 1. Base UI Components

#### Button Component

```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-sm rounded-md",
      lg: "px-6 py-3 text-base rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner className="w-4 h-4 mr-2" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
```

#### Input Component

```typescript
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helpText, leftIcon, rightIcon, className, ...props },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-300 focus:ring-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);
```

### 2. Feature Components

#### Hotel Card Component

```typescript
// components/features/hotels/HotelCard.tsx
interface HotelCardProps {
  hotel: Hotel;
  onBook?: (hotel: Hotel) => void;
  onFavorite?: (hotel: Hotel) => void;
  isFavorite?: boolean;
  className?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  onBook,
  onFavorite,
  isFavorite = false,
  className,
}) => {
  return (
    <Card.Root
      className={cn(
        "overflow-hidden hover:shadow-lg transition-shadow",
        className
      )}
    >
      <div className="relative">
        <Image
          src={hotel.images[0]}
          alt={hotel.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => onFavorite?.(hotel)}
        >
          <Heart
            className={cn("w-4 h-4", isFavorite && "fill-red-500 text-red-500")}
          />
        </Button>
      </div>

      <Card.Body className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{hotel.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">{hotel.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ${hotel.pricePerNight}
            </span>
            <span className="text-gray-500 text-sm ml-1">/ night</span>
          </div>

          <Button onClick={() => onBook?.(hotel)}>Book Now</Button>
        </div>
      </Card.Body>
    </Card.Root>
  );
};
```

#### Search Form Component

```typescript
// components/features/search/SearchForm.tsx
interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  defaultValues?: Partial<SearchParams>;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  defaultValues,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchParams>({
    defaultValues,
    resolver: zodResolver(searchParamsSchema),
  });

  const onSubmit = (data: SearchParams) => {
    onSearch(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Destination"
          placeholder="Where are you going?"
          {...register("destination")}
          error={errors.destination?.message}
          leftIcon={<MapPin className="w-4 h-4 text-gray-400" />}
        />

        <DateRangePicker
          label="Dates"
          startDate={watch("checkIn")}
          endDate={watch("checkOut")}
          onDateChange={(dates) => {
            setValue("checkIn", dates.startDate);
            setValue("checkOut", dates.endDate);
          }}
          error={errors.checkIn?.message || errors.checkOut?.message}
        />

        <GuestSelector
          label="Guests"
          value={{
            adults: watch("adults"),
            children: watch("children"),
            rooms: watch("rooms"),
          }}
          onChange={(guests) => {
            setValue("adults", guests.adults);
            setValue("children", guests.children);
            setValue("rooms", guests.rooms);
          }}
          error={errors.adults?.message}
        />

        <Button
          type="submit"
          loading={loading}
          className="md:mt-6"
          leftIcon={<Search className="w-4 h-4" />}
        >
          Search
        </Button>
      </div>
    </form>
  );
};
```

### 3. Layout Components

#### Navigation Component

```typescript
// components/layout/Navigation.tsx
interface NavigationProps {
  user?: User | null;
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/hotels", label: "Hotels" },
    { href: "/activities", label: "Activities" },
    { href: "/destinations", label: "Destinations" },
    { href: "/dining", label: "Dining" },
    { href: "/events", label: "Events" },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo className="h-8 w-auto" />
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
```

## State Management

### 1. Global State with Zustand

```typescript
// store/useAppStore.ts
interface AppState {
  user: User | null;
  searchParams: SearchParams | null;
  favorites: string[];
  cart: CartItem[];

  // Actions
  setUser: (user: User | null) => void;
  setSearchParams: (params: SearchParams) => void;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  searchParams: null,
  favorites: [],
  cart: [],

  setUser: (user) => set({ user }),
  setSearchParams: (searchParams) => set({ searchParams }),

  addToFavorites: (id) =>
    set((state) => ({
      favorites: [...state.favorites, id],
    })),

  removeFromFavorites: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((favId) => favId !== id),
    })),

  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));
```

### 2. Server State with React Query

```typescript
// hooks/useHotels.ts
export const useHotels = (params: SearchParams) => {
  return useQuery({
    queryKey: ["hotels", params],
    queryFn: () => fetchHotels(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useHotel = (id: string) => {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => fetchHotel(id),
    enabled: !!id,
  });
};

export const useBookHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookHotel,
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Hotel booked successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
```

## Component Guidelines

### 1. Naming Conventions

- **Components**: PascalCase (e.g., `HotelCard`, `SearchForm`)
- **Props Interfaces**: PascalCase with Props suffix (e.g., `HotelCardProps`)
- **Hooks**: camelCase with use prefix (e.g., `useHotels`, `useBooking`)
- **Files**: PascalCase for components, camelCase for utilities

### 2. Component Structure

```typescript
// Standard component structure
import React from "react";
import { cn } from "@/lib/utils";

// Types and interfaces
interface ComponentProps {
  // Props definition
}

// Component implementation
const Component: React.FC<ComponentProps> = (
  {
    // Destructured props
  }
) => {
  // Hooks
  // State
  // Effects
  // Event handlers
  // Memoized values

  // Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Main render
  return (
    <div className={cn("base-classes", className)}>
      {/* Component content */}
    </div>
  );
};

// Default props (if needed)
Component.defaultProps = {
  // Default values
};

// Display name for debugging
Component.displayName = "Component";

export default Component;
```

### 3. Props Design

- **Keep props minimal**: Only include necessary props
- **Use composition**: Favor children and render props
- **Provide good defaults**: Sensible default values
- **Use TypeScript**: Full type safety
- **Document complex props**: JSDoc comments for clarity

```typescript
interface ButtonProps {
  /** Button text content */
  children: React.ReactNode;

  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline" | "ghost";

  /** Button size */
  size?: "sm" | "md" | "lg";

  /** Loading state */
  loading?: boolean;

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Additional CSS classes */
  className?: string;

  /** Disabled state */
  disabled?: boolean;
}
```

## File Structure

### Component Organization

```
components/
├── ui/                     # Base UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Modal/
│   └── index.ts           # Export all UI components
├── features/              # Feature-specific components
│   ├── hotels/
│   │   ├── HotelCard/
│   │   ├── HotelList/
│   │   ├── HotelSearch/
│   │   └── index.ts
│   ├── activities/
│   ├── bookings/
│   └── index.ts
├── layout/                # Layout components
│   ├── Header/
│   ├── Footer/
│   ├── Navigation/
│   └── index.ts
└── forms/                 # Form components
    ├── SearchForm/
    ├── BookingForm/
    └── index.ts
```

### Import/Export Pattern

```typescript
// components/ui/index.ts
export { default as Button } from "./Button";
export { default as Input } from "./Input";
export { default as Modal } from "./Modal";
export * from "./Button";
export * from "./Input";
export * from "./Modal";

// Usage
import { Button, Input, Modal } from "@/components/ui";
```

## Styling Patterns

### Tailwind CSS Organization

```typescript
// Use cn utility for conditional classes
const buttonClasses = cn(
  // Base classes
  "inline-flex items-center justify-center font-medium transition-colors",
  // Conditional classes
  {
    "bg-blue-600 text-white": variant === "primary",
    "bg-gray-600 text-white": variant === "secondary",
    "opacity-50 cursor-not-allowed": disabled,
  },
  // Size classes
  size === "sm" && "px-3 py-1.5 text-sm",
  size === "md" && "px-4 py-2 text-sm",
  size === "lg" && "px-6 py-3 text-base",
  // Custom classes
  className
);
```

### CSS Modules (when needed)

```typescript
// Button.module.css
.button {
  @apply inline-flex items-center justify-center font-medium transition-colors;
}

.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700;
}

// Button.tsx
import styles from './Button.module.css';

const Button: React.FC<ButtonProps> = ({ variant, className, ...props }) => {
  return (
    <button
      className={cn(styles.button, styles[variant], className)}
      {...props}
    />
  );
};
```

## Performance Considerations

### 1. Memoization

```typescript
// Memo for expensive components
const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data, onAction }) => {
    // Expensive rendering logic
    return <div>{/* Complex UI */}</div>;
  },
  // Custom comparison function (optional)
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id;
  }
);

// useMemo for expensive calculations
const processedData = useMemo(() => {
  return expensiveDataProcessing(rawData);
}, [rawData]);

// useCallback for stable function references
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id);
  },
  [onItemClick]
);
```

### 2. Code Splitting

```typescript
// Lazy loading components
const LazyHotelDetails = React.lazy(() => import("./HotelDetails"));
const LazyBookingForm = React.lazy(() => import("./BookingForm"));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyHotelDetails hotelId={id} />
</Suspense>;
```

### 3. Virtual Scrolling

```typescript
// For large lists
import { FixedSizeList as List } from "react-window";

const VirtualizedHotelList: React.FC<{ hotels: Hotel[] }> = ({ hotels }) => {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => (
    <div style={style}>
      <HotelCard hotel={hotels[index]} />
    </div>
  );

  return (
    <List height={600} itemCount={hotels.length} itemSize={200} width="100%">
      {Row}
    </List>
  );
};
```

This architecture provides a solid foundation for building scalable, maintainable React components for the Off2Zim platform.
