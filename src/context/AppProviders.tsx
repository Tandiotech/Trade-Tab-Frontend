import AccountCreationProvider from './accounts/AccountCreationContext';
import MTAccountContextProvider from './accounts/MTAccountsContext';
import { MetricsProvider } from './accounts/MetricsProvider';
import { ProgressBarProvider } from './ProgressBarContext';
import { TradesProvider } from './accounts/TradesProvider';
import { AccountStateProvider } from './accounts/useAccountState';
import { FeatureFlagsProvider } from './FeatureFlagsProvider';
import { NotificationProvider } from './NotificationContext';
import { UserProvider } from './UserContext';
import { OnboardingProvider } from './OnboardingContext';
import { ModeProvider } from './ModeContext';
import { ConnectionJobProvider } from './ConnectionJobContext';
import { MetricsPrefetch } from '@/component/MetricsPrefetch';

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <FeatureFlagsProvider>
        <NotificationProvider>
          <ModeProvider>
            <OnboardingProvider>
                <MTAccountContextProvider>
                  <ConnectionJobProvider>
                    <AccountCreationProvider>
                      <ProgressBarProvider>
                        <MetricsProvider>
                          <TradesProvider>
                            <MetricsPrefetch />
                            <AccountStateProvider>{children}</AccountStateProvider>
                          </TradesProvider>
                        </MetricsProvider>
                      </ProgressBarProvider>
                    </AccountCreationProvider>
                  </ConnectionJobProvider>
                </MTAccountContextProvider>
            </OnboardingProvider>
          </ModeProvider>
        </NotificationProvider>
      </FeatureFlagsProvider>
    </UserProvider>
  );
};

export default AppProviders;
