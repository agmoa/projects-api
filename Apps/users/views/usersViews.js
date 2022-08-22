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

exports.getAccountInfo = (request, response, next) => {
	const uid = request.uid;

	const query = {
		text: `
    SELECT uu.uid, uu.email, uu.first_name, uu.last_name, 
    uu.gender, uu.zip_code, uu.country, 
    uu.is_superuser, uu.is_staff,

    (
      SELECT TO_JSON(user_birthday)
      FROM(
      SELECT
        ub.month,
        ub.day,
        ub.year
    
      FROM users_user_birthday ub
      WHERE uu.uid = ub.uid
      ) AS user_birthday
  	) AS dob

    FROM users_user uu
    WHERE uu.uid=($1)
    `,
	};

	db.query(query, [uid])
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

exports.getUserProfile = (request, response, next) => {
	const username = request.params.username;

	const query = {
		text: `SELECT 
		uu.first_name,
		uu.last_name,
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

    FROM users_user uu
	LEFT JOIN users_user_profile pr ON uu.uid = pr.uid
    WHERE username=($1)
    `,
	};

	db.query(query, [username])
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
        PATCH 
================== */

exports.updateAccountInfo = (request, response, next) => {
	const uid = request.uid;

	const keys = ["email", "first_name", "last_name", "gender", "tel", "country"];
	const fields = [];

	keys.forEach(key => {
		if (request.body[key]) fields.push(key);
	});

	fields.forEach((field, index) => {
		db.query(
			`UPDATE users_user SET ${field}=($1) WHERE uid=($2)`,
			[request.body[field], uid],

			(err, res) => {
				if (err) return next(err);

				if (index === fields.length - 1) response.status(200).send(`Updated Successfully`);
			}
		);
	});
}; // Update User

exports.updateAccountEmail = (request, response, next) => {
	const uid = request.params.uid;
	const email = request.body.email;
	console.log(request.body);
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		const error = new Error("Unprocessable Entity.");
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}

	const query = {
		text: `
    UPDATE users_user SET email=($2)
    WHERE uid=($1)
    `,
	};

	db.query(query, [uid, email])
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

exports.updateAccountBirthday = (request, response, next) => {
	const uid = request.uid;

	const keys = ["month", "day", "year"];
	const fields = [];

	keys.forEach(key => {
		if (request.body[key]) fields.push(key);
	});

	fields.forEach((field, index) => {
		db.query(
			`UPDATE users_user_birthday SET ${field}=($1) WHERE uid=($2)`,
			[request.body[field], uid],

			(err, res) => {
				if (err) return next(err);

				if (index === fields.length - 1) response.status(200).send(`Updated Successfully`);
			}
		);
	});
}; // Update User
