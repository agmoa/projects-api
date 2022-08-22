const { Router } = require("express");
const db = require("../../../config/db/index");

const { body } = require("express-validator");

const usersViews = require("../views/usersViews");
const isAuth = require("../../../config/middleware/is-auth");

const router = Router();

/* ================== 
        GET 
================== */
router.get("/users", isAuth.isAuthenticated, usersViews.getUsers); // Get All Users
router.get("/users/:id", isAuth.isAuthenticated, usersViews.getUsersById); // Get Users By Id

router.get("/account/:uid/view/info", isAuth.isAuthenticated, usersViews.getAccountInfo); // Get All Users

// router.get(
// 	"/profiles/:uid/consultant/:username",
// 	isAuth.isAuthenticated,
// 	usersViews.getUserProfile
// );
router.get("/profiles/consultant/:username", usersViews.getUserProfile);

/* ================== 
        PATCH 
================== */
router.patch("/account/:uid/update/info", isAuth.isSelf_UID, usersViews.updateAccountInfo); // Update Users By Id

router.patch(
	"/account/:uid/update/email",
	[
		body("email")
			.isEmail()
			.withMessage("Please enter a valid email.")
			.normalizeEmail()
			.custom((value, { req }) => {
				return db
					.query(
						`
                SELECT email 
                FROM users_user
                WHERE email=($1)
            `,
						[value]
					)
					.then(user => {
						if (user.rowCount > 0) {
							return Promise.reject("Email address already exists!");
						}
					});
			})
			.normalizeEmail(),
	],
	isAuth.isSelf_UID,
	usersViews.updateAccountEmail
);

router.patch("/account/:uid/update/dob", isAuth.isSelf_UID, usersViews.updateAccountBirthday); // Update Users By Id

module.exports = router;
