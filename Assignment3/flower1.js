document.addEventListener("DOMContentLoaded", function () {
  // === Weather video toggle logic ===
  // Get the fullscreen weatherVideo element for toggling between sunny and rainy videos
  var weatherVideo = document.getElementById("weather-video");
  // State flag: true for initial sunny state, toggles to rain
  var isSunny = true;

  // Get the sidebar Weather button
  var weatherBtn = document.getElementById("toggle-weather-btn");
  weatherBtn.addEventListener("click", function (e) {
    // Prevent event bubbling to avoid triggering sidebar close logic
    e.stopPropagation();
    if (isSunny) {
      // Switch to rain video
      weatherVideo.src = "rain.mp4";
    } else {
      // Switch back to sunny video
      weatherVideo.src = "sun.mp4";
    }
    weatherVideo.play();
    // Toggle the state flag for next click
    isSunny = !isSunny;
  });

  // === Background music playback control ===
  // Load background music file using Audio object for unified play/pause control
  var bgMusic = new Audio("background.m4a");
  // Loop playback
  bgMusic.loop = true;
  bgMusic.play().catch(function () {
    // Some browsers block autoplay, warn user to click manually
    console.warn(
      "Autoplay is blocked, please click the Music button to start the audio."
    ); // Optimization from ChatGPT
  });

  // Get the sidebar Music button, toggle play/pause on click
  var sidebarMusicBtn = document.getElementById("sidebar-music-btn");
  sidebarMusicBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  });

  // === Sidebar open/close logic ===
  var toggleSidebarBtn = document.getElementById("toggle-sidebar");
  var sidebar = document.getElementById("sidebar");
  var sidebarCloseBtn = document.getElementById("sidebar-close");

  // Click menu icon to toggle sidebar sliding
  toggleSidebarBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });

  // Click close button inside sidebar to remove 'open' class
  sidebarCloseBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.remove("open");
  });

  // Click outside sidebar to automatically close it
  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // === Seeds dropdown menu logic ===
  var seedToggleBtn = document.getElementById("seed-toggle-btn");
  var seedDropdown = document.getElementById("seed-dropdown");

  // Click Seeds button to show or hide dropdown panel
  seedToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (seedDropdown.style.display === "grid") {
      seedDropdown.style.display = "none";
    } else {
      seedDropdown.style.display = "grid";
    }
  });

  // Hide dropdown panel when clicking elsewhere
  document.addEventListener("click", function (e) {
    if (!seedToggleBtn.contains(e.target) && !seedDropdown.contains(e.target)) {
      seedDropdown.style.display = "none";
    }
  });

  // === Drag and growth effects ===
  var seedIcons = document.querySelectorAll(".seed-icon");
  var potItems = document.querySelectorAll(".pot-item");

  // Bind dragstart to each seed icon, pass video path and create drag preview
  seedIcons.forEach(function (icon) {
    icon.addEventListener("dragstart", function (e) {
      // Store the mp4 path to play
      e.dataTransfer.setData("text/plain", icon.dataset.mp4);

      // Create a preview element to enhance drag UX
      var preview = document.createElement("div");
      preview.className = "seed-preview";
      var img = document.createElement("img");
      img.src = icon.querySelector("img").src;
      preview.appendChild(img);
      document.body.appendChild(preview);
      e.dataTransfer.setDragImage(preview, 30, 30);
      setTimeout(function () {
        document.body.removeChild(preview);
      }, 0);
    });
  });

  // Bind dragover/drop to each pot to enable video playback and growth animation
  potItems.forEach(function (pot) {
    pot.addEventListener("dragover", function (e) {
      e.preventDefault(); // Allow drop
    });
    pot.addEventListener("drop", function (e) {
      e.preventDefault();
      var mp4Url = e.dataTransfer.getData("text/plain");
      if (!mp4Url) return;

      // Remove old video element and final frame
      var oldVideo = pot.querySelector(".plant-video");
      if (oldVideo) oldVideo.remove();
      var oldFrame = pot.querySelector(".final-frame");
      if (oldFrame) oldFrame.remove();

      // Add growing text for visual feedback
      var txt = document.createElement("div");
      txt.className = "growing-text";
      txt.textContent = "🌱 Growing...";
      pot.appendChild(txt);
      setTimeout(function () {
        txt.remove();
      }, 3000);

      // Create and play plant growth video
      var video = document.createElement("video");
      video.src = mp4Url;
      video.className = "plant-video";
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;

      // On video end, capture final frame to preserve visual, no PNG swap. Inspired by ChatGPT
      video.addEventListener("ended", function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        var finalFrame = document.createElement("img");
        finalFrame.className = "final-frame";
        finalFrame.src = canvas.toDataURL();
        pot.appendChild(finalFrame);
        video.remove();
      });
      pot.appendChild(video);
    });
  });
});
