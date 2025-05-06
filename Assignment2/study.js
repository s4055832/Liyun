document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backButton");
  const video = document.getElementById("studyVideo");
  const timerDisplay = document.getElementById("studyTimer");
  const playBtn = document.getElementById("PlayBtn");
  const switchBtn = document.getElementById("switchBtn");

  // Go back to homepage
  // Give users the opportunity to change their plans
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Load pomodoro count
  // Let the Pomodoro timer be calculated by multiplying the previously set time by 25 minutes.
  const storedCount = parseInt(localStorage.getItem("pomodoroCount"), 10);
  const sessions = isNaN(storedCount) || storedCount < 1 ? 1 : storedCount;
  let totalSeconds = sessions * 25 * 60;

  // Background sounds
  const ambientAudios = [];
  JSON.parse(localStorage.getItem("selectedSounds") || "[]").forEach(
    ({ src, volume }) => {
      const a = new Audio(src);
      a.loop = true;
      a.volume = parseFloat(volume);
      ambientAudios.push(a);
    }
  );

  // Alert sound, Pomodoro countdown reminder
  const alarmSound = new Audio("ding.mp3");

  // Video sources & loop
  // Because the video is relatively short, in order to make the video length fit the Pomodoro timer, it is played in a loop
  const sources = ["normal.mp4", "normal1.mp4", "normal2.mp4"];
  let current = 0;
  video.loop = true;

  // Countdown & play state
  let timerInterval = null;
  let isPlaying = false;

  // Format time as MM:SS，make the Pomodoro display closer to reality
  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
  }
  updateDisplay();

  // Switch video source
  // A single video may not meet the needs of users, so multiple comparison videos are added for easy selection
  switchBtn.addEventListener("click", () => {
    current = (current + 1) % sources.length;
    video.src = sources[current];
    video.load();
    if (isPlaying) video.play();
  });

  // Toggle play/pause
  // The play and pause buttons control the video, audio and Pomodoro timer in a unified way
  playBtn.addEventListener("click", () => {
    if (!isPlaying) {
      // Start playback
      isPlaying = true;
      playBtn.textContent = "Pause";
      video.play();
      ambientAudios.forEach((a) => a.play());
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateDisplay();
        } else {
          // When countdown ends: play alert & stop all
          clearInterval(timerInterval);
          alarmSound.play();
          isPlaying = false;
          playBtn.textContent = "Start";
          video.pause();
          ambientAudios.forEach((a) => a.pause());
        }
      }, 1000);
    } else {
      // Pause playback
      isPlaying = false;
      playBtn.textContent = "Start";
      video.pause();
      ambientAudios.forEach((a) => a.pause());
      clearInterval(timerInterval);
    }
  });
});
