# React Conversion Plan

## Phase 1: Project Setup (1-2 days)

### 1.1 Initialize Next.js Project

```bash
# Create Next.js 14 project with App Router
npx create-next-app@latest off2zim-react --typescript --tailwind --app --src-dir --import-alias "@/*"

# Navigate to project
cd off2zim-react

# Install required dependencies
npm install @relume_io/relume-ui framer-motion react-icons
npm install flatpickr react-flatpickr
npm install clsx class-variance-authority
npm install lucide-react
```

### 1.2 Project Structure Setup

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── activities/        # Activities section
│   ├── destinations/      # Destinations section
│   ├── dining/           # Dining reservations
│   ├── events/           # Events booking
│   ├── hotels/           # Hotel booking
│   └── services/         # Services section
├── components/            # Shared components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   ├── navigation/       # Navigation components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── styles/               # Global styles
```

### 1.3 Asset Migration

```bash
# Copy assets to public folder
cp -r fonts/ public/fonts/
cp -r icons/ public/icons/
cp -r images/ public/images/
cp -r logos/ public/logos/
```

### 1.4 Configure Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "century-gothic": ["Century Gothic", "sans-serif"],
      },
      colors: {
        primary: "#000000",
        "primary-hover": "#909090",
        secondary: "#2c3e50",
        "background-light": "#f9f9f9",
        accent: "#ffcc00",
      },
    },
  },
  plugins: [],
};
```

## Phase 2: Component Migration (3-5 days)

### 2.1 Migrate Existing React Components

```bash
# Copy existing React components to new structure
mkdir -p src/app/activities
cp activities-hub/components/* src/components/activities/
cp activities-hub/index.jsx src/app/activities/page.tsx

# Repeat for all sections
mkdir -p src/app/{destinations,dining,events,hotels,services}
# ... continue migration
```

### 2.2 Create Shared Components

#### Navigation Component

```typescript
// src/components/navigation/MainNav.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Navigation implementation */}
    </nav>
  );
}
```

#### Layout Component

```typescript
// src/components/layout/RootLayout.tsx
import { MainNav } from "@/components/navigation/MainNav";
import { Footer } from "@/components/layout/Footer";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

### 2.3 Convert Home Page Components

#### Hero Section with Slideshow

```typescript
// src/components/home/HeroSlideshow.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: "/images/slide1.jpg", title: "Discover Zimbabwe" },
    { image: "/images/slide2.jpg", title: "Adventure Awaits" },
    { image: "/images/slide3.jpg", title: "Wildlife Safari" },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Slideshow implementation */}
    </div>
  );
}
```

#### Search Interface

```typescript
// src/components/home/SearchInterface.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaysForm } from "./forms/StaysForm";
import { FlightsForm } from "./forms/FlightsForm";
import { CarsForm } from "./forms/CarsForm";

export function SearchInterface() {
  const [activeTab, setActiveTab] = useState("stays");

  return (
    <section className="search-section py-8">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="search-tabs">
            <TabsTrigger value="stays">Stays</TabsTrigger>
            <TabsTrigger value="bus">Bus</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="cars">Car Rental</TabsTrigger>
            <TabsTrigger value="cruises">Houseboat</TabsTrigger>
            <TabsTrigger value="things-to-do">Things to Do</TabsTrigger>
          </TabsList>

          <TabsContent value="stays">
            <StaysForm />
          </TabsContent>
          {/* Other tab contents */}
        </Tabs>
      </div>
    </section>
  );
}
```

## Phase 3: Form Components (2-3 days)

### 3.1 Create Form Components

#### Stays Form

```typescript
// src/components/home/forms/StaysForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DestinationDropdown } from "./DestinationDropdown";
import { DatePicker } from "./DatePicker";
import { GuestCounter } from "./GuestCounter";

