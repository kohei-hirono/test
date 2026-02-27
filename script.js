const DEFAULT_POOL = ["大吉", "中吉", "小吉", "吉", "凶"];

const poolInput = document.getElementById("poolInput");
const savePoolButton = document.getElementById("savePoolButton");
const resetPoolButton = document.getElementById("resetPoolButton");
const drawButton = document.getElementById("drawButton");
const drawWithoutReplacementButton = document.getElementById("drawWithoutReplacementButton");
const resetRemainingButton = document.getElementById("resetRemainingButton");
const result = document.getElementById("result");
const remainingCount = document.getElementById("remainingCount");
const history = document.getElementById("history");

let pool = [];
let remainingPool = [];

function parsePoolFromInput(text) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function savePool() {
  const nextPool = parsePoolFromInput(poolInput.value);
  if (nextPool.length === 0) {
    result.textContent = "⚠️ くじの候補を1つ以上入力してください。";
    return;
  }

  pool = [...nextPool];
  remainingPool = [...pool];

  localStorage.setItem("lotteryPool", JSON.stringify(pool));
  updateRemainingCount();
  result.textContent = "✅ プールを保存しました。";
}

function resetToDefaultPool() {
  pool = [...DEFAULT_POOL];
  remainingPool = [...pool];
  poolInput.value = pool.join("\n");
  localStorage.setItem("lotteryPool", JSON.stringify(pool));

  history.innerHTML = "";
  updateRemainingCount();
  result.textContent = "初期値に戻しました。";
}

function resetRemaining() {
  remainingPool = [...pool];
  updateRemainingCount();
  result.textContent = "残りプールをリセットしました。";
}

function updateRemainingCount() {
  remainingCount.textContent = `重複なしモードの残り: ${remainingPool.length} / ${pool.length}`;
}

function appendHistory(mode, value) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} [${mode}] ${value}`;
  history.prepend(li);
}

function randomPick(items) {
  const index = Math.floor(Math.random() * items.length);
  return {
    index,
    value: items[index],
  };
}

function drawWithReplacement() {
  if (pool.length === 0) {
    result.textContent = "⚠️ 先にプールを保存してください。";
    return;
  }

  const pick = randomPick(pool);
  result.textContent = `🎉 ${pick.value}`;
  appendHistory("重複あり", pick.value);
}

function drawWithoutReplacement() {
  if (pool.length === 0) {
    result.textContent = "⚠️ 先にプールを保存してください。";
    return;
  }

  if (remainingPool.length === 0) {
    result.textContent = "📭 残りがありません。リセットしてください。";
    return;
  }

  const pick = randomPick(remainingPool);
  remainingPool.splice(pick.index, 1);

  result.textContent = `🎉 ${pick.value}`;
  appendHistory("重複なし", pick.value);
  updateRemainingCount();
}

function loadPool() {
  const raw = localStorage.getItem("lotteryPool");

  if (!raw) {
    pool = [...DEFAULT_POOL];
  } else {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string" && item.trim())) {
        pool = parsed;
      } else {
        pool = [...DEFAULT_POOL];
      }
    } catch {
      pool = [...DEFAULT_POOL];
    }
  }

  remainingPool = [...pool];
  poolInput.value = pool.join("\n");
  updateRemainingCount();
}

savePoolButton.addEventListener("click", savePool);
resetPoolButton.addEventListener("click", resetToDefaultPool);
drawButton.addEventListener("click", drawWithReplacement);
drawWithoutReplacementButton.addEventListener("click", drawWithoutReplacement);
resetRemainingButton.addEventListener("click", resetRemaining);

loadPool();
