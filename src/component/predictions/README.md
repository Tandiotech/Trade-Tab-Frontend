# Economic Predictions Feature

A comprehensive React + TypeScript + Tailwind + React Query implementation for economic event predictions with leaderboards, user history, and vision scoring.

## 🚀 Features

### Core Functionality
- **Make a Call**: Submit predictions on economic events with USD, Gold, and Volatility outcomes
- **Event Cards**: Display upcoming and passed events with prediction status
- **Leaderboard**: Weekly, Monthly, and All-Time rankings with vision scores
- **User History**: Paginated prediction history with results
- **Vision Score System**: Bronze, Silver, Gold, Diamond tiers with color-coded badges
- **Streak Bonuses**: Animated celebrations for prediction streaks

### UX Enhancements
- **Responsive Design**: Mobile-first with compact components
- **Animations**: Framer Motion for smooth transitions and streak celebrations
- **Toast Notifications**: Success/error feedback with custom styling
- **Loading States**: Skeleton loaders and optimistic updates
- **Accessibility**: Keyboard navigation and focus management

## 📁 File Structure

```
src/component/predictions/
├── EventCard.tsx                    # Event display with prediction buttons
├── MakeCallModal.tsx               # Prediction submission modal
├── LeaderboardView.tsx             # Rankings with tabs
├── VisionScoreBadge.tsx            # Color-coded score badges
├── HistoryTable.tsx                # User prediction history
├── StreakBonusAnimation.tsx        # Celebration animations
├── PredictionToast.tsx             # Toast notification system
├── index.ts                        # Component exports
└── __tests__/                      # Unit tests
    ├── MakeCallModal.test.tsx
    └── VisionScoreBadge.test.tsx

src/hook/
├── usePredictions.ts               # React Query hooks
└── __tests__/
    └── usePredictions.test.ts      # API integration tests

src/types/
└── predictions.ts                  # TypeScript types and schemas

src/pages/predictions/
└── PredictionsPage.tsx             # Main predictions page
```

## 🔧 API Integration

### Endpoints
- `POST /predictions` - Create prediction
- `GET /predictions/:eventId` - Get prediction for event
- `GET /predictions/history` - Get user prediction history
- `GET /leaderboard` - Get leaderboard data
- `GET /vision-score` - Get user vision score
- `GET /predictions/available-events` - Get available events

### Authentication
All requests include `Authorization: Bearer <token>` header via axios interceptor.

## 🎨 Components

### EventCard
```tsx
<EventCard event={event} />
<EventCardCompact event={event} /> // Mobile version
```

### MakeCallModal
```tsx
<MakeCallModal
  isOpen={isOpen}
  onClose={onClose}
  eventId="event-123"
  eventTitle="Economic Event"
/>
```

### LeaderboardView
```tsx
<LeaderboardView />
<LeaderboardViewCompact /> // Mobile version
```

### VisionScoreBadge
```tsx
<VisionScoreBadge score={1200} size="lg" />
<VisionScoreBadgeCompact score={1200} /> // Compact version
```

### HistoryTable
```tsx
<HistoryTable pageSize={10} />
<HistoryTableCompact pageSize={5} /> // Mobile version
```

## 🎯 Usage

### Basic Setup
```tsx
import { PredictionsPage } from '@/component/predictions';

// Add to your router
{
  path: '/predictions',
  element: <PredictionsPage />,
}
```

### Using Individual Components
```tsx
import { 
  EventCard, 
  MakeCallModal, 
  LeaderboardView,
  VisionScoreBadge 
} from '@/component/predictions';

// In your component
const [isModalOpen, setIsModalOpen] = useState(false);

return (
  <div>
    <EventCard event={event} />
    <MakeCallModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      eventId={event.event_id}
      eventTitle={event.title}
    />
  </div>
);
```

