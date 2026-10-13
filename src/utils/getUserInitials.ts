/**
 * Gets the initials from a user's name
 * @param name - The user's name (can be firstName, fullName, userName, etc.)
 * @param maxInitials - Maximum number of initials to return (default: 2)
 * @returns The initials in uppercase (e.g., "John Doe" -> "JD", "John" -> "J")
 */
export function getUserInitials(name?: string | null, maxInitials: number = 2): string {
  if (!name || typeof name !== 'string') {
    return 'U'; // Default to 'U' for User
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return 'U';
  }

  // Split by spaces and filter out empty strings
  const parts = trimmed.split(/\s+/).filter(part => part.length > 0);

  if (parts.length === 0) {
    return 'U';
  }

  // If only one name part, return first letter
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  // If multiple parts, get first letter of first and last name
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  // Return up to maxInitials initials
  return (firstInitial + lastInitial).slice(0, maxInitials);
}

