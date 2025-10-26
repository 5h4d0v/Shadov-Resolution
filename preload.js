const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  setResolution: (w, h, f) => ipcRenderer.invoke("set-resolution", w, h, f),
  getProfiles: () => ipcRenderer.invoke("get-profiles"),
  saveProfile: (name, w, h, f) =>
    ipcRenderer.invoke("save-profile", name, w, h, f),
  deleteProfile: (name) => ipcRenderer.invoke("delete-profile", name),
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  closeWindow: () => ipcRenderer.send("window-close"),
});
