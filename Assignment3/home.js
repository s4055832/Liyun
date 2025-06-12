window.addEventListener("DOMContentLoaded", function () {
  // === 音乐控制逻辑 ===
  // 获取音乐控制按钮和音频元素
  var musicControl = document.getElementById("musicControl");
  var bgMusic = document.getElementById("bgMusic");
  // 音乐状态标志，初始为播放中
  var isPlaying = true;
  // 音乐图标，用于切换图标显示
  var musicIcon = musicControl.querySelector("i");

  // 尝试自动播放背景音乐
  function initMusic() {
    var playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(function (error) {
        // 浏览器阻止自动播放，需要用户点击触发
        isPlaying = false;
        musicIcon.classList.remove("fa-volume-up");
        musicIcon.classList.add("fa-volume-mute");
        console.log("自动播放被阻止，需要用户交互启动音频。");
      });
    }
  }
  initMusic(); // 初始化音乐播放

  // 点击音乐按钮切换播放/暂停
  musicControl.addEventListener("click", function () {
    if (isPlaying) {
      bgMusic.pause(); // 暂停音乐
      musicIcon.classList.remove("fa-volume-up");
      musicIcon.classList.add("fa-volume-mute");
    } else {
      bgMusic.play(); // 播放音乐
      musicIcon.classList.remove("fa-volume-mute");
      musicIcon.classList.add("fa-volume-up");
    }
    isPlaying = !isPlaying; // 更新状态
  });

  // === 页面导航逻辑 ===
  // 花盆选项点击简单反馈再跳转
  var potOption = document.getElementById("potOption");
  potOption.addEventListener("click", function () {
    // 点击动画反馈
    this.style.transform = "scale(0.95)";
    setTimeout(function () {
      // 恢复并跳转
      potOption.style.transform = "";
      window.location.href = "flower1.html";
    }, 200);
  });

  // 花田选项同理
  var fieldOption = document.getElementById("fieldOption");
  fieldOption.addEventListener("click", function () {
    this.style.transform = "scale(0.95)";
    setTimeout(function () {
      fieldOption.style.transform = "";
      window.location.href = "flower2.html";
    }, 200);
  });

  // === 键盘快捷键逻辑 ===
  document.addEventListener("keydown", function (e) {
    switch (e.code) {
      case "Space":
        // 空格键控制音乐播放，避免滚动页面
        e.preventDefault();
        musicControl.click();
        break;
      case "Digit1":
        // 按 1 进入花盆界面
        potOption.click();
        break;
      case "Digit2":
        // 按 2 进入花田界面
        fieldOption.click();
        break;
      default:
        // 其他按键不处理
        break;
    }
  });
});
