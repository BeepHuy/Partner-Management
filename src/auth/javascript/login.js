// Initialize Notyf
const notyf = new Notyf({
    duration: 4000,
    position: {
        x: 'right',
        y: 'top'
    },
    dismissible: true,
    ripple: true
});

// Toggle password visibility
const toggleEye = document.getElementById('toggleEye');
const passwordInput = document.getElementById('passwordInput');
const eyeIcon = toggleEye.querySelector('i');

toggleEye.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
});

// Form validation and submit
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');

// Remove error state on input
emailInput.addEventListener('input', function () {
    this.classList.remove('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');
});

passwordInput.addEventListener('input', function () {
    this.classList.remove('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');
});

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get values
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset error states
    emailInput.classList.remove('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');
    passwordInput.classList.remove('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');

    // Collect all errors
    let errors = [];

    // Validate Email
    if (email === '') {
        emailInput.classList.add('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');
        errors.push('Vui lòng nhập email');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailInput.classList.add('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');
            errors.push('Email không đúng định dạng');
        }
    }

    // Validate Password
    if (password === '') {
        passwordInput.classList.add('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');
        errors.push('Vui lòng nhập mật khẩu');
    } else if (password.length < 6) {
        passwordInput.classList.add('border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]');
        errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    // Show errors or success
    if (errors.length > 0) {
        // Show each error with delay
        errors.forEach((error, index) => {
            setTimeout(() => {
                notyf.error(error);
            }, index * 500);
        });
    } else {
        // Success
        notyf.success('Đăng nhập thành công! Chào mừng bạn quay trở lại.');

        // Optional: Redirect after success
        setTimeout(() => {
            // loginForm.reset();
            // window.location.href = '/dashboard'; // Uncomment to redirect
            console.log('Login successful with:', { email, password });
        }, 1500);
    }
});

// Responsive breakpoints info (for development)
function checkBreakpoint() {
    const width = window.innerWidth;
    let breakpoint = '';

    if (width <= 480) {
        breakpoint = 'Mobile Portrait (0-480px)';
    } else if (width <= 767) {
        breakpoint = 'Mobile Landscape (481-767px)';
    } else if (width <= 1024) {
        breakpoint = 'Tablet/iPad (768-1024px)';
    } else if (width <= 1536) {
        breakpoint = 'Laptop (1025-1536px)';
    } else {
        breakpoint = 'TV/Large Desktop (1536px+)';
    }

    console.log('Current breakpoint:', breakpoint, '- Width:', width + 'px');
}

// Check on load and resize
window.addEventListener('load', checkBreakpoint);
window.addEventListener('resize', checkBreakpoint);