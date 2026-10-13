# AccountsSummary Component

## Overview
A modern, responsive accounts summary component designed to discourage users from connecting too many accounts while providing a clear, organized view of their trading accounts.

## Design Philosophy

### 5 Account Hard Cap
- Users can connect a maximum of 5 trading accounts
- Progress bar shows usage (e.g., "3 / 5 used")
- Messaging emphasizes that "Most traders keep 1–2 accounts for clarity and control"
- Add account button is disabled when limit is reached

### Primary Account (Hero)
- The first or most important account gets prominent display
- Shows detailed metrics:
  - Balance
  - Realized PnL (not real-time equity)
  - Number of closed trades
  - Win rate
  - Max drawdown
- Large, visually distinctive card design
- Period-based retrospective metrics (e.g., "Last 30 days")

### Secondary Accounts (Compact Cards)
- Displayed as smaller, compact cards
- Show essential information only:
  - Account name and status
  - Broker and account number
  - Balance
  - PnL (if available)
- Desktop: Grid layout (2-4 columns depending on screen size)
- Mobile: Horizontal scroll

## Responsive Design

### Desktop (≥1280px)
- Primary account: Full-width hero card
- Secondary accounts: 4-column grid

### Laptop (≥1024px)
- Primary account: Full-width hero card
- Secondary accounts: 3-column grid

### Tablet (≥640px)
- Primary account: Full-width hero card
- Secondary accounts: 2-column grid

### Mobile (<640px)
- Primary account: Full-width hero card
- Secondary accounts: Horizontal scroll (with padding for swipe affordance)

## Features

### Filter & Sort Capabilities
- Sort by:
  - Name (alphabetical)
  - Balance (high to low / low to high)
  - Last updated (most recent / oldest)
- Filter buttons with active state indication
- Preserves sort state across re-renders

### Status Indicators
- **Green dot (ok)**: Account is connected and syncing properly
- **Yellow dot (warning)**: Account needs attention (missing data, sync issues)
- **Red dot (error)**: Account has errors

### Integration Points
- **MTAccountsContext**: Primary data source for accounts
- **ProgressBarContext**: Handles new account deployment states
- **useAccountState**: Controls account connection modal

## Component Structure

```
AccountsSummary/
├── AccountsSummary.tsx    # Main component
├── index.ts              # Exports
└── README.md             # This file
```

## Usage

```tsx
import AccountsSummary from '@/component/AccountsSummary';

function TradingDashboard() {
  return (
    <div>
      <AccountsSummary />
    </div>
  );
}
```

## Future Enhancements

### Metrics Calculation (TODO)
Currently, metrics like `realizedPnl`, `trades`, `winRate`, and `maxDrawdown` are placeholders. These should be calculated from:
- Historical trades data
- Account transaction history
- Selected time period (e.g., last 30 days)

### Account Management Modal
The "Manage" button currently logs to console. Future implementation should:
- Open a modal/drawer with account settings
- Allow editing account name
- Show sync status and history
- Provide option to disconnect/delete account

### Period Selection
Add ability to change the analysis period:
- Last 7 days
- Last 30 days
- Last 90 days
- Custom date range

## Accessibility
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for interactive elements
- Color contrast meets WCAG AA standards
- Focus indicators on all interactive elements

## Performance Considerations
- Uses `useMemo` for expensive computations (sorting, enriching accounts)
- Efficient re-render strategy
- Lazy loading for account cards (if needed for large lists)
- Optimized responsive images and icons from lucide-react

