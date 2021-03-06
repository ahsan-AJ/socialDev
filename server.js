const express = require('express');
const helmet = require('helmet');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 5000;

require('./db');


app.use(helmet());
app.use(passport.initialize());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

require('./config/passport')(passport);

app.get('/',(req,res)=>{
    res.send('Demo');
});

require('./routes/v1')(app);
app.listen(port,()=> console.log(`Server is listening at ${port}`));





