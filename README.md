# Shadov Resolution

A modern desktop application for changing display resolution and refresh rate with quick profiles and native Windows integration.  
Built using Electron and a C++ addon for full system-level control.

---

## Features

- Change screen resolution and refresh rate instantly  
- Save and manage custom resolution profiles  
- Apply profiles directly without manual input  
- Custom dark UI consistent with other Shadov tools  
- Electron + C++ bridge for native performance and reliability  

---

## Tech Stack

- **Electron** — application framework  
- **HTML / CSS / JavaScript** — frontend  
- **Node-Addon-API / C++** — native backend  
- **electron-builder** — packaging and Windows installer  

---

## Installation

### Windows

1. Go to the [Releases](../../releases) section  
2. Download `Shadov Resolution Setup.exe`  
3. Run the installer  
4. Start the application from the desktop or Start Menu  

No Node.js or external dependencies are required. Everything is packaged inside the installer.

---

## Development

Clone the repository and build locally:

```
git clone https://github.com/5h4d0v/ShadovResolution.git
cd ShadovResolution
npm install
npm run build-addon
npm start
```

To create your own installer:

```
npm run dist
```

---

## About

Created by **5had0v**  
Designed for simplicity, performance, and consistency across all Shadov software.

---

## Preview

<img width="896" height="591" alt="image" src="https://github.com/user-attachments/assets/6cbf6280-4eb3-44bb-b17a-eac878d121db" />

---

## License

MIT License
