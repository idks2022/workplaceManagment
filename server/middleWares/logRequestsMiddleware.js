const requestsFile = require("../DAL/requestsFile");

async function logRequest(req, res, next) {
  const requestData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    user: req.headers["x-user"],
  };
  requestsFile.writeRequest(requestData);
  next();
}

module.exports = logRequest;
