const express = require("express");
var cors = require("cors");
// const bodyParser = require("body-parser");
const routes = require("./config/router");
const path = require("path");
require("dotenv").config();

var fs = require("fs");
var morgan = require("morgan");

const app = express();

// const multer = require("multer");

// const fileStorage = require("./config/imports/fileStorage");

// ========== SERVER CONFIGURATION ==========
const PORT = parseInt(process.env.PORT || 8080);
const HOSTNAME = process.env.HOSTNAME;

// console.log(IP);
// ========== STATIC ==========

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1/storage", express.static(path.join(__dirname, "storage")));

/* ============================================= 
                  MIDDLEWARE
=============================================== */

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Body Parser
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json()); // Body Parser

app.use(morgan("short"));
// var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
// app.use(morgan("common", { stream: accessLogStream }));

// app.use(
//   multer({ storage: fileStorage }).fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "banner", maxCount: 1 },
//     { name: "images", maxCount: 8 },
//   ])
// );

// CORS

var whitelist = ["http://localhost:8080"];
var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Access-Control-Request-Headers",
//     "Content-Type, Authorization",
//     "Content-Type, X-Requested-With",
//     "Content-Type, X-CSRF-TOKEN"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

// Routes
app.use("/", routes);

// error handling
app.use((error, req, res, next) => {
	console.log(error.statusCode);
	console.log(error.message);

	const status = error.statusCode || 500;
	const message = error.message;
	const msg = !!error.data ? error.data[0].msg : error;

	res.status(status).json({ message: message, status: status, msg: msg });
});

app.listen(PORT, HOSTNAME, () => {
	console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
	console.log(`Quit the server with CONTROL-C.`);
});
