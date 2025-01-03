/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        red: "#f81d1de0",
        blue:"#1d87f8e0",
        green:"#07ff2aba",
        yellow:"#19ff23db",
        purple:"#6b1df8e0",
        pink:"#f81dd5e0",
      cyan:"#92ff05e0",
        orange:"#ff7519db"
      }
    },
  },
  plugins: [],
}

