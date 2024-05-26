var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const router = express.Router();
var goalsRouter = require('./routes/goals');
var tasksRouter =  require('./routes/tasks');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersTasks = require('./routes/tasks');
var usersGoals = require('./routes/goals');

var app = express();
//INSERTANCO DATOS PARA LA CONECCIÓN A MYSQL EN EL USUARIO ROOT
const mysql =require('mysql2');
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'mysql',
  password:'CerjioCerjio'
});
//CONECTANDO CON MYSQL
connection.connect(function(err){
  if(err){
    console.error('error al conectar '+err.stack);
    return;
  }
  console.log('conected as id '+connection.threadId);
});

//CREANDO LA BASE DE DATOS Y LAS TABLAS
let queryCreateDB = 'CREATE DATABASE IF NOT EXISTS proyectoDesarrolloWeb';
let queryCreateTableGoals = 'CREATE TABLE IF NOT EXISTS `goals` ( \
  `id` int(11) NOT NULL auto_increment, \   \
  `name` varchar(250) NOT NULL default \'\', \
  `description` varchar(250) NOT NULL default \'\', \
  `dueDate` varchar(250) NOT NULL default \'\', \
  PRIMARY KEY   (`id`) \
  );' 
  let queryCreateTableTasks = 'CREATE TABLE IF NOT EXISTS `tasks` ( \
    `id` int(11) NOT NULL auto_increment, \   \
    `name` varchar(250) NOT NULL default \'\', \
    `description` varchar(250) NOT NULL default \'\', \
    `dueDate` varchar(250) NOT NULL default \'\', \
    PRIMARY KEY   (`id`) \
    );' 

//REALIZANDO QUERY PARA CREAR BASE DE DATOS
connection.query(queryCreateDB, function(err, results, filds){
  if(err){
    console.log(err);
    return;
  }else{
    console.log(results);
  }
})
//REALIZANDO QUERY PARA CREAR TABLA GOALS
connection.query(queryCreateTableGoals, function(err, results, filds){
  if(err){
    console.log('error al crear la tabla '+err);
    return;
  }else{
    console.log(results);
  }
})
connection.query(queryCreateTableTasks, function(err, results, filds){
  if(err){
    console.log('error al crear la tabla '+err);
    return;
  }else{
    console.log(results);
  }
})

//connection.destroy();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/goals', goalsRouter);
app.use('/tasks', tasksRouter);

router.use((req, res, next)=>{
  if(req.headers.authorization && req.headers.authorization === '123456'){
    next();
  }else{
    res.status(401).json({'error':'no se encontro autorizacion'})
  }
});

app.use('/',router);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', usersTasks);
app.use('/goals', usersGoals);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
