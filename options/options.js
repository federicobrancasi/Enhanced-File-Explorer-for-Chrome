"use strict";

// THEMES and FONTS are loaded from themes.js via script tag

const elements = {};
let savedCustomThemes = {};

async function init() {
  cacheElements();
  await loadSettings();
  setupEventListeners();
}

function cacheElements() {
  elements.themeGallery = document.getElementById("theme-gallery");
  elements.fontFamily = document.getElementById("font-family");
  elements.fontSize = document.getElementById("font-size");
  elements.fontSizeValue = document.getElementById("font-size-value");
  elements.iconStyle = document.getElementById("icon-style");
  elements.saveToast = document.getElementById("save-toast");
  elements.applyCustomTheme = document.getElementById("apply-custom-theme");
  elements.customThemeName = document.getElementById("custom-theme-name");

  elements.customBg = document.getElementById("custom-bg");
  elements.customBgText = document.getElementById("custom-bg-text");
  elements.customBgAlt = document.getElementById("custom-bgAlt");
  elements.customBgAltText = document.getElementById("custom-bgAlt-text");
  elements.customText = document.getElementById("custom-text");
  elements.customTextText = document.getElementById("custom-text-text");
  elements.customLink = document.getElementById("custom-link");
  elements.customLinkText = document.getElementById("custom-link-text");
  elements.customBorder = document.getElementById("custom-border");
  elements.customBorderText = document.getElementById("custom-border-text");
  elements.customIconColor = document.getElementById("custom-iconColor");
  elements.customIconColorText = document.getElementById("custom-iconColor-text");

  elements.previewContainer = document.getElementById("preview-container");
  elements.previewHeader = document.getElementById("preview-header");
  elements.previewRow1 = document.getElementById("preview-row-1");
  elements.previewRow2 = document.getElementById("preview-row-2");
  elements.previewLink = document.getElementById("preview-link");
}

async function buildThemeGallery(currentTheme) {
  elements.themeGallery.innerHTML = "";

  // Add preset themes
  Object.entries(THEMES).forEach(([key, theme]) => {
    const tile = createThemeTile(key, theme, false);
    tile.addEventListener("click", () => selectTheme(key));
    elements.themeGallery.appendChild(tile);
  });

  // Add saved custom themes
  Object.entries(savedCustomThemes).forEach(([key, theme]) => {
    const tile = createThemeTile(key, theme, true);
    tile.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-theme")) {
        selectSavedCustomTheme(key);
      }
    });
    elements.themeGallery.appendChild(tile);
  });

  highlightSelectedTheme(currentTheme);
}

function createThemeTile(key, theme, isCustom) {
  const tile = document.createElement("div");
  tile.className = "theme-tile" + (isCustom ? " custom-theme-tile" : "");
  tile.dataset.theme = key;

  let deleteBtn = "";
  if (isCustom) {
    deleteBtn = `<button class="delete-theme" data-key="${key}" title="Delete theme">×</button>`;
  }

  tile.innerHTML = `
    <div class="tile-preview" style="background: ${theme.bg}">
      <div class="tile-header" style="background: ${theme.border}"></div>
      <div class="tile-row" style="background: ${theme.bgAlt}"></div>
      <div class="tile-link" style="color: ${theme.link}">Link</div>
    </div>
    <span class="tile-name">${theme.name}</span>
    ${deleteBtn}
  `;

  if (isCustom) {
    const deleteButton = tile.querySelector(".delete-theme");
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCustomTheme(key);
    });
  }

  return tile;
}

function setupEventListeners() {
  elements.fontFamily.addEventListener("change", handleFontFamilyChange);
  elements.fontSize.addEventListener("input", handleFontSizeChange);
  elements.iconStyle.addEventListener("change", handleIconStyleChange);
  elements.applyCustomTheme.addEventListener("click", handleApplyCustomTheme);

  const colorInputs = ["Bg", "BgAlt", "Text", "Link", "Border", "IconColor"];
  colorInputs.forEach((name) => {
    const colorInput = elements[`custom${name}`];
    const textInput = elements[`custom${name}Text`];

    colorInput.addEventListener("input", () => {
      textInput.value = colorInput.value;
      updatePreviewFromCustom();
    });

    textInput.addEventListener("input", () => {
      if (/^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
        colorInput.value = textInput.value;
        updatePreviewFromCustom();
      }
    });
  });
}

