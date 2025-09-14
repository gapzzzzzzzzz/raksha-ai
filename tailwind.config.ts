import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Light theme with high contrast
        rk: {
          bg: "#FFFFFF",        // white
          surface: "#F8FAFC",   // slate-50
          card: "#FFFFFF",      // white
          border: "#E2E8F0",    // slate-200
          text: "#1E293B",      // slate-800
          subtle: "#64748B",    // slate-500
          primary: "#2563EB",   // blue-600
          "primary-600": "#1D4ED8", // blue-700
          "primary-50": "#EFF6FF",  // blue-50
          accent: "#059669",    // emerald-600
          "accent-50": "#ECFDF5",   // emerald-50
          warn: "#D97706",      // amber-600
          "warn-50": "#FFFBEB",     // amber-50
          danger: "#DC2626",    // red-600
          "danger-50": "#FEF2F2",   // red-50
          success: "#059669",   // emerald-600
          info: "#0284C7",      // sky-600
          emergency: "#DC2626", // red-600
          consult: "#D97706",   // amber-600
          "self-care": "#059669", // emerald-600
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["24px", "32px"],
        "2xl": ["32px", "40px"],
        "3xl": ["44px", "52px"],
        "4xl": ["56px", "64px"],
      },
      spacing: {
        "8": "2rem",
        "12": "3rem",
        "16": "4rem",
        "24": "6rem",
        "32": "8rem",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
