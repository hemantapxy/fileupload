const express = require('express');
const router = express.Router();

const {localFileUpload,imageUpload} = require('../controllers/FileUpload');

//api routes
// router.post('/image', imageUpload);
// router.post('/video', videoUpload);
// router.post('/image-reduce', imageReduceUpload);
router.post('/localFileUpload', localFileUpload);
router.post('/imageUpload', imageUpload);

module.exports = router;