async function loadSettings() {
  const settings = await chrome.storage.local.get(null);

  const theme = settings.theme || "ocean";
  savedCustomThemes = settings.savedCustomThemes || {};

  elements.fontFamily.value = settings.fontFamily || "montserrat";
  elements.fontSize.value = settings.fontSize || 1.05;
  elements.fontSizeValue.textContent = settings.fontSize || 1.05;
  elements.iconStyle.value = settings.iconStyle || "icons";

  await buildThemeGallery(theme);

  // Apply icon style to preview
  updatePreviewIconStyle(settings.iconStyle || "icons");

  if (theme === "custom" && settings.customTheme) {
    loadCustomThemeValues(settings.customTheme);
    updatePreviewFromCustom();
  } else if (theme.startsWith("custom_") && savedCustomThemes[theme]) {
    loadCustomThemeValues(savedCustomThemes[theme]);
    updatePreview(savedCustomThemes[theme], settings.fontFamily, settings.fontSize);
  } else if (THEMES[theme]) {
    updatePreview(THEMES[theme], settings.fontFamily, settings.fontSize);
  }
}

function loadCustomThemeValues(customTheme) {
  elements.customBg.value = customTheme.bg;
  elements.customBgText.value = customTheme.bg;
  elements.customBgAlt.value = customTheme.bgAlt;
  elements.customBgAltText.value = customTheme.bgAlt;
  elements.customText.value = customTheme.text;
  elements.customTextText.value = customTheme.text;
  elements.customLink.value = customTheme.link;
  elements.customLinkText.value = customTheme.link;
  elements.customBorder.value = customTheme.border;
  elements.customBorderText.value = customTheme.border;
  elements.customIconColor.value = customTheme.iconColor || "#2b6cb0";
  elements.customIconColorText.value = customTheme.iconColor || "#2b6cb0";
}

function highlightSelectedTheme(themeName) {
  document.querySelectorAll(".theme-tile").forEach((tile) => {
    tile.classList.toggle("selected", tile.dataset.theme === themeName);
  });
}

async function selectTheme(themeName) {
  await chrome.storage.local.set({ theme: themeName });
  highlightSelectedTheme(themeName);

  const { fontFamily, fontSize } = await chrome.storage.local.get(["fontFamily", "fontSize"]);
  updatePreview(THEMES[themeName], fontFamily, fontSize);
  showSaveToast();
}

async function selectSavedCustomTheme(themeKey) {
  await chrome.storage.local.set({ theme: themeKey });
  highlightSelectedTheme(themeKey);

  const theme = savedCustomThemes[themeKey];
  const { fontFamily, fontSize } = await chrome.storage.local.get(["fontFamily", "fontSize"]);
  updatePreview(theme, fontFamily, fontSize);
  loadCustomThemeValues(theme);
  showSaveToast();
}

async function deleteCustomTheme(themeKey) {
  delete savedCustomThemes[themeKey];
  await chrome.storage.local.set({ savedCustomThemes });

  const settings = await chrome.storage.local.get(["theme"]);
  if (settings.theme === themeKey) {
    await chrome.storage.local.set({ theme: "ocean" });
  }

  await buildThemeGallery(settings.theme === themeKey ? "ocean" : settings.theme);
  showSaveToast();
}

function updatePreview(theme, fontFamily, fontSize) {
  if (!theme) return;

  const font = FONTS[fontFamily || "montserrat"]?.value || FONTS.montserrat.value;
  const size = (fontSize || 1.05) + "em";

  elements.previewContainer.style.background = theme.bg;
  elements.previewContainer.style.fontFamily = font;
  elements.previewContainer.style.fontSize = size;
  elements.previewContainer.style.color = theme.text;

  elements.previewHeader.style.background = theme.headerBg || theme.bgAlt;
  elements.previewHeader.style.borderColor = theme.border;
  elements.previewHeader.style.color = theme.text;

  elements.previewRow1.style.background = theme.bg;
  elements.previewRow2.style.background = theme.bgAlt;

  document.querySelectorAll(".preview-link").forEach((link) => {
    link.style.color = theme.link;
  });

  document.querySelectorAll(".preview-th").forEach((th) => {
    th.style.background = theme.thBg || theme.bgAlt;
    th.style.borderColor = theme.border;
  });

  // Update preview icons color
  const isDark = isColorDark(theme.bg);
  const iconColor = theme.iconColor || (isDark ? "#e0e0e0" : "#2b6cb0");
  updatePreviewIconColor(iconColor);
}

