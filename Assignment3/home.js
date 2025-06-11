document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const musicControl = document.getElementById("musicControl");
  const bgMusic = document.getElementById("bgMusic");
  const potOption = document.getElementById("potOption");
  const fieldOption = document.getElementById("fieldOption");
  const musicIcon = musicControl.querySelector("i");

  // 音乐播放状态
  let isPlaying = true;

  // 初始化音乐播放
  function initMusic() {
    // 尝试自动播放音乐
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // 自动播放失败，显示静音状态
        isPlaying = false;
        musicIcon.classList.remove("fa-volume-up");
        musicIcon.classList.add("fa-volume-mute");
        console.log("自动播放被阻止，需要用户交互");
      });
    }
  }

  // 初始化音乐
  initMusic();

  // 音乐控制按钮事件
  musicControl.addEventListener("click", function () {
    if (isPlaying) {
      // 暂停音乐
      bgMusic.pause();
      musicIcon.classList.remove("fa-volume-up");
      musicIcon.classList.add("fa-volume-mute");
    } else {
      // 播放音乐
      bgMusic.play();
      musicIcon.classList.remove("fa-volume-mute");
      musicIcon.classList.add("fa-volume-up");
    }
    isPlaying = !isPlaying;
  });

  // 花盆选项点击事件
  potOption.addEventListener("click", function () {
    // 添加点击反馈效果
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";
      window.location.href = "flower1.html";
    }, 200);
  });

  // 花田选项点击事件
  fieldOption.addEventListener("click", function () {
    // 添加点击反馈效果
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";
      window.location.href = "flower2.html";
    }, 200);
  });

  // 添加键盘快捷键
  document.addEventListener("keydown", function (e) {
    // 空格键控制音乐
    if (e.code === "Space") {
      e.preventDefault();
      musicControl.click();
    }
    // 1键进入花盆
    else if (e.code === "Digit1") {
      potOption.click();
    }
    // 2键进入花田
    else if (e.code === "Digit2") {
      fieldOption.click();
    }
  });
});
