window.addEventListener("DOMContentLoaded", function () {
  // === Music control logic ===
  // Get the music control button and the audio element
  var musicControl = document.getElementById("musicControl");
  var bgMusic = document.getElementById("bgMusic");
  // Music state flag, initially playing
  var isPlaying = true;
  // Music icon for toggling display
  var musicIcon = musicControl.querySelector("i");

  // Attempt to autoplay the background music
  function initMusic() {
    var playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(function (error) {
        // Browser blocked autoplay; user interaction is required
        isPlaying = false;
        musicIcon.classList.remove("fa-volume-up");
        musicIcon.classList.add("fa-volume-mute");
        console.log(
          "Autoplay was blocked; user interaction is required to start the audio."
        );
      });
    }
  }
  initMusic(); // Initialize music playback

  // Toggle play/pause on click
  musicControl.addEventListener("click", function () {
    if (isPlaying) {
      bgMusic.pause(); // Pause music
      musicIcon.classList.remove("fa-volume-up");
      musicIcon.classList.add("fa-volume-mute");
    } else {
      bgMusic.play(); // Play music
      musicIcon.classList.remove("fa-volume-mute");
      musicIcon.classList.add("fa-volume-up");
    }
    isPlaying = !isPlaying; // Update state
  });

  // === Page navigation logic ===
  // Simple click feedback before navigating for the pot option
  var potOption = document.getElementById("potOption");
  potOption.addEventListener("click", function () {
    // Click animation feedback
    this.style.transform = "scale(0.95)";
    setTimeout(function () {
      // Reset and navigate
      potOption.style.transform = "";
      window.location.href = "flower1.html";
    }, 200);
  });

  // Same logic for the field option
  var fieldOption = document.getElementById("fieldOption");
  fieldOption.addEventListener("click", function () {
    this.style.transform = "scale(0.95)";
    setTimeout(function () {
      fieldOption.style.transform = "";
      window.location.href = "flower2.html";
    }, 200);
  });

  // === Keyboard shortcut logic ===
  document.addEventListener("keydown", function (e) {
    switch (e.code) {
      case "Space":
        // Spacebar toggles music playback and prevents page scrolling
        e.preventDefault();
        musicControl.click();
        break;
      case "Digit1":
        // Press 1 to enter the pot interface
        potOption.click();
        break;
      case "Digit2":
        // Press 2 to enter the field interface
        fieldOption.click();
        break;
      default:
        // Other keys are not handled
        break;
    }
  });
});
