const form = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const messageEl = document.getElementById('message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  window.authApi.clearMessage(messageEl);

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const profilePicture = document.getElementById('profilePicture').files[0];

  if (name.length < 2) {
    return window.authApi.showMessage(messageEl, 'Name must be at least 2 characters', 'error');
  }

  if (password.length < 6) {
    return window.authApi.showMessage(messageEl, 'Password must be at least 6 characters', 'error');
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  if (profilePicture) formData.append('profilePicture', profilePicture);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account...';

  try {
    const data = await window.authApi.request('/auth/register', {
      method: 'POST',
      body: formData,
    });

    window.authApi.setToken(data.token);
    window.authApi.showMessage(messageEl, 'Registration successful. Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = './profile.html';
    }, 700);
  } catch (error) {
    window.authApi.showMessage(messageEl, error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
});
