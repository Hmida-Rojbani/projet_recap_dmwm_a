const mongoose = require('mongoose');
const Joi = require('joi');

const author_schema = new mongoose.Schema({
    name : String,
    first_name: String,
    nb_books : Number
});

module.exports = mongoose.model('Author',author_schema);

