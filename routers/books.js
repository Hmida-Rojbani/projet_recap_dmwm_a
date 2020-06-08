const router = require('express').Router();
const Book = require('../models/book');
const Author = require('../models/author');
const _ = require('lodash');

router.get('',async (req,res)=>{
    let books = await Book.find().populate('author');
    res.send(books);
});

router.get('/id/:id',async (req,res)=>{
    let books = await Book.findById(req.params.id).populate('author');
    res.send(books);
});


router.post('', async (req,res)=>{
    let errors = Book.validate_book(req.body);
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
});

router.delete('/id/:id',async (req,res)=>{
    let book = await Book.findByIdAndRemove(req.params.id);
    if(!book)
        res.send('No book with this id');
        let author = await Author.findById(book.author);
        author.nb_books -=1;
        await author.save();
    res.send(book);
});

router.put('/id/:id',async (req,res)=>{
    let book = await Book.findById(req.params.id);
    if(!book)
        res.send('No book with this id');
    let errors = Book.validate_book(req.body);
    if(errors)
        return res.status(400).send(errors.details[0].message);
    let old_author_id = book.author;
    book = _.merge(book,req.body);
    if(old_author_id != book.author)
    {
    let new_author = await Author.findById(book.author);
    if(! new_author)
        return res.status(400).send('author id does not exist');
    new_author.nb_books +=1;
    await new_author.save();

    let old_author = await Author.findById(old_author_id);
    old_author.nb_books -=1;
    await old_author.save();
    }
    book = await book.save();
    res.send(book);
});

// get book with price
router.get('/price/:price',async (req,res)=>{
    let books = await Book.find({price : req.params.price});
    res.send(books.length);
});

// get book with price with author
router.get('/price/:price/author/:author_id',async (req,res)=>{
    let books = await Book.find({price : req.params.price, author : req.params.author_id});
    res.send(books.length);
});

// book begin with part_title
router.get('/title/:part_title',async (req,res)=>{
    let books = await Book.find({title: {$regex:'/^{'+req.params.part_title+'}'}});
    res.send(books);
});

//display sorted authors
router.get('/authors/',async (req,res)=>{
    let authors = await Author.find().sort('name');
    res.send(authors);
});
module.exports = router;