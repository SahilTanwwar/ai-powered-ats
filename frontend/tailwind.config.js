export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:   "#0F172A",
        secondary: "#64748B",
        accent:    "#2563EB",
        "accent-light": "#EFF6FF",
        surface:   "#FFFFFF",
        bg:        "#F8FAFC",
        border:    "#E2E8F0",
        success:   "#10B981",
        warning:   "#F59E0B",
        danger:    "#EF4444",
        muted:     "#94A3B8",
      },
      fontFamily: {
        sans:  ["Inter", "sans-serif"],
        head:  ["DM Sans", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
