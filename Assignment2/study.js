// study.js
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backButton");
  const video = document.getElementById("studyVideo");
  const timerDisplay = document.getElementById("studyTimer");
  const startBtn = document.getElementById("startButton");
  const pauseControl = document.getElementById("pausePlayControl");
  const pausePlayBtn = document.getElementById("pausePlayBtn");

  let totalSeconds = 25 * 60;
  let timerInterval = null;
  let isPaused = true;

  // Ensure video is paused on load
  video.pause();

  // Format seconds -> MM:SS
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

  // Back to index
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Start button
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    video.play();
    startCountdown();
  });

  // Show/hide pause control on hover
  video.addEventListener("mouseenter", () => {
    pauseControl.classList.remove("hidden");
  });
  video.addEventListener("mouseleave", () => {
    pauseControl.classList.add("hidden");
  });

  // Pause/Resume
  pausePlayBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      isPaused = false;
      pausePlayBtn.textContent = "Pause";
    } else {
      video.pause();
      isPaused = true;
      pausePlayBtn.textContent = "Play";
    }
  });

  // Initial display
  updateDisplay();
});
