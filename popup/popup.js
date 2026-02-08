"use strict";

const THEMES = {
  light: { name: "Light", bg: "#ffffff", bgAlt: "#f4f6fb", text: "#1c1c1c", link: "#1c1c1c", border: "#000000" },
  ocean: { name: "Ocean", bg: "#f0f8ff", bgAlt: "#e6f2ff", text: "#1a365d", link: "#2b6cb0", border: "#2b6cb0" },
  dark: { name: "Dark", bg: "#1a1a2e", bgAlt: "#16213e", text: "#e0e0e0", link: "#7ec8e3", border: "#4a4a6a" },
  midnight: { name: "Midnight", bg: "#0d1117", bgAlt: "#161b22", text: "#c9d1d9", link: "#58a6ff", border: "#30363d" },
  forest: { name: "Forest", bg: "#f0fff4", bgAlt: "#c6f6d5", text: "#22543d", link: "#276749", border: "#2f855a" },
  sunset: { name: "Sunset", bg: "#fffaf0", bgAlt: "#feebc8", text: "#744210", link: "#c05621", border: "#dd6b20" },
  lavender: { name: "Lavender", bg: "#faf5ff", bgAlt: "#e9d8fd", text: "#44337a", link: "#6b46c1", border: "#805ad5" },
  rose: { name: "Rose", bg: "#fff5f7", bgAlt: "#fed7e2", text: "#702459", link: "#b83280", border: "#d53f8c" },
  sepia: { name: "Sepia", bg: "#fdf6e3", bgAlt: "#eee8d5", text: "#657b83", link: "#268bd2", border: "#93a1a1" },
  nord: { name: "Nord", bg: "#eceff4", bgAlt: "#e5e9f0", text: "#2e3440", link: "#5e81ac", border: "#4c566a" },
  contrast: { name: "High Contrast", bg: "#000000", bgAlt: "#1a1a1a", text: "#ffffff", link: "#00ff00", border: "#ffffff" }
};

const elements = {
  toggle: null,
  toggleSection: null,
  toggleText: null,
  statusSection: null,
  statusIcon: null,
  statusText: null,
  themeSelect: null,
  settingsLink: null,
  previewBg: null,
  previewHeader: null,
  previewRow: null,
  previewLink: null
};

let currentTab = null;

async function init() {
  cacheElements();
  setupEventListeners();
  await loadCurrentTab();
  await updateUI();
}

function cacheElements() {
  elements.toggle = document.getElementById("disable-toggle");
  elements.toggleSection = document.getElementById("toggle-section");
  elements.toggleText = document.getElementById("toggle-text");
  elements.statusSection = document.getElementById("status-section");
  elements.statusIcon = document.getElementById("status-icon");
  elements.statusText = document.getElementById("status-text");
  elements.themeSelect = document.getElementById("theme-select");
  elements.settingsLink = document.getElementById("settings-link");
  elements.previewBg = document.getElementById("preview-bg");
  elements.previewHeader = document.getElementById("preview-header");
  elements.previewRow = document.getElementById("preview-row");
  elements.previewLink = document.getElementById("preview-link");
}

function setupEventListeners() {
  elements.toggle.addEventListener("change", handleToggleChange);
  elements.themeSelect.addEventListener("change", handleThemeChange);
  elements.settingsLink.addEventListener("click", handleSettingsClick);
}

async function loadCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
}

async function updateUI() {
  const isFileUrl = currentTab?.url?.startsWith("file://");
  const isMdFile = currentTab?.url?.match(/\.(md|markdown)$/i);

  if (!isFileUrl) {
    showNotFilePage();
    return;
  }

  if (isMdFile) {
    showMdFilePage();
    return;
  }

  showFilePage();
  await loadToggleState();
  await loadThemeState();
}

function showNotFilePage() {
  elements.statusIcon.textContent = "🌐";
  elements.statusText.textContent = "Not a file:// page";
  elements.toggleSection.style.display = "none";
}

function showMdFilePage() {
  elements.statusIcon.textContent = "📝";
  elements.statusText.textContent = "Markdown file (excluded)";
  elements.toggleSection.style.display = "none";
}

function showFilePage() {
  elements.statusIcon.textContent = "✨";
  elements.statusText.textContent = "Enhanced";
  elements.toggleSection.style.display = "flex";
}

async function loadToggleState() {
  const response = await chrome.runtime.sendMessage({
    action: "getTabState",
    tabId: currentTab.id
  });

  elements.toggle.checked = response.isDisabled;
  updateStatusForToggle(response.isDisabled);
}

async function loadThemeState() {
  const { theme = "ocean" } = await chrome.storage.local.get("theme");
  elements.themeSelect.value = theme;
  updateThemePreview(theme);
}

function updateStatusForToggle(isDisabled) {
  if (isDisabled) {
    elements.statusIcon.textContent = "⏸️";
    elements.statusText.textContent = "Disabled on this page";
    elements.toggleText.textContent = "Disabled";
  } else {
    elements.statusIcon.textContent = "✨";
    elements.statusText.textContent = "Enhanced";
    elements.toggleText.textContent = "Disable on this page";
  }
}

function updateThemePreview(themeName) {
  const theme = THEMES[themeName];
  if (!theme) {
    return;
  }

  elements.previewBg.style.background = theme.bg;
  elements.previewHeader.style.background = theme.border;
  elements.previewRow.style.background = theme.bgAlt;
  elements.previewLink.style.color = theme.link;
}

async function handleToggleChange() {
  const isDisabled = elements.toggle.checked;

  if (isDisabled) {
    await chrome.runtime.sendMessage({
      action: "disableForTab",
      tabId: currentTab.id
    });
  } else {
    await chrome.runtime.sendMessage({
      action: "enableForTab",
      tabId: currentTab.id
    });
  }

  window.close();
}

async function handleThemeChange() {
  const theme = elements.themeSelect.value;

  if (theme === "custom") {
    chrome.runtime.openOptionsPage();
    return;
  }

  await chrome.storage.local.set({ theme });
  updateThemePreview(theme);
}

function handleSettingsClick(event) {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
}

document.addEventListener("DOMContentLoaded", init);
