const checkListController = require('../components/checkListController');
const express = require('express');
const router = express.Router();

router.get('/', checkListController.getAllcheckLists);

router.post('/', checkListController.postNewcheckList);

router.get('/:id', checkListController.getcheckList);

router.put('/:id', checkListController.updatecheckList);

router.delete('/:id', checkListController.deletecheckList);

module.exports = router;