// study.js
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backButton");
  const video = document.getElementById("studyVideo");
  const timerDisplay = document.getElementById("studyTimer");
  const playBtn = document.getElementById("PlayBtn");
  const switchBtn = document.getElementById("switchBtn");

  // 返回首页
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 读取番茄钟次数
  const storedCount = parseInt(localStorage.getItem("pomodoroCount"), 10);
  const sessions = isNaN(storedCount) || storedCount < 1 ? 1 : storedCount;
  let totalSeconds = sessions * 25 * 60;

  // 准备背景音
  const ambientAudios = [];
  JSON.parse(localStorage.getItem("selectedSounds") || "[]").forEach(
    ({ src, volume }) => {
      const a = new Audio(src);
      a.loop = true;
      a.volume = parseFloat(volume);
      ambientAudios.push(a);
    }
  );

  // 视频源列表 & 索引
  const sources = ["normal.mp4", "normal1.mp4", "normal2.mp4"];
  let current = 0;

  // 设置视频单个循环
  video.loop = true;

  // 倒计时相关
  let timerInterval = null;
  let isPlaying = false;

  // 格式化 MM:SS
  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
  }
  updateDisplay();

  // 切换视频源（只是更换 src，新的视频也会单独循环）
  switchBtn.addEventListener("click", () => {
    current = (current + 1) % sources.length;
    video.src = sources[current];
    video.load();
    // 保持之前的播放/暂停状态
    if (isPlaying) video.play();
  });

  // 播放/暂停 切换
  playBtn.addEventListener("click", () => {
    if (!isPlaying) {
      // —— Start ——
      isPlaying = true;
      playBtn.textContent = "Pause";
      video.play();
      ambientAudios.forEach((a) => a.play());
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateDisplay();
        } else {
          // 倒计时到零：停止一切
          clearInterval(timerInterval);
          isPlaying = false;
          playBtn.textContent = "Start";
          video.pause();
          ambientAudios.forEach((a) => a.pause());
        }
      }, 1000);
    } else {
      // —— Pause ——
      isPlaying = false;
      playBtn.textContent = "Start";
      video.pause();
      ambientAudios.forEach((a) => a.pause());
      clearInterval(timerInterval);
    }
  });
});
