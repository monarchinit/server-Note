// process.env
require = require("esm")(module);
require("dotenv").config();
const { FilmsServer } = require("./server");

new FilmsServer().start();
