//employeeModel.js

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  startYear: {
    type: Number,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  shifts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
    },
  ],
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
