const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, first_name) => {
	sgMail
		.send({
			to: email, // Change to your recipient
			from: "hello@aarcho.com", // Change to your verified sender
			subject: "Welcome to Aarcho Consulting!",
			//   text: `Login ${first_name}`,
			template_id: "d-86361687a5a941d5ab2b698431015094", // welcome id
			dynamic_template_data: {
				first_name: first_name,
				// city: "Denver",
			},
		})
		.catch(error => {
			console.error(error);
		});
};

const sendLoginEmail = (email, first_name) => {
	sgMail
		.send({
			to: email, // Change to your recipient
			from: "no-replay@aarcho.com", // Change to your verified sender
			subject: "Login notification from Aarcho",
			//   text: `Login ${first_name}`,
			template_id: "d-868d38d9ff07436da1c098937eaac5c7", // logged in id
			dynamic_template_data: {
				first_name: first_name,
				// city: "Denver",
			},
		})
		.catch(error => {
			console.error(error);
		});
};

module.exports = {
	sendWelcomeEmail,
	sendLoginEmail,
	//   sendCancelationEmail
};
