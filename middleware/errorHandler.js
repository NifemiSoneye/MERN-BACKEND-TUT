const { logEvents } = require("./logEvents");
const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name} : ${err.message}`, "errLog.txt");
  console.error(err.stack);
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status);
};

module.exports = errorHandler;
