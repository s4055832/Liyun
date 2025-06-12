window.addEventListener("DOMContentLoaded", function () {
  // === Weather video toggle logic (same as in flower1) ===
  // Get the fullscreen weatherVideo element for toggling between sunny and rainy videos
  var weatherVideo = document.getElementById("weather-video");
  var isSunny = true;

  // Get the sidebar Weather button; on click, toggle the weather video
  var weatherBtn = document.getElementById("toggle-weather-btn");
  weatherBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent event bubbling to avoid conflict with sidebar close logic
    if (isSunny) {
      weatherVideo.src = "rain.mp4";
    } else {
      weatherVideo.src = "sun.mp4";
    }
    // Play again after switching to ensure the change takes effect immediately
    weatherVideo.play();
    // Toggle the state so the next click switches back
    isSunny = !isSunny;
  });

  // === Background music playback control (same as in flower1) ===
  // Use an Audio object to load music for unified play/pause control
  var bgMusic = new Audio("background.m4a");
  bgMusic.loop = true; // Loop playback
  bgMusic.play().catch(function () {
    console.warn(
      "Autoplay was blocked, please click the Music button to start audio."
    );
  });

  // Get the sidebar Music button; on click, toggle play/pause
  var sidebarMusicBtn = document.getElementById("sidebar-music-btn");
  sidebarMusicBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent bubbling to avoid closing the sidebar
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  });

  // === Sidebar open/close logic ===
  var toggleBtn = document.getElementById("toggle-sidebar");
  var sidebar = document.getElementById("sidebar");
  var closeBtn = document.getElementById("sidebar-close");

  // Click the menu button to toggle the sidebar's visibility
  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });

  // Click the close button inside the sidebar to hide it
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.remove("open");
  });

  // Click outside the sidebar to automatically close it
  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // === Seeds dropdown menu logic ===
  var seedToggle = document.getElementById("seed-toggle-btn");
  var seedDropdown = document.getElementById("seed-dropdown");

  // Click the Seeds button to show/hide the dropdown
  seedToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (seedDropdown.style.display === "grid") {
      seedDropdown.style.display = "none";
    } else {
      seedDropdown.style.display = "grid";
    }
  });

  // Click elsewhere to hide the dropdown
  document.addEventListener("click", function (e) {
    if (!seedToggle.contains(e.target) && !seedDropdown.contains(e.target)) {
      seedDropdown.style.display = "none";
    }
  });

  // === Grid creation and drag/drop event binding ===
  var grid = document.getElementById("grid-container");
  for (var i = 0; i < 25; i++) {
    var cell = document.createElement("div");
    cell.className = "grid-cell";
    // Allow dragged elements to hover (enable drop)
    cell.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    // Handle drop logic: remove action / play video / freeze frame
    cell.addEventListener("drop", function (e) {
      e.preventDefault();
      var action = e.dataTransfer.getData("action");
      if (action === "remove") {
        // Remove action: clear the cell's content
        this.innerHTML = "";
        return;
      }
      // Get video path and clear old content
      var mp4 = e.dataTransfer.getData("text/plain");
      this.innerHTML = "";
      var video = document.createElement("video");
      video.src = mp4;
      video.autoplay = true;
      video.muted = true;
      video.play();
      // Freeze on the last frame after video ends
      video.addEventListener("ended", function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        ctx.drawImage(this, 0, 0);
        var img = document.createElement("img");
        img.className = "final-frame";
        img.src = canvas.toDataURL();
        cell.innerHTML = "";
        cell.appendChild(img);
      });
      cell.appendChild(video);
    });
    grid.appendChild(cell);
  }

  // === Drag initialization: seeds and remove actions ===
  var seedIcons = document.querySelectorAll(".seed-icon");
  seedIcons.forEach(function (icon) {
    icon.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", icon.dataset.mp4);
    });
  });
  var removeIcons = document.querySelectorAll(".remove-icon");
  removeIcons.forEach(function (icon) {
    icon.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("action", icon.dataset.action);
    });
  });
});
