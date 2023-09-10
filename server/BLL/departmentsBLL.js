//departmentsBLL.js
const Department = require("../models/departmentModel");

/* CRUD functions */

// GET - Get all - Read
const getAllDepartments = (query) => {
  const departments = Department.find(query)
    .populate({
      path: "employees",
      select: ["firstName", "lastName"],
    })
    .populate({
      path: "manager",
      select: ["firstName", "lastName"],
    });
  return departments;
};

// GET - Get by ID - Read
const getDepartmentById = async (id) => {
  const dep = await getAllDepartments({ _id: id });
  if (dep.length === 0) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }
  return dep[0];
};

// Post - Create new department - Create
const addDepartment = async (obj) => {
  const dep = new Department(obj);
  await dep.save();
  return dep;
};

// PATCH - Update department - Update
const updateDepartment = async (id, obj, session) => {
  const updatedDepartment = await Department.findByIdAndUpdate(id, obj, {
    new: true,
    session,
  });
  if (!updatedDepartment) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }
  console.log("Department updated");
  return updatedDepartment;
};

// DELETE - Delete department - Delete
const deleteDepartment = async (id) => {
  const deletedDepartment = await Department.findByIdAndDelete(id);
  if (!deletedDepartment) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }
  return "Deleted!";
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
