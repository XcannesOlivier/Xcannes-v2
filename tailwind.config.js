/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "xcannes-background": "#202320",
        "xcannes-green": "#16b303",
        "xcannes-blue-light": "#0695d9",
        "xcannes-blue": "#0a08a9",
        "xcannes-blue-weight": "#195e7f",
        "xcannes-green-weight": "#16650c",
        "xcannes-red": "#930606",
        "xcannes-red-light": "#e70707",
        "xcannes-yellow": "#fbff00",
        "xcannes-yellow-weight": "#797b06",
        "xcannes-gray": "#414139",
        "xcannes-gray-light": "#51514a",
        "xcannes-gray-weight": "#272725",
        "xcannes-violet": "#6027e9",
        "xcannes-violet-weight": "#3a2371",
        "xcannes-pink": "#c525b9",
        "xcannes-pink-weight": "#75136d"
      },
      animation: {
        firework: "firework 0.8s ease-out forwards",
        blueFlame: "blueFlame 1s ease-in-out infinite"
      },
      keyframes: {
        blueFlame: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        firework: {
          "0%": { transform: "scale(0)", opacity: 1 },
          "100%": {
            transform: "scale(3) translateY(-50px)",
            opacity: 0,
          },
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      }
    }
  },
  plugins: []
};

