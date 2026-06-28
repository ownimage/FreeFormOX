let currentPlayer = "X";
let gameOver = false;

const SVG = {
  X: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><line x1="17" y1="20" x2="83" y2="80" stroke="#d63031" stroke-width="15" stroke-linecap="round"/><line x1="83" y1="20" x2="17" y2="80" stroke="#d63031" stroke-width="15" stroke-linecap="round"/></svg>',
  O: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="37" ry="35" fill="none" stroke="#0984e3" stroke-width="12"/><circle cx="33" cy="42" r="4.5" fill="#0984e3"/><circle cx="67" cy="42" r="4.5" fill="#0984e3"/><path d="M 36 58 Q 50 72 64 58" fill="none" stroke="#0984e3" stroke-width="3.5" stroke-linecap="round"/></svg>'
};

function rc(i) {
  return { row: Math.floor((i - 1) / 5), col: (i - 1) % 5 };
}

function getPieceStyle(symbol) {
  return localStorage.getItem("ffox_" + symbol.toLowerCase() + "PieceStyle") || "classic";
}

function getPieceImg(symbol, style) {
  const map = {
    dino: { X: "dino-cross.png", O: "dino-nought.png" },
    unicorn: { X: "unicorn-cross.png", O: "unicorn-nought.png" }
  };
  const file = map[style][symbol];
  return '<img class="cell-dino" src="img/' + file + '" alt="' + symbol + '">';
}

function getPieceHtml(symbol) {
  const style = getPieceStyle(symbol);
  if (style === "classic") return SVG[symbol];
  return getPieceImg(symbol, style);
}

function getPlayerName(symbol) {
  return localStorage.getItem("ffox_" + symbol.toLowerCase() + "Name") || (symbol === "X" ? "Xander" : "Oliver");
}

function getPlaced() {
  const cells = document.getElementById("buttonGrid").children;
  const placed = [];
  for (const btn of cells) {
    if (btn.className === "cell-placed" || btn.className === "cell-oob") {
      placed.push(+btn.dataset.index);
    }
  }
  return placed;
}

function fits3x3(indices) {
  const rows = indices.map(i => rc(i).row);
  const cols = indices.map(i => rc(i).col);
  return Math.max(...rows) - Math.min(...rows) <= 2 &&
         Math.max(...cols) - Math.min(...cols) <= 2;
}

function updateAvailability() {
  const cells = document.getElementById("buttonGrid").children;
  const placed = getPlaced();
  if (placed.length === 0) return;
  for (const btn of cells) {
    if (btn.disabled) continue;
    if (!fits3x3([...placed, +btn.dataset.index])) {
      btn.disabled = true;
      btn.innerHTML = "";
      btn.className = "cell-unavailable";
    }
  }
}

function buildLines() {
  const lines = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c <= 2; c++)
      lines.push([r * 5 + c + 1, r * 5 + c + 2, r * 5 + c + 3]);
  for (let c = 0; c < 5; c++)
    for (let r = 0; r <= 2; r++)
      lines.push([r * 5 + c + 1, (r + 1) * 5 + c + 1, (r + 2) * 5 + c + 1]);
  for (let r = 0; r <= 2; r++)
    for (let c = 0; c <= 2; c++)
      lines.push([r * 5 + c + 1, (r + 1) * 5 + c + 2, (r + 2) * 5 + c + 3]);
  for (let r = 0; r <= 2; r++)
    for (let c = 2; c < 5; c++)
      lines.push([r * 5 + c + 1, (r + 1) * 5 + c, (r + 2) * 5 + c - 1]);
  return lines;
}
const winLines = buildLines();

function checkWin(player) {
  const cells = document.getElementById("buttonGrid").children;
  for (const line of winLines) {
    if (line.every(i => cells[i - 1].dataset.player === player)) return line;
  }
  return null;
}

function checkDraw() {
  const cells = document.getElementById("buttonGrid").children;
  for (const btn of cells) {
    if (btn.className === "cell-available") return false;
  }
  return true;
}

