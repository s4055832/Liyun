// flower1.js

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
    if (seedDropdown.style.display === "grid") {
      seedDropdown.style.display = "none";
    } else {
      seedDropdown.style.display = "grid";
    }
  });

  // 点击侧边栏内其他地方或外部空白时隐藏种子菜单
  document.addEventListener("click", (e) => {
    // 如果点击目标既不在“选种子”按钮，也不在种子菜单内，则隐藏
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

      // 拖拽时显示一个较小预览图
      const dragPreview = document.createElement("img");
      dragPreview.src = icon.querySelector("img").src;
      dragPreview.style.width = "40px";
      dragPreview.style.height = "40px";
      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 20, 20);

      // 拖拽开始后立即移除预览图节点
      setTimeout(() => {
        document.body.removeChild(dragPreview);
      }, 0);
    });
  });

  // 在每个 pot-item 上处理拖放
  potItems.forEach((pot) => {
    pot.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    pot.addEventListener("drop", (e) => {
      e.preventDefault();
      const gifUrl = e.dataTransfer.getData("text/plain");
      if (!gifUrl) return;

      // 如果 pot-item 已有旧的 GIF，先移除
      const existingGif = pot.querySelector(".seed-gif");
      if (existingGif) {
        existingGif.remove();
      }

      // 创建并插入新的 <img class="seed-gif">
      const gifImg = document.createElement("img");
      gifImg.src = gifUrl;
      gifImg.className = "seed-gif";
      pot.appendChild(gifImg);

      // 2 秒后淡出并移除 GIF
      setTimeout(() => {
        gifImg.style.transition = "opacity 0.3s";
        gifImg.style.opacity = "0";
        setTimeout(() => {
          if (pot.contains(gifImg)) {
            pot.removeChild(gifImg);
          }
        }, 300);
      }, 2000);
    });
  });
});

// flower1.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. 给每个种子图标添加拖拽逻辑
  const seedIcons = document.querySelectorAll(".seed-icon");
  seedIcons.forEach((icon) => {
    icon.addEventListener("dragstart", (e) => {
      // 从 data-gif 属性读取对应 GIF 的 URL
      const gifUrl = icon.getAttribute("data-gif");
      e.dataTransfer.setData("text/plain", gifUrl);

      // 可选：显示一个小预览图作为拖拽图像
      const preview = document.createElement("img");
      preview.src = icon.querySelector("img").src;
      preview.style.width = "40px";
      preview.style.height = "40px";
      document.body.appendChild(preview);
      e.dataTransfer.setDragImage(preview, 20, 20);
      setTimeout(() => document.body.removeChild(preview), 0);
    });
  });

  // 2. 让每个花盆 (pot-item) 可以接受拖放
  const potItems = document.querySelectorAll(".pot-item");
  potItems.forEach((pot) => {
    pot.addEventListener("dragover", (e) => {
      e.preventDefault(); // 必须阻止默认才能允许 drop
    });

    pot.addEventListener("drop", (e) => {
      e.preventDefault();
      const gifUrl = e.dataTransfer.getData("text/plain");
      if (!gifUrl) return;

      // 如果已经存在旧的 GIF，先移除
      const oldGif = pot.querySelector(".seed-gif");
      if (oldGif) oldGif.remove();

      // 创建新的 <img class="seed-gif">，放在花盆上方
      const gifImg = document.createElement("img");
      gifImg.src = gifUrl;
      gifImg.className = "seed-gif";
      pot.appendChild(gifImg);

      // 2 秒后淡出并移除，营造“生长”效果
      setTimeout(() => {
        gifImg.style.transition = "opacity 0.3s";
        gifImg.style.opacity = "0";
        setTimeout(() => {
          if (pot.contains(gifImg)) {
            pot.removeChild(gifImg);
          }
        }, 300);
      }, 2000);
    });
  });
});
