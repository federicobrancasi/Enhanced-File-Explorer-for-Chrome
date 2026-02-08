"use strict";

const THEMES = {
  light: {
    name: "Light",
    bg: "#ffffff",
    bgAlt: "#f4f6fb",
    text: "#1c1c1c",
    link: "#1c1c1c",
    border: "#000000",
    headerBg: "#ffffff",
    thBg: "#e8e8e8"
  },

  ocean: {
    name: "Ocean",
    bg: "#f0f8ff",
    bgAlt: "#e6f2ff",
    text: "#1a365d",
    link: "#2b6cb0",
    border: "#2b6cb0",
    headerBg: "#e6f2ff",
    thBg: "#cce0ff"
  },

  blackwhite: {
    name: "Black & White",
    bg: "#1c1c1c",
    bgAlt: "#2a2a2a",
    text: "#ffffff",
    link: "#ffffff",
    border: "#ffffff",
    headerBg: "#1c1c1c",
    thBg: "#333333"
  },

  dark: {
    name: "Dark",
    bg: "#1e1e2e",
    bgAlt: "#313244",
    text: "#cdd6f4",
    link: "#89b4fa",
    border: "#45475a",
    headerBg: "#1e1e2e",
    thBg: "#45475a"
  },

  darkwarm: {
    name: "Dark Warm",
    bg: "#1a1a1a",
    bgAlt: "#262626",
    text: "#e0e0e0",
    link: "#ffb86c",
    border: "#444444",
    headerBg: "#1a1a1a",
    thBg: "#333333"
  },

  darkcool: {
    name: "Dark Cool",
    bg: "#0f172a",
    bgAlt: "#1e293b",
    text: "#e2e8f0",
    link: "#22d3ee",
    border: "#334155",
    headerBg: "#0f172a",
    thBg: "#1e293b"
  },

  midnight: {
    name: "Midnight",
    bg: "#0d1117",
    bgAlt: "#161b22",
    text: "#c9d1d9",
    link: "#58a6ff",
    border: "#30363d",
    headerBg: "#010409",
    thBg: "#21262d"
  },

  forest: {
    name: "Forest",
    bg: "#f0fff4",
    bgAlt: "#c6f6d5",
    text: "#22543d",
    link: "#276749",
    border: "#2f855a",
    headerBg: "#c6f6d5",
    thBg: "#9ae6b4"
  },

  sunset: {
    name: "Sunset",
    bg: "#fffaf0",
    bgAlt: "#feebc8",
    text: "#744210",
    link: "#c05621",
    border: "#dd6b20",
    headerBg: "#feebc8",
    thBg: "#fbd38d"
  },

  lavender: {
    name: "Lavender",
    bg: "#faf5ff",
    bgAlt: "#e9d8fd",
    text: "#44337a",
    link: "#6b46c1",
    border: "#805ad5",
    headerBg: "#e9d8fd",
    thBg: "#d6bcfa"
  },

  rose: {
    name: "Rose",
    bg: "#fff5f7",
    bgAlt: "#fed7e2",
    text: "#702459",
    link: "#b83280",
    border: "#d53f8c",
    headerBg: "#fed7e2",
    thBg: "#fbb6ce"
  },

  sepia: {
    name: "Sepia",
    bg: "#fdf6e3",
    bgAlt: "#eee8d5",
    text: "#657b83",
    link: "#268bd2",
    border: "#93a1a1",
    headerBg: "#eee8d5",
    thBg: "#d9d2c2"
  },

  nord: {
    name: "Nord",
    bg: "#eceff4",
    bgAlt: "#e5e9f0",
    text: "#2e3440",
    link: "#5e81ac",
    border: "#4c566a",
    headerBg: "#e5e9f0",
    thBg: "#d8dee9"
  },

  contrast: {
    name: "High Contrast",
    bg: "#000000",
    bgAlt: "#1a1a1a",
    text: "#ffffff",
    link: "#00ff00",
    border: "#ffffff",
    headerBg: "#000000",
    thBg: "#333333"
  }
};

const FONTS = {
  // Sans-Serif
  system: {
    name: "System Default",
    value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
  },
  montserrat: {
    name: "Montserrat",
    value: "'Montserrat', sans-serif"
  },
  inter: {
    name: "Inter",
    value: "'Inter', sans-serif"
  },
  roboto: {
    name: "Roboto",
    value: "'Roboto', sans-serif"
  },
  opensans: {
    name: "Open Sans",
    value: "'Open Sans', sans-serif"
  },
  lato: {
    name: "Lato",
    value: "'Lato', sans-serif"
  },
  poppins: {
    name: "Poppins",
    value: "'Poppins', sans-serif"
  },
  sourcesans: {
    name: "Source Sans 3",
    value: "'Source Sans 3', sans-serif"
  },
  // Monospace
  firacode: {
    name: "Fira Code",
    value: "'Fira Code', monospace"
  },
  jetbrains: {
    name: "JetBrains Mono",
    value: "'JetBrains Mono', monospace"
  },
  sourcecodepro: {
    name: "Source Code Pro",
    value: "'Source Code Pro', monospace"
  },
  ibmplex: {
    name: "IBM Plex Mono",
    value: "'IBM Plex Mono', monospace"
  },
  // Serif
  merriweather: {
    name: "Merriweather",
    value: "'Merriweather', serif"
  },
  lora: {
    name: "Lora",
    value: "'Lora', serif"
  }
};

const DEFAULT_SETTINGS = {
  theme: "ocean",
  customTheme: {
    bg: "#ffffff",
    bgAlt: "#f4f6fb",
    text: "#1c1c1c",
    link: "#2b6cb0",
    border: "#000000",
    headerBg: "#ffffff",
    thBg: "#e8e8e8",
    iconColor: "#2b6cb0"
  },
  fontFamily: "montserrat",
  fontSize: 1.05,
  iconStyle: "icons",
  savedCustomThemes: {},
  disabledTabs: []
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { THEMES, FONTS, DEFAULT_SETTINGS };
}
