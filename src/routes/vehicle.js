const vehicleController = require('../components/vehicleController');
const express = require('express');
const router = express.Router();

router.get('/', vehicleController.getAllVehicles);

router.post('/', vehicleController.postNewVehicle);

router.get('/:id', vehicleController.getVehicle);

router.put('/:id', vehicleController.updateVehicle);

router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;