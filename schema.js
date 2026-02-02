///This is Backend validation using Joi and first we have used listingSchema then after
/// are using reviews schema to validate from user
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
         categories: Joi.array().items(
      Joi.string().valid(
        "trending",
        "rooms",
        "iconic-cities",
        "pools",
        "camping",
        "farms",
        "metro",
        "domes",
        "5-star"
      )
    ),
  }).required(),
        // image: Joi.object({
        //     filename: Joi.string().allow("", null),
        //     url: Joi.string().required()
        // }).required()
});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})

