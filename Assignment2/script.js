// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Pomodoro count controls
  const decreaseBtn = document.getElementById("decreaseBtn");
  const increaseBtn = document.getElementById("increaseBtn");
  const sessionCount = document.getElementById("sessionCount");
  const confirmBtn = document.getElementById("confirmBtn");
  let count = 1;

  decreaseBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      sessionCount.textContent = count;
    }
  });
  increaseBtn.addEventListener("click", () => {
    count++;
    sessionCount.textContent = count;
  });
  confirmBtn.addEventListener("click", () => {
    confirmBtn.textContent = "Complete";
    confirmBtn.disabled = true;
  });

  // Sound card filtering
  const filterButtons = document.querySelectorAll(".category-buttons button");
  const allCards = document.querySelectorAll(".sound-card");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      allCards.forEach((card) => {
        card.style.display =
          filter === "all" || card.dataset.category === filter
            ? "block"
            : "none";
      });
    });
  });

  // Sound card selection & volume
  allCards.forEach((card) => {
    const playBtn = card.querySelector(".play-btn");
    const audio = card.querySelector("audio");
    const slider = card.querySelector(".volume-slider");
    slider.addEventListener("input", () => (audio.volume = slider.value));
    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        card.classList.add("selected");
        playBtn.textContent = "⏸";
      } else {
        audio.pause();
        card.classList.remove("selected");
        playBtn.textContent = "▶";
      }
    });
  });

  // Confirm sounds
  const confirmSoundsBtn = document.getElementById("confirmSoundsBtn");
  const successMessage = document.getElementById("successMessage");
  const beginStudyButton = document.getElementById("beginStudyButton");
  confirmSoundsBtn.addEventListener("click", () => {
    // 标记为 Complete
    confirmSoundsBtn.textContent = "Complete";
    confirmSoundsBtn.disabled = true;

    // ① 保存番茄钟次数
    localStorage.setItem("pomodoroCount", count);

    // ② 收集所有选中的音频及其音量
    const selectedSounds = [];
    allCards.forEach((card) => {
      if (card.classList.contains("selected")) {
        const audio = card.querySelector("audio");
        const slider = card.querySelector(".volume-slider");
        selectedSounds.push({
          src: audio.src,
          volume: slider.value,
        });
      }
    });
    localStorage.setItem("selectedSounds", JSON.stringify(selectedSounds));

    // 显示成功提示 & “Begin Studying”按钮
    successMessage.classList.remove("hidden");
    beginStudyButton.classList.remove("hidden");
  });

  // Begin studying
  beginStudyButton.addEventListener("click", () => {
    window.location.href = "study.html";
  });
});
