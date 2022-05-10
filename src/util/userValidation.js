import Joi from "joi";

function validateCreateUser(user) {
	const userSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().required(),
		phone: Joi.number().integer(),
	});

	return userSchema.validate(user);
}

export default validateCreateUser;
