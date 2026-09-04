import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mehndi: {
          DEFAULT: "#1F3B2C", // Deep Mehndi Green
          50: "#EEF3EF",
          100: "#D6E2D9",
          200: "#ADC5B3",
          300: "#82A78B",
          400: "#588A64",
          500: "#3A6D48",
          600: "#28542F", // brighter mid green
          700: "#1F3B2C", // primary
          800: "#152A1F",
          900: "#0C1913",
        },
        brown: {
          DEFAULT: "#5B3524", // Rich Brown
          50: "#F3ECE7",
          100: "#E2CFC2",
          200: "#C9A488",
          300: "#AC7C5D",
          400: "#8C5C3E",
          500: "#5B3524",
          600: "#4A2A1C",
          700: "#3A2116",
          800: "#2A1710",
          900: "#190D09",
        },
        gold: {
          DEFAULT: "#B08D57", // Muted Antique Gold
          50: "#FAF5EC",
          100: "#F0E3C9",
          200: "#DFC496",
          300: "#CCA76A",
          400: "#B08D57",
          500: "#93733F",
          600: "#795C32",
          700: "#5D4726",
        },
        ivory: {
          DEFAULT: "#FBF5E9", // Warm Ivory / Cream
          soft: "#F7EEDC",
          card: "#FFFDF8",
        },
        ink: "#231A13",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(35, 26, 19, 0.18)",
        card: "0 4px 20px -6px rgba(91, 53, 36, 0.15)",
        lift: "0 20px 45px -15px rgba(31, 59, 44, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "paisley-fade":
          "radial-gradient(circle at 20% 20%, rgba(176,141,87,0.10), transparent 40%), radial-gradient(circle at 80% 60%, rgba(31,59,44,0.08), transparent 45%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
