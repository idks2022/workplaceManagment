//shiftsBLL.js

const Shift = require("../models/shiftModel");

/* CRUD functions */

// GET - Get all - Read
const getAllShifts = (query) => {
  const shifts = Shift.find(query).populate({
    path: "employees",
    select: ["firstName", "lastName"],
  });
  return shifts;
};

// GET - Get by ID - Read
const getShiftById = async (id) => {
  const shift = await getAllShifts({ _id: id });
  if (shift.length === 0) {
    const error = new Error("Shift not found.");
    error.statusCode = 404;
    throw error;
  }
  return shift[0];
};

// Post - Create new shift - Create
const addShift = async (obj) => {
  const shift = new Shift(obj);
  await shift.save();
  return shift;
};

// PATCH - Update shift - Update
const updateShift = async (id, obj) => {
  console.log("updatShift called in BLL with", obj);
  const updatedShift = await Shift.findByIdAndUpdate(id, obj, {
    new: true,
  });
  if (!updatedShift) {
    const error = new Error("Shift not found.");
    error.statusCode = 404;
    throw error;
  }
  return updatedShift;
};

// DELETE - Delete shift - Delete
const deleteShift = async (id) => {
  const deletedShift = await Shift.findByIdAndDelete(id);
  if (!deletedShift) {
    throw new Error("Shift not found");
  }
  return "Deleted!";
};

module.exports = {
  getAllShifts,
  getShiftById,
  addShift,
  updateShift,
  deleteShift,
};
