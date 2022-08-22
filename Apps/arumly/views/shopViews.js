const db = require("../../../config/db/index");

/* ================== 
        GET 
================== */
exports.getProductsByLimit = (request, response, next) => {
	const limit = request.params.limit;

	const query = {
		text: `
		SELECT 
			so.id,
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
			so.shop_url,
			so.created_at,
			so.updated_at
		
		FROM arumly_shop_object so
		LIMIT ($1)
	`,
	};

	db.query(query, [limit])
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (err) return next(err);
		});
}; // Get User

exports.getProductsByType = (request, response, next) => {
	const obj_type = request.params.obj_type;

	const query = {
		text: `
		SELECT 
			so.id,
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
			so.shop_url,
			so.created_at,
			so.updated_at
		
		FROM arumly_shop_object so
		WHERE obj_type = ($1)
		LIMIT 50
	`,
	};

	db.query(query, [obj_type])
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (err) return next(err);
		});
}; // Get User

exports.getProductById = (request, response, next) => {
	const id = request.params.id;

	const query = {
		text: `
		SELECT 
			so.id,
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
			so.shop_url,
			so.created_at,
			so.updated_at
		
		FROM arumly_shop_object so
		WHERE so.id = ($1)
    `,
	};

	db.query(query, [id])
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}; // Get Product By Id

exports.getProductsByTags = (request, response, next) => {
	const obj_tags = request.params.obj_tags;

	const query = {
		text: `
		SELECT 
			so.id,
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
			so.shop_url,
			so.created_at,
			so.updated_at
		
		FROM arumly_shop_object so
		WHERE so.obj_tags @> ($1);
		`,
	};

	db.query(query, [obj_tags])
		.then(res => {
			response.json(res.rows);
		})
		.catch(err => {
			if (err) return next(err);
		});
}; // Get User

/* ================== 
        POST 
================== */

/* ================== 
        PATCH 
================== */
