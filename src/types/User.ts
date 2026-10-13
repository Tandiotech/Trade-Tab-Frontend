/**
 * User Type Definition
 * Represents the user data structure from the backend
 */
export interface User {
  id?: string;
  _id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  socialMedia?: {
    twitter?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    telegram?: string;
    discord?: string;
  };
  maxAccountsAllowed?: number; // Maximum number of accounts user can create
  [key: string]: any; // Allow additional properties
}

/**
 * User with accounts information
 */
interface UserWithAccounts extends User {
  accounts?: Array<any>;
  brokers?: Array<any>;
}

