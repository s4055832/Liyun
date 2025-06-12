// 侧边栏音乐按钮
document.addEventListener("DOMContentLoaded", () => {
  // 创建并播放背景音乐
  const bgMusic = new Audio("background.mp3"); // ← 指向你的音乐文件
  bgMusic.loop = true;
  bgMusic.play().catch(() => {
    // 某些浏览器需要用户手势才能播放
    console.warn("浏览器阻止了自动播放，请点击 Music 按钮播放音频。");
  });

  // 侧边栏 Music 按钮
  const sidebarMusicBtn = document.getElementById("sidebar-music-btn");
  sidebarMusicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  });
  // 侧边栏开关
  const toggleBtn = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("sidebar-close");
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.remove("open");
  });
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target))
      sidebar.classList.remove("open");
  });

  // Seeds 下拉
  const seedToggle = document.getElementById("seed-toggle-btn");
  const seedDropdown = document.getElementById("seed-dropdown");
  seedToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    seedDropdown.style.display =
      seedDropdown.style.display === "grid" ? "none" : "grid";
  });
  document.addEventListener("click", (e) => {
    if (!seedToggle.contains(e.target) && !seedDropdown.contains(e.target))
      seedDropdown.style.display = "none";
  });

  // 生成网格并添加拖拽事件
  const grid = document.getElementById("grid-container");
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      const action = e.dataTransfer.getData("action");
      if (action === "remove") {
        cell.innerHTML = "";
        return;
      }
      const mp4 = e.dataTransfer.getData("text/plain");
      cell.innerHTML = "";
      const video = document.createElement("video");
      video.src = mp4;
      video.autoplay = true;
      video.muted = true;
      video.play();
      video.addEventListener("ended", function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const img = document.createElement("img");
        img.className = "final-frame";
        img.src = canvas.toDataURL();
        cell.innerHTML = "";
        cell.appendChild(img);
      });
      cell.appendChild(video);
    });
    grid.appendChild(cell);
  }

  // 拖拽初始化
  document
    .querySelectorAll(".seed-icon")
    .forEach((icon) =>
      icon.addEventListener("dragstart", (e) =>
        e.dataTransfer.setData("text/plain", icon.dataset.mp4)
      )
    );
  document
    .querySelectorAll(".remove-icon")
    .forEach((icon) =>
      icon.addEventListener("dragstart", (e) =>
        e.dataTransfer.setData("action", icon.dataset.action)
      )
    );
});
