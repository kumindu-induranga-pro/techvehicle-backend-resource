const centerController = require('../components/centerController');
const express = require('express');
const router = express.Router();

router.get('/', centerController.getAllCenters);

router.post('/', centerController.postNewCenter);

router.get('/:id', centerController.getCenter);

router.put('/:id', centerController.updateCenter);

router.delete('/:id', centerController.deleteCenter);

module.exports = router;