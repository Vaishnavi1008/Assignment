const express = require("express");
const Router = express.Router();
const { authenticateToken } = require("../Middleware/AuthenticateToken");

const {
  LoginInsert,
  LoginGet,
  LoginGetByEmail,
} = require("../Controller/Login");

//below our endpoints

Router.post("/LoginInsert", LoginInsert);
Router.get("/LoginGet", authenticateToken, LoginGet);
Router.get("/LoginGetByEmail", LoginGetByEmail);

module.exports = Router;
