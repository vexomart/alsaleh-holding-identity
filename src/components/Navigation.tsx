/**
 * Navigation - Re-exports NavigationDark
 * This file maintains backward compatibility with existing imports
 */

import { NavigationDark } from './homepage/NavigationDark';

// Re-export as default for backward compatibility
export default NavigationDark;

// Also export the component directly
export { NavigationDark as Navigation };
