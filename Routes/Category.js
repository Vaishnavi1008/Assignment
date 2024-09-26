const express = require("express");
const Router = express.Router();
const { authenticateToken } = require("../Middleware/AuthenticateToken");
const { roleCheck } = require("../Controller/Login");
const { CategoryInsertUpdate, CategoryGet } = require("../Controller/Category");

//below our endpoints

Router.post(
  "/CategoryInsertUpdate",
  authenticateToken,
  roleCheck("user"),
  CategoryInsertUpdate
);
Router.get("/CategoryGet", authenticateToken, roleCheck("user"), CategoryGet);

module.exports = Router;
