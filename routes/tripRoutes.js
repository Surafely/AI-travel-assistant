const express = require('express');
const tripController = require('../controllers/tripController');
const router = express.Router();

router.param('id', tripController.checkId);

router
  .route('/')
  .get(tripController.getAllTrips)
  .post(tripController.createTrip);
router
  .route('/:id')
  .get(tripController.getTrip)
  .patch(tripController.updateTrip)
  .delete(tripController.deleteTrip);

module.exports = router;
