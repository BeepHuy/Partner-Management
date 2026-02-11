// Khởi tạo Notyf
const notyf = new Notyf({
  duration: 5000,
  position: { x: "right", y: "top" },
  // dismissible: true,
  ripple: true,
});

// Helper functions
const NotifyHelper = {
  // Thông báo thành công
  success(message, duration = 5000) {
    notyf.open({ type: "success", message, duration });
  },

  // Thông báo đăng ký thành công với custom modal
  registrationSuccess() {
    // Tạo overlay
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] opacity-0 transition-opacity duration-300";

    // Tạo modal box
    const modal = document.createElement("div");
    modal.className =
      "bg-white/[0.83] backdrop-blur-[10px] rounded-2xl px-6 py-4 max-w-[550px] w-[90%] text-left scale-90 transition-transform duration-300 animate-pulse-shadow";

    // Tạo nội dung
    modal.innerHTML = `
      <div class="flex items-center gap-5">
        <div class="flex-shrink-0 w-[40px] h-[40px] bg-gradient-to-br from-[#08fd3a] to-[#47ffff] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(102,126,234,0.3)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-black leading-tight mb-4">
            Registration successful!
          </h2>
          <p class="text-base text-black leading-relaxed mb-3">
            We have sent a verification email to your address.
          </p>
          <p class="text-base text-black leading-relaxed">
            Please check your Inbox (or Spam folder) and click the verification link to complete your registration.
          </p>
        </div>
      </div>
    `;

    // Thêm CSS animation cho pulse shadow (chỉ cái này thôi vì Tailwind không có sẵn)
    if (!document.getElementById("registration-success-styles")) {
      const style = document.createElement("style");
      style.id = "registration-success-styles";
      style.textContent = `
        @keyframes pulse-shadow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(198, 215, 226, 0.14);
          }
          50% {
            box-shadow: 0 0 30px 10px rgba(198, 215, 226, 0.53);
          }
        }
        .animate-pulse-shadow {
          animation: pulse-shadow 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.remove("opacity-0");
      modal.classList.remove("scale-90");
      modal.classList.add("scale-100");
    });

    // Auto close sau 6 giây
    setTimeout(() => {
      overlay.classList.add("opacity-0");
      modal.classList.remove("scale-100");
      modal.classList.add("scale-90");
      setTimeout(() => overlay.remove(), 300);
      window.location.href = "login.html";
    }, 5000);

    // Click để đóng
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.add("opacity-0");
        modal.classList.remove("scale-100");
        modal.classList.add("scale-90");
        setTimeout(() => overlay.remove(), 300);
      }
    });
  },

  // Thông báo lỗi
  error(message, duration = 5000) {
    notyf.open({ type: "error", message, duration });
  },

  // Hiển thị nhiều lỗi với delay
  showErrors(errors, delay = 800) {
    if (!Array.isArray(errors)) {
      this.error(errors);
      return;
    }

    errors.forEach((error, index) => {
      setTimeout(() => {
        const message =
          typeof error === "string"
            ? error
            : error.step
              ? `[${error.step}] ${error.message}`
              : error.message;
        this.error(message);
      }, index * delay);
    });
  },

  // Đóng tất cả
  dismissAll() {
    notyf.dismissAll();
  },
};

// Export cho global
window.NotifyHelper = NotifyHelper;
window.notyf = notyf;
