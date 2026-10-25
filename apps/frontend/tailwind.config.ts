import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        obsidian: {
          950: "#07080b",
          900: "#0e1017",
          850: "#141722",
          800: "#1a1e2d",
        },
        crimson: {
          DEFAULT: "#ef4444",
          neon: "#ff2a4b",
          dark: "#991b1b",
          border: "#45121b",
          muted: "#261a22",
        },
      },
      boxShadow: {
        "neon-red": "0 0 25px -5px rgba(239, 68, 68, 0.45)",
        "neon-red-sm": "0 0 12px rgba(255, 42, 75, 0.35)",
        "card-dark": "0 8px 30px rgba(0, 0, 0, 0.75)",
      },
    },
  },
  plugins: [],
};

export default config;
