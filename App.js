const express = require('express'); //import express
const app = express() //using express
const cookieParser = require('cookie-parser');
const router = require('./Router');

app.use(cookieParser());
 app.use(express.json()) //for using middleware for eg : postman and frontend send data in json if we do not use this we cannot do crud
 app.use('/api',router) //calling router

app.listen('5000',()=> console.log('res'))