const mongoose = require('mongoose');

module.exports = async function connection (url) {
    try{
        await mongoose.connect(url, {useNewUrlParser : true, useUnifiedTopology : true, useFindAndModify:true, useCreateIndex :true});
        console.log('Mongo is UP.')
    }catch(err){
        console.log('Mongo is DOWN. ERROR :'+err.message);
    }
}