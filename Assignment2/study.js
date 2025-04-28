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

// 读取localStorage中的数据
const studyMinutes = localStorage.getItem("studyMinutes") || 25;
const selectedSounds = JSON.parse(localStorage.getItem("selectedSounds")) || [];

// 设置倒计时时间
let totalSeconds = studyMinutes * 60;

// 更新倒计时
function updateTimer() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  document.getElementById("studyTimer").textContent = `${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateTimer();

const countdown = setInterval(() => {
  if (totalSeconds > 0) {
    totalSeconds--;
    updateTimer();
  } else {
    clearInterval(countdown);
    alert("Time's up! Well done!");
  }
}, 1000);

// 设置视频播放
const videoPlayer = document.getElementById("studyVideo");

if (selectedSounds.length === 1) {
  // 只选择了一个背景音，就播放对应的视频
  const selectedVideo = `main/${selectedSounds[0]}.mp4`;
  videoPlayer.src = selectedVideo;
} else {
  // 选了多个或者没有选，播放默认的normal.mp4
  videoPlayer.src = "main/normal.mp4";
}

videoPlayer.load();
videoPlayer.play();
