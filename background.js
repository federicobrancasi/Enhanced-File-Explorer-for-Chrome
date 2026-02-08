"use strict";

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

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(null);
  if (!existing.theme) {
    await chrome.storage.local.set(DEFAULT_SETTINGS);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { disabledTabs = [] } = await chrome.storage.local.get("disabledTabs");
  const updated = disabledTabs.filter((id) => id !== tabId);
  if (updated.length !== disabledTabs.length) {
    await chrome.storage.local.set({ disabledTabs: updated });
  }
});

async function getTabState(tabId) {
  const { disabledTabs = [] } = await chrome.storage.local.get("disabledTabs");
  return { isDisabled: disabledTabs.includes(tabId) };
}

async function disableForTab(tabId) {
  const { disabledTabs = [] } = await chrome.storage.local.get("disabledTabs");
  if (!disabledTabs.includes(tabId)) {
    disabledTabs.push(tabId);
    await chrome.storage.local.set({ disabledTabs });
  }
  await chrome.tabs.reload(tabId);
  return { success: true };
}

async function enableForTab(tabId) {
  const { disabledTabs = [] } = await chrome.storage.local.get("disabledTabs");
  const updated = disabledTabs.filter((id) => id !== tabId);
  await chrome.storage.local.set({ disabledTabs: updated });
  await chrome.tabs.reload(tabId);
  return { success: true };
}

async function getSettings() {
  const settings = await chrome.storage.local.get(null);
  return {
    theme: settings.theme || DEFAULT_SETTINGS.theme,
    customTheme: settings.customTheme || DEFAULT_SETTINGS.customTheme,
    fontFamily: settings.fontFamily || DEFAULT_SETTINGS.fontFamily,
    fontSize: settings.fontSize || DEFAULT_SETTINGS.fontSize
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "getTabState":
      getTabState(message.tabId).then(sendResponse);
      return true;

    case "disableForTab":
      disableForTab(message.tabId).then(sendResponse);
      return true;

    case "enableForTab":
      enableForTab(message.tabId).then(sendResponse);
      return true;

    case "getSettings":
      getSettings().then(sendResponse);
      return true;

    case "openOptions":
      chrome.runtime.openOptionsPage();
      sendResponse({ success: true });
      return false;

    default:
      sendResponse({ error: "Unknown action" });
      return false;
  }
});
