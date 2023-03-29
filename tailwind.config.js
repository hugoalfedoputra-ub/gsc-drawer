/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ["Montserrat", "sans-serif"],
                segoe: ["Segoe UI", "sans-serif"],
            },
        },
        colors: {
            primary: "#0057ff",
            white: "#ffffff",
            black: "#101010",
            accent: "#191919",
            warning: "ffd400",
            success: "98ca3e",
        },
    },
    plugins: [require("daisyui")],
    daisyui: { themes: ["light"] },
};
