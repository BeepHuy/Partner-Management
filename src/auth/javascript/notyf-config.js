/**
 * Shared Notyf Toast Notification Configuration
 * Usage: Include this file in your HTML, then use showSuccess() and showError()
 */

// Initialize Notyf instance
const notyf = new Notyf({
  duration: 5000,
  position: { x: 'right', y: 'center' },
  dismissible: true,
  ripple: true,
  types: [
    {
      type: 'success',
      background: '#4dd0e1',
      icon: {
        className: 'fas fa-check-circle',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'error',
      background: '#ff4d4f',
      icon: {
        className: 'fas fa-times-circle',
        tagName: 'i',
        color: 'white'
      }
    }
  ]
});

/**
 * Show success notification
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
  notyf.success(message);
}

/**
 * Show error notification
 * @param {string} message - Error message to display
 */
function showError(message) {
  notyf.error(message);
}

/**
 * Show custom notification
 * @param {string} type - Notification type ('success' or 'error')
 * @param {string} message - Message to display
 */
function showNotification(type, message) {
  if (type === 'success') {
    showSuccess(message);
  } else {
    showError(message);
  }
}