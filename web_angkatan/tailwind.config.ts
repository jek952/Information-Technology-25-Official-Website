/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hijaugelap: "#132a13",
        hijauhunter: "#31572c",
        hijauterang: "#4f772d",
        hijauterangbanget: "#90a955",
        jeruk: "#ecf39e",
      },
    },
  },
};