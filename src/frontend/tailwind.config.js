/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        navy: {
          900: "#050d1f",
          800: "#0a1628",
          700: "#0d1f3c",
          600: "#122448",
          500: "#1a3a6b",
          400: "#1e4a8a",
        },
        gold: {
          DEFAULT: "#FFD700",
          light: "#FFE44D",
          dark: "#CC9900",
        },
        "cyan-glow": "#00BFFF",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        gold: "0 0 20px #FFD700, 0 0 40px rgba(255,215,0,0.4)",
        "gold-lg": "0 0 40px #FFD700, 0 0 80px rgba(255,215,0,0.5)",
        cyan: "0 0 15px #00BFFF, 0 0 30px rgba(0,191,255,0.3)",
      },
      animation: {
        float: "float 2s ease-in-out infinite",
        arcFlash: "arcFlash 0.4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        scanline: "scanline 3s linear infinite",
        chainSway: "chainSway 3s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        fadeIn: "fadeIn 0.6s ease-out forwards",
        titleShimmer: "titleShimmer 3s linear infinite",
        orbPulse: "orbPulse 1.5s ease-in-out infinite",
        meterBar1: "meterBar1 0.8s ease-in-out infinite",
        meterBar2: "meterBar2 1.1s ease-in-out infinite",
        meterBar3: "meterBar3 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
