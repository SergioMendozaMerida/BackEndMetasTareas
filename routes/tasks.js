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

let tasks = [];

router.get('/getTasks', function(req, res, next){
    let queryGetTasks = 'SELECT * FROM tasks';
    connection.query(queryGetTasks, function(err, results, filds){
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(results);
        }
    })
})

router.post('/addTask', function(req, res, next){
    if (req.body && req.body.name && req.body.description && req.body.dueDate){
        let queryCreateTasks = 'INSERT INTO tasks (name, description, dueDate) \
        VALUES("'+req.body.name+'","'+req.body.description+'","'+req.body.dueDate+'")';''
        connection.query(queryCreateTasks, function(err, results, filds){
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json(results);
            }
        })
    }    
})

router.delete('/removeTask/:id', function(req, res, next){
    if(req.params && req.params.id){
        let id = req.params.id;
        let queryDeleteTask = 'DELETE FROM tasks WHERE id="'+id+'"';
        connection.query(queryDeleteTask, function(err, results, filds){
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