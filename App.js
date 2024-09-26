const express = require('express'); //import express
const app = express() //using express
const cookieParser = require('cookie-parser');
const categoryRouter = require('./Routes/Category');
const productRouter = require('./Routes/Products');
const Login = require('./Routes/Login')
app.use(cookieParser());
 app.use(express.json()) //for using middleware for eg : postman and frontend send data in json if we do not use this we cannot do crud
 app.use('/api',categoryRouter) //calling router
 app.use('/api',productRouter) 
 app.use('/api',Login) 
app.listen('5000',()=> console.log('res'))