
SELECT *
FROM pg_user;

/* Create Users Table */
CREATE TABLE users_user
(
	user_id BIGSERIAL PRIMARY KEY,

	email VARCHAR(254) UNIQUE NOT NULL,
	uid VARCHAR(32) DEFAULT gen_uid('u', 17) UNIQUE,
	password VARCHAR(128) NOT NULL,
	
	first_name VARCHAR(254) NOT NULL,
	last_name VARCHAR(254) NOT NULL,
	dob DATE,
	gender VARCHAR(254) NOT NULL,
	zip_code VARCHAR(254) NOT NULL,
	country VARCHAR(254) NOT NULL,

	last_login TIMESTAMPTZ,
	
	is_superuser BOOLEAN DEFAULT false,
	is_staff BOOLEAN DEFAULT false,
	is_active BOOLEAN DEFAULT true,

	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);


SELECT * FROM users_user;

/* ========================== DROP TABLE ========================== */
/* DROP TABLE */ DROP TABLE users_user; /* DROP TABLE */ 
/* ========================== DROP TABLE ========================== */
/* ========================== DELETE ========================== */
DELETE FROM users_user
WHERE user_id >= 148;
/* ========================== DELETE ========================== */

/* DELETES */




/* Alter Add Table Column */
ALTER TABLE users_user 
ADD COLUMN uid VARCHAR(32) DEFAULT gen_uid('u', 17) UNIQUE, 
ADD COLUMN display_name VARCHAR(80),
ADD COLUMN bio TEXT,
ADD COLUMN banner VARCHAR(300);


/* Alter Table Column */
ALTER TABLE users_user 
ALTER COLUMN is_superuser SET DEFAULT false;

ALTER TABLE users_user 
ALTER COLUMN dob TYPE VARCHAR(80);














