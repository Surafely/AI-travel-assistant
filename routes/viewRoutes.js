const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/trip/:slug', authController.isLoggedIn, viewsController.getTrip);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get(
  '/forgotPassword',
  authController.isLoggedIn,
  viewsController.getForgotPasswordForm,
);

router.get(
  '/resetPassword/:token',
  authController.isLoggedIn,
  viewsController.getResetPasswordForm,
);

router.get('/me', authController.protect, viewsController.getAccount);
router.get('/assistant', authController.protect, viewsController.getAssistant);
router.get('/signup', viewsController.signup);

module.exports = router;
