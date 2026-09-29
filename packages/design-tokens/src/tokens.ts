export const colors = {
  brand: {
    sustainability: "#1B5E20",
    water: "#01579B",
    vitality: "#F9A825",
  },

  background: {
    default: "#F8FAFC",
    surface: "#FFFFFF",
  },

  text: {
    primary: "#0F172A",
    secondary: "#475569",
    inverse: "#FFFFFF",
    disabled: "#94A3B8",
  },

  border: {
    default: "#E2E8F0",
    strong: "#CBD5E1",
  },

  feedback: {
    success: "#15803D",
    warning: "#B45309",
    danger: "#B91C1C",
    info: "#0369A1",
  },

  state: {
    disabled: "#E2E8F0",
    focus: "#01579B",
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    heading: "Poppins",
    body: "Roboto",
  },

  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;