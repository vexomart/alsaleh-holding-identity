import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'ar': ['IBM Plex Sans Arabic', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
        'en': ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
        'executive': ['IBM Plex Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
        'corporate': ['IBM Plex Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['IBM Plex Sans Arabic', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['1.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h3': ['1.25rem', { lineHeight: '1.375', fontWeight: '600' }],
        'h4': ['1.125rem', { lineHeight: '1.375', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.625', fontWeight: '400' }],
        'body-lg': ['1rem', { lineHeight: '1.625', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.01em' }],
        'button': ['0.875rem', { lineHeight: '1.25', fontWeight: '600' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
          variant: "hsl(var(--primary-variant))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          dark: "hsl(var(--secondary-dark))",
          light: "hsl(var(--secondary-light))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: "hsl(var(--accent-light))",
          dark: "hsl(var(--accent-dark))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-out": "fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-out": "scale-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-left": "slide-in-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 6s ease-in-out infinite 2s",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        "exit": "fade-out 0.2s ease-in, scale-out 0.15s ease-in",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // RTL Support Plugin + Typography
    function({ addUtilities, addBase }) {
      // Enterprise Typography Base
      addBase({
        'html': {
          fontFamily: "var(--font-ar, 'IBM Plex Sans Arabic', system-ui, sans-serif)",
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          'font-variant-numeric': 'tabular-nums',
        },
        'html[dir="rtl"]': {
          direction: 'rtl',
        },
        'html[dir="rtl"] body': {
          direction: 'rtl',
          fontFamily: "var(--font-ar)",
        },
        'html[dir="ltr"] body, html[lang="en"] body': {
          direction: 'ltr',
          fontFamily: "var(--font-en, 'Inter', system-ui, sans-serif)",
        }
      });

      // RTL Utilities
      addUtilities({
        '.rtl\\:text-right': {
          '[dir="rtl"] &': {
            textAlign: 'right',
          },
        },
        '.rtl\\:text-left': {
          '[dir="rtl"] &': {
            textAlign: 'left',
          },
        },
        '.rtl\\:mr-auto': {
          '[dir="rtl"] &': {
            marginRight: 'auto',
          },
        },
        '.rtl\\:ml-auto': {
          '[dir="rtl"] &': {
            marginLeft: 'auto',
          },
        },
        '.hover-scale': {
          '@apply transition-transform duration-300 hover:scale-105': {},
        },
        '.story-link': {
          '@apply relative inline-block after:content-[""] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left': {},
        },
        '.glass-effect': {
          '@apply bg-white/20 backdrop-blur-sm border border-white/30': {},
        },
        '.gradient-text': {
          '@apply bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent': {},
        },
        '.gradient-text-primary': {
          '@apply bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent': {},
        },
        '.gradient-text-accent': {
          '@apply bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent': {},
        },
        '.shadow-glow': {
          'box-shadow': 'var(--shadow-glow)',
        },
        '.shadow-accent-glow': {
          'box-shadow': 'var(--shadow-accent-glow)',
        },
        '.shadow-secondary-glow': {
          'box-shadow': 'var(--shadow-secondary-glow)',
        },
        '.delay-100': {
          'animation-delay': '100ms',
        },
        '.delay-200': {
          'animation-delay': '200ms',
        },
        '.delay-300': {
          'animation-delay': '300ms',
        },
        '.delay-400': {
          'animation-delay': '400ms',
        },
        '.delay-500': {
          'animation-delay': '500ms',
        },
      });
    }
  ],
} satisfies Config;