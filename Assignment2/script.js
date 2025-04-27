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

// 设置番茄钟数量
let sessionCount = 1; // 默认1

const sessionDisplay = document.getElementById("sessionCount");
const increaseBtn = document.getElementById("increaseBtn");
const confirmBtn = document.getElementById("confirmBtn");

// 点击加号，增加1
increaseBtn.addEventListener("click", () => {
  sessionCount++;
  sessionDisplay.textContent = sessionCount;
});

decreaseBtn.addEventListener("click", () => {
  if (sessionCount > 1) {
    sessionCount--;
    sessionDisplay.textContent = sessionCount;
  }
});

// 点击确认，把设置保存到 localStorage
confirmBtn.addEventListener("click", () => {
  const totalMinutes = sessionCount * 25; // 每个session是25分钟
  localStorage.setItem("studyMinutes", totalMinutes); // 保存到localStorage
  // 然后跳转到背景音选择页面
  document.getElementById("timerScreen").classList.remove("active");
  document.getElementById("bgMusicScreen").classList.add("active");
});

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
