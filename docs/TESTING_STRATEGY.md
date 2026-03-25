# Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the Off2Zim travel platform, ensuring reliability, performance, and user experience quality across all features.

## Testing Philosophy

- **Test-Driven Development (TDD)**: Write tests before implementation when possible
- **Coverage Goals**: Maintain minimum 80% code coverage
- **Quality Gates**: Automated testing in CI/CD pipeline
- **User-Centric**: Focus on testing user workflows and business logic

## Testing Pyramid

### Unit Tests (70% of tests)

- **Framework**: Jest + React Testing Library
- **Scope**: Individual components, utilities, and business logic
- **Location**: `__tests__` folders alongside source files

```typescript
// Example unit test structure
import { render, screen } from "@testing-library/react";
import { HotelCard } from "@/components/hotel/HotelCard";

describe("HotelCard", () => {
  it("displays hotel information correctly", () => {
    const mockHotel = {
      id: "1",
      name: "Test Hotel",
      rating: 4.5,
      price: 150,
    };

    render(<HotelCard hotel={mockHotel} />);

    expect(screen.getByText("Test Hotel")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });
});
```

### Integration Tests (20% of tests)

- **Framework**: Jest + MSW (Mock Service Worker)
- **Scope**: Component interactions, API integrations, state management
- **Focus**: User workflows across multiple components

```typescript
// Example integration test
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { server } from "@/mocks/server";

describe("Hotel Booking Flow", () => {
  it("completes hotel booking successfully", async () => {
    const user = userEvent.setup();

    render(<BookingFlow />);

    // Select hotel
    await user.click(screen.getByTestId("hotel-select"));

    // Fill booking form
    await user.type(screen.getByLabelText("Check-in Date"), "2024-06-01");
    await user.type(screen.getByLabelText("Check-out Date"), "2024-06-03");

    // Submit booking
    await user.click(screen.getByRole("button", { name: "Book Now" }));

    // Verify confirmation
    await waitFor(() => {
      expect(screen.getByText("Booking Confirmed")).toBeInTheDocument();
    });
  });
});
```

### End-to-End Tests (10% of tests)

- **Framework**: Playwright
- **Scope**: Complete user journeys across the entire application
- **Focus**: Critical business flows

```typescript
// Example E2E test
import { test, expect } from "@playwright/test";

test("complete hotel booking journey", async ({ page }) => {
  await page.goto("/");

  // Search for hotels
  await page.fill('[data-testid="destination-input"]', "Harare");
  await page.click('[data-testid="search-button"]');

  // Select a hotel
  await page.click('.hotel-card:first-child [data-testid="book-button"]');

  // Complete booking form
  await page.fill('[name="checkIn"]', "2024-06-01");
  await page.fill('[name="checkOut"]', "2024-06-03");
  await page.fill('[name="guests"]', "2");

  // Proceed to payment
  await page.click('[data-testid="proceed-payment"]');

  // Fill payment details (using test data)
  await page.fill('[name="cardNumber"]', "4242424242424242");
  await page.fill('[name="expiryDate"]', "12/25");
  await page.fill('[name="cvv"]', "123");

  // Complete booking
  await page.click('[data-testid="complete-booking"]');

  // Verify success
  await expect(
    page.locator('[data-testid="booking-confirmation"]')
  ).toBeVisible();
});
```

## Testing Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/mocks/**",
    "!src/stories/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 12"] },
    },
  ],
});
```

## Test Data Management

### Mock Data Strategy

```typescript
// src/mocks/handlers.ts
import { rest } from "msw";

export const handlers = [
  rest.get("/api/hotels", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        hotels: [
          {
            id: "1",
            name: "Rainbow Towers",
            rating: 4.5,
            price: 150,
            amenities: ["Pool", "WiFi", "Gym"],
          },
        ],
      })
    );
  }),

  rest.post("/api/bookings", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        bookingId: "booking-123",
        status: "confirmed",
      })
    );
  }),
];
```

### Test Fixtures

```typescript
// src/fixtures/hotels.ts
export const mockHotels = [
  {
    id: "1",
    name: "Rainbow Towers",
    location: "Harare CBD",
    rating: 4.5,
    pricePerNight: 150,
    images: ["/images/hotel1.jpg"],
    amenities: ["Pool", "WiFi", "Gym", "Restaurant"],
  },
  {
    id: "2",
    name: "Victoria Falls Hotel",
    location: "Victoria Falls",
    rating: 5.0,
    pricePerNight: 300,
    images: ["/images/hotel2.jpg"],
    amenities: ["Spa", "WiFi", "Pool", "Restaurant", "Bar"],
  },
];
```

## Component Testing Patterns

### Testing Custom Hooks

```typescript
import { renderHook, act } from "@testing-library/react";
import { useBookingStore } from "@/stores/bookingStore";

describe("useBookingStore", () => {
  it("adds item to booking", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.addHotel({
        id: "1",
        name: "Test Hotel",
        price: 100,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(100);
  });
});
```

### Testing Async Components

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HotelList } from "@/components/hotel/HotelList";

describe("HotelList", () => {
  it("displays hotels after loading", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <HotelList destination="Harare" />
      </QueryClientProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Rainbow Towers")).toBeInTheDocument();
    });
  });
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Hotel Search Flow"
    flow:
      - get:
          url: "/"
      - get:
          url: "/api/hotels?destination=Harare"
      - think: 3
      - get:
          url: "/hotels/1"
```

### Lighthouse CI

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
      },
    },
  },
};
```

## Accessibility Testing

### Automated A11y Testing

```typescript
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { HotelCard } from "@/components/hotel/HotelCard";

expect.extend(toHaveNoViolations);

describe("HotelCard Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<HotelCard hotel={mockHotel} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Visual Regression Testing

### Storybook + Chromatic

```typescript
// .storybook/main.js
module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
};

// HotelCard.stories.tsx
import { HotelCard } from "./HotelCard";

export default {
  title: "Components/HotelCard",
  component: HotelCard,
};

export const Default = {
  args: {
    hotel: {
      id: "1",
      name: "Rainbow Towers",
      rating: 4.5,
      price: 150,
    },
  },
};
```

## Testing Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:visual": "chromatic --build-script-name storybook:build",
    "test:a11y": "jest --testNamePattern=accessibility",
    "test:performance": "lighthouse-ci autorun"
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      - run: npm run test:performance

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## Quality Gates

### Pre-commit Hooks

```javascript
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test:changed
npm run lint
npm run type-check
```

### Pull Request Checks

- ✅ All tests pass
- ✅ Coverage threshold met (80%)
- ✅ No accessibility violations
- ✅ Performance budget maintained
- ✅ Visual regression tests pass

## Best Practices

### Test Organization

- Group related tests in describe blocks
- Use descriptive test names that explain behavior
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests focused and isolated

### Mock Strategy

- Mock external dependencies
- Use real implementations for internal modules
- Reset mocks between tests
- Prefer MSW for API mocking

### Performance Considerations

- Run tests in parallel where possible
- Use selective testing for faster feedback
- Optimize test data and fixtures
- Monitor test execution time

## Debugging Tests

### VS Code Configuration

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Common Debugging Techniques

- Use `screen.debug()` to inspect DOM
- Add `await new Promise(r => setTimeout(r, 5000))` for debugging async tests
- Use Playwright's `page.pause()` for E2E debugging
- Enable verbose logging in test configuration

This comprehensive testing strategy ensures the Off2Zim platform maintains high quality, reliability, and user experience standards throughout development and production deployment.
