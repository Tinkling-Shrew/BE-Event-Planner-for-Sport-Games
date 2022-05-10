import Joi from "joi";

function validateCreateUser(user) {
    const userSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().min(10),
        password: Joi.string().min(8).required(),
    });

    return userSchema.validate(user);
}

export default validateCreateUser;
