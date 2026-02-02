/**
 * Client ID Utilities
 * Generate and format unique client identifiers
 */

/**
 * Generate a unique client ID in format: ASH-CL-XXXXXX
 * Uses 6 random alphanumeric characters
 */
export function generateClientId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars: 0,O,1,I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ASH-CL-${code}`;
}

/**
 * Validate client ID format
 */
export function isValidClientId(clientId: string): boolean {
  return /^ASH-CL-[A-Z0-9]{6}$/.test(clientId);
}

/**
 * Format client ID for display (already formatted, but ensures consistency)
 */
export function formatClientId(clientId: string): string {
  if (!clientId) return '';
  // If already in correct format, return as-is
  if (clientId.startsWith('ASH-CL-')) return clientId;
  // If it's just the code, add prefix
  if (/^[A-Z0-9]{6,8}$/.test(clientId)) return `ASH-CL-${clientId}`;
  return clientId;
}

/**
 * Get initials from name for avatar
 */
export function getInitials(name: string, maxChars = 2): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, maxChars).toUpperCase();
  }
  return parts
    .slice(0, maxChars)
    .map(p => p[0])
    .join('')
    .toUpperCase();
}

/**
 * Determine client status based on their data
 */
export function determineClientStatus(data: {
  hasActiveContracts: boolean;
  isVerified: boolean;
  isSuspended: boolean;
}): 'active' | 'under_contract' | 'suspended' | 'pending_verification' {
  if (data.isSuspended) return 'suspended';
  if (!data.isVerified) return 'pending_verification';
  if (data.hasActiveContracts) return 'under_contract';
  return 'active';
}
