const path = require("path");
const multer = require("multer");
var multerGoogleStorage = require("multer-google-storage");

exports.fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "storage/" + file.fieldname + "s");
	},

	// filename: (req, file, cb) => {
	//   cb(null, new Date().toISOString() + "-" + file.originalname);
	// },
	filename: (req, file, cb) => {
		const uniqueSuffix = Math.round(Math.random() * 1e9);
		cb(
			null,
			file.originalname.replace(/\.[^/.]+$/, "-" + uniqueSuffix + path.extname(file.originalname))
		);
	},
});

exports.fileFiler = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

exports.gcpStorageUsers = multerGoogleStorage.storageEngine({
	autoRetry: true,
	bucket: "user-content-aarcho",
	projectId: "aarcho-api-db",
	keyFilename: "ccec19402db90598c3aac8c3e47fbc2a402035fa",
	filename: (req, file, cb) => {
		cb(null, `/storage/${file.originalname}_${Date.now()}`);
	},
});
