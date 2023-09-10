//departmentsService.js
const empsBLL = require("../BLL/employeesBLL");
const depsBLL = require("../BLL/departmentsBLL");
const { getChanges } = require("./servicesUtils");

const getAllDepartments = (query) => {
  return depsBLL.getAllDepartments(query);
};

const getDepartmentById = async (id) => {
  return depsBLL.getDepartmentById(id);
};

const addDepartment = async (obj) => {
  const newDep = await depsBLL.addDepartment(obj);
  console.log("new Department created:", newDep);

  if (newDep) {
    newDep.employees.forEach((emp) => addDepToEmp(newDep._id, emp));
    console.log("Employees updated with this department");
  }
  return newDep;
};

const updateDepartment = async (id, obj) => {
  const validObj = obj; //NEED TO ADD VALIDATION LOGIC and add transaction block
  const oldDep = await depsBLL.getDepartmentById(id);
  console.log("oldDep", oldDep);
  const updatedDep = await depsBLL.updateDepartment(id, validObj);
  console.log("updatedDep", updatedDep);

  if ("employees" in obj) {
    console.log("'employees' in obj");
    //check for updates in the array
    const changes = getChanges(oldDep, updatedDep);
    console.log("changes:", changes);

    //send the updates to the employees (add/remove)
    changes.removed?.forEach((emp) => removeDepFromEmp(emp));
    changes.added?.forEach((emp) => addDepToEmp(id, emp));
  }

  return updatedDep;
};

const deleteDepartment = async (id) => {
  const dep = await depsBLL.getDepartmentById(id);
  const depEmps = dep.employees;
  //remove the Department from all Employees associated with it
  depEmps?.forEach((emp) => removeDepFromEmp(emp));
  //remove the Department itslef.
  const result = depsBLL.deleteDepartment(id);
  return result;
};

//Utils:

//add Department to Employee's department field
const addDepToEmp = async (depId, empId) => {
  await empsBLL.updateEmployee(empId, { department: depId });
};

//remove Department from Employee's department field
const removeDepFromEmp = async (oldEmpId) => {
  const emptyDep = { $unset: { department: "" } };
  await empsBLL.updateEmployee(oldEmpId, emptyDep);
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
