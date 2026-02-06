/**
 * MainHeaderV2 - Style Utilities
 * Centralized styling for the header system
 * Enhanced visibility and contrast
 */

// Header Container Styles
export const headerStyles = {
  wrapper: 'fixed inset-x-0 top-0 z-[100]',
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  inner: 'flex h-20 items-center justify-between gap-8',
  
  // Background states - Solid dark with high contrast
  bgDefault: 'bg-slate-900 backdrop-blur-xl border-b border-slate-700/50',
  bgScrolled: 'bg-slate-900 shadow-2xl shadow-black/50 border-b border-slate-700',
};

// Navigation Styles - HIGH CONTRAST
export const navStyles = {
  desktop: 'hidden lg:flex items-center gap-1',
  
  // Links - WHITE text for maximum visibility
  link: `
    relative px-4 py-2 text-sm font-semibold text-white
    hover:text-primary transition-colors duration-200
    after:absolute after:bottom-0 after:inset-x-4 after:h-0.5
    after:bg-gradient-to-r after:from-primary after:to-accent
    after:scale-x-0 after:origin-right after:transition-transform after:duration-300
    hover:after:scale-x-100 hover:after:origin-left
  `,
  
  linkActive: `
    text-primary
    after:scale-x-100
  `,
  
  // Dropdown trigger - WHITE text
  dropdownTrigger: `
    flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
    hover:text-primary transition-colors duration-200
  `,
  
  dropdownTriggerActive: 'text-primary',
};

// Dropdown Panel Styles - HIGH CONTRAST (Portal-based)
export const dropdownStyles = {
  // Panel styles (position handled dynamically via Portal)
  panel: `
    bg-slate-800 rounded-2xl border border-slate-600
    shadow-2xl shadow-black/50 overflow-hidden
  `,
  
  panelSmall: 'w-72',
  
  // Header
  header: 'px-5 py-4 border-b border-slate-600 bg-slate-900/50',
  headerTitle: 'text-base font-bold text-white',
  headerCount: 'text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full',
  
  // Grid/List
  grid: 'p-3 grid grid-cols-2 gap-2',
  list: 'p-2 space-y-1',
  
  // Items - HIGH VISIBILITY
  item: `
    group flex items-center gap-3 p-3 rounded-xl
    text-white hover:bg-primary/20 hover:text-primary
    transition-all duration-200 cursor-pointer
  `,
  
  itemActive: 'bg-primary/20 text-primary',
  
  // Icon box
  itemIcon: `
    w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center
    text-slate-300 group-hover:bg-primary/30 group-hover:text-primary
    transition-all duration-200
  `,
  
  itemIconActive: 'bg-primary/30 text-primary',
  
  // Text
  itemText: 'flex-1 min-w-0',
  itemLabel: 'block text-sm font-semibold text-white group-hover:text-primary',
  itemDesc: 'block text-xs text-slate-400 mt-0.5 truncate',
};

// Mobile Menu Styles - HIGH CONTRAST
export const mobileStyles = {
  overlay: 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
  
  panel: `
    fixed top-0 end-0 z-50 h-full w-[85vw] max-w-sm
    bg-slate-900 border-s border-slate-700
    flex flex-col
  `,
  
  header: 'flex items-center justify-between h-20 px-5 border-b border-slate-700',
  
  nav: 'flex-1 overflow-y-auto p-5',
  
  group: 'mb-6',
  groupTitle: 'px-3 mb-2 text-xs font-bold text-primary uppercase tracking-wider',
  
  // Links - WHITE text
  link: `
    flex items-center gap-3 px-3 py-3 rounded-xl
    text-white hover:bg-primary/20 hover:text-primary
    transition-all duration-200
  `,
  
  linkActive: 'bg-primary/20 text-primary',
  
  linkIcon: 'w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300',
  linkIconActive: 'bg-primary/30 text-primary',
  
  footer: 'p-5 border-t border-slate-700',
};

// Button Styles - HIGH CONTRAST
export const buttonStyles = {
  // Secondary button - visible border
  secondary: `
    inline-flex items-center gap-2 px-5 py-2.5
    bg-slate-800 text-white text-sm font-semibold rounded-xl
    border border-slate-600 hover:bg-slate-700 hover:border-primary
    transition-all duration-200
  `,
  
  // Primary CTA
  primary: `
    inline-flex items-center gap-2 px-6 py-2.5
    bg-gradient-to-l from-primary to-accent text-white text-sm font-bold rounded-xl
    hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.02]
    transition-all duration-200
  `,
  
  // Mobile toggle
  mobileToggle: `
    lg:hidden w-11 h-11 flex items-center justify-center rounded-xl
    bg-slate-800 text-white border border-slate-600
    hover:bg-slate-700 hover:border-primary transition-all duration-200
  `,
};

// Logo Styles
export const logoStyles = {
  wrapper: 'flex items-center gap-3 group',
  
  icon: `
    relative w-11 h-11 rounded-xl
    bg-gradient-to-br from-primary via-primary to-accent
    flex items-center justify-center
    shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40
    transition-all duration-300
  `,
  
  iconText: 'text-white font-black text-sm',
  
  text: 'hidden sm:block',
  textMain: 'text-lg font-black text-white tracking-tight',
  textGradient: 'bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent',
  textSub: 'text-[10px] text-slate-400 font-medium tracking-widest uppercase',
};
