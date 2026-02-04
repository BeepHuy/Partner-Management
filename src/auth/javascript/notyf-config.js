
// Khởi tạo Notyf
const notyf = new Notyf({
  duration: 5000,
  position: { x: 'right', y: 'top' },
  dismissible: true,
  ripple: true
});

// Helper functions
const NotifyHelper = {
  // Thông báo thành công
  success(message, duration = 5000) {
    notyf.open({ type: 'success', message, duration });
  },

  // Thông báo lỗi
  error(message, duration = 5000) {
    notyf.open({ type: 'error', message, duration });
  },

  // Hiển thị nhiều lỗi với delay
  showErrors(errors, delay = 800) {
    if (!Array.isArray(errors)) {
      this.error(errors);
      return;
    }

    errors.forEach((error, index) => {
      setTimeout(() => {
        const message = typeof error === 'string' 
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
  }
};

// Export cho global
window.NotifyHelper = NotifyHelper;
window.notyf = notyf;