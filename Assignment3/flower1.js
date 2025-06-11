document.addEventListener("DOMContentLoaded", () => {
  // 侧边栏切换逻辑
  const toggleSidebarBtn = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const sidebarCloseBtn = document.getElementById("sidebar-close");

  toggleSidebarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });

  // 点击空白处时隐藏侧边栏
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // 种子菜单切换逻辑
  const seedToggleBtn = document.getElementById("seed-toggle-btn");
  const seedDropdown = document.getElementById("seed-dropdown");

  seedToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    seedDropdown.style.display =
      seedDropdown.style.display === "grid" ? "none" : "grid";
  });

  // 点击其他地方时隐藏种子菜单
  document.addEventListener("click", (e) => {
    if (!seedToggleBtn.contains(e.target) && !seedDropdown.contains(e.target)) {
      seedDropdown.style.display = "none";
    }
  });

  // 拖拽种子到花盆逻辑
  const seedIcons = document.querySelectorAll(".seed-icon");
  const potItems = document.querySelectorAll(".pot-item");

  // 种子图标启动拖拽
  seedIcons.forEach((icon) => {
    icon.addEventListener("dragstart", (e) => {
      const mp4Url = icon.getAttribute("data-mp4");
      e.dataTransfer.setData("text/plain", mp4Url);

      // 创建拖拽预览图
      const preview = document.createElement("div");
      preview.className = "seed-preview";

      const img = document.createElement("img");
      img.src = icon.querySelector("img").src;

      preview.appendChild(img);
      document.body.appendChild(preview);
      e.dataTransfer.setDragImage(preview, 30, 30);

      setTimeout(() => {
        document.body.removeChild(preview);
      }, 0);
    });
  });

  // 在每个花盆上处理拖放
  potItems.forEach((pot) => {
    pot.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    pot.addEventListener("drop", (e) => {
      e.preventDefault();

      const mp4Url = e.dataTransfer.getData("text/plain");
      if (!mp4Url) return;

      // 移除已有的视频和定格图像
      const existingVideo = pot.querySelector(".plant-video");
      if (existingVideo) existingVideo.remove();

      const existingFrame = pot.querySelector(".final-frame");
      if (existingFrame) existingFrame.remove();

      // 创建"生长中"文本效果
      const growingText = document.createElement("div");
      growingText.className = "growing-text";
      growingText.textContent = "🌱 Growing...";
      pot.appendChild(growingText);

      // 3秒后移除文本
      setTimeout(() => {
        growingText.remove();
      }, 3000);

      // 创建视频元素
      const video = document.createElement("video");
      video.src = mp4Url;
      video.className = "plant-video";
      video.autoplay = true;
      video.muted = true;
      video.loop = false;
      video.playsInline = true;

      // 视频结束后暂停在最后一帧
      video.addEventListener("ended", function () {
        // 创建定格图像
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const finalFrame = document.createElement("img");
        finalFrame.className = "final-frame";
        finalFrame.src = canvas.toDataURL();

        // 添加到花盆并移除视频
        pot.appendChild(finalFrame);
        video.remove();
      });

      // 添加到花盆
      pot.appendChild(video);
    });
  });
});
