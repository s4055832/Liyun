// study.js
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backButton");
  const video = document.getElementById("studyVideo");
  const timerDisplay = document.getElementById("studyTimer");
  const startBtn = document.getElementById("startButton");
  const pauseControl = document.getElementById("pausePlayControl");
  const pausePlayBtn = document.getElementById("pausePlayBtn");

  // 读取番茄钟次数（没设过就默认为 1）
  const storedCount = parseInt(localStorage.getItem("pomodoroCount"), 10);
  const sessions = isNaN(storedCount) || storedCount < 1 ? 1 : storedCount;
  let totalSeconds = sessions * 25 * 60;

  // 读取选中的背景音
  const ambientAudios = [];
  const storedSounds = JSON.parse(
    localStorage.getItem("selectedSounds") || "[]"
  );
  storedSounds.forEach(({ src, volume }) => {
    const a = new Audio(src);
    a.loop = true;
    a.volume = parseFloat(volume);
    ambientAudios.push(a);
  });

  let timerInterval = null;
  let isPaused = true;

  // 格式化 MM:SS
  function formatTime(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
  }

  function startCountdown() {
    isPaused = false;
    timerInterval = setInterval(() => {
      if (!isPaused && totalSeconds > 0) {
        totalSeconds--;
        updateDisplay();
      }
      if (totalSeconds === 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }

  // 返回首页
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 开始按钮：隐藏自己、启动视频、倒计时 & 播放所有背景音
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    video.play();
    ambientAudios.forEach((a) => a.play());
    startCountdown();
  });

  // 悬停显示 / 隐藏暂停控件
  video.addEventListener("mouseenter", () => {
    pauseControl.classList.remove("hidden");
  });
  video.addEventListener("mouseleave", () => {
    pauseControl.classList.add("hidden");
  });

  // 暂停 / 继续：同时控制视频和背景音
  pausePlayBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      ambientAudios.forEach((a) => a.play());
      isPaused = false;
      pausePlayBtn.textContent = "Pause";
    } else {
      video.pause();
      ambientAudios.forEach((a) => a.pause());
      isPaused = true;
      pausePlayBtn.textContent = "Play";
    }
  });

  // 初始化显示
  updateDisplay();
});
