const fuelTypeController = require('../components/fuelTypeController');
const express = require('express');
const router = express.Router();

router.get('/', fuelTypeController.getAllfuelTypes);

router.post('/', fuelTypeController.postNewfuelType);

router.get('/:id', fuelTypeController.getfuelType);

router.put('/:id', fuelTypeController.updatefuelType);

router.delete('/:id', fuelTypeController.deletefuelType);

module.exports = router;