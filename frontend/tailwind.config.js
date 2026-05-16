export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0A65CC",
        "primary-hover": "#0854AE",
        "primary-light": "#E7F0FA",
        "dark-bg": "#18191C",
        "dark-muted": "#767F8C",
        "text-primary": "#18191C",
        "text-secondary": "#515B6F",
        "text-muted": "#9199A3",
        border: "#E4E5E8",
        success: "#0BA02C",
        warning: "#E05151",
        yellow: "#FFB836",
      },
      fontFamily: {
        sans:  ["Epilogue", "sans-serif"],
        head:  ["Epilogue", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'glow': '0 4px 12px rgba(10, 101, 204, 0.2)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
