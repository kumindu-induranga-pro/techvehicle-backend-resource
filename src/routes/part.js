const partController = require('../components/partController');
const express = require('express');
const router = express.Router();

router.get('/', partController.getAllParts);

router.post('/', partController.postNewPart);

router.get('/:id', partController.getPart);

router.put('/:id', partController.updatePart);

router.delete('/:id', partController.deletePart);

module.exports = router;