### Using Hooks
```tsx
import { 
  useAvailableEvents, 
  useCreatePrediction, 
  useLeaderboard 
} from '@/hook/usePredictions';

function MyComponent() {
  const { data: events } = useAvailableEvents();
  const createPrediction = useCreatePrediction();
  const { data: leaderboard } = useLeaderboard('weekly');

  const handleSubmit = async (data) => {
    await createPrediction.mutateAsync(data);
  };

  return (
    // Your component JSX
  );
}
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Component rendering and interactions
- Form validation and submission
- API integration and error handling
- Responsive behavior
- Animation states

### Example Test
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MakeCallModal } from '@/component/predictions';

test('submits prediction with correct data', async () => {
  render(<MakeCallModal {...props} />);
  
  // Select outcomes
  fireEvent.click(screen.getByText('Up'));
  
  // Submit
  fireEvent.click(screen.getByText('Submit Prediction'));
  
  // Assert
  expect(mockMutateAsync).toHaveBeenCalledWith(expectedData);
});
```

## 🎨 Styling

### Tailwind Classes
- **Colors**: Gray-800/900 for backgrounds, Cyan-600 for primary actions
- **Spacing**: Consistent padding and margins using Tailwind scale
- **Responsive**: Mobile-first with `lg:` breakpoints
- **Animations**: Framer Motion for smooth transitions

### Custom Classes
```css
/* Vision Score Badge Colors */
.bg-amber-100 { /* Bronze */ }
.bg-gray-100  { /* Silver */ }
.bg-yellow-100 { /* Gold */ }
.bg-blue-100   { /* Diamond */ }
```

## 🔄 State Management

### React Query
- **Caching**: 5-minute stale time for most queries
- **Optimistic Updates**: Immediate UI updates for predictions
- **Error Handling**: Automatic retry with exponential backoff
- **Background Refetch**: Keeps data fresh

### Local State
- **Modal States**: useState for open/close
- **Form Data**: Controlled components with validation
- **UI States**: Loading, error, success states

## 🚀 Performance

### Optimizations
- **Code Splitting**: Lazy loading for large components
- **Memoization**: React.memo for expensive renders
- **Virtual Scrolling**: For large lists (if needed)
- **Image Optimization**: WebP format with fallbacks

### Bundle Size
- **Tree Shaking**: Only import used components
- **Dynamic Imports**: Load components on demand
- **Bundle Analysis**: Regular size monitoring

## 🔒 Security

### Data Validation
- **Zod Schemas**: Runtime type checking
- **Input Sanitization**: XSS prevention
- **CSRF Protection**: Token-based requests

### Error Handling
- **Graceful Degradation**: Fallbacks for API failures
- **User Feedback**: Clear error messages
- **Logging**: Error tracking and monitoring

## 📱 Mobile Support

### Responsive Design
- **Breakpoints**: Mobile, tablet, desktop
- **Touch Targets**: Minimum 44px touch areas
- **Compact Components**: Space-efficient mobile versions
- **Gesture Support**: Swipe and touch interactions

### Performance
- **Lazy Loading**: Load components on demand
- **Image Optimization**: Responsive images
- **Bundle Splitting**: Separate mobile/desktop bundles

## 🔧 Configuration

### Environment Variables
```env
VITE_SERVER_URL_MAINNET=https://api.tradetab.com
VITE_SERVER_URL_TESTNET=https://api-test.tradetab.com
VITE_TEST_MODE=0
```

### API Configuration
```tsx
// http_request.tsx
export const http = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Modal not opening**
   - Check if `isOpen` prop is true
   - Verify event handlers are properly bound

2. **API errors**
   - Check authentication token
   - Verify API endpoint URLs
   - Check network connectivity

3. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Debug Mode
```tsx
// Enable React Query DevTools
<ReactQueryDevtools initialIsOpen={false} />
```

## 📈 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Prediction accuracy trends
- **Social Features**: Share predictions, follow traders
- **Gamification**: Achievements, badges, rewards
- **AI Insights**: Machine learning predictions

### Performance Improvements
- **Service Workers**: Offline support
- **Progressive Web App**: Installable app
- **Advanced Caching**: Intelligent cache invalidation
- **Bundle Optimization**: Further size reduction

## 🤝 Contributing

### Development Setup
```bash
npm install
npm run dev
npm test
npm run build
```

### Code Style
- **ESLint**: Enforced code quality
- **Prettier**: Consistent formatting
- **TypeScript**: Strict type checking
- **Conventional Commits**: Standardized commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request with description

## 📄 License

This feature is part of the TradeTab application. See main project license for details.
