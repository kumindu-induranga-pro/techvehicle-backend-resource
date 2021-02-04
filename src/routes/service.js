const serviceController = require('../components/serviceController');
const express = require('express');
const router = express.Router();

router.get('/', serviceController.getAllServices);

router.post('/', serviceController.postNewService);

router.get('/:id', serviceController.getService);

router.put('/:id', serviceController.updateService);

router.delete('/:id', serviceController.deleteService);

module.exports = router;