const os = require("os");
const fs = require("fs");
const path = require("path");
const logFolderName = "LOGS_FOLDER";

const Log = (message, type = "log") => {
  // afficher un console.log (ou error ou warn etc...)
  if (console[type]) {
    console[type](message);
  } else {
    console.log(message);
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

  const dateString = `${year}-${month}-${day}`;

  const pathToLogs = path.join(
    os.homedir(),
    logFolderName,
    dateString + "__Log_API.txt"
  );

  const modifiedMessage = `${date.toISOString()} -- [${type.toUpperCase()}] -- ${message}${
    os.EOL
  }`;

  if (fs.existsSync(pathToLogs)) {
    fs.appendFile(pathToLogs, modifiedMessage, err => {
      if (err) console.log(err);
    });
  } else {
    fs.writeFile(pathToLogs, modifiedMessage, err => {
      if (err) console.log(err);
    });
  }
};

module.exports = Log;
