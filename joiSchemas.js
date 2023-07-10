const Joi = require('joi');

module.exports.rockSchema = Joi.object({
    rock: Joi.object({
        name: Joi.string().required(),
        location: Joi.object({
            area: Joi.string().required(),
            state: Joi.string().allow(''),
            country: Joi.string().required(),
        }).required(),
        //image: Joi.string().allow(''),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.routeSchema = Joi.object({
    route: Joi.object({
        name: Joi.string().required(),
        grade: Joi.string().required(),
        types: Joi.string().required(),
        pitches: Joi.number().required().min(1),
        description: Joi.string().allow(''),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
    }).required()
});