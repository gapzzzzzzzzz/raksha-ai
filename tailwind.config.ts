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
        // Brand colors
        rk: {
          bg: "#0B1220",        // slate-950
          surface: "#111827",   // gray-900
          card: "#0F172A",      // slate-900
          border: "#1F2937",    // gray-800
          text: "#E5E7EB",      // gray-200
          subtle: "#9CA3AF",    // gray-400
          primary: "#0EA5E9",   // sky-500
          "primary-600": "#0284C7",
          accent: "#22C55E",    // green-500
          warn: "#F59E0B",      // amber-500
          danger: "#EF4444",    // red-500
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
  plugins: [],
};

export default config;
