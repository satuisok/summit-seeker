const Joi = require('joi');

module.exports.rockSchema = Joi.object({
    rock: Joi.object({
        name: Joi.string().required(),
        location: Joi.object({
            area: Joi.string().required(),
            state: Joi.string().allow(''),
            country: Joi.string().required(),
        }).required(),
        image: Joi.string().allow(''),
        description: Joi.string().required(),
    }).required()
});