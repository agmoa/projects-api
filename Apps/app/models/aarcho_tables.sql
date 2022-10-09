/* FUNCTIONS */
CREATE EXTENSION pgcrypto;

SELECT usename FROM pg_user


/* ========== AUTO UPDATE TIME ========== */
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


/* ========================= 
        TRIGGERS
========================== */

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users_user
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


/* ========================= 
        SELECTS TABLES
========================== */
/* ==== USERS ==== */
SELECT * FROM users_user ORDER BY user_id;
SELECT * FROM users_user_profile ORDER BY id;
SELECT * FROM users_user_terms ORDER BY id; 

SELECT * FROM forms_contact ORDER BY id; 

SELECT * FROM projects_info ORDER BY id; 

/* ==== ARUMLY ==== */
SELECT * FROM arumly_shop;
SELECT * FROM arumly_shop_object;
SELECT * FROM arumly_checkout;
SELECT * FROM arumly_checkout_cart;


ALTER TABLE users_user_terms ADD COLUMN email VARCHAR REFERENCES users_user (email) ON UPDATE CASCADE ON DELETE CASCADE

ALTER TABLE arumly_shop_object
ADD COLUMN obj_uid VARCHAR(32) DEFAULT generate_uid(30) UNIQUE


/* ========================= 
		ACCOUNT
========================== */

CREATE TABLE users_user(
	user_id BIGSERIAL PRIMARY KEY,
	uid VARCHAR(32) DEFAULT gen_uid('u', 20) UNIQUE,

	email VARCHAR(254) UNIQUE NOT NULL,
    username VARCHAR(80) DEFAULT generate_uid(30) UNIQUE NOT NULL,
	password VARCHAR(128) NOT NULL,
	
	first_name VARCHAR(254) NOT NULL,
	last_name VARCHAR(254) NOT NULL,
	dob DATE,
	gender VARCHAR(254) DEFAULT 'Not Specified' NOT NULL,
	zip_code VARCHAR(254),
	country VARCHAR(254),

	last_login TIMESTAMPTZ,
	date_joined DATE,
	
	is_superuser BOOLEAN DEFAULT false,
	is_staff BOOLEAN DEFAULT false,
	is_active BOOLEAN DEFAULT true,
	account_type VARCHAR DEFAULT 'personal',

	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	initial_terms_accepted BOOLEAN DEFAULT false
); -- 10/7/22

CREATE TABLE users_user_terms(
	id BIGSERIAl UNIQUE PRIMARY KEY NOT NULL,
	email VARCHAR REFERENCES users_user (email) ON UPDATE CASCADE ON DELETE CASCADE
	
	terms_type VARCHAR NOT NULL,
	title VARCHAR NOT NULL,
	terms_version VARCHAR NOT NULL,
	short_description TEXT,
	accepted BOOLEAN DEFAULT false,
	date_commited TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
); -- 10/7/22

CREATE TABLE users_user_profile(
	id BIGSERIAL PRIMARY KEY UNIQUE, 
	email VARCHAR REFERENCES users_user (email) ON UPDATE CASCADE ON DELETE CASCADE,
    
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    title VARCHAR(180),
    position_1 VARCHAR(180),
    position_2 VARCHAR(180),
	bio TEXT, 
    locale VARCHAR(180),
    
	avatar VARCHAR(300) NULL,
	banner VARCHAR(300) NULL,
    resume VARCHAR(500) NULL,
    skills TEXT NULL,

    socials_email TEXT NULL,
    socials_linkedin TEXT NULL,
    socials_instagram TEXT NULL,
    socials_twitter TEXT NULL,
    socials_youtube TEXT NULL,
    socials_facebook TEXT NULL
); -- 10/7/22

CREATE TABLE users_user_pwd(
	pwd_id BIGSERIAL PRIMARY KEY,
	
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	email VARCHAR REFERENCES users_user (email) ON UPDATE CASCADE ON DELETE CASCADE,	
	
	password VARCHAR(128) DEFAULT generate_uid(45) UNIQUE NOT NULL
); -- 10/7/22

