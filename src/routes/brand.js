const brandController = require('../components/brandController');
const express = require('express');
const router = express.Router();

router.get('/', brandController.getAllBrands);

router.post('/', brandController.postNewBrand);

router.get('/:id', brandController.getBrand);

router.put('/:id', brandController.updateBrand);

router.delete('/:id', brandController.deleteBrand);

module.exports = router;