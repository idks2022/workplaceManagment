//employeeService.js
const empsBLL = require("../BLL/employeesBLL");
const depsBLL = require("../BLL/departmentsBLL");
const { default: mongoose } = require("mongoose");

const getAllEmployees = () => {
  return empsBLL.getAllEmployees();
  //returns a promise
};

const getEmployeeById = (id) => {
  return empsBLL.getEmployeeById(id);
  //returns the employee
};

const addEmployee = async (obj) => {
  //const session = await mongoose.startSession();
  //session.startTransaction();

  try {
    const newEmp = await empsBLL.addEmployee(obj);
    //if this new Employee is associated with department:
    if ("department" in newEmp) {
      //and this department is not null:
      if (newEmp.department) {
        //add this Employees to its Department's array of Employees:
        await addEmpToDep(newEmp._id, newEmp.department /*, session*/);
      }
    }
    //await session.commitTransaction();
    return newEmp;
  } catch (error) {
    //await session.abortTransaction();
    console.error(error);
    throw error;
  } finally {
    //session.endSession();
  }
};

const updateEmployee = async (id, obj) => {
  //const session = await mongoose.startSession();
  //session.startTransaction();

  try {
    const emp = await getEmployeeById(id);
    let objToUpdade = { ...obj };
    console.log("ObjSentToUpdate:", objToUpdade);
    if ("department" in obj) {
      console.log("Department in obj");
      if (obj.department === null && emp.department) {
        console.log("entered If 1");
        //if the employee is already associated with department
        //and the request includes "null" department
        removeEmpFromDep(emp.department, id);
        //remove the department field from the obj
        objToUpdade.$unset = { department: "" };
        delete objToUpdade.department;
      } else if (obj.department !== emp.department) {
        console.log("entered If 2");
        //if the employee is already associated with department
        //and the request includes another department
        removeEmpFromDep(emp.department, id);
        addEmpToDep(id, obj.department);
      } else {
        console.log("entered Else");
        //if the employee isn't associated with department yet
        //and the request includes a department
        addEmpToDep(id, obj.department);
      }
    }
    //update the employee
    const updatedEmp = await empsBLL.updateEmployee(id, objToUpdade);

    //await session.commitTransaction();
    return updatedEmp;
  } catch (error) {
    //await session.abortTransaction();
    console.error(error);
    throw error;
  } finally {
    //session.endSession();
  }
};

const deleteEmployee = async (id) => {
  //const session = await mongoose.startSession();
  //session.startTransaction();

  try {
    const emp = await empsBLL.getEmployeeById(id);
    const dep = emp.department;
    if (dep) {
      await removeEmpFromDep(dep, id);
    }
    const result = await empsBLL.deleteEmployee(id);

    //await session.commitTransaction();
    return result;
  } catch (error) {
    //await session.abortTransaction();
    console.error(error);
    throw error;
  } finally {
    //session.endSession();
  }
};

//Utils:
//add Employee to Department's array of employees
const addEmpToDep = async (empId, depId /*, session*/) => {
  console.log("Add Employee from Department:", depId);
  if (!depId) {
    return;
  }
  try {
    const dep = await depsBLL.getDepartmentById(depId);
    console.log("addEmpToThisDep:", dep._id);
    let empsInDep = dep.employees;
    if (!empsInDep.includes(empId)) {
      empsInDep.push(empId);
      console.log("Emp pushed into department");
      await depsBLL.updateDepartment(
        depId,
        { employees: empsInDep } /*, session*/
      );
    }
  } catch (error) {
    console.error("Couldn't add Emp to Dep:", error);
    throw Error;
  }
};

//remove Employee from Department's array of employees
const removeEmpFromDep = async (oldDepId, empId) => {
  console.log("Remove Employee from Department:", oldDepId);
  if (!oldDepId) {
    return;
  }
  try {
    const dep = await depsBLL.getDepartmentById(oldDepId);
    let empsInDep = dep.employees;
    console.log("Dep.employees before remove:", empsInDep);
    const index = empsInDep.findIndex(
      (emp) => emp._id.toString() === empId.toString()
    );
    if (index !== -1) {
      empsInDep.splice(index, 1);
      const updatedDep = await depsBLL.updateDepartment(oldDepId, {
        employees: empsInDep,
      });
      console.log("Dep.employees updated:", updatedDep.employees);
    }
  } catch (error) {
    console.error("Couldn't remove Emp from Dep:", error);
    throw Error;
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
