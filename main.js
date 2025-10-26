const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const display = require("./native/build/Release/display.node");

const profilesPath = path.join(__dirname, "profiles.json");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    frame: false, // 🔹 usuwa standardowy pasek Windowsa
    titleBarStyle: "hidden", // 🔹 pełna kontrola nad topbarem
    backgroundColor: "#0d0d0d",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("renderer/index.html");

  // Obsługa zamykania i minimalizowania z renderer
  const { ipcMain } = require("electron");
  ipcMain.on("window-minimize", () => win.minimize());
  ipcMain.on("window-close", () => win.close());
}

// ==================== DISPLAY CONTROL ====================
ipcMain.handle("set-resolution", async (event, width, height, freq) => {
  console.log(`Setting resolution: ${width}x${height}@${freq}Hz`);
  return display.setResolution(width, height, freq);
});

// ==================== PROFILES ====================
ipcMain.handle("get-profiles", async () => {
  if (!fs.existsSync(profilesPath)) return [];
  const data = fs.readFileSync(profilesPath, "utf-8");
  return JSON.parse(data);
});

ipcMain.handle("save-profile", async (event, name, width, height, freq) => {
  let profiles = [];
  if (fs.existsSync(profilesPath)) {
    profiles = JSON.parse(fs.readFileSync(profilesPath, "utf-8"));
  }

  const existing = profiles.find((p) => p.name === name);
  if (existing) {
    existing.width = width;
    existing.height = height;
    existing.freq = freq;
  } else {
    profiles.push({ name, width, height, freq });
  }

  fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
  return profiles;
});

ipcMain.handle("delete-profile", async (event, name) => {
  if (!fs.existsSync(profilesPath)) return [];
  let profiles = JSON.parse(fs.readFileSync(profilesPath, "utf-8"));
  profiles = profiles.filter((p) => p.name !== name);
  fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
  return profiles;
});

app.whenReady().then(createWindow);
