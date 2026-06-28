const themeConfig = (() => {
  const bw = "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist";
  return {
    brite:     { css: `${bw}/brite/bootstrap.min.css`,     bsTheme: "light" },
    cerulean:  { css: `${bw}/cerulean/bootstrap.min.css`,   bsTheme: "light" },
    cosmo:     { css: `${bw}/cosmo/bootstrap.min.css`,      bsTheme: "light" },
    cyborg:    { css: `${bw}/cyborg/bootstrap.min.css`,     bsTheme: "dark" },
    darkly:    { css: `${bw}/darkly/bootstrap.min.css`,     bsTheme: "dark" },
    flatly:    { css: `${bw}/flatly/bootstrap.min.css`,     bsTheme: "light" },
    journal:   { css: `${bw}/journal/bootstrap.min.css`,    bsTheme: "light" },
    litera:    { css: `${bw}/litera/bootstrap.min.css`,     bsTheme: "light" },
    lumen:     { css: `${bw}/lumen/bootstrap.min.css`,      bsTheme: "light" },
    lux:       { css: `${bw}/lux/bootstrap.min.css`,        bsTheme: "light" },
    materia:   { css: `${bw}/materia/bootstrap.min.css`,    bsTheme: "light" },
    minty:     { css: `${bw}/minty/bootstrap.min.css`,      bsTheme: "light" },
    morph:     { css: `${bw}/morph/bootstrap.min.css`,      bsTheme: "light" },
    pulse:     { css: `${bw}/pulse/bootstrap.min.css`,      bsTheme: "light" },
    quartz:    { css: `${bw}/quartz/bootstrap.min.css`,     bsTheme: "light" },
    sandstone: { css: `${bw}/sandstone/bootstrap.min.css`,  bsTheme: "light" },
    simplex:   { css: `${bw}/simplex/bootstrap.min.css`,    bsTheme: "light" },
    sketchy:   { css: `${bw}/sketchy/bootstrap.min.css`,    bsTheme: "light" },
    slate:     { css: `${bw}/slate/bootstrap.min.css`,      bsTheme: "dark" },
    solar:     { css: `${bw}/solar/bootstrap.min.css`,       bsTheme: "dark" },
    spacelab:  { css: `${bw}/spacelab/bootstrap.min.css`,   bsTheme: "light" },
    superhero: { css: `${bw}/superhero/bootstrap.min.css`,  bsTheme: "dark" },
    united:    { css: `${bw}/united/bootstrap.min.css`,     bsTheme: "light" },
    vapor:     { css: `${bw}/vapor/bootstrap.min.css`,      bsTheme: "dark" },
    yeti:      { css: `${bw}/yeti/bootstrap.min.css`,       bsTheme: "light" },
    zephyr:    { css: `${bw}/zephyr/bootstrap.min.css`,     bsTheme: "light" }
  };
})();

function applyTheme(name) {
  const config = themeConfig[name] || themeConfig.solar;
  const link = document.getElementById("bootstrap-theme-css");
  if (link) {
    link.onerror = () => {
      if (name !== "solar") applyTheme("solar");
    };
    link.href = config.css;
  }
  document.documentElement.setAttribute("data-bs-theme", config.bsTheme);
  localStorage.setItem("ffox_theme", name);
}

function changeTheme(name) {
  applyTheme(name);
}

function changePieceStyle(symbol, style) {
  localStorage.setItem("ffox_" + symbol + "PieceStyle", style);
  refreshPieces();
}

function openSettings() {
  document.getElementById("mainContent").classList.add("d-none");
  document.getElementById("settingsPage").classList.remove("d-none");

  const savedTheme = localStorage.getItem("ffox_theme") || "solar";
  const themeSel = document.getElementById("themeSelector");
  if (themeSel) themeSel.value = savedTheme;

  ["x", "o"].forEach(s => {
    const el = document.getElementById(s + "Name");
    if (el) el.value = localStorage.getItem("ffox_" + s + "Name") || (s === "x" ? "Xander" : "Oliver");
    const styleSel = document.getElementById(s + "PieceStyle");
    if (styleSel) styleSel.value = localStorage.getItem("ffox_" + s + "PieceStyle") || "classic";
  });

  try {
    const qrContainer = document.getElementById("shareQrCode");
    if (qrContainer && typeof QRCode !== "undefined") {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: "https://ownimage.github.io/FreeFormOX",
        width: 120,
        height: 120,
        margin: 8
      });
    }
  } catch (_) {}
}

function swapPlayers() {
  const xInput = document.getElementById("xName");
  const oInput = document.getElementById("oName");

  const xName = xInput ? xInput.value : "";
  const oName = oInput ? oInput.value : "";

  localStorage.setItem("ffox_xName", oName);
  localStorage.setItem("ffox_oName", xName);

  if (xInput) xInput.value = oName || "Xander";
  if (oInput) oInput.value = xName || "Oliver";

  const xStyle = localStorage.getItem("ffox_xPieceStyle") || "classic";
  const oStyle = localStorage.getItem("ffox_oPieceStyle") || "classic";
  localStorage.setItem("ffox_xPieceStyle", oStyle);
  localStorage.setItem("ffox_oPieceStyle", xStyle);

  const xStyleSel = document.getElementById("xPieceStyle");
  const oStyleSel = document.getElementById("oPieceStyle");
  if (xStyleSel) xStyleSel.value = oStyle;
  if (oStyleSel) oStyleSel.value = xStyle;

  refreshPieces();
}

function saveName(symbol, value) {
  localStorage.setItem("ffox_" + symbol + "Name", value);
}

function closeSettings() {
  document.getElementById("settingsPage").classList.add("d-none");
  document.getElementById("mainContent").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("buildNumber").textContent = BUILD_NUMBER;

  const savedTheme = localStorage.getItem("ffox_theme") || "solar";
  applyTheme(savedTheme);

});
