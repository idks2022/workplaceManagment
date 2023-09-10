//employeesBLL.js
const Employee = require("../models/employeeModel");

/* CRUD functions */

// GET - Get all - Read
const getAllEmployees = (query) => {
  const employees = Employee.find(query)
    .populate({
      path: "department",
      select: "name",
    })
    .populate({
      path: "shifts",
      select: ["date", "startingHour", "endingHour"],
    });
  return employees;
};

// GET - Get by ID - Read
const getEmployeeById = async (id) => {
  const emp = await getAllEmployees({ _id: id });
  //const emp = await Employee.findById({ _id: id })
  if (emp.length === 0) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }
  return emp[0];
};

//GET - Get multiple employees by ID - Read
const getEmployeesByIds = async (ids) => {
  const emps = await Employee.find({ _id: { $in: ids } });
  return emps;
};

// Post - Create new employee - Create
const addEmployee = async (obj) => {
  const emp = new Employee(obj);
  await emp.save();
  return emp;
};

// PATCH - Update employee - Update
const updateEmployee = async (id, obj) => {
  console.log("updateEmployee called in BLL with", obj);
  const updatedEmployee = await Employee.findByIdAndUpdate(id, obj, {
    new: true,
  });
  if (!updatedEmployee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }
  return updatedEmployee;
};

//PATCH - Update multiple employees at once - Update
const updateEmployees = async (emps) => {
  console.log(emps);
  try {
    const updateOperations = emps.map((emp) => ({
      updateOne: {
        filter: { _id: emp._id },
        update: { $set: { shifts: emp.shifts } },
      },
    }));
    //console.log(JSON.stringify(updateOperations, null, 2));

    await Employee.bulkWrite(updateOperations);
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete employee - Delete
const deleteEmployee = async (id) => {
  const deletedEmployee = await Employee.findByIdAndDelete(id);
  if (!deletedEmployee) {
    throw new Error("Employee not found");
  }
  return "Deleted!";
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeesByIds,
  addEmployee,
  updateEmployee,
  updateEmployees,
  deleteEmployee,
};
