/**
 * MainHeaderV2 - Style Utilities
 * Centralized styling for the header system
 */

// Header Container Styles
export const headerStyles = {
  wrapper: 'fixed inset-x-0 top-0 z-50',
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  inner: 'flex h-20 items-center justify-between gap-8',
  
  // Background states
  bgDefault: 'bg-slate-950/95 backdrop-blur-xl border-b border-white/5',
  bgScrolled: 'bg-slate-950 shadow-2xl shadow-black/50 border-b border-white/10',
};

// Navigation Styles
export const navStyles = {
  desktop: 'hidden lg:flex items-center gap-1',
  
  link: `
    relative px-4 py-2 text-sm font-medium text-slate-300
    hover:text-white transition-colors duration-200
    after:absolute after:bottom-0 after:inset-x-4 after:h-0.5
    after:bg-gradient-to-r after:from-primary after:to-accent
    after:scale-x-0 after:origin-right after:transition-transform after:duration-300
    hover:after:scale-x-100 hover:after:origin-left
  `,
  
  linkActive: `
    text-white
    after:scale-x-100
  `,
  
  dropdownTrigger: `
    flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-300
    hover:text-white transition-colors duration-200
  `,
  
  dropdownTriggerActive: 'text-white',
};

// Dropdown Panel Styles
export const dropdownStyles = {
  panel: `
    absolute top-full end-0 mt-4 w-[540px]
    bg-slate-900 rounded-2xl border border-white/10
    shadow-2xl shadow-black/40 overflow-hidden
  `,
  
  panelSmall: 'w-72',
  
  header: 'px-5 py-4 border-b border-white/5 bg-white/[0.02]',
  headerTitle: 'text-base font-bold text-white',
  headerCount: 'text-xs text-slate-500',
  
  grid: 'p-3 grid grid-cols-2 gap-1',
  list: 'p-2 space-y-0.5',
  
  item: `
    group flex items-center gap-3 p-3 rounded-xl
    text-slate-300 hover:bg-white/5 hover:text-white
    transition-all duration-200
  `,
  
  itemActive: 'bg-primary/10 text-primary',
  
  itemIcon: `
    w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center
    text-slate-400 group-hover:bg-primary/20 group-hover:text-primary
    transition-all duration-200
  `,
  
  itemIconActive: 'bg-primary/20 text-primary',
  
  itemText: 'flex-1 min-w-0',
  itemLabel: 'block text-sm font-medium',
  itemDesc: 'block text-xs text-slate-500 mt-0.5 truncate',
};

// Mobile Menu Styles
export const mobileStyles = {
  overlay: 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
  
  panel: `
    fixed top-0 end-0 z-50 h-full w-[85vw] max-w-sm
    bg-slate-950 border-s border-white/10
    flex flex-col
  `,
  
  header: 'flex items-center justify-between h-20 px-5 border-b border-white/5',
  
  nav: 'flex-1 overflow-y-auto p-5',
  
  group: 'mb-6',
  groupTitle: 'px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider',
  
  link: `
    flex items-center gap-3 px-3 py-3 rounded-xl
    text-slate-300 hover:bg-white/5 hover:text-white
    transition-all duration-200
  `,
  
  linkActive: 'bg-primary/10 text-primary',
  
  linkIcon: 'w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center',
  linkIconActive: 'bg-primary/20 text-primary',
  
  footer: 'p-5 border-t border-white/5',
};

// Button Styles
export const buttonStyles = {
  secondary: `
    inline-flex items-center gap-2 px-5 py-2.5
    bg-white/5 text-white text-sm font-medium rounded-xl
    border border-white/10 hover:bg-white/10
    transition-all duration-200
  `,
  
  primary: `
    inline-flex items-center gap-2 px-6 py-2.5
    bg-gradient-to-l from-primary to-accent text-white text-sm font-bold rounded-xl
    hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]
    transition-all duration-200
  `,
  
  mobileToggle: `
    lg:hidden w-11 h-11 flex items-center justify-center rounded-xl
    bg-white/5 text-white border border-white/10
    hover:bg-white/10 transition-all duration-200
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
  textSub: 'text-[10px] text-slate-500 font-medium tracking-widest uppercase',
};
