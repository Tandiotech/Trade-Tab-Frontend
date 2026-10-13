import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';
import { afterEach } from 'vitest';

MotionGlobalConfig.skipAnimations = true;

afterEach(() => {
  cleanup();
});
