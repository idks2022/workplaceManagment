const jsonFile = require("jsonfile");
const filePatch = "./logs/requests.json";
const fs = require("fs");

const getRequests = async () => {
  try {
    const requestsData = await jsonFile.readFile(filePatch);
    return requestsData;
  } catch (error) {
    console.error("Error reading requests file:", error);
    return { requests: [] };
  }
};

const writeRequest = async (requestData) => {
  try {
    const requestsData = await getRequests();
    requestsData.requests.push(requestData);
    await jsonFile.writeFile(filePatch, requestsData, { spaces: 2 });
  } catch (error) {
    console.error("Error writing request:", error);
  }
};

module.exports = {
  getRequests,
  writeRequest,
};
