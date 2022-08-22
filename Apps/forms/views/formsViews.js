const db = require("../../../config/db/index");

/* ================== 
        GET 
================== */
exports.getUsers = (request, response, next) => {
	const query = {
		text: `SELECT user_id, email, 
      first_name, last_name, dob, 
      gender, zip_code, country 

    FROM users_user`,
	};

	db.query(query)
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (err) return next(err);
		});
}; // Get User

exports.getUsersById = (request, response, next) => {
	const p = request.params;

	const query = {
		text: `SELECT user_id, email, 
      first_name, last_name, dob, 
      gender, zip_code, country 

    FROM users_user
    WHERE user_id=($1)
    `,
	};

	db.query(query, [p.id])
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}; // Get User By Id

/* ================== 
        POST 
================== */
exports.createContentForm = (request, response, next) => {
	const full_name = request.body.full_name;
	const email = request.body.email;
	const company = request.body.company;
	const subject_matter = request.body.subject_matter;
	const subject = request.body.subject;
	const message = request.body.message;

	const text = `INSERT INTO
  forms_contact(full_name, email, company, subject_matter, subject, message)
          VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

	db.query(text, [full_name, email, company, subject_matter, subject, message])
		.then(res => {
			response.status(201).json({ message: "Successfully Submitted Form!" });
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

// exports.updateAccountInfo = (request, response, next) => {
// 	const uid = request.uid;

// 	const keys = ["email", "first_name", "last_name", "gender", "tel", "country"];
// 	const fields = [];

// 	keys.forEach(key => {
// 		if (request.body[key]) fields.push(key);
// 	});

// 	fields.forEach((field, index) => {
// 		db.query(
// 			`UPDATE users_user SET ${field}=($1) WHERE uid=($2)`,
// 			[request.body[field], uid],

// 			(err, res) => {
// 				if (err) return next(err);

// 				if (index === fields.length - 1) response.status(200).send(`Updated Successfully`);
// 			}
// 		);
// 	});
// }; // Update User
