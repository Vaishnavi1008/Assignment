const express = require("express");
const Router = express.Router();
const { authenticateToken } = require("../Middleware/AuthenticateToken");
const { roleCheck } = require("../Controller/Login");
const {
  ProductBulkInsert,
  ProductGet,
  ProductInsertUpdate,
  ExportToExcel
} = require("../Controller/Product");


//below our endpoints

Router.post(
  "/ProductBulkInsert",
  authenticateToken,
  roleCheck("user"),
  ProductBulkInsert
);
Router.post(
  "/ProductInsertUpdate",
  authenticateToken,
  roleCheck("user"),
  ProductInsertUpdate
);
Router.get("/ProductGet", authenticateToken, roleCheck("user"), ProductGet);

Router.get(
  "/ExporttoExcel",
  authenticateToken,
  roleCheck("user"),
  ExportToExcel
);
module.exports = Router;
