const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        mongoose.connect(process.env.DATABASE);
    } catch(error) {
        console.log(error);
    }
};

module.exports = connectDb;