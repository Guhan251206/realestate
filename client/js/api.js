const API_BASE_URL = 'http://127.0.0.1:5000/api';
const TOKEN_KEY = 'auth_token';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const showMessage = (element, text, type) => {
  if (!element) return;
  element.textContent = text;
  element.className = `message ${type}`;
};

const clearMessage = (element) => {
  if (!element) return;
  element.textContent = '';
  element.className = 'message';
};

const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

window.authApi = {
  API_BASE_URL,
  getToken,
  setToken,
  clearToken,
  showMessage,
  clearMessage,
  request,
};
