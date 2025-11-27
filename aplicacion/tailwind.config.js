/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Activamos modo oscuro manual
  theme: {
    extend: {
      colors: {
        panda: {
          dark: '#0F172A',   // Fondo principal muy oscuro (Slate-900)
          card: '#1E293B',   // Fondo de tarjetas (Slate-800)
          light: '#F1F5F9',  // Texto claro (Slate-100)
          primary: '#3B82F6', // Azul eléctrico
          accent: '#10B981',  // Verde verificado
        }
      }
    },
  },
  plugins: [],
}