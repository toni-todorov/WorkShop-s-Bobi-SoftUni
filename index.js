require('dotenv').config()
const env = process.env.NODE_ENV || 'development';
const mongoose = require('mongoose')
const config = require('./config/config')[env];
mongoose.connect('mongodb://localhost:27017/cubicle' , {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false
} , (err) => {
    if (err){
        console.error(err)
        throw err
    }
    console.log('Database is setup and runnig')
})

const express = require('express');
const app = express()

const configExpress = require('./config/express');
const cubeRoutes = require('./controllers/cube-routes');
const accessoryRoutes = require('./controllers/accessory-routes');
const configAuth = require('./controllers/user-routes');
const otherRoutes = require('./controllers/404-routes');


configExpress(app);
cubeRoutes(app);
accessoryRoutes(app);
configAuth(app);
otherRoutes(app);


app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));