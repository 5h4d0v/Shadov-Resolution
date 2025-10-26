const applyButton = document.getElementById("apply");
const profileSelect = document.getElementById("profiles");
const saveButton = document.getElementById("saveProfile");
const loadButton = document.getElementById("loadProfile");
const deleteButton = document.getElementById("deleteProfile");

async function loadProfiles() {
  const profiles = await window.api.getProfiles();
  profileSelect.innerHTML = "";
  profiles.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = `${p.name} (${p.width}x${p.height}@${p.freq}Hz)`;
    profileSelect.appendChild(opt);
  });
}

async function applyResolution(width, height, freq) {
  await window.api.setResolution(width, height, freq);
}

applyButton.addEventListener("click", async () => {
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const freq = parseInt(document.getElementById("freq").value);

  if (!width || !height || !freq) return;

  await applyResolution(width, height, freq);
});

saveButton.addEventListener("click", async () => {
  const name = document.getElementById("profileName").value.trim();
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const freq = parseInt(document.getElementById("freq").value);

  if (!name) return;

  await window.api.saveProfile(name, width, height, freq);
  await loadProfiles();
});

loadButton.addEventListener("click", async () => {
  const selected = profileSelect.value;
  if (!selected) return;

  const profiles = await window.api.getProfiles();
  const p = profiles.find((x) => x.name === selected);
  if (!p) return;

  await applyResolution(p.width, p.height, p.freq);
});

deleteButton.addEventListener("click", async () => {
  const selected = profileSelect.value;
  if (!selected) return;

  await window.api.deleteProfile(selected);
  await loadProfiles();
});

window.addEventListener("DOMContentLoaded", loadProfiles);

/* === Window Controls (keep them working) === */
const minimizeBtn = document.getElementById("minimize");
const closeBtn = document.getElementById("close");

if (minimizeBtn && closeBtn) {
  minimizeBtn.addEventListener("click", () => {
    window.api.minimizeWindow();
  });

  closeBtn.addEventListener("click", () => {
    window.api.closeWindow();
  });
}
