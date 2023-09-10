//employeesRouter.js

const express = require("express");
const empsService = require("../services/employeesService");
const router = express.Router();
const authMiddleware = require("../middleWares/authMiddleware");

router.use(authMiddleware);
// 'http://localhost:8000/employees' is the Entry Point

//get all
router.route("/").get(async (req, res, next) => {
  try {
    const employees = await empsService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

//get employee by id
router.route("/:id").get(async (req, res, next) => {
  const { id } = req.params;
  try {
    const employee = await empsService.getEmployeeById(id);
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
});

//add employee
router.route("/").post(async (req, res, next) => {
  const obj = req.body;
  try {
    const result = await empsService.addEmployee(obj);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

//update employee
router.route("/:id").patch(async (req, res, next) => {
  const { id } = req.params;
  const obj = req.body;
  try {
    const result = await empsService.updateEmployee(id, obj);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//delete employee
router.route("/:id").delete(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await empsService.deleteEmployee(id);
    res.status(204).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
