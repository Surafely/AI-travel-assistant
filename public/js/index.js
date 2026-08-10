/* eslint-disable */
// const displayMap = require('./leaflet')
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login, logout, signup, forgotPassword, resetPassword } from './login';
import { updateSettings } from './updateSattings';
import { initSidebar, initMobileSidebar } from './assistant/sidebar';
import { initChatForm } from './assistant/chatForm';
import { initNewChat } from './assistant/newChat';

const assistantPage = document.querySelector('.assistant');

if (assistantPage) {
  initSidebar();
  initChatForm();
  initNewChat();
  initMobileSidebar();
}

// DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const formUser = document.querySelector('.form-user-data');
const formPassword = document.querySelector('.form-user-password');
const signupForm = document.querySelector('#signup-form');
const forgotPasswordForm = document.querySelector('#forgot-password-form');
const resetPasswordForm = document.querySelector('#reset-password-form');

if (leaflet) {
  const mapElement = leaflet;
  displayMap(mapElement);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: document.querySelector('#name').value,
      email: document.querySelector('#email').value,
      password: document.querySelector('#password').value,
      passwordConfirm: document.querySelector('#passwordConfirm').value,
    };

    signup(data);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#forgot-password-form #email').value;
    forgotPassword(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const token = document.querySelector('#reset-token').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    resetPassword(token, password, passwordConfirm);
  });
}

if (formUser) {
  formUser.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (formPassword) {
  formPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
  });

  document.querySelector('.btn--save-password').textContent = 'Update password';
  document.querySelector('#password-current').value = '';
  document.querySelector('#password').value = '';
  document.querySelector('#password-confirm').value = '';
}
