const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.isAuthenticated = (req, res, next) => {
	const authHeader = req.get("Authorization");
	// console.log(authHeader);

	if (!authHeader) {
		const error = new Error("Authorization Header.");
		error.statusCode = 401;
		throw error;
	}

	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
	} catch (err) {
		console.log(err);
		err = new Error("Token Expired.");
		err.statusCode = 401;
		throw err;
	}
	if (!decodedToken) {
		const error = new Error("Not authenticated.");
		error.statusCode = 401;
		throw error;
	}
	req.email = decodedToken.email;
	req.uid = decodedToken.uid;
	next();
};

exports.isSelf_UID = (req, res, next) => {
	const authHeader = req.get("Authorization");

	if (!authHeader) {
		const error = new Error("Authorization Header.");
		error.statusCode = 403;
		throw error;
	}

	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (decodedToken.uid != req.params.uid) {
		err = new Error("Not Authorized.");
		error.statusCode = 403;
		throw error;
	}
	req.uid = decodedToken.uid;
	next();
};

exports.isSelf = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		const error = new Error("Forbidden Access.");
		error.statusCode = 403;
		throw error;
	}

	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (decodedToken.email != req.params.email) {
		const error = new Error("Forbidden Access.");
		error.statusCode = 403;
		throw error;
	}
	req.email = decodedToken.email;
	req.uid = decodedToken.uid;
	next();
};

exports.isSelfBody = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		const error = new Error("Forbidden Access.");
		error.statusCode = 403;
		throw error;
	}

	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (decodedToken.uid != req.body.uid) {
		// console.log(req);
		const error = new Error("Forbidden Access.");
		error.statusCode = 403;
		throw error;
	}
	req.uid = decodedToken.uid;
	next();
};

exports.isStaff = (req, res, next) => {
	next();
};

exports.isAdmin = (req, res, next) => {
	next();
};

exports.isSuperuser = (req, res, next) => {
	next();
};

exports.isOwner = (req, res, next) => {
	next();
};
