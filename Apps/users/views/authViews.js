const db = require("../../../config/db/index");
require("dotenv").config();

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const { sendLoginEmail, sendWelcomeEmail } = require("../../app/emails/accountEmails");

const crypto = require("crypto");

const SALT_ROUND = 12;

/* ================== 
        GET 
================== */

exports.signup = (request, response, next) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		const error = new Error("Validation Failed.");
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}

	const email = request.body.email;
	const username =
		request.body.first_name.toLowerCase() + "_" + crypto.randomBytes(4).toString("hex");
	const password = request.body.password;
	const first_name = request.body.first_name;
	const last_name = request.body.last_name;

	const is_active = true;
	const initial_terms_accepted = true;
	const date_joined = new Date();
	const project = request.body.project;

	// Create User Account SQL
	const CreateAccountSQL = `
    INSERT INTO
        users_user(email, username, password, first_name, last_name,
        is_active, initial_terms_accepted, date_joined, project)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *  
  `;

	// Setup User Account SQL
	const SetupAccountSQL = `
  WITH X AS (
      INSERT INTO users_user_birthday (email) 
      VALUES($1) RETURNING email
      )
		INSERT INTO users_user_profile (email)
		SELECT email FROM X
`;

	bcrypt.hash(password, SALT_ROUND, function (err, hashedPassword) {
		if (err == null)
			db.query(CreateAccountSQL, [
				email,
				username,
				hashedPassword,
				first_name,
				last_name,
				is_active,
				initial_terms_accepted,
				date_joined,
				project,
			])
				.then(res => {
					const uid = res.rows[0].uid;
					const email = res.rows[0].email;
					const user_id = res.rows[0].user_id;
					const first_name = res.rows[0].first_name;

					/* Account Setup Database Instance */
					db.query(SetupAccountSQL, [email])
						// .then(res => console.log("DONE"))
						.then()
						.catch(err => {
							console.log(err);
							if (err) {
								err.statusCode = 500;
							}
							next(err);
						});

					/* Sign Authentication Token */
					const token = jwt.sign(
						{
							email: email,
							user_id: user_id,
							uid: uid,
						},
						process.env.JWT_TOKEN_KEY,
						{ expiresIn: "30d" },
						{ algorithm: "HS256" }
					);

					/* Return Data Back To User */
					response.status(201).json({
						message: "User created successfully!",
						token: token,
						email: email,
						user_id: user_id,
						uid: uid,
					});

					/* Emailer - Welcome Email */
					// sendWelcomeEmail(email, first_name);
				})

				.catch(err => {
					if (!err.statusCode) {
						err.statusCode = 500;
					}
					next(err);
				});
	});
};

exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let grabbedUser;

	const query = {
		text: `
    SELECT 
      uu.email, uu.password, uu.user_id, uu.uid
    FROM users_user uu
    WHERE email=($1)
    `,
	};

	db.query(query, [email])
		.then(user => {
			if (user.rowCount == 0) {
				const error = new Error("A user with this email could not be found.");

				error.statusCode = 401;
				error.message = "Wrong email or password";
				throw error;
			}
			grabbedUser = user;
			return bcrypt.compare(password, user.rows[0].password);
		})
		.then(isEqual => {
			if (!isEqual) {
				const error = new Error("Wrong email or password");
				error.statusCode = 401;
				throw error;
			}
			const token = jwt.sign(
				{
					email: grabbedUser.rows[0].email,
					user_id: grabbedUser.rows[0].user_id,
					uid: grabbedUser.rows[0].uid,
					tracker_uid: grabbedUser.rows[0].tracker_uid,
					page_uid: grabbedUser.rows[0].page_uid,
					refresh_token: grabbedUser.rows[0].refresh_token,
				},
				process.env.JWT_TOKEN_KEY,
				{
					expiresIn: "30d",
				},
				{ algorithm: "HS256" }
			);
			res.status(200).json({
				token: token,
				user_id: grabbedUser.rows[0].user_id,
				uid: grabbedUser.rows[0].uid,
				email: grabbedUser.rows[0].email,
				tracker_uid: grabbedUser.rows[0].tracker_uid,
				page_uid: grabbedUser.rows[0].page_uid,
				refresh_token: grabbedUser.rows[0].refresh_token,
			});
		})

		.then(() => {
			// sendLoginEmail(grabbedUser.rows[0].email, grabbedUser.rows[0].first_name);
		})

		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.loggedUser = (request, response, next) => {
	const email = request.email;

	const query = {
		text: `
    SELECT u.uid, email,
    u.first_name, u.last_name, 
    u.is_superuser, u.is_staff, 

    (
      SELECT TO_JSON(user_birthday)
      FROM(
      SELECT
        ub.month,
        ub.day,
        ub.year
    
      FROM users_user_birthday ub
      WHERE u.email = ub.email
      ) AS user_birthday
  	) AS dob,

    (
      SELECT TO_JSON(user_profile)
      FROM(
      SELECT
        pr.title,
		pr.position_1,
		pr.position_2,
		pr.bio,
		pr.locale,

		pr.avatar,
		pr.banner,
		pr.resume,
		pr.skills,

		pr.socials_email,
		pr.socials_linkedin,
		pr.socials_instagram,
		pr.socials_twitter,
		pr.socials_youtube,
		pr.socials_facebook
    
      FROM users_user_profile pr
      WHERE u.email = pr.email
      ) AS user_profile
  	) AS profile

    FROM users_user u
    WHERE u.email=($1)
    `,
	};

	db.query(query, [email])
		.then(res => {
			response.json(res.rows[0]);
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.checkPassword = (req, res, next) => {
	const uid = req.params.uid;
	const password = req.body.password;
	let grabbedUser;

	const query = {
		text: `
    SELECT password
    FROM users_user
    WHERE uid=($1)
    `,
	};

	db.query(query, [uid])

		.then(user => {
			if (user.rowCount == 0) {
				const error = new Error("Unauthorized.");
				error.statusCode = 401;
				throw error;
			}
			grabbedUser = user;
			return bcrypt.compare(password, user.rows[0].password);
		})
		.then(isEqual => {
			if (!isEqual) {
				const error = new Error("Your old password was entered incorrectly.");
				error.statusCode = 401;
				throw error;
			}

			// code block
			next();
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.changePassword = (req, response, next) => {
	const uid = req.body.uid;
	const password = req.body.new_password;

	const text = `
      UPDATE users_user
	        SET password=($1)
	        WHERE uid=($2)`;

	bcrypt.hash(password, SALT_ROUND, function (err, hashedPassword) {
		if (err == null)
			db.query(text, [hashedPassword, uid])
				.then(res => {
					response.status(200).json({ message: "Password updated successfully!" });
				})

				.catch(err => {
					if (!err.statusCode) {
						err.statusCode = 500;
					}
					next(err);
				});
	});
};

exports.refreshTheToken = (req, res, next) => {
	const uid = req.params.uid;
	const refresh_token = req.params.refresh_token;

	const query = {
		text: `
    SELECT
    uu.email, uu.password, uu.uid, td.tracker_uid, pp.page_uid,
    pt.refresh_token

  FROM users_user uu
  LEFT JOIN permiix_token pt ON pt.uid = uu.uid

  WHERE uu.uid=($1)
  AND pt.uid=($1)
  AND pt.refresh_token=($2)
  `,
	};

	db.query(query, [uid, refresh_token])
		.then(grabbedUser => {
			const token = jwt.sign(
				{
					email: grabbedUser.rows[0].email,
					user_id: grabbedUser.rows[0].user_id,
					uid: grabbedUser.rows[0].uid,
					tracker_uid: grabbedUser.rows[0].tracker_uid,
					page_uid: grabbedUser.rows[0].page_uid,
				},
				process.env.JWT_TOKEN_KEY,
				{
					expiresIn: "30d",
					// expiresIn: 60,
				},
				{ algorithm: "HS256" }
			);
			res.status(200).json({
				token: token,
				user_id: grabbedUser.rows[0].user_id,
				uid: grabbedUser.rows[0].uid,
				email: grabbedUser.rows[0].email,
				tracker_uid: grabbedUser.rows[0].tracker_uid,
				page_uid: grabbedUser.rows[0].page_uid,
				refresh_token: grabbedUser.rows[0].refresh_token,
			});
		})

		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

/* ================== 
        PATCH 
================== */
