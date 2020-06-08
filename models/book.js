const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);
const book_schema = new mongoose.Schema({
    title : String,
    author : {type :mongoose.Types.ObjectId, ref : 'Author'},
    description : String,
    url_image : String,
    resources : [String],
    price : {type : Number, min :20, max :100}
});

const book_validation_schema = {
    title : Joi.string().min(5).required(),
    author : Joi.objectid().required(),
    description : Joi.string().required(),
    url_image : Joi.string().required(),
    resources : Joi.array().items(Joi.string()),
    price : Joi.number().positive()
}

book_schema.statics.validate_book = (book) =>{
    let results = Joi.validate(book,book_validation_schema);
    return results.error;
}

module.exports = mongoose.model('Book',book_schema);

