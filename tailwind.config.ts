import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        ocean: "#11706d",
        coral: "#e65f54",
        honey: "#f2b84b",
        meadow: "#4d9c6b",
      },
      boxShadow: {
        lift: "0 18px 45px rgba(23, 32, 42, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
