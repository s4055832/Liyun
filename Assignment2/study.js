// 设置初始时间（比如25分钟）
let totalSeconds = 25 * 60;

// 获取计时器元素
const timerDisplay = document.getElementById("studyTimer");

// 更新时间函数
function updateTimer() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

// 开始倒计时
updateTimer(); // 初始化显示
const countdown = setInterval(() => {
  if (totalSeconds > 0) {
    totalSeconds--;
    updateTimer();
  } else {
    clearInterval(countdown);
    alert("Time's up! Great job!");
  }
}, 1000);

document.getElementById("backButton").addEventListener("click", () => {
  window.location.href = "index.html"; // 点击返回首页
});
