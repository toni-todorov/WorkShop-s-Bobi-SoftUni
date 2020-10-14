const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { isLogin } = require('../services/user-service');


module.exports = (app) => {
    app.use(cookieParser())
    //TODO: Setup the view engine
    app.engine('.hbs',handlebars({
        extname: '.hbs'
    }));

    app.set('view engine','.hbs');
    //TODO: Setup the body parser
    app.use(bodyParser.urlencoded({ extended: false }));

    //TODO: Setup the static files
    app.use(express.static('static'));
    app.use(isLogin)
};