function playerIcon(symbol) {
  const style = getPieceStyle(symbol);
  if (style === "classic") {
    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:1.6rem;height:1.6rem">' + SVG[symbol] + '</span>';
  }
  const map = { dino: "dino", unicorn: "unicorn" };
  const file = map[style] + "-" + (symbol === "X" ? "cross" : "nought") + ".png";
  return '<span style="display:inline-flex;align-items:center;justify-content:center;width:3rem;height:3rem"><img src="img/' + file + '" alt="' + symbol + '" style="width:100%;height:100%;object-fit:contain"></span>';
}

function refreshPieces() {
  const cells = document.getElementById("buttonGrid").children;
  for (const btn of cells) {
    if (btn.dataset.player) {
      btn.innerHTML = getPieceHtml(btn.dataset.player);
    }
  }
  if (!gameOver) {
    document.getElementById("turnIndicator").innerHTML = playerIcon(currentPlayer) + " " + getPlayerName(currentPlayer) + " to go";
  } else {
    for (const p of ["X", "O"]) {
      const w = checkWin(p);
      if (w) {
        document.getElementById("turnIndicator").innerHTML = playerIcon(p) + " " + getPlayerName(p) + " wins!";
        break;
      }
    }
  }
}

function endGame(msg, line) {
  gameOver = true;
  document.getElementById("turnIndicator").innerHTML = msg;
  document.getElementById("gameBtns").classList.remove("d-none");
  if (line) {
    const cells = document.getElementById("buttonGrid").children;
    for (const i of line) cells[i - 1].classList.add("cell-winner");
  }
}

function resetGame() {
  const cells = document.getElementById("buttonGrid").children;
  for (let i = 0; i < cells.length; i++) {
    const btn = cells[i];
    const idx = i + 1;
    btn.classList.remove("cell-winner");
    if (idx === 13) {
      btn.innerHTML = getPieceHtml("O");
      btn.dataset.player = "O";
      btn.disabled = true;
      btn.className = "cell-oob";
    } else {
      btn.innerHTML = "";
      delete btn.dataset.player;
      btn.disabled = false;
      btn.className = "cell-available";
      btn.onclick = () => handleClick(btn);
    }
  }
  document.getElementById("turnIndicator").innerHTML = playerIcon("X") + " " + getPlayerName("X") + " to go";
  document.getElementById("gameBtns").classList.add("d-none");
  currentPlayer = "X";
  gameOver = false;
}

function buildGrid() {
  const grid = document.getElementById("buttonGrid");
  for (let i = 1; i <= 25; i++) {
    const btn = document.createElement("button");
    btn.dataset.index = i;
    if (i === 13) {
      btn.innerHTML = getPieceHtml("O");
      btn.dataset.player = "O";
      btn.disabled = true;
      btn.className = "cell-oob";
    } else {
      btn.innerHTML = "";
      btn.className = "cell-available";
      btn.onclick = () => handleClick(btn);
    }
    grid.appendChild(btn);
  }
}

function handleClick(btn) {
  if (gameOver) return;
  const player = currentPlayer;
  btn.innerHTML = getPieceHtml(player);
  btn.dataset.player = player;
  btn.disabled = true;
  btn.className = "cell-placed";
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("turnIndicator").innerHTML = playerIcon(currentPlayer) + " " + getPlayerName(currentPlayer) + " to go";
  updateAvailability();
  const winning = checkWin(player);
  if (winning) {
    endGame(playerIcon(player) + " " + getPlayerName(player) + " wins!", winning);
  } else if (checkDraw()) {
    endGame("Draw!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildGrid();
  document.getElementById("turnIndicator").innerHTML = playerIcon("X") + " " + getPlayerName("X") + " to go";
  if (screen.orientation && typeof screen.orientation.lock === "function") {
    screen.orientation.lock("portrait").catch(() => {});
  }
});
