import Joi from 'joi';

export const TodoSchema = Joi.object({
    title: Joi.string()
        .required()
        .min(2)
        .message('Title cannot be less than two characters'),
    description: Joi.string()
        .required()
        .max(300).message("Description cannot be greater than  300 characters"),
    completed: Joi.boolean().required()
});
