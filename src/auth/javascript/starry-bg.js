(function () {
  "use strict";

  // Inject CSS styles
  function injectStyles() {
    const css = `
/* Starry Background Styles - UPDATED COLOR */
.starry-bg {
    position: relative;
    /* Không set overflow: hidden ở đây nếu nó làm mất nội dung của bạn, 
       nhưng thường background nên có hidden */
    overflow: hidden; 
    background-color: #0D335F !important; /* Màu nền của bạn */
}

/* Lớp sương mù nhẹ để tạo chiều sâu */
.starry-bg::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}

/* Glow effect - Logic cũ của bạn */
.starry-bg-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
}

.starry-dot {
    position: absolute;
    background: rgba(255, 255, 255, 0.6); /* Màu dịu hơn */
    border-radius: 50%;
    animation: starry-twinkle ease-in-out infinite;
    z-index: 1;
    pointer-events: none;
}

.starry-shape {
    position: absolute;
    /* Filter nhẹ nhàng hơn */
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
    animation: starry-twinkle ease-in-out infinite;
    z-index: 1;
    pointer-events: none;
}

@keyframes starry-twinkle {
    0%, 100% { 
        opacity: 0.3;
        transform: scale(0.8);
    }
    50% { 
        opacity: 0.9;
        transform: scale(1.2);
    }
}
        `;

    const styleElement = document.createElement("style");
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }

  // Random helper
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Tạo ngôi sao chấm tròn (Logic cũ)
  function createDot(size, top, left, duration, delay) {
    const dot = document.createElement("div");
    dot.className = "starry-dot";
    // Thêm animation time vào style inline để random
    dot.style.cssText = `
            width: ${size}px; height: ${size}px; 
            top: ${top}%; left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
    return dot;
  }

  // Tạo ngôi sao hình 4 cánh (Logic cũ)
  function createShape(size, top, left, duration, delay) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "starry-shape");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.style.cssText = `
            width: ${size}px; height: ${size}px; 
            top: ${top}%; left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 0 L14.59 9.41 L24 12 L14.59 14.59 L12 24 L9.41 14.59 L0 12 L9.41 9.41 Z",
    );
    path.setAttribute("fill", "rgba(255, 255, 255, 0.5)"); // Màu trắng mờ

    svg.appendChild(path);
    return svg;
  }

  // Tạo tất cả các ngôi sao
  function createStars(container) {
    // 1. Giữ logic kiểm tra Glow của bạn
    if (!container.querySelector(".starry-bg-glow")) {
      const glow = document.createElement("div");
      glow.className = "starry-bg-glow";
      container.appendChild(glow);
    }

    // 2. Thay thế mảng cứng bằng vòng lặp random (60 chấm + 60 hình)

    // Tạo 60 Dots
    for (let i = 0; i < 60; i++) {
      const size = random(1, 3); // Size 1-3px
      const top = random(0, 100); // Vị trí ngẫu nhiên
      const left = random(0, 100);
      const duration = random(3, 7); // Thời gian nhấp nháy 3-7s
      const delay = random(0, 5); // Độ trễ

      container.appendChild(createDot(size, top, left, duration, delay));
    }

    // Tạo 60 Shapes
    for (let i = 0; i < 60; i++) {
      const size = random(6, 12); // Size 6-12px
      const top = random(0, 100);
      const left = random(0, 100);
      const duration = random(4, 8);
      const delay = random(0, 5);

      container.appendChild(createShape(size, top, left, duration, delay));
    }
  }

  // Initialize
  function init() {
    injectStyles();

    const containers = document.querySelectorAll(".starry-bg");
    containers.forEach((container) => {
      // Logic cũ: Chỉ tạo nếu chưa có glow (tránh tạo 2 lần)
      if (!container.querySelector(".starry-bg-glow")) {
        createStars(container);
      }
    });
  }

  // Chạy khi DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export object như cũ để bạn dùng thủ công
  window.StarryBg = {
    init: init,
    createOn: function (element) {
      if (element && !element.querySelector(".starry-bg-glow")) {
        element.classList.add("starry-bg");
        createStars(element);
      }
    },
  };
})();
