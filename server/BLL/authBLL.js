//authBLL.js
const usersWS = require("../DAL/usersWS");

const getUserByUsername = async (username) => {
  const { data } = await usersWS.getUserByUsername(username);
  const user = data[0];

  if (!user) {
    const error = new Error("Username not found.");
    error.statusCode = 404;
    throw error;
  }

  const credentials = {
    username: user.username,
    password: user.email,
    name: user.name,
  };

  return credentials;
};

module.exports = { getUserByUsername };
