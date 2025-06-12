window.addEventListener("DOMContentLoaded", function () {
  //天气视频切换逻辑，与flower1一致
  // 获取页面全屏播放的 weatherVideo 元素，用于切换晴天/雨天视频
  var weatherVideo = document.getElementById("weather-video");
  var isSunny = true;

  // 获取侧边栏的 Weather 按钮，点击后切换天气视频
  var weatherBtn = document.getElementById("toggle-weather-btn");
  weatherBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // 阻止事件冒泡，避免与侧边栏关闭逻辑冲突
    if (isSunny) {
      weatherVideo.src = "rain.mp4";
    } else {
      weatherVideo.src = "sun.mp4";
    }
    // 切换后重新播放，保证视频即时生效
    weatherVideo.play();
    // 翻转状态，下次点击反向切换
    isSunny = !isSunny;
  });

  // 背景音乐播放控制（与flower1一致）
  // 使用 Audio 对象加载音乐，便于统一播放/暂停控制
  var bgMusic = new Audio("background.m4a");
  bgMusic.loop = true; // 循环播放
  bgMusic.play().catch(function () {
    console.warn("自动播放被阻止，请点击 Music 按钮启动音频。");
  });

  // 获取侧边栏的 Music 按钮，点击后切换播放/暂停
  var sidebarMusicBtn = document.getElementById("sidebar-music-btn");
  sidebarMusicBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // 阻止冒泡，避免关闭侧边栏
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  });

  // === 侧边栏打开/关闭逻辑 ===
  var toggleBtn = document.getElementById("toggle-sidebar");
  var sidebar = document.getElementById("sidebar");
  var closeBtn = document.getElementById("sidebar-close");

  // 点击菜单按钮，切换侧边栏显示状态
  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });

  // 点击侧边栏内关闭按钮，隐藏侧边栏
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.remove("open");
  });

  // 点击页面空白，自动关闭侧边栏
  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // === Seeds 下拉菜单逻辑 ===
  var seedToggle = document.getElementById("seed-toggle-btn");
  var seedDropdown = document.getElementById("seed-dropdown");

  // 点击 Seeds 按钮展开/收起下拉
  seedToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (seedDropdown.style.display === "grid") {
      seedDropdown.style.display = "none";
    } else {
      seedDropdown.style.display = "grid";
    }
  });

  // 点击其他区域，隐藏下拉菜单
  document.addEventListener("click", function (e) {
    if (!seedToggle.contains(e.target) && !seedDropdown.contains(e.target)) {
      seedDropdown.style.display = "none";
    }
  });

  // === 网格生成及拖拽事件绑定 ===
  var grid = document.getElementById("grid-container");
  for (var i = 0; i < 25; i++) {
    var cell = document.createElement("div");
    cell.className = "grid-cell";
    // 允许拖拽元素悬停
    cell.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    // 处理放置逻辑：移除/播放视频/定格
    cell.addEventListener("drop", function (e) {
      e.preventDefault();
      var action = e.dataTransfer.getData("action");
      if (action === "remove") {
        // 铲除操作：清空单元格内容
        this.innerHTML = "";
        return;
      }
      // 获取视频路径，清空旧内容
      var mp4 = e.dataTransfer.getData("text/plain");
      this.innerHTML = "";
      var video = document.createElement("video");
      video.src = mp4;
      video.autoplay = true;
      video.muted = true;
      video.play();
      // 视频结束后定格最后一帧
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

  // === 拖拽初始化：种子与铲除操作 ===
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
