const express = require("express");
const route = express.Router();

const services = require("../services/render");
const controller = require("../controller/controller");

/*
 *@discription homeroute
 *@method get
 */
route.get("/", services.homeRoute);

/*
 *@discription add user
 *@method get
 */
route.get("/add-user", services.add_user);

/*
 *@discription add user
 *@method get
 */
route.get("/update", services.update);

//API ROUTES
route.post("/api/users", controller.create);
route.get("/api/users", controller.find);
route.get("/edit/:id", controller.edit);
route.post("/api/users/:id", controller.update);
//route.delete("/api/users/:id", controller.delete);
route.get("/delete/:id", controller.delete);

module.exports = route;
