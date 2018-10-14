const express = require('express');
const _ = require('lodash');
const vars = require('../../../config/vars')

const router = express.Router();


const pgString = vars.pg.uri;


var pg = require('knex')({
  client: 'pg',
  connection: pgString,
  searchPath: ['knex', 'public'],
});
 
router.route('/register').post((req,res)=>{

  console.log('req.body',req.body);

  var foo = _.pickBy(req.body);

  var formResults =  _.pick(foo,['name','guests','coming_status','password','email','questions'])
  
  pg('save_the_date_responses') .returning('*').insert(formResults).then((inserted)=>{
      res.send({status:'submited'});
  }).catch((yo)=>{
      res.status(500).send({status:'not submitted'});
  })

});

router.route('/register').get((req,res)=>{

  res.send('sfsdsf')

  // var formResults =  pick(req.body,['name','guests','coming_status','password','notes'])
 

  // pg('save_the_date_responses').insert(formResults).then((res)=>{
  //     console.log(res)
  //     res.status(201).send('submited');
  // }).catch((yo)=>{
  //     console.log(yo)
  // })

});



module.exports = router;
