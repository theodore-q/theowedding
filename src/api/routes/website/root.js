const express = require('express');
const {pick} = require('lodash');

const router = express.Router();
var path = require('path');


 
router.route('/').get((req,res)=>{
    res.sendFile(path.join(__dirname + '../../../../websiteFrontEnd/index.html'));
});

module.exports = router;
