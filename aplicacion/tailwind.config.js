/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta Oficial NubiAI
        nubi: {
          dark: '#0F172A',    // Fondo principal (Slate-900)
          card: '#1E293B',    // Fondo tarjetas (Slate-800)
          primary: '#9333EA', // Purple-600 (Color principal)
          secondary: '#C026D3', // Fuchsia-600 (Color secundario/acento)
          accent: '#3B82F6',  // Blue-500 (Detalles técnicos)
          success: '#10B981', // Emerald-500 (Verificado/Ahorro)
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}