//usersWS.js
const axios = require("axios");

const url = "https://jsonplaceholder.typicode.com/users?username=";

const getUserByUsername = (username) => {
  return axios.get(`${url}${username}`);
};

module.exports = { getUserByUsername };
