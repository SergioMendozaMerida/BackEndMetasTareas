var express = require('express');
var router = express.Router();
const mysql =require('mysql2');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'mysql',
    password:'CerjioCerjio'
  });

connection.connect(function(err){
    if(err){
      console.error('error al conectar '+err.stack);
      return;
    }
    console.log('conected as id '+connection.threadId);
  });

let goals = [];

router.get('/getGoals', function(req, res, next){
    let queryGetGoals = 'SELECT * FROM goals';
        connection.query(queryGetGoals, function(err, results, filds){
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json(results);
            }
        })
})

router.post('/addGoals', function(req, res, next){
    if (req.body && req.body.name && req.body.description && req.body.dueDate){
        let queryCreateGoal = 'INSERT INTO goals (name, description, dueDate) \
        VALUES("'+req.body.name+'","'+req.body.description+'","'+req.body.description+'")';
        connection.query(queryCreateGoal, function(err, results, filds){
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json(results);
            }
        })
    }
})

router.delete('/removeGoals/:id', function(req, res, next){
    if(req.params && req.params.id){
        let id = req.params.id;
        let queryDeleteGoal = 'DELETE FROM goals WHERE id="'+id+'"';
        connection.query(queryDeleteGoal, function(err, results, filds){
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json(results);
            }
        })
    }else{
        res.status(400).json([{}])
    }
})

module.exports = router