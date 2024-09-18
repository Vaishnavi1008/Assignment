const express = require('express');
const Router = express.Router()
const {authenticateToken} = require('./Controller/AuthenticateToken'); 
const {roleCheck} = require('./Controller/Login')
const {CategoryInsertUpdate,CategoryGet} = require('./Controller/Category')
const {ProductBulkInsert,ProductGet,ProductInsertUpdate} = require('./Controller/Product')
const {LoginInsert,LoginGet,LoginGetByEmail} = require('./Controller/Login')
const {ExporttoExcel} = require('./Controller/ExportToExcel')
//below our endpoints 

Router.post('/CategoryInsertUpdate',authenticateToken,roleCheck('user'),CategoryInsertUpdate)
Router.get('/CategoryGet',authenticateToken,roleCheck('user'),CategoryGet)
 Router.post('/ProductBulkInsert',authenticateToken,roleCheck('user'),ProductBulkInsert)
 Router.post('/ProductInsertUpdate',authenticateToken,roleCheck('user'),ProductInsertUpdate)
 Router.get('/ProductGet',authenticateToken,roleCheck('user'),ProductGet)
 Router.post('/LoginInsert',LoginInsert)
 Router.get('/LoginGet',authenticateToken,LoginGet)
 Router.get('/LoginGetByEmail',LoginGetByEmail)
 Router.get('/ExporttoExcel',authenticateToken,roleCheck('user'),ExporttoExcel)
module.exports = Router
