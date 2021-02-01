const modelController = require('../components/modelController');
const express = require('express');
const router = express.Router();

router.get('/', modelController.getAllModels);

router.post('/', modelController.postNewModel);

router.get('/:id', modelController.getModel);

router.put('/:id', modelController.updateModel);

router.delete('/:id', modelController.deleteModel);

module.exports = router;