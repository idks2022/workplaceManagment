//check for added/removed employess from employess array
//serves departmentsService and shiftsService
const getChanges = (old, updated) => {
  const oldEmp = old.employees.map((emp) => emp._id.toString());
  console.log("oldEmpsArr", oldEmp);
  const updatedEmp = updated.employees.map((emp) => emp._id.toString());
  console.log("updatedEmpArr", updatedEmp);

  const addedEmps = updatedEmp.filter((emp) => !oldEmp.includes(emp));
  const removedEmps = oldEmp.filter((emp) => !updatedEmp.includes(emp));

  return {
    added: addedEmps,
    removed: removedEmps,
  };
};

module.exports = {
  getChanges,
};
