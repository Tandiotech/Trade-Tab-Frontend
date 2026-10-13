# BrokerCard Component

A modern, clean broker card component designed for performance and user value.

## Features

- **Clean Design**: Minimal, professional layout focused on essential information
- **Performance Optimized**: No heavy animations, fast rendering
- **Responsive**: Mobile-first design that works on all screen sizes
- **Accessible**: Proper semantic HTML and ARIA labels
- **Extensible**: Easy to add new features and data points

## Components

### BrokerCard
Main card component displaying broker information including:
- Logo and basic information
- Overall rating and score
- Key metrics (trust, fees, platform, support)
- Feature badges
- Action button

### StarRating
Reusable star rating component with:
- Configurable size (sm, md, lg)
- Half-star support
- Optional numeric display

### BrokerMetrics
Visual representation of broker metrics with:
- Progress bars for each metric
- Color-coded categories
- Responsive grid layout

### BrokerBadges
Feature and regulation badges with:
- Smart truncation (shows most important features)
- Color-coded categories
- Responsive wrapping

## Usage

```tsx
import { BrokerCard } from './component/BrokerCard';

<BrokerCard
  broker={brokerData}
  showComparison={true}
  onCompareToggle={handleCompareToggle}
  isComparing={false}
/>
```

## Data Structure

The component expects a `Broker` object with the following structure:

```typescript
interface Broker {
  id: string;
  slug: string;
  generalInformation: {
    brokerName: string;
    logo: string;
    website?: string;
    established?: string;
    headquarters?: string;
  };
  scoreboard: {
    overallReview: number;
    stars: number;
    trustScore?: number;
    fees?: number;
    platform?: number;
    customerSupport?: number;
  };
  features?: string[];
  regulation?: string[];
  minDeposit?: number;
  spreads?: string;
}
```



