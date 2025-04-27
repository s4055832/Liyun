// player
const videoPlayer = document.getElementById("videoPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const volumeControl = document.getElementById("volumeControl");

// play pause
playPauseBtn.addEventListener("click", () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playPauseBtn.textContent = "Pause";
  } else {
    videoPlayer.pause();
    playPauseBtn.textContent = "Play";
  }
});

// volume control
volumeControl.addEventListener("input", () => {
  videoPlayer.volume = volumeControl.value;
});

// playing sound
const activeSounds = new Set();

// Background sound card and category button
const soundCards = document.querySelectorAll(".sound-card");
const filterButtons = document.querySelectorAll(".category-buttons button");

soundCards.forEach((card) => {
  const soundName = card.getAttribute("data-sound");
  const audioElem = card.querySelector("audio");
  const playBtn = card.querySelector(".play-btn");
  const volumeSlider = card.querySelector(".volume-slider");

  // volume
  audioElem.volume = volumeSlider.value;

  // click start pause
  playBtn.addEventListener("click", () => {
    if (audioElem.paused) {
      audioElem.play();
      card.classList.add("playing");
      playBtn.textContent = "⏸";
      activeSounds.add(soundName);
    } else {
      audioElem.pause();
      audioElem.currentTime = 0;
      card.classList.remove("playing");
      playBtn.textContent = "▶";
      activeSounds.delete(soundName);
    }
    updateBackgroundVideo(); // 每次更新背景视频
  });

  // control volume in time
  volumeSlider.addEventListener("input", () => {
    audioElem.volume = volumeSlider.value;
  });
});

// Switch video
function updateBackgroundVideo() {
  if (activeSounds.size === 0) {
    // nothing
    switchVideo("normal.mp4");
  } else if (activeSounds.size === 1) {
    // choose 1
    const onlySound = Array.from(activeSounds)[0];
    switchVideo(`${onlySound}.mp4`);
  } else {
    // choose many
    switchVideo("normal.mp4");
  }
}

function switchVideo(src) {
  if (videoPlayer.getAttribute("src") !== src) {
    videoPlayer.setAttribute("src", src);
    videoPlayer.load();
    videoPlayer.play();
  }
}

// Category filtering function
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    document
      .querySelector(".category-buttons button.active")
      .classList.remove("active");
    button.classList.add("active");

    soundCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// Pomodoro
const timerDisplay = document.getElementById("timer");
const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");

let isRunning = false;
let timeLeft = 25 * 60;
let timerInterval;

// Pomodoro timer
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

// Pomotoro start pause
function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    startPauseBtn.textContent = "Start";
  } else {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startPauseBtn.textContent = "Start";
        playPomodoroEndSound();
        alert("Time's up! Take a short break!");
      }
    }, 1000);
    startPauseBtn.textContent = "Pause";
  }
  isRunning = !isRunning;
}

// Reset timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = 25 * 60;
  updateDisplay();
  startPauseBtn.textContent = "Start";
}

// Pomotoro end
function playPomodoroEndSound() {
  const ding = new Audio("main/ding.mp3");
  ding.play();
}

startPauseBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
updateDisplay();

// Playlist
const playlistButtons = document.querySelectorAll(".playlist button");

playlistButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sounds = button.getAttribute("data-sounds");
    if (sounds) {
      const soundArray = sounds.split(",");

      // Stop sound
      soundCards.forEach((card) => {
        const audio = card.querySelector("audio");
        const playBtn = card.querySelector(".play-btn");
        audio.pause();
        audio.currentTime = 0;
        playBtn.textContent = "▶";
        activeSounds.delete(card.getAttribute("data-sound"));
      });

      // Play right sound
      soundArray.forEach((soundName) => {
        const card = document.querySelector(
          `.sound-card[data-sound="${soundName}"]`
        );
        if (card) {
          const audio = card.querySelector("audio");
          const playBtn = card.querySelector(".play-btn");
          audio.play();
          playBtn.textContent = "⏸";
          activeSounds.add(soundName);
        }
      });

      updateBackgroundVideo();
    }
  });
});

// 点击 "Begin Studying" 跳转到 study.html
document.getElementById("beginStudyButton").addEventListener("click", () => {
  window.location.href = "study.html"; // 跳转到新的页面
});
