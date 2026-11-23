/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // AZUG FR brand palette — expand as design tokens are confirmed
        azure: {
          50: "#EFF6FC",
          100: "#DEECF9",
          200: "#C7E0F4",
          300: "#71AFE5",
          500: "#2B88D8",
          600: "#0078D4",
          700: "#005A9E",
          800: "#004578",
          900: "#003A6C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
