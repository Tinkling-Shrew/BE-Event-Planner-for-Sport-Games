import Joi from "joi";

function validateCreateEvent(event) {
    const eventSchema = Joi.object({
        "name": Joi.string().required(),
        "description": Joi.string().min(0),
        "sport": Joi.string().required(),
        "max_participants": Joi.number().min(2).required(),
        "location": Joi.string().required(),
        "starttime": Joi.string().required(),
        "endtime": Joi.string().required(),
        "password": Joi.string().min(0)
    });

    return eventSchema.validate(event);
}

export default validateCreateEvent;