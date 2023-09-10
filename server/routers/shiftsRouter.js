//shiftsRouter.js
const express = require("express");
const shiftsService = require("../services/shiftsService");
const router = express.Router();
const authMiddleware = require("../middleWares/authMiddleware");

router.use(authMiddleware);
// 'http://localhost:8000/shifts' is the Entry Point

//get all
router.route("/").get(async (req, res, next) => {
  try {
    const shifts = await shiftsService.getAllShifts();
    res.status(200).json(shifts);
  } catch (error) {
    next(error);
  }
});

//get shift by id
router.route("/:id").get(async (req, res, next) => {
  const { id } = req.params;
  try {
    const shift = await shiftsService.getShiftById(id);
    res.status(200).json(shift);
  } catch (error) {
    next(error);
  }
});

//add shift
router.route("/").post(async (req, res, next) => {
  const obj = req.body;
  try {
    const result = await shiftsService.addShift(obj);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

//update shift
router.route("/:id").patch(async (req, res, next) => {
  const { id } = req.params;
  const obj = req.body;
  try {
    const result = await shiftsService.updateShift(id, obj);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//delete shift
router.route("/:id").delete(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await shiftsService.deleteShift(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
