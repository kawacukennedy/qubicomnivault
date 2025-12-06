/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.tsx",
    "./src/**/*.ts",
    "./src/**/*.jsx",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EAF6FF",
          100: "#D1ECFF",
          200: "#A6DFFF",
          300: "#7BD1FF",
          400: "#4EBFFF",
          500: "#229FFF",
          600: "#1C7ECC",
          700: "#145F99",
          800: "#0E4366",
          900: "#072834"
        },
        secondary: {
          50: "#FFF7EA",
          100: "#FFEDCC",
          200: "#FFE0A3",
          300: "#FFD480",
          400: "#FFC24A",
          500: "#FFB014",
          600: "#CC8E10",
          700: "#996B0B",
          800: "#664707",
          900: "#332304"
        },
        accent: {
          50: "#F6EFFF",
          100: "#E9D9FF",
          200: "#D6BBFF",
          300: "#C59DFF",
          400: "#B37FFF",
          500: "#A05EFF",
          600: "#7F47CC",
          700: "#5F3299",
          800: "#3E2066",
          900: "#1F1033"
        },
        success: {
          50: "#F0FFF4",
          100: "#DAF9E0",
          200: "#B7F2C0",
          300: "#8DE69A",
          400: "#57D66A",
          500: "#2AB94B",
          600: "#218A3B",
          700: "#17642D",
          800: "#0E3F1E",
          900: "#071E10"
        },
        warning: {
          50: "#FFF9F0",
          100: "#FFF0D9",
          200: "#FFE2B3",
          300: "#FFD188",
          400: "#FFBF4D",
          500: "#FFA800",
          600: "#CC8800",
          700: "#995F00",
          800: "#663D00",
          900: "#331E00"
        },
        error: {
          50: "#FFF2F2",
          100: "#FFE0E0",
          200: "#FFBFBF",
          300: "#FF9E9E",
          400: "#FF6E6E",
          500: "#FF3B3B",
          600: "#CC2F2F",
          700: "#991E1E",
          800: "#661414",
          900: "#330A0A"
        },
        neutral: {
          50: "#F8FAFB",
          100: "#F1F5F7",
          200: "#E6EAEE",
          300: "#D7DEE6",
          400: "#BFC9D4",
          500: "#9FA9B8",
          600: "#778394",
          700: "#54606A",
          800: "#30363B",
          900: "#0F1112"
        }
      },
      fontFamily: {
        display: ["Inter var", "ui-sans-serif", "system-ui", "-apple-system", "'Segoe UI'", "Roboto", "'Helvetica Neue'", "Arial"],
        mono: ["'Fira Code'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "'Roboto Mono'"]
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["36px", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],
        h3: ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        h5: ["16px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0" }],
        h6: ["14px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.01em" }],
        bodyLarge: ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
        mono: ["13px", { lineHeight: "1.6", fontWeight: "400" }]
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
        xxx: "48px",
        xxxx: "64px",
        huge: "96px",
        giant: "128px"
      },
      borderRadius: {
        small: "6px",
        medium: "12px",
        large: "20px",
        pill: "9999px",
        circle: "50%"
      },
      boxShadow: {
        subtle: "0px 1px 3px rgba(16,24,40,0.06), 0px 1px 2px rgba(16,24,40,0.03)",
        medium: "0px 6px 18px rgba(16,24,40,0.08)",
        large: "0px 20px 40px rgba(16,24,40,0.12)"
      },
      animation: {
        micro: "cubic-bezier(0.25, 0.8, 0.25, 1)",
        springSoft: "spring(400, 30, 0)",
        easeInOutExpo: "cubic-bezier(0.85, 0, 0.15, 1)",
        sharp: "cubic-bezier(0.2, 0, 0, 1)"
      },
      transitionTimingFunction: {
        micro: "cubic-bezier(0.25, 0.8, 0.25, 1)",
        springSoft: "spring(400, 30, 0)",
        easeInOutExpo: "cubic-bezier(0.85, 0, 0.15, 1)",
        sharp: "cubic-bezier(0.2, 0, 0, 1)"
      }
    },
  },
  plugins: [],
}