export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    50: "#F0F7FF",
    100: "#C2E0FF",
    200: "#99CCF3",
    300: "#66B2FF",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    700: "#0059B2",
    800: "#004C99",
    900: "#003A75",
  },
  secondary: {
    50: "#F9F0FF",
    100: "#E9CEFF",
    200: "#D49EFF",
    300: "#BF6EFF",
    400: "#AA3EFF",
    500: "#9400FF",
    600: "#7A00D4",
    700: "#6000AA",
    800: "#460080",
    900: "#2C0055",
  },
};

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // Dark mode palette
            primary: {
              main: colorTokens.primary[400],
              dark: colorTokens.primary[600],
              light: colorTokens.primary[200],
            },
            secondary: {
              main: colorTokens.secondary[400],
              dark: colorTokens.secondary[600],
              light: colorTokens.secondary[200],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
              paper: colorTokens.grey[800],
            },
          }
        : {
            // Light mode palette
            primary: {
              main: colorTokens.primary[500],
              dark: colorTokens.primary[700],
              light: colorTokens.primary[100],
            },
            secondary: {
              main: colorTokens.secondary[500],
              dark: colorTokens.secondary[700],
              light: colorTokens.secondary[100],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10],
              alt: colorTokens.grey[0],
              paper: colorTokens.grey[0],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.25rem",
      },
      h6: {
        fontWeight: 500,
        fontSize: "1rem",
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: "8px 16px",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: "none",
            border: "1px solid",
            borderColor: mode === "dark" ? colorTokens.grey[700] : colorTokens.grey[200],
          },
        },
      },
    },
  };
};