function isColorDark(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

function updatePreviewFromCustom() {
  const customTheme = {
    bg: elements.customBg.value,
    bgAlt: elements.customBgAlt.value,
    text: elements.customText.value,
    link: elements.customLink.value,
    border: elements.customBorder.value,
    headerBg: elements.customBgAlt.value,
    thBg: elements.customBgAlt.value,
    iconColor: elements.customIconColor.value
  };

  chrome.storage.local.get(["fontFamily", "fontSize"]).then(({ fontFamily, fontSize }) => {
    updatePreview(customTheme, fontFamily, fontSize);
  });
}

async function handleApplyCustomTheme() {
  // Generate unique ID
  const existingIds = Object.keys(savedCustomThemes).map(k => parseInt(k.replace("custom_", "")) || 0);
  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  const themeKey = `custom_${nextId}`;

  // Get theme name or generate default
  const themeName = elements.customThemeName.value.trim() || `My Theme #${nextId}`;

  const customTheme = {
    name: themeName,
    bg: elements.customBg.value,
    bgAlt: elements.customBgAlt.value,
    text: elements.customText.value,
    link: elements.customLink.value,
    border: elements.customBorder.value,
    headerBg: elements.customBgAlt.value,
    thBg: elements.customBgAlt.value,
    iconColor: elements.customIconColor.value
  };

  // Save to savedCustomThemes
  savedCustomThemes[themeKey] = customTheme;

  await chrome.storage.local.set({
    theme: themeKey,
    savedCustomThemes: savedCustomThemes
  });

  // Clear the name input for next theme
  elements.customThemeName.value = "";

  // Rebuild gallery and highlight new theme
  await buildThemeGallery(themeKey);
  showSaveToast();
}

async function handleFontFamilyChange() {
  const fontFamily = elements.fontFamily.value;
  await chrome.storage.local.set({ fontFamily });

  const settings = await chrome.storage.local.get(["theme", "customTheme", "savedCustomThemes", "fontSize"]);
  let theme;
  if (settings.theme === "custom") {
    theme = settings.customTheme;
  } else if (settings.theme.startsWith("custom_") && settings.savedCustomThemes?.[settings.theme]) {
    theme = settings.savedCustomThemes[settings.theme];
  } else {
    theme = THEMES[settings.theme];
  }
  updatePreview(theme, fontFamily, settings.fontSize);
  showSaveToast();
}

async function handleFontSizeChange() {
  const fontSize = parseFloat(elements.fontSize.value);
  elements.fontSizeValue.textContent = fontSize.toFixed(2);
  await chrome.storage.local.set({ fontSize });

  const settings = await chrome.storage.local.get(["theme", "customTheme", "savedCustomThemes", "fontFamily"]);
  let theme;
  if (settings.theme === "custom") {
    theme = settings.customTheme;
  } else if (settings.theme.startsWith("custom_") && settings.savedCustomThemes?.[settings.theme]) {
    theme = settings.savedCustomThemes[settings.theme];
  } else {
    theme = THEMES[settings.theme];
  }
  updatePreview(theme, settings.fontFamily, fontSize);
  showSaveToast();
}

async function handleIconStyleChange() {
  const iconStyle = elements.iconStyle.value;
  await chrome.storage.local.set({ iconStyle });
  updatePreviewIconStyle(iconStyle);
  showSaveToast();
}

function updatePreviewIconStyle(iconStyle) {
  if (iconStyle === "emojis") {
    elements.previewContainer.classList.add("emoji-mode");
  } else {
    elements.previewContainer.classList.remove("emoji-mode");
  }
}

function updatePreviewIconColor(iconColor) {
  const encodedColor = (iconColor || "#2b6cb0").replace("#", "%23");

  const folderSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/%3E%3C/svg%3E")`;
  const fileSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodedColor}'%3E%3Cpath d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z'/%3E%3C/svg%3E")`;

  document.querySelectorAll(".preview-folder").forEach(el => {
    el.style.backgroundImage = folderSvg;
  });
  document.querySelectorAll(".preview-file").forEach(el => {
    el.style.backgroundImage = fileSvg;
  });
}

function showSaveToast() {
  elements.saveToast.classList.add("visible");
  setTimeout(() => {
    elements.saveToast.classList.remove("visible");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", init);
