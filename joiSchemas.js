const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// create an extension to Joi to sanitize the user input
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});



const Joi = BaseJoi.extend(extension);

module.exports.rockSchema = Joi.object({
    rock: Joi.object({
        name: Joi.string().required().escapeHTML(),
        location: Joi.object({
            area: Joi.string().required().escapeHTML(),
            state: Joi.string().allow('').escapeHTML(),
            country: Joi.string().required().escapeHTML(),
        }).required(),
        //image: Joi.string().allow(''),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.routeSchema = Joi.object({
    route: Joi.object({
        name: Joi.string().required().escapeHTML(),
        grade: Joi.string().required(),
        types: Joi.string().required(),
        pitches: Joi.number().required().min(1),
        description: Joi.string().allow('').escapeHTML(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required()
});