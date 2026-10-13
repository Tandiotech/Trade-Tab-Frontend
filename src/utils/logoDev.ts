/**
 * Logo.dev integration utilities
 * Handles domain normalization and Logo.dev URL generation
 */

/**
 * Normalizes a website URL to extract just the domain/hostname
 * Strips protocol, www, paths, queries, and hashes
 * 
 * @param website - The website URL (e.g., "www.305markets.com/", "https://example.com/path?query=1")
 * @returns Normalized domain (e.g., "305markets.com") or empty string if invalid
 * 
 * @example
 * normalizeDomainFromWebsite("www.305markets.com/") // "305markets.com"
 * normalizeDomainFromWebsite("https://example.com/path") // "example.com"
 * normalizeDomainFromWebsite("http://www.test.com") // "test.com"
 */
export function normalizeDomainFromWebsite(website?: string | null): string {
  if (!website || typeof website !== 'string') {
    return '';
  }

  try {
    // Remove leading/trailing whitespace
    let normalized = website.trim();

    // If empty after trim, return empty
    if (!normalized) {
      return '';
    }

    // Add protocol if missing (needed for URL parsing)
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }

    // Parse URL
    const url = new URL(normalized);

    // Extract hostname
    let hostname = url.hostname.toLowerCase();

    // Remove leading "www."
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }

    // Return the cleaned hostname
    return hostname;
  } catch (error) {
    // If URL parsing fails, try simple regex extraction
    try {
      // Remove protocol
      let cleaned = website.replace(/^https?:\/\//i, '');
      
      // Remove www.
      cleaned = cleaned.replace(/^www\./i, '');
      
      // Remove path, query, hash (everything after first /)
      cleaned = cleaned.split('/')[0];
      
      // Remove port if present
      cleaned = cleaned.split(':')[0];
      
      // Remove trailing dot
      cleaned = cleaned.replace(/\.$/, '');
      
      return cleaned.toLowerCase();
    } catch {
      return '';
    }
  }
}

/**
 * Generates a Logo.dev URL for a given website
 * Returns empty string if website or token is missing
 * 
 * @param website - The website URL to generate logo for
 * @returns Logo.dev URL or empty string
 * 
 * @example
 * getLogoDevUrl("www.305markets.com/") // "https://img.logo.dev/305markets.com?token=..."
 */
export function getLogoDevUrl(website?: string | null): string {
  const domain = normalizeDomainFromWebsite(website);
  
  if (!domain) {
    return '';
  }

  // Get token from environment variables
  const token = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;
  
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return '';
  }

  // Get base URL from environment variables, default to https://img.logo.dev
  const baseUrl = import.meta.env.VITE_LOGO_DEV_BASE_URL || 'https://img.logo.dev';

  // Build and return the Logo.dev URL
  return `${baseUrl}/${domain}?token=${token.trim()}`;
}

