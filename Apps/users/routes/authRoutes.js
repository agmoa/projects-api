const { Router } = require("express");
const db = require("../../../config/db/index");
const isAuth = require("../../../config/middleware/is-auth");
// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport')

require("dotenv").config();

const { body } = require("express-validator");

const authViews = require("../views/authViews");

const router = Router();

router.post(
	"/account/create",
	[
		body("email")
			.isEmail()
			.withMessage("Please enter a valid email.")
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
						// console.log(user);
						if (user.rowCount > 0) {
							return Promise.reject(new Error("Email address already exists!"));
						}
					});
			})
			.normalizeEmail(),
		body("password").trim().isLength({ min: 8 }),
		body("first_name").trim().not().isEmpty(),
	],
	authViews.signup
);

router.post("/login", authViews.login);

router.get("/user", isAuth.isAuthenticated, authViews.loggedUser); // get method by id

router.post(
	"/:uid/change_pwd",
	isAuth.isSelf_UID,
	authViews.checkPassword,
	authViews.changePassword
); // get method by id

module.exports = router;
