//index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./configs/db");
const errorHandler = require("./middleWares/errorHandler");
const logRequest = require("./middleWares/logRequestsMiddleware");

//Routers
const authRouter = require("./routers/authRouter");
const employeesRouter = require("./routers/employeesRouter");
const departmentsRouter = require("./routers/departmentsRouter");
const shiftsRouter = require("./routers/shiftsRouter");

const app = express();
const port = 8000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));
app.use(errorHandler);
app.use(logRequest);

// Routes
app.use("/auth", authRouter);
app.use("/employees", employeesRouter);
app.use("/departments", departmentsRouter);
app.use("/shifts", shiftsRouter);

app.listen(port, () =>
  console.log(`app is listening at http://localhost:${port}`)
);
