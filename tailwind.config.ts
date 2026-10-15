import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["variant", "&:is(.dark *):not(.light-island, .light-island *)"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          muted: "hsl(var(--surface-muted) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        brand: {
          50: "#EEF8FE",
          100: "#D8EFFC",
          200: "#B6E2FA",
          300: "#82CEF6",
          400: "#45B4EF",
          500: "#1EA4E9",
          600: "#0A94DC",
          700: "#0767A0",
          800: "#0C5A86",
          900: "#104B6E",
          950: "#0B3049",
          DEFAULT: "#0879B8",
          foreground: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#0B1220",
          800: "#111A2C",
          700: "#1A2438",
          600: "#26324A",
        },
        // Theme-aware blue for small brand-colored TEXT (AA-safe on both themes).
        "brand-strong": "var(--brand-strong)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem" },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.18)",
        "card-hover":
          "0 2px 4px rgb(0 0 0 / 0.06), 0 24px 48px -16px rgb(0 0 0 / 0.32)",
        brand: "none",
        glow: "none",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1EA4E9 0%, #0767A0 100%)",
        "ink-gradient": "linear-gradient(160deg, #111A2C 0%, #0B1220 60%, #0B3049 100%)",
        "hero-fade":
          "linear-gradient(to top, hsl(var(--background)) 4%, transparent 60%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rise: {
          "0%": { transform: "translateY(16px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        rise: "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        progress: "progress 5.2s linear forwards",
      },
    },
  },
  plugins: [],
};

export default config;
