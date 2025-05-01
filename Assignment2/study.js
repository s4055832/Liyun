// study.js
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backButton");
  const video = document.getElementById("studyVideo");
  const timerDisplay = document.getElementById("studyTimer");
  const playBtn = document.getElementById("PlayBtn");
  const switchBtn = document.getElementById("switchBtn");

  // 1. 返回首页
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 2. 读取番茄钟次数
  const storedCount = parseInt(localStorage.getItem("pomodoroCount"), 10);
  const sessions = isNaN(storedCount) || storedCount < 1 ? 1 : storedCount;
  let totalSeconds = sessions * 25 * 60;

  // 3. 准备背景音
  const ambientAudios = [];
  JSON.parse(localStorage.getItem("selectedSounds") || "[]").forEach(
    ({ src, volume }) => {
      const a = new Audio(src);
      a.loop = true;
      a.volume = parseFloat(volume);
      ambientAudios.push(a);
    }
  );

  // 4. 提示音（将 alarm.mp3 放在工程根目录）
  const alarmSound = new Audio("ding.mp3");

  // 5. 视频源 & 循环
  const sources = ["normal.mp4", "normal1.mp4", "normal2.mp4"];
  let current = 0;
  video.loop = true;

  // 6. 倒计时 & 播放状态
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

  // 7. 切换视频源
  switchBtn.addEventListener("click", () => {
    current = (current + 1) % sources.length;
    video.src = sources[current];
    video.load();
    if (isPlaying) video.play();
  });

  // 8. 播放/暂停 切换
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
          // 倒计时到零：播放提示音 & 停止一切
          clearInterval(timerInterval);
          alarmSound.play();
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
