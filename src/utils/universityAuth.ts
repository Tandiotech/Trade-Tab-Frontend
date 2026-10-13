import { http } from './http_request';

// University platform origin. Set VITE_UNIVERSITY_URL (https in production) in .env.
export const UNIVERSITY_URL = (import.meta.env.VITE_UNIVERSITY_URL || '').replace(/\/+$/, '');

interface UniversityTokenData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  accountId?: string;
}

interface UniversityTokenResponse {
  success: boolean;
  token: string;
  expiresIn: number;
  message: string;
}

/**
 * Generate JWT token for university access
 * @param userData - User information for token generation
 * @returns Promise with token response
 */
const generateUniversityToken = async (userData: UniversityTokenData): Promise<UniversityTokenResponse> => {
  try {
    const response = await http.post('/university/generate-token', userData);
    return response.data;
  } catch (error) {
    console.error('Error generating university token:', error);
    throw new Error('Failed to generate university access token');
  }
};

/**
 * Construct university URL with JWT token
 * @param token - JWT token for authentication
 * @returns University URL with token parameter
 */
const constructUniversityUrl = (token: string): string => {
  const baseUrl = UNIVERSITY_URL;
  return `${baseUrl}/auth?token=${encodeURIComponent(token)}`;
};

/**
 * Complete flow to generate token and redirect to university
 * @param userData - User information
 * @param onSuccess - Callback for successful token generation
 * @param onError - Callback for error handling
 */
const goToUniversity = async (
  userData: UniversityTokenData,
  onSuccess?: (url: string) => void,
  onError?: (error: string) => void
): Promise<void> => {
  try {
    // Generate JWT token
    const tokenResponse = await generateUniversityToken(userData);
    
    if (!tokenResponse.success) {
      throw new Error(tokenResponse.message || 'Token generation failed');
    }

    // Construct university URL
    const universityUrl = constructUniversityUrl(tokenResponse.token);
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess(universityUrl);
    }

    // Open university in new tab
    window.open(universityUrl, '_blank');
    
  } catch (error) {
    console.error('Error in goToUniversity flow:', error);
    
    // Call error callback if provided
    if (onError) {
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
    
    // Fallback to direct university link
    window.open(`${UNIVERSITY_URL}/`, '_blank');
  }
};



/**
 * Get user resume data for university dashboard
 * @param accountId - User's account ID
 * @param userId - User's ID (alternative to accountId)
 * @returns Promise with user resume data
 */
export const getUserResume = async (accountId?: string, userId?: string): Promise<any> => {
  try {
    const params: any = {};
    if (accountId) params.accountId = accountId;
    if (userId) params.userId = userId;
    
    const response = await http.get('/university/user-resume', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user resume:', error);
    throw new Error('Failed to fetch user resume data');
  }
};


/**
 * Check if token is expired
 * @param token - JWT token to check
 * @returns True if expired, false otherwise
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // Assume expired if we can't decode
  }
};

/**
 * Decode JWT token payload (without verification)
 * @param token - JWT token to decode
 * @returns Decoded payload
 */
const decodeToken = (token: string): any => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}; 