const mongoose = require('mongoose');

const connectDatabase = async ()=>{
    await mongoose.connect(
        process.env.CONNECTION_STRING
        );
}

module.exports = connectDatabase;