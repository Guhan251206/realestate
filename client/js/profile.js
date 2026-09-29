const messageEl = document.getElementById('message');
const logoutBtn = document.getElementById('logoutBtn');
const avatarEl = document.getElementById('avatar');
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');

const fallbackAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23d1fae5"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Arial" font-size="14" fill="%2306513f">No Image</text></svg>';

const loadProfile = async () => {
  const token = window.authApi.getToken();
  if (!token) {
    window.location.href = './login.html';
    return;
  }

  try {
    const data = await window.authApi.request('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    nameEl.textContent = data.user.name;
    emailEl.textContent = data.user.email;
    avatarEl.src = data.user.profilePicture || fallbackAvatar;
    avatarEl.onerror = () => {
      avatarEl.src = fallbackAvatar;
    };
  } catch (error) {
    window.authApi.showMessage(messageEl, 'Session expired. Please login again.', 'error');
    window.authApi.clearToken();
    setTimeout(() => {
      window.location.href = './login.html';
    }, 900);
  }
};

logoutBtn.addEventListener('click', () => {
  window.authApi.clearToken();
  window.location.href = './login.html';
});

loadProfile();
