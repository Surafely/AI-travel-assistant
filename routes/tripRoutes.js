const express = require('express');
const tripController = require('../controllers/tripController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tripController.checkId);

router.route('/trip-stats').get(tripController.getTripStats);
router.route('/monthly-plan/:year').get(tripController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tripController.getAllTrips)
  .post(tripController.createTrip);
router
  .route('/:id')
  .get(tripController.getTrip)
  .patch(tripController.updateTrip)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tripController.deleteTrip,
  );

module.exports = router;
