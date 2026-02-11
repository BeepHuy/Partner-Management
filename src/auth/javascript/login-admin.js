const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const toggleEye = document.getElementById('toggleEye');

// Constants
const ERROR_CLASS = ['border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'];

// Toggle password visibility
toggleEye?.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  
  const icon = toggleEye.querySelector('i');
  icon.classList.toggle('fa-eye', !isPassword);
  icon.classList.toggle('fa-eye-slash', isPassword);
});

// Remove error on input
[emailInput, passwordInput].forEach(input => {
  input.addEventListener('input', () => input.classList.remove(...ERROR_CLASS));
});

// Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Form submit
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const errors = [];

  // Reset errors
  emailInput.classList.remove(...ERROR_CLASS);
  passwordInput.classList.remove(...ERROR_CLASS);

  // Validate email
  if (!email) {
    emailInput.classList.add(...ERROR_CLASS);
    errors.push('Please enter your email');
  } else if (!isValidEmail(email)) {
    emailInput.classList.add(...ERROR_CLASS);
    errors.push('Email format is invalid');
  }

  // Validate password
  if (!password) {
    passwordInput.classList.add(...ERROR_CLASS);
    errors.push('Please enter your password');
  } else if (password.length < 6) {
    passwordInput.classList.add(...ERROR_CLASS);
    errors.push('Password must be at least 6 characters');
  }

  // Show errors or success
  if (errors.length > 0) {
    NotifyHelper.showErrors(errors, 500);
  } else {
    NotifyHelper.success('Login successful! Welcome back to admin dashboard.');
    setTimeout(() => {
      console.log('Login success:', { email, password });
      // window.location.href = '/admin/dashboard';
    }, 1500);
  }
});