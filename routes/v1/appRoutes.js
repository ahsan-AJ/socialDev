const fs = require('fs');
const path = require('path');


module.exports = function() {
    let _fns = {};
    fs.readdirSync(__dirname).forEach(function(file){
       if(file === 'index.js' || file === 'appRoutes.js') return;

       let ext = path.extname(file);
       let basename = path.basename(file,ext);

       _fns[basename]= require('./'+file);
    });

    return _fns;
}