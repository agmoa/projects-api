SELECT * FROM 'forms_contact';

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