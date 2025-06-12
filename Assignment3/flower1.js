document.addEventListener("DOMContentLoaded", function () {
  // === 天气视频切换逻辑 ===
  // 获取页面全屏播放的 weatherVideo 元素，用于切换晴天/雨天视频
  var weatherVideo = document.getElementById("weather-video");
  var isSunny = true; // 状态标志：true 初始状态为晴天，需要切换到雨天

  // 获取侧边栏的 Weather 按钮
  var weatherBtn = document.getElementById("toggle-weather-btn");
  weatherBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // 阻止事件冒泡，以免触发关闭侧边栏的逻辑
    if (isSunny) {
      weatherVideo.src = "rain.mp4"; // 切换到雨天
    } else {
      weatherVideo.src = "sun.mp4"; // 切换回晴天
    }
    weatherVideo.play();
    isSunny = !isSunny; // 翻转状态标志，下次点击反向切换
  });

  // === 背景音乐播放控制 ===
  // 使用 Audio 对象加载背景音乐文件，便于统一暂停/播放控制
  var bgMusic = new Audio("background.m4a");
  bgMusic.loop = true; // 循环播放
  bgMusic.play().catch(function () {
    // 某些浏览器限制自动播放，提醒用户手动点击
    console.warn(
      "Autoplay is blocked, please click the Music button to start the audio."
    ); //来自chatgpt的优化方案
  });

  // 获取侧边栏 Music 按钮，点击时切换播放/暂停
  var sidebarMusicBtn = document.getElementById("sidebar-music-btn");
  sidebarMusicBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  });

  // === 侧边栏打开/关闭逻辑 ===
  var toggleSidebarBtn = document.getElementById("toggle-sidebar");
  var sidebar = document.getElementById("sidebar");
  var sidebarCloseBtn = document.getElementById("sidebar-close");

  // 点击菜单图标，切换，控制侧边栏平移
  toggleSidebarBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });

  // 点击侧边栏内的关闭按钮，移除 open 类名
  sidebarCloseBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.remove("open");
  });

  // 点击页面任何非侧边栏区域时自动关闭侧边栏
  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // Seeds 下拉菜单逻辑
  var seedToggleBtn = document.getElementById("seed-toggle-btn");
  var seedDropdown = document.getElementById("seed-dropdown");

  // 点击 Seeds 按钮显示或隐藏下拉面板
  seedToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (seedDropdown.style.display === "grid") {
      seedDropdown.style.display = "none";
    } else {
      seedDropdown.style.display = "grid";
    }
  });

  // 点击其他地方时隐藏下拉面板
  document.addEventListener("click", function (e) {
    if (!seedToggleBtn.contains(e.target) && !seedDropdown.contains(e.target)) {
      seedDropdown.style.display = "none";
    }
  });

  // 拖拽与生长效果
  var seedIcons = document.querySelectorAll(".seed-icon");
  var potItems = document.querySelectorAll(".pot-item");

  // 为每个种子图标绑定 dragstart，传递视频路径并创建拖拽预览
  seedIcons.forEach(function (icon) {
    icon.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", icon.dataset.mp4); // 存储要播放的 mp4 路径

      // 创建一个预览元素，提高拖拽 UX
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

  // 为每个花盆绑定 dragover/drop，实现视频播放和生长动画
  potItems.forEach(function (pot) {
    pot.addEventListener("dragover", function (e) {
      e.preventDefault();
    }); // 允许 drop
    pot.addEventListener("drop", function (e) {
      e.preventDefault();
      var mp4Url = e.dataTransfer.getData("text/plain");
      if (!mp4Url) return;

      // 清除旧的视频元素和定格图
      var oldVideo = pot.querySelector(".plant-video");
      if (oldVideo) oldVideo.remove();
      var oldFrame = pot.querySelector(".final-frame");
      if (oldFrame) oldFrame.remove();

      // 添加生长文字，增强视觉反馈
      var txt = document.createElement("div");
      txt.className = "growing-text";
      txt.textContent = "🌱 Growing...";
      pot.appendChild(txt);
      setTimeout(function () {
        txt.remove();
      }, 3000);

      // 创建并播放植物生长视频
      var video = document.createElement("video");
      video.src = mp4Url;
      video.className = "plant-video";
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;

      // 视频结束后定格在最后一帧，保留视觉效果，不用切换到png.借鉴自chatgpt
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
