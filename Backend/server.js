const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');

// set up an express app
const app = express();

app.use('/api', cors({
    methods: ['GET','POST','DELETE','PUT'],
    credentials: true

}));

//initialize routes 


app.use(bodyParser.json());
app.use(express.json());
app.use('/api',routes);


// listen for requests
app.listen(8080,function(){
    console.log('Listening...')
});



//npm run start//