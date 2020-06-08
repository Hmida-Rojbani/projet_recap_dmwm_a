const router = require('express').Router();
const Book = require('../models/book');
const Author = require('../models/author');
const _ = require('lodash');

router.get('',async (req,res)=>{
    let books = await Book.find().populate('author');
    res.send(books);
});

router.post('', async (req,res)=>{
    let errors = Book.validate_book(req.boy);
    if(errors)
        return res.status(400).send(errors.details[0].message);
    let book = new Book(_.pick(req.body,['title','author','description','url_image','resources','price']));
    let author = await Author.findById(book.author);
    if(! author)
        return res.status(400).send('author id does not exist');
    book = await book.save();
    author.nb_books +=1;
    await author.save();
    res.status(201).send(book);
})


module.exports = router;