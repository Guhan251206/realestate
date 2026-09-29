const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const messageEl = document.getElementById('message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  window.authApi.clearMessage(messageEl);

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';

  try {
    const data = await window.authApi.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    window.authApi.setToken(data.token);
    window.authApi.showMessage(messageEl, 'Login successful. Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = './profile.html';
    }, 700);
  } catch (error) {
    window.authApi.showMessage(messageEl, error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
});
