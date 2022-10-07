REINDEX DATABASE postgres;

SELECT *
FROM pg_user;

/* ========================= 
    SELECTS
========================== */
SELECT * FROM users_user;


ALTER TABLE users_user 
ADD COLUMN project VARCHAR(120);

ALTER TABLE users_user 
ALTER COLUMN dob TYPE VARCHAR(80);



/* ========================= 
    TABLES
========================== */
/* Create Users Table */
CREATE TABLE users_user
(
	user_id BIGSERIAL PRIMARY KEY,

	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),	

	email VARCHAR(254) UNIQUE NOT NULL,
	username VARCHAR(80) UNIQUE NOT NULL,
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
);  -- Updated 8/11/22



/* ========================== DROP TABLE ========================== */
/* DROP TABLE */ DROP TABLE users_user; /* DROP TABLE */ 
/* ========================== DROP TABLE ========================== */



















