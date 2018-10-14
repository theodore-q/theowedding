const express = require('express');

const router = express.Router();
const rootRoute = require('./root');


router.use('/',rootRoute);

router.use('/', express.static(__dirname + '../../../../websiteFrontEnd'));


module.exports = router;
