const express = require('express');
const url = 'mongodb://localhost/dmwm_recap'
require('./db/connect')(url);
const app = express();
const port = process.env.PORT || 3000;
const book_router = require('./routers/books');

app.use(express.json());
app.use('/api/books',book_router);



app.listen(port, ()=> console.log('Server is running'));