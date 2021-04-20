const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController")

let routes = (app) => {
    router.get("/get", controller.getTasks);
    router.get("/get/:where", controller.getTasks);
    router.get("/getChart/:date1/:date2", controller.getTasksCount);
    router.get("/demo", controller.getInfoDemo);
    router.post("/add", controller.addTask);
    router.put("/update", controller.updateTask);

  app.use("/task", router);
};

module.exports = routes;