const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[A-Za-z0-9]+$/gi , 'Please write valid username with english letters'],
        minlength : [5 , 'Please write longer username']
    },

    password: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('User' , UserShema)