//shiftsService.js
const shiftsBLL = require("../BLL/shiftsBLL");
const empsBLL = require("../BLL/employeesBLL");
const { getChanges } = require("./servicesUtils");

const getAllShifts = () => {
  return shiftsBLL.getAllShifts();
};

const getShiftById = (id) => {
  return shiftsBLL.getShiftById(id);
};

const addShift = async (obj) => {
  const newShift = await shiftsBLL.addShift(obj);
  if ("employees" in obj) {
    updateShiftInEmps(obj.employees, newShift._id, "add");
  }
  return newShift;
};

const updateShift = async (id, obj) => {
  const oldShift = await shiftsBLL.getShiftById(id);
  const updatedShift = await shiftsBLL.updateShift(id, obj);

  if ("employees" in obj) {
    //check for updates in the array
    const changes = getChanges(oldShift, updatedShift);
    console.log("changes", changes);
    if (changes.removed.length > 0) {
      await updateShiftInEmps(changes.removed, id, "remove");
    }
    if (changes.added.length > 0) {
      await updateShiftInEmps(changes.added, id, "add");
    }
  }

  return updatedShift;
};

const deleteShift = async (id) => {
  const shift = await shiftsBLL.getShiftById(id);
  const shiftEmps = shift.employees;
  const empsIds = shiftEmps.map((emp) => emp._id.toString());
  console.log("delete those", empsIds);
  //remove the shift from Emplyees associated with it
  await updateShiftInEmps(empsIds, id, "remove");

  //remove the Shift from the collection
  return shiftsBLL.deleteShift(id);
};

//Utils:

//add/remove Shift from Employee's array of Shifts
const updateShiftInEmps = async (empsIds, shiftId, action) => {
  const allEmps = await empsBLL.getEmployeesByIds(empsIds);
  const allEmpsMap = new Map(allEmps.map((emp) => [emp._id.toString(), emp]));

  console.log("allEmpsMap:", allEmpsMap);

  for (const empId of empsIds) {
    const emp = allEmpsMap.get(empId);
    console.log(`Updating shift in Emp:`, emp);

    switch (action) {
      case "remove":
        const index = emp.shifts?.indexOf(shiftId);
        if (index !== -1) {
          emp.shifts.splice(index, 1);
        }
        break;

      case "add":
        if (!emp.shifts.includes(shiftId)) {
          emp.shifts.push(shiftId);
        }

        break;
    }
  }
  const resp = await empsBLL.updateEmployees(allEmps);
  return resp;
};

module.exports = {
  getAllShifts,
  getShiftById,
  addShift,
  updateShift,
  deleteShift,
};
