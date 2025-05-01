// study.js
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backButton");
  const video = document.getElementById("studyVideo");
  const timerDisplay = document.getElementById("studyTimer");
  const playControl = document.getElementById("PlayControl");
  const playBtn = document.getElementById("PlayBtn");

  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 读取番茄钟次数
  const storedCount = parseInt(localStorage.getItem("pomodoroCount"), 10);
  const sessions = isNaN(storedCount) || storedCount < 1 ? 1 : storedCount;
  let totalSeconds = sessions * 25 * 60;

  // 准备背景音列表
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
  let isCounting = false;

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
  updateDisplay();

  // 显示控制按钮
  playControl.classList.remove("hidden");

  playBtn.addEventListener("click", () => {
    if (!isCounting) {
      // —— Start ——
      isCounting = true;
      playBtn.textContent = "Pause";
      video.play();
      ambientAudios.forEach((a) => a.play());
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateDisplay();
        } else {
          clearInterval(timerInterval);
        }
      }, 1000);
    } else {
      // —— Pause ——
      isCounting = false;
      playBtn.textContent = "Start";
      video.pause();
      ambientAudios.forEach((a) => a.pause()); // ← 这里加上暂停所有音频
      clearInterval(timerInterval);
    }
  });
});

/* 隐藏 Safari/Chrome 的默认大播放按钮 */
#studyVideo::-webkit-media-controls-start-playback-button,
#studyVideo::-webkit-media-controls-overlay-play-button {
  display: none !important;
  opacity: 0 !important;
}

/* 隐藏 Edge/IE 的大播放图标 */
#studyVideo::-ms-clear {
  display: none !important;
}

/* 隐藏所有浏览器可能的内建覆盖层 */
#studyVideo::-webkit-media-controls {
  display: none !important;
}

/* 确保视频本身可点击到自定义按钮下方 */
#studyVideo {
  pointer-events: none;
}
