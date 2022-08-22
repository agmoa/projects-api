const db = require("../../../config/db/index");

/* ================== 
        GET 
================== */
exports.getCartItems = (request, response, next) => {
	const query = {
		text: `
		SELECT 
			cc.id,
			cc.created_at,
			so.obj_uid,
			so.thumbnail,
			so.obj_name,
			so.obj_type,
			so.obj_description,
			so.obj_tags,
			so.shop_status,
			so.pricing_price,
			so.pricing_old_price,
			so.pricing_rate,	
			so.pricing_metric,
			so.shop_url
		
		FROM arumly_checkout_cart cc
		LEFT JOIN arumly_shop_object so ON so.obj_uid = cc.obj_uid
		ORDER BY cc.created_at DESC
	`,
	};

	db.query(query)
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (err) return next(err);
		});
};

exports.getCartTotal = (request, response, next) => {
	const query = {
		text: `
		SELECT SUM (pricing_price) AS total

		FROM arumly_checkout_cart cc
		LEFT JOIN arumly_shop_object so ON so.obj_uid = cc.obj_uid
	`,
	};

	db.query(query)
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (err) return next(err);
		});
};

/* ================== 
        POST 
================== */
exports.createCartItem = (request, response, next) => {
	const obj_uid = request.body.obj_uid;

	const text = `
	INSERT INTO 
		arumly_checkout_cart(obj_uid)
        VALUES($1) RETURNING *`;

	db.query(text, [obj_uid])
		.then(res => {
			response.status(201).json({ message: "Added To Cart!" });
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

/* ================== 
        DELETE 
================== */

exports.deleteCartItem = (request, response, next) => {
	const id = request.params.id;
	console.log(id);
	const query = {
		text: `
    DELETE FROM arumly_checkout_cart 
    WHERE id=($1) 
    `,
	};

	db.query(query, [id])
		.then(res => {
			response.json({ message: "Item successfully deleted" });
		})
		.catch(err => {
			if (err) return next(err);
		});
};
