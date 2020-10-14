const mongoose = require('mongoose')

const CubeShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxlength:2000,
    },
    imageUrl: {
        type: String,
        required: true,
        // validate:(function (imageUrl){
        //     let urlRegEx = /^[a-z]+:\/\//gi
        //     return urlRegEx.test(imageUrl)
        // },'Invalid URL.')
        match: [/^[a-z]+:\/\//gi , 'Please write valid Url']
    },
    difficultyLevel: {
        type: Number,
        required : true,
        min: 1,
        max: 10,
    },
    accessories: [{
        type: 'ObjectId',
        ref: 'Accessory'
    }],
    creatorId: {
        type: 'ObjectId',
        ref: 'User'
    }
})

module.exports = mongoose.model('Cube' , CubeShema)