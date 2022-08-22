const { Router } = require("express");
const db = require("../../../config/db/index");

const formsViews = require("../views/formsViews");
const isAuth = require("../../../config/middleware/is-auth");

const router = Router();

/* ================== 
        GET 
================== */
router.get("/contact", formsViews.getUsers); // Get All Users
router.get("/contact/:id", formsViews.getUsersById); // Get Users By Id

/* ================== 
        POST 
================== */
router.post("/create/contact", formsViews.createContentForm);

/* ================== 
        PATCH 
================== */
// router.patch("/account/:uid/update/info", isAuth.isSelf_UID, formsViews.updateAccountInfo); // Update Users By Id

module.exports = router;
