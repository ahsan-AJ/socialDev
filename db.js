const mongoose = require('mongoose');
const {mongoURI} = require('./config/keys');

class Database {

    constructor(){
        this._connect();
    }

    _connect(){
        mongoose.connect(mongoURI,{promiseLibrary : global.Promise , useNewUrlParser:true});

        mongoose.connection
            .on('connected',function(){
                console.log('Connected to database')
            })
            .on('disconnected',function(){
                console.log('DB disconnected')
            })
            .on('error',function(error){
                console.error('Error connecting to db \n', error.message);
            })

        process.on('SIGINT',function(){
            mongoose.connection.close(function(){
                console.log(`Mongoose db closed by user`);
                process.exit(0)
            })
        })
    }

}

module.exports = new Database();