/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".break-after-page": {
          breakAfter: "page",
        },
        ".break-inside-avoid": {
          breakInside: "avoid",
        },
        "@media print": {
          ".print\\:hidden": {
            display: "none !important",
          },
          ".print\\:block": {
            display: "block !important",
          },
        },
      });
    },
  ],
};
