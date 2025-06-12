document.addEventListener("DOMContentLoaded", () => {
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

  // Seeds 下拉开关
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

  // 拖拽和生长逻辑
  const seedIcons = document.querySelectorAll(".seed-icon");
  const potItems = document.querySelectorAll(".pot-item");

  seedIcons.forEach((icon) => {
    icon.addEventListener("dragstart", (e) => {
      // 传递视频路径
      e.dataTransfer.setData("text/plain", icon.dataset.mp4);

      // 拖拽预览
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

      // 清除已有视频和定格图
      const existingVideo = pot.querySelector(".plant-video");
      if (existingVideo) existingVideo.remove();
      const existingFrame = pot.querySelector(".final-frame");
      if (existingFrame) existingFrame.remove();

      // 显示“Growing...”文字
      const growingText = document.createElement("div");
      growingText.className = "growing-text";
      growingText.textContent = "🌱 Growing...";
      pot.appendChild(growingText);
      setTimeout(() => growingText.remove(), 3000);

      // 创建并播放视频
      const video = document.createElement("video");
      video.src = mp4Url;
      video.className = "plant-video";
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;

      // 视频结束时定格
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
