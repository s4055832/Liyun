document.addEventListener("DOMContentLoaded", () => {
  // Let the button of the Pomodoro module control the number of Pomodoros
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
  // Let different types of music be categorized by tags
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
    // Set Complete
    confirmSoundsBtn.textContent = "Complete";
    confirmSoundsBtn.disabled = true;

    // Prepare for the study page and connect the data of the two pages together
    // Collect pomodoro times
    localStorage.setItem("pomodoroCount", count);

    // Collect sound and volume
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

    // Success & Begin Studying
    // Unhide the text and buttons, and use the celebratory GIF in the previously loaded page to give users a sense of accomplishment
    successMessage.classList.remove("hidden");
    beginStudyButton.classList.remove("hidden");
  });

  // Begin studying
  beginStudyButton.addEventListener("click", () => {
    window.location.href = "study.html";
  });
});
