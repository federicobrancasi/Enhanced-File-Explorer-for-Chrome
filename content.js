"use strict";

const CONFIG = {
  MAX_HEADER_LENGTH: 65,
  MAX_LINK_LENGTH: 60,
  FALLBACK_HEADER: "~"
};

function loadGoogleFonts() {
  if (document.getElementById("fe-google-fonts")) return;

  const link = document.createElement("link");
  link.id = "fe-google-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Lato:wght@400;700&family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Source+Code+Pro:wght@400;500&family=Source+Sans+3:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

function enhanceHeader() {
  const header = document.getElementById("header");
  if (!header) {
    return;
  }

  header.textContent = header.textContent.trim();

  if (header.textContent === "") {
    header.textContent = CONFIG.FALLBACK_HEADER;
  }

  header.style.width = "100%";
  header.textContent = truncateText(header.textContent, CONFIG.MAX_HEADER_LENGTH);
}

function enhanceLinks() {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.textContent = truncateText(link.textContent, CONFIG.MAX_LINK_LENGTH);
  });
}

function applyTheme(settings) {
  const root = document.documentElement;
  let theme;

  if (settings.theme === "custom" && settings.customTheme) {
    theme = settings.customTheme;
  } else if (settings.theme && settings.theme.startsWith("custom_") && settings.savedCustomThemes && settings.savedCustomThemes[settings.theme]) {
    theme = settings.savedCustomThemes[settings.theme];
  } else if (typeof THEMES !== "undefined" && THEMES[settings.theme]) {
    theme = THEMES[settings.theme];
  } else {
    return;
  }

  root.style.setProperty("--bg-primary", theme.bg);
  root.style.setProperty("--bg-secondary", theme.bgAlt);
  root.style.setProperty("--text-primary", theme.text);
  root.style.setProperty("--text-link", theme.link);
  root.style.setProperty("--border-color", theme.border);
  root.style.setProperty("--header-bg", theme.headerBg || theme.bgAlt);
  root.style.setProperty("--th-bg", theme.thBg || theme.bgAlt);

  const isDark = isColorDark(theme.bg);
  root.style.setProperty("--text-hover", isDark ? lightenColor(theme.link) : darkenColor(theme.link));

  // Set icon colors based on theme brightness or custom icon color
  const iconColor = theme.iconColor || (isDark ? "#e0e0e0" : "#2b6cb0");
  const encodedColor = iconColor.replace("#", "%23");

  root.style.setProperty("--folder-icon", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/%3E%3C/svg%3E")`);
  root.style.setProperty("--file-icon", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z'/%3E%3C/svg%3E")`);

  // Parent icon has white arrow on light bg, dark arrow on dark bg
  const arrowColor = isDark ? "%23333333" : "%23ffffff";
  root.style.setProperty("--parent-icon", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/%3E%3Cpath d='M12 10l4 4h-3v4h-2v-4H8l4-4z' fill='${arrowColor}'/%3E%3C/svg%3E")`);

  updateToolbarTheme(isDark);
}

function applyFont(settings) {
  const root = document.documentElement;

  if (typeof FONTS !== "undefined" && FONTS[settings.fontFamily]) {
    root.style.setProperty("--font-family", FONTS[settings.fontFamily].value);
  }

  if (settings.fontSize) {
    root.style.setProperty("--font-size", settings.fontSize + "em");
  }
}

function isColorDark(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

function darkenColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lightenColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 40);
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 40);
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 40);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function markAsEnhanced() {
  document.body.dataset.fileExplorerEnhanced = "true";
}

function isAlreadyEnhanced() {
  return document.body.dataset.fileExplorerEnhanced === "true";
}

async function loadSettings() {
  try {
    const result = await chrome.storage.local.get(null);
    return {
      theme: result.theme || "ocean",
      customTheme: result.customTheme || null,
      savedCustomThemes: result.savedCustomThemes || {},
      fontFamily: result.fontFamily || "montserrat",
      fontSize: result.fontSize || 1.05,
      iconStyle: result.iconStyle || "icons",
      disabledTabs: result.disabledTabs || []
    };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return {
      theme: "ocean",
      customTheme: null,
      savedCustomThemes: {},
      fontFamily: "montserrat",
      fontSize: 1.05,
      iconStyle: "icons",
      disabledTabs: []
    };
  }
}

function applyIconStyle(iconStyle) {
  if (iconStyle === "emojis") {
    document.body.classList.add("emoji-icons");
  } else {
    document.body.classList.remove("emoji-icons");
  }
}

function updateToolbarTheme(isDark) {
  const toolbar = document.getElementById("fe-toolbar");
  if (toolbar) {
    toolbar.classList.toggle("fe-toolbar-dark", isDark);
  }
}

function createSettingsToolbar(settings) {
  if (document.getElementById("fe-toolbar")) {
    return;
  }

  const toolbar = document.createElement("div");
  toolbar.id = "fe-toolbar";
  toolbar.className = "fe-toolbar";

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "fe-toolbar-toggle";
  toggleBtn.title = "Settings";

  const panel = document.createElement("div");
  panel.className = "fe-toolbar-panel";

  const themeRow = document.createElement("div");
  themeRow.className = "fe-toolbar-row";
  themeRow.innerHTML = `
    <label>Theme</label>
    <select id="fe-theme-select">
      <option value="light">Light</option>
      <option value="ocean">Ocean</option>
      <option value="dark">Dark</option>
      <option value="darkwarm">Dark Warm</option>
      <option value="darkcool">Dark Cool</option>
      <option value="blackwhite">Black & White</option>
      <option value="midnight">Midnight</option>
      <option value="forest">Forest</option>
      <option value="sunset">Sunset</option>
      <option value="lavender">Lavender</option>
      <option value="rose">Rose</option>
      <option value="sepia">Sepia</option>
      <option value="nord">Nord</option>
      <option value="contrast">High Contrast</option>
    </select>
  `;

  const fontRow = document.createElement("div");
  fontRow.className = "fe-toolbar-row";
  fontRow.innerHTML = `
    <label>Font</label>
    <select id="fe-font-select">
      <option value="system">System</option>
      <option value="montserrat">Montserrat</option>
      <option value="inter">Inter</option>
      <option value="roboto">Roboto</option>
      <option value="opensans">Open Sans</option>
      <option value="lato">Lato</option>
      <option value="poppins">Poppins</option>
      <option value="firacode">Fira Code</option>
      <option value="jetbrains">JetBrains</option>
      <option value="sourcecodepro">Source Code</option>
    </select>
  `;

  const sizeRow = document.createElement("div");
  sizeRow.className = "fe-toolbar-row";
  sizeRow.innerHTML = `
    <label>Size <span id="fe-size-value">${settings.fontSize}</span></label>
    <input type="range" id="fe-size-slider" min="0.8" max="1.5" step="0.05" value="${settings.fontSize}">
  `;

  const settingsLink = document.createElement("a");
  settingsLink.className = "fe-toolbar-link";
  settingsLink.href = "#";
  settingsLink.textContent = "All Settings";
  settingsLink.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: "openOptions" });
  });

  panel.appendChild(themeRow);
  panel.appendChild(fontRow);
  panel.appendChild(sizeRow);
  panel.appendChild(settingsLink);

  toolbar.appendChild(toggleBtn);
  toolbar.appendChild(panel);
  document.body.appendChild(toolbar);

  const themeSelect = document.getElementById("fe-theme-select");
  const fontSelect = document.getElementById("fe-font-select");
  const sizeSlider = document.getElementById("fe-size-slider");
  const sizeValue = document.getElementById("fe-size-value");

  themeSelect.value = settings.theme === "custom" ? "ocean" : settings.theme;
  fontSelect.value = settings.fontFamily;

  toggleBtn.addEventListener("click", () => {
    toolbar.classList.toggle("fe-toolbar-expanded");
  });

  themeSelect.addEventListener("change", async () => {
    await chrome.storage.local.set({ theme: themeSelect.value });
  });

  fontSelect.addEventListener("change", async () => {
    await chrome.storage.local.set({ fontFamily: fontSelect.value });
  });

  sizeSlider.addEventListener("input", async () => {
    const size = parseFloat(sizeSlider.value);
    sizeValue.textContent = size.toFixed(2);
    await chrome.storage.local.set({ fontSize: size });
  });

  const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim();
  if (bgColor) {
    updateToolbarTheme(isColorDark(bgColor));
  }
}

async function init() {
  if (isAlreadyEnhanced()) {
    return;
  }

  loadGoogleFonts();

  const settings = await loadSettings();

  applyTheme(settings);
  applyFont(settings);
  applyIconStyle(settings.iconStyle);
  enhanceHeader();
  enhanceLinks();
  createSettingsToolbar(settings);
  markAsEnhanced();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    loadSettings().then((settings) => {
      applyTheme(settings);
      applyFont(settings);
      applyIconStyle(settings.iconStyle);

      const themeSelect = document.getElementById("fe-theme-select");
      const fontSelect = document.getElementById("fe-font-select");
      const sizeSlider = document.getElementById("fe-size-slider");
      const sizeValue = document.getElementById("fe-size-value");

      if (themeSelect && settings.theme !== "custom" && !settings.theme.startsWith("custom_")) {
        themeSelect.value = settings.theme;
      }
      if (fontSelect) {
        fontSelect.value = settings.fontFamily;
      }
      if (sizeSlider && sizeValue) {
        sizeSlider.value = settings.fontSize;
        sizeValue.textContent = settings.fontSize.toFixed(2);
      }
    });
  }
});
