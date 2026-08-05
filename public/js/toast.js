export const showToast = async (message, type = 'success') => {
  const container = document.getElementById('toast-container');

  if (!container) return;

  const toast = document.createElement('div');

  toast.className = `toast ${type}`;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  toast.innerHTML = `
      <span>${icons[type] || 'ℹ'}</span>
      <span>${message}</span>
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');

    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 3000);
};
