import { SafeSectionProps } from '@/pages/metrics/interface';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Error Boundary Component for individual sections
export const SafeSection: React.FC<SafeSectionProps> = ({ children, fallback = null, sectionName = 'Section' }) => {
  try {
    if (!children) return fallback;
    return children;
  } catch (error) {
    console.error(`Error in ${sectionName}:`, error);
    return fallback || <div className="text-red-500 p-4">Error loading {sectionName}</div>;
  }
};


// Safe data access utility
export const safeGet = (obj: any, path: string, defaultValue: any = null): any => {
  try {
    return path.split('.').reduce((current: any, key: string) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch (error) {
    console.error('Safe get error:', error);
    return defaultValue;
  }
};