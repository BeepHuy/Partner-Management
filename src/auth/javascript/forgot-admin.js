const forgotForm = document.getElementById('forgotForm');
const emailInput = document.getElementById('emailInput');

// Constants
const ERROR_CLASS = ['border-red-500', 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'];
const SUCCESS_CLASS = ['border-green-500', 'shadow-[0_0_0_3px_rgba(34,197,94,0.1)]'];

// Remove error on input
emailInput.addEventListener('input', () => {
  emailInput.classList.remove(...ERROR_CLASS, ...SUCCESS_CLASS);
});

// Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Form submit
forgotForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const errors = [];

  // Reset styles
  emailInput.classList.remove(...ERROR_CLASS, ...SUCCESS_CLASS);

  // Validate email
  if (!email) {
    emailInput.classList.add(...ERROR_CLASS);
    errors.push('Please enter your email');
  } else if (!isValidEmail(email)) {
    emailInput.classList.add(...ERROR_CLASS);
    errors.push('Email format is invalid');
  }

  // Show errors or success
  if (errors.length > 0) {
    NotifyHelper.showErrors(errors, 500);
  } else {
    // Add success state
    emailInput.classList.add(...SUCCESS_CLASS);
    
    NotifyHelper.success('Password reset instructions have been sent to your email!');
    
    setTimeout(() => {
      console.log('Password reset requested for:', email);
      window.location.href = 'login.html';
    }, 2000);
  }
});