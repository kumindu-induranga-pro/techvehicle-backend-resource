const profileController = require('../components/profileController');
const express = require('express');
const router = express.Router();

router.get('/', profileController.getAllProfiles);

router.post('/', profileController.postNewProfile);

router.get('/:id', profileController.getProfile);

router.put('/:id', profileController.updateProfile);

router.delete('/:id', profileController.deleteProfile);

module.exports = router;