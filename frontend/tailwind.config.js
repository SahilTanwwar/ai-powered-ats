export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary:   "#09090b",
        secondary: "#71717a",
        accent:    "#6366f1", // Indigo 500
        "accent-light": "#e0e7ff",
        "accent-hover": "#4f46e5",
        surface:   "#ffffff",
        "surface-glass": "rgba(255, 255, 255, 0.7)",
        bg:        "#f8fafc",
        border:    "#e4e4e7",
        success:   "#10b981",
        warning:   "#f59e0b",
        danger:    "#ef4444",
        muted:     "#a1a1aa",
      },
      fontFamily: {
        sans:  ["Inter", "sans-serif"],
        head:  ["Outfit", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
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
