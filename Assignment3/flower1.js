document.addEventListener("DOMContentLoaded", () => {
  // 天气切换视频
  const weatherVideo = document.getElementById("weather-video");
  let isSunny = true;
  const weatherBtn = document.getElementById("toggle-weather-btn");
  weatherBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isSunny) {
      weatherVideo.src = "rain.mp4";
    } else {
      weatherVideo.src = "sun.mp4";
    }
    weatherVideo.play();
    isSunny = !isSunny;
  });

  // 背景音乐
  const bgMusic = new Audio("background.m4a");
  bgMusic.loop = true;
  bgMusic.play().catch(() => {
    console.warn("自动播放被阻止，请点击 Music 按钮启动音频。");
  });
  const sidebarMusicBtn = document.getElementById("sidebar-music-btn");
  sidebarMusicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgMusic.paused) bgMusic.play();
    else bgMusic.pause();
  });

  // 侧边栏开关
  const toggleSidebarBtn = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const sidebarCloseBtn = document.getElementById("sidebar-close");
  toggleSidebarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });
  sidebarCloseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.remove("open");
  });
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // Seeds 下拉
  const seedToggleBtn = document.getElementById("seed-toggle-btn");
  const seedDropdown = document.getElementById("seed-dropdown");
  seedToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    seedDropdown.style.display =
      seedDropdown.style.display === "grid" ? "none" : "grid";
  });
  document.addEventListener("click", (e) => {
    if (!seedToggleBtn.contains(e.target) && !seedDropdown.contains(e.target)) {
      seedDropdown.style.display = "none";
    }
  });

  // 拖拽与生长逻辑
  const seedIcons = document.querySelectorAll(".seed-icon");
  const potItems = document.querySelectorAll(".pot-item");

  seedIcons.forEach((icon) => {
    icon.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", icon.dataset.mp4);
      const preview = document.createElement("div");
      preview.className = "seed-preview";
      const img = document.createElement("img");
      img.src = icon.querySelector("img").src;
      preview.appendChild(img);
      document.body.appendChild(preview);
      e.dataTransfer.setDragImage(preview, 30, 30);
      setTimeout(() => document.body.removeChild(preview), 0);
    });
  });

  potItems.forEach((pot) => {
    pot.addEventListener("dragover", (e) => e.preventDefault());
    pot.addEventListener("drop", (e) => {
      e.preventDefault();
      const mp4Url = e.dataTransfer.getData("text/plain");
      if (!mp4Url) return;

      // 移除旧视频和最后一帧
      pot.querySelector(".plant-video")?.remove();
      pot.querySelector(".final-frame")?.remove();

      // 显示生长文字
      const txt = document.createElement("div");
      txt.className = "growing-text";
      txt.textContent = "🌱 Growing...";
      pot.appendChild(txt);
      setTimeout(() => txt.remove(), 3000);

      // 添加视频
      const video = document.createElement("video");
      video.src = mp4Url;
      video.className = "plant-video";
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.addEventListener("ended", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const finalFrame = document.createElement("img");
        finalFrame.className = "final-frame";
        finalFrame.src = canvas.toDataURL();
        pot.appendChild(finalFrame);
        video.remove();
      });
      pot.appendChild(video);
    });
  });
});
pot.addEventListener("drop", (e) => {
  e.preventDefault();
  const mp4Url = e.dataTransfer.getData("text/plain");
  if (!mp4Url) return;

  
