document.addEventListener("DOMContentLoaded", () => {
  // ======== 侧边栏切换逻辑 ========
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

  // 点击空白处时隐藏侧边栏
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // ======== 种子菜单切换逻辑 ========
  const seedToggleBtn = document.getElementById("seed-toggle-btn");
  const seedDropdown = document.getElementById("seed-dropdown");

  seedToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    seedDropdown.style.display =
      seedDropdown.style.display === "grid" ? "none" : "grid";
  });

  // 点击侧边栏内其他地方或外部空白时隐藏种子菜单
  document.addEventListener("click", (e) => {
    if (!seedToggleBtn.contains(e.target) && !seedDropdown.contains(e.target)) {
      seedDropdown.style.display = "none";
    }
  });

  // ======== 拖拽种子到花盆逻辑 ========
  const seedIcons = document.querySelectorAll(".seed-icon");
  const potItems = document.querySelectorAll(".pot-item");

  // 种子图标启动拖拽
  seedIcons.forEach((icon) => {
    icon.addEventListener("dragstart", (e) => {
      const gifUrl = icon.getAttribute("data-gif");
      e.dataTransfer.setData("text/plain", gifUrl);

      // 创建拖拽预览图
      const preview = document.createElement("div");
      preview.style.position = "absolute";
      preview.style.left = "-1000px";
      preview.style.top = "-1000px";
      preview.style.width = "60px";
      preview.style.height = "60px";
      preview.style.borderRadius = "10px";
      preview.style.overflow = "hidden";
      preview.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
      preview.style.zIndex = "9999";

      const img = document.createElement("img");
      img.src = icon.querySelector("img").src;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

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
      pot.style.transform = "scale(1.1)";
    });

    pot.addEventListener("dragleave", () => {
      pot.style.transform = "";
    });

    pot.addEventListener("drop", (e) => {
      e.preventDefault();
      pot.style.transform = "";

      const gifUrl = e.dataTransfer.getData("text/plain");
      if (!gifUrl) return;

      // 移除已有的动画
      const existingVideo = pot.querySelector(".seed-video");
      if (existingVideo) {
        existingVideo.remove();
      }

      // 创建视频元素
      const video = document.createElement("video");
      video.src = gifUrl;
      video.className = "seed-video";
      video.autoplay = true;
      video.muted = true;
      video.loop = false;
      video.playsInline = true;

      // 视频结束后暂停在最后一帧
      video.addEventListener("ended", function () {
        video.pause();
      });

      // 添加到花盆
      pot.appendChild(video);

      // 添加成功效果
      pot.animate(
        [
          { transform: "scale(1.1)", offset: 0.3 },
          { transform: "scale(1)", offset: 1 },
        ],
        {
          duration: 600,
          easing: "ease-out",
        }
      );
    });
  });
});