export function StaysForm() {
  const [formData, setFormData] = useState({
    destination: "",
    checkIn: null,
    checkOut: null,
    guests: { adults: 1, children: 0 },
  });

  return (
    <form className="search-form">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DestinationDropdown
          value={formData.destination}
          onChange={(value) => setFormData({ ...formData, destination: value })}
        />
        <DatePicker
          label="Check In"
          value={formData.checkIn}
          onChange={(date) => setFormData({ ...formData, checkIn: date })}
        />
        <DatePicker
          label="Check Out"
          value={formData.checkOut}
          onChange={(date) => setFormData({ ...formData, checkOut: date })}
        />
        <GuestCounter
          guests={formData.guests}
          onChange={(guests) => setFormData({ ...formData, guests })}
        />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        Search Hotels
      </Button>
    </form>
  );
}
```

### 3.2 Reusable Form Components

#### Destination Dropdown

```typescript
// src/components/home/forms/DestinationDropdown.tsx
"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const destinations = [
  "Harare",
  "Bulawayo",
  "Victoria Falls",
  "Kariba",
  "Hwange",
  "Mutare",
  "Nyanga",
  "Masvingo",
  "Chinhoyi",
  "Gweru",
];

export function DestinationDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        placeholder="Where are you going?"
        onClick={() => setIsOpen(!isOpen)}
        readOnly
      />
      {isOpen && (
        <div className="destinations-dropdown">
          {destinations.map((dest) => (
            <div
              key={dest}
              className="destination-item"
              onClick={() => {
                onChange(dest);
                setIsOpen(false);
              }}
            >
              <MapPin className="w-4 h-4" />
              <span>{dest}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Date Picker

```typescript
// src/components/home/forms/DatePicker.tsx
"use client";

import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

export function DatePicker({ label, value, onChange }) {
  return (
    <div className="search-field">
      <label>{label}</label>
      <Flatpickr
        value={value}
        onChange={([date]) => onChange(date)}
        options={{
          dateFormat: "Y-m-d",
          minDate: "today",
        }}
        placeholder="Select date"
      />
    </div>
  );
}
```

#### Guest Counter

```typescript
// src/components/home/forms/GuestCounter.tsx
"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function GuestCounter({ guests, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const updateGuests = (type: "adults" | "children", increment: boolean) => {
    const newGuests = { ...guests };
    if (increment) {
      newGuests[type]++;
    } else if (newGuests[type] > (type === "adults" ? 1 : 0)) {
      newGuests[type]--;
    }
    onChange(newGuests);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={`${guests.adults} adult${guests.adults > 1 ? "s" : ""}${
          guests.children > 0
            ? `, ${guests.children} child${guests.children > 1 ? "ren" : ""}`
            : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
      />
      {isOpen && (
        <div className="guests-dropdown">
          <div className="guest-type">
            <span>Adults</span>
            <div className="guest-counter">
              <button
                type="button"
                onClick={() => updateGuests("adults", false)}
                disabled={guests.adults <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span>{guests.adults}</span>
              <button
                type="button"
                onClick={() => updateGuests("adults", true)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="guest-type">
            <span>Children</span>
            <div className="guest-counter">
              <button
                type="button"
                onClick={() => updateGuests("children", false)}
                disabled={guests.children <= 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span>{guests.children}</span>
              <button
                type="button"
                onClick={() => updateGuests("children", true)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Phase 4: Content Sections (2-3 days)

### 4.1 Top Destinations Section

```typescript
// src/components/home/TopDestinations.tsx
"use client";

import { DestinationCard } from "./DestinationCard";

const destinations = [
  {
    id: 1,
    name: "Victoria Falls",
    image: "/images/vicfalls.jpg",
    description: "World-famous waterfall and adventure capital",
  },
  // ... more destinations
];

export function TopDestinations() {
  return (
    <section className="features py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Top Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4.2 Traveler's Choice Section

```typescript
// src/components/home/TravelersChoice.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AccommodationCard } from "./AccommodationCard";

export function TravelersChoice() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Component implementation with carousel functionality
}
```

### 4.3 Events Section

```typescript
// src/components/home/UpcomingEvents.tsx
"use client";

import { EventTicket } from "./EventTicket";

const events = [
  {
    id: 1,
    title: "Market At Queen",
    date: "28 September 2025",
    location: "Queen of Hearts Cafe, Harare",
    image: "/images/maq.png",
    tickets: [{ type: "Early Bird", price: 5 }],
  },
  {
    id: 2,
    title: "Jacaranda Music Festival",
    date: "3 - 5 October 2025",
    location: "Thorn Park Polo Grounds, Harare",
    image: "/images/jacaranda.JPG",
    tickets: [
      { type: "Day Pass", price: 30 },
      { type: "3-Day Pass", price: 80 },
      { type: "VIP Day Pass", price: 80 },
      { type: "VIP 3-Day Pass", price: 200 },
    ],
  },
];

export function UpcomingEvents() {
  return (
    <section className="features upcoming-events py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Upcoming Events
        </h2>
        <div className="space-y-8">
          {events.map((event) => (
            <EventTicket key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Phase 5: Routing Setup (1 day)

### 5.1 App Router Configuration

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayout } from "@/components/layout/RootLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Off2Zim - Your Zimbabwe Travel Companion",
  description: "Discover, plan, and book your Zimbabwe travel experience",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
```

### 5.2 Page Routes

```typescript
// src/app/page.tsx - Home page
// src/app/activities/page.tsx - Activities hub
// src/app/destinations/page.tsx - Destinations
// src/app/dining/page.tsx - Dining reservations
// src/app/events/page.tsx - Events booking
// src/app/hotels/page.tsx - Hotel booking
// src/app/services/page.tsx - Services
```

## Phase 6: Styling & Optimization (1-2 days)

### 6.1 Global Styles

```css
/* src/styles/globals.css */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

@font-face {
  font-family: "Century Gothic";
  src: url("/fonts/centurygothic.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Century Gothic";
  src: url("/fonts/centurygothic_bold.ttf") format("truetype");
  font-weight: bold;
  font-style: normal;
}

:root {
  --primary-color: #000000;
  --primary-hover: #909090;
  --secondary-color: #2c3e50;
  --background-light: #f9f9f9;
  --accent-color: #ffcc00;
}

body {
  font-family: "Century Gothic", sans-serif;
}
```

### 6.2 Performance Optimization

```typescript
// Image optimization
import Image from "next/image";

// Lazy loading components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
});

// Code splitting by route
```

## Phase 7: Testing & Quality Assurance (1-2 days)

### 7.1 Component Testing

```javascript
// __tests__/components/SearchInterface.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInterface } from "@/components/home/SearchInterface";

test("renders search tabs", () => {
  render(<SearchInterface />);
  expect(screen.getByText("Stays")).toBeInTheDocument();
  expect(screen.getByText("Flights")).toBeInTheDocument();
});
```

### 7.2 Integration Testing

- Form submission workflows
- Navigation between sections
- Responsive design testing
- Cross-browser compatibility

## Timeline Summary

| Phase | Duration | Tasks                                        |
| ----- | -------- | -------------------------------------------- |
| 1     | 1-2 days | Project setup, dependencies, asset migration |
| 2     | 3-5 days | Component migration, shared components       |
| 3     | 2-3 days | Form components, interactive elements        |
| 4     | 2-3 days | Content sections, carousel components        |
| 5     | 1 day    | Routing setup, navigation                    |
| 6     | 1-2 days | Styling, optimization                        |
| 7     | 1-2 days | Testing, QA                                  |

**Total Estimated Time: 11-18 days**

## Risk Mitigation

### Technical Risks

- Complex JavaScript interactions → Gradual conversion with fallbacks
- Asset loading issues → Proper Next.js Image optimization
- Styling conflicts → Systematic CSS migration

### Timeline Risks

- Feature complexity → Break down into smaller components
- Integration issues → Regular testing during migration
- Performance issues → Monitor bundle size and optimize

## Success Criteria

### Functional Requirements

- ✅ All existing functionality preserved
- ✅ Improved performance and maintainability
- ✅ Mobile responsiveness maintained
- ✅ SEO optimization improved

### Technical Requirements

- ✅ Modern React architecture
- ✅ TypeScript integration
- ✅ Component reusability
- ✅ Code splitting and optimization

### Business Requirements

- ✅ No downtime during conversion
- ✅ Improved development velocity
- ✅ Better user experience
- ✅ Scalable architecture for future features
