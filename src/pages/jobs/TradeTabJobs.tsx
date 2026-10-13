import { JobsCareersPage } from './careers/JobsCareersPage';

/** Logged-in app route at /jobs — same UI as public /careers, without marketing chrome. */
export default function TradeTabJobs() {
  return <JobsCareersPage variant='inApp' />;
}
