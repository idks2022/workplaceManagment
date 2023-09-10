//departmentsRouter.js

const express = require("express");
const depsService = require("../services/departmentsService");
const router = express.Router();
const authMiddleware = require("../middleWares/authMiddleware");

router.use(authMiddleware);
// 'http://localhost:8000/departments' is the Entry Point

//get all
router.route("/").get(async (req, res, next) => {
  try {
    const departments = await depsService.getAllDepartments(req.query);
    res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
});

//get department by id
router.route("/:id").get(async (req, res, next) => {
  const { id } = req.params;
  try {
    const department = await depsService.getDepartmentById(id);
    res.status(200).json(department);
  } catch (error) {
    next(error);
  }
});

//add department
router.route("/").post(async (req, res, next) => {
  const obj = req.body;
  try {
    const result = await depsService.addDepartment(obj);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

//update department
router.route("/:id").patch(async (req, res, next) => {
  const { id } = req.params;
  const obj = req.body;
  try {
    const result = await depsService.updateDepartment(id, obj);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//delete department
router.route("/:id").delete(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await depsService.deleteDepartment(id);
    res.status(204).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
