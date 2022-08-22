const { Router } = require("express");
require("dotenv").config();
const isAuth = require("../../../config/middleware/is-auth");

var multer = require("multer");

const storage = require("../../../config/imports/storage");

if (process.env.NODE_ENV === "development") {
	var uploadFiles = multer({ storage: storage.fileStorage });
}
if (process.env.NODE_ENV === "production") {
	var uploadFiles = multer({ storage: storage.gcpStorageUsers });
}

const router = Router();

/* ================== 
    SOCIAL ROUTES 
================== */

// post
router.post(
	"/pages/:uid/:page_uid/create/simple-post",
	uploadFiles.fields([{ name: "thumb_pre", maxCount: 1 }])
);

// patch
router.patch(
	"/pages/:uid/:page_uid/update/avatar",
	uploadFiles.fields([{ name: "avatar", maxCount: 1 }])
	// pagesViews.updatePageAvatar
);

module.exports = router;