CREATE TABLE users_user_birthday(
	id BIGSERIAL PRIMARY KEY,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
	email VARCHAR REFERENCES users_user (email) ON UPDATE CASCADE ON DELETE CASCADE,
	
	month SMALLINT DEFAULT 1,
    day SMALLINT DEFAULT 1,
	year SMALLINT DEFAULT 1

);	-- 10/7/22

CREATE TABLE users_user_address(
	id BIGSERIAl UNIQUE PRIMARY KEY NOT NULL,

	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	email VARCHAR REFERENCES users_user (email) ON UPDATE CASCADE ON DELETE CASCADE,
	
	full_name VARCHAR NOT NULL,
	address VARCHAR NOT NULL,
	address_sub VARCHAR,
	city VARCHAR NOT NULL,
	state VARCHAR NOT NULL,
	zip_code VARCHAR NOT NULL NOT NULL,
	country VARCHAR NOT NULL,
	default_address BOOLEAN DEFAULT false
); -- 10/7/22

/* ========================= 
        PROJECTS
========================== */
CREATE TABLE projects_info(
    id BIGSERIAL NOT NULL PRIMARY KEY,
	proj_uid VARCHAR(32) DEFAULT generate_uid(20) UNIQUE,
    
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
	proj_url TEXT,
    
    name VARCHAR(100),
	desciption TEXT,
	technologies TEXT[]
);

CREATE TABLE projects_file(
    id BIGSERIAL NOT NULL PRIMARY KEY,
	file_uid VARCHAR(32) DEFAULT generate_uid(20) UNIQUE,
    
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    file VARCHAR,
	file_type VARCHAR(300) DEFAULT 'img', -- thumbnail
    is_default BOOLEAN DEFAULT 'false',
    
	proj_uid VARCHAR REFERENCES projects_info (proj_uid) ON UPDATE CASCADE ON DELETE CASCADE
);

/* ========================= 
        FORMS
========================== */
CREATE TABLE forms_contact(
	id BIGSERIAL PRIMARY KEY UNIQUE, 
    
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    full_name VARCHAR(300),
    email VARCHAR(300) NOT NULL,
    company VARCHAR(300),
    subject VARCHAR(300),
    message VARCHAR(300),
    subject_matter VARCHAR(300)
);

/* ========================= 
        ARUMLY
========================== */

CREATE TABLE arumly_shop(
    id BIGSERIAL NOT NULL PRIMARY KEY,
		
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    shop_name VARCHAR(100),
	shop_url VARCHAR(180) DEFAULT generate_uid(20) UNIQUE NOT NULL,
	shop_avatar VARCHAR(300) NULL,
	shop_banner VARCHAR(300) NULL,

	email VARCHAR REFERENCES users_user (email) ON UPDATE CASCADE ON DELETE CASCADE UNIQUE
);

CREATE TABLE arumly_shop_object(
    id BIGSERIAL NOT NULL PRIMARY KEY,
	obj_uid VARCHAR(32) DEFAULT generate_uid(30) UNIQUE,
    
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    thumbnail TEXT,
    obj_name VARCHAR(300) NOT NULL,
	obj_type VARCHAR(180) NOT NULL, -- product-physical, product-digital, events-online, events-inperson 
	obj_description VARCHAR(400),
    obj_tags TEXT[],
	
	shop_status VARCHAR(100) DEFAULT 'draft', -- draft, public, private, archived

    pricing_price NUMERIC(6, 2) DEFAULT 0.00,
	pricing_old_price NUMERIC(6, 2) DEFAULT 0.00,
	pricing_rate VARCHAR(180) DEFAULT 'once',	
    pricing_metric VARCHAR(100) DEFAULT 'usd',

	shop_url VARCHAR REFERENCES arumly_shop (shop_url) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE arumly_checkout_cart(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	obj_uid VARCHAR REFERENCES arumly_shop_object (obj_uid) ON UPDATE CASCADE ON DELETE CASCADE
);



























