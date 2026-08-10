/* eslint-disable */

import { showAlert } from './alert';

import axios from 'axios';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.error(err);

    showAlert(
      'error',
      err.response?.data?.message || err.message || 'Something went wrong',
    );
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out. Try again.');
  }
};

export const signup = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');

      setTimeout(() => {
        window.location.href = '/assistant';
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Something went wrong');
  }
};
