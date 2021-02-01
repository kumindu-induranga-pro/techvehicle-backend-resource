const categoryController = require('../components/categoryController');
const express = require('express');
const router = express.Router();

router.get('/', categoryController.getAllCategories);

router.post('/', categoryController.postNewCategory);

router.get('/:id', categoryController.getCategory);

router.put('/:id', categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;