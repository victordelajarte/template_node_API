const http = require("http");
const app = require("./app");
const os = require("os");
const fs = require("fs");
const path = require("path");
const Log = require("./helpers/Log");

const logFolderName = "LOGS_FOLDER";

const folderPath = path.join(os.homedir(), logFolderName);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, err => {
    if (err) console.log(err);
  });
}

const server = http.createServer(app);
Log("Server created");

const PORT = process.env.PORT || 3000;
server.listen(PORT);
Log("Server listening on PORT : " + PORT);
