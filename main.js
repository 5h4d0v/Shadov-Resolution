const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const display = require("./native/build/Release/display.node");

// 🔹 Folder userData (działa w dev i w release)
const appDataDir = app.getPath("userData");
const profilesPath = path.join(appDataDir, "profiles.json");
const logPath = path.join(appDataDir, "logs.txt");

// ==================== LOGGER ====================
function log(message) {
  const time = new Date().toISOString().replace("T", " ").replace("Z", "");
  const entry = `[${time}] ${message}\n`;

  try {
    fs.appendFileSync(logPath, entry);
  } catch (err) {
    console.error("Failed to write log:", err);
  }
  console.log(entry.trim());
}

// ==================== WINDOW ====================
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#0d0d0d",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("renderer/index.html");

  ipcMain.on("window-minimize", () => {
    log("Window minimized");
    win.minimize();
  });

  ipcMain.on("window-close", () => {
    log("Window closed");
    win.close();
  });

  log("Main window created");
}

// ==================== DISPLAY CONTROL ====================
ipcMain.handle("set-resolution", async (event, width, height, freq) => {
  log(`Setting resolution to ${width}x${height}@${freq}Hz`);
  try {
    const ok = display.setResolution(width, height, freq);
    log(ok ? "Resolution successfully changed" : "Resolution change failed");
    return ok;
  } catch (err) {
    log(`Error while setting resolution: ${err.message}`);
    return false;
  }
});

// ==================== PROFILE MANAGEMENT ====================
function readProfiles() {
  try {
    if (!fs.existsSync(profilesPath)) return [];
    const data = fs.readFileSync(profilesPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    log(`Error reading profiles: ${err.message}`);
    return [];
  }
}

function writeProfiles(profiles) {
  try {
    fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
    log("Profiles saved successfully");
  } catch (err) {
    log(`Error writing profiles: ${err.message}`);
  }
}

ipcMain.handle("get-profiles", async () => {
  const profiles = readProfiles();
  log(`Loaded ${profiles.length} profiles`);
  return profiles;
});

ipcMain.handle("save-profile", async (event, name, width, height, freq) => {
  log(`Saving profile "${name}" (${width}x${height}@${freq}Hz)`);
  const profiles = readProfiles();

  const existing = profiles.find((p) => p.name === name);
  if (existing) {
    existing.width = width;
    existing.height = height;
    existing.freq = freq;
    log(`Updated existing profile "${name}"`);
  } else {
    profiles.push({ name, width, height, freq });
    log(`Created new profile "${name}"`);
  }

  writeProfiles(profiles);
  return profiles;
});

ipcMain.handle("delete-profile", async (event, name) => {
  log(`Deleting profile "${name}"`);
  const profiles = readProfiles().filter((p) => p.name !== name);
  writeProfiles(profiles);
  return profiles;
});

// ==================== APP INIT ====================
app.whenReady().then(() => {
  log("App starting...");
  createWindow();
  log(`Data directory: ${appDataDir}`);
});
