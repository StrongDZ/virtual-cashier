/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#1a1a2e", // Deep Navy
                    dark: "#0f0f1e",
                    light: "#2a2a3e",
                },
                accent: {
                    DEFAULT: "#d4af37", // Muted Gold
                    light: "#f4e4bc",
                    dark: "#b8941f",
                    electric: "#3b82f6", // Electric Blue
                },
                charcoal: {
                    DEFAULT: "#1e293b", // Dark Charcoal
                    light: "#334155",
                    dark: "#0f172a",
                },
            },
            backgroundImage: {
                "gradient-gold": "linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)",
                "gradient-blue": "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                "gradient-overlay": "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
            },
            backdropBlur: {
                xs: "2px",
            },
            boxShadow: {
                glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                "glass-lg": "0 20px 60px 0 rgba(31, 38, 135, 0.5)",
            },
        },
    },
    plugins: [],
};
