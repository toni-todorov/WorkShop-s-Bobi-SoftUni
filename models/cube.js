const mongoose = require('mongoose')

const CubeShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [/^[A-Za-z0-9]+$/gi , 'Please write valid name with english letters and digits'],
        minlength : [5 , 'Please write longer name']

    },
    description: {
        type: String,
        required: true,
        maxlength:2000,
        match: [/[A-Za-z0-9]+/gi , 'Cube disctription is not valid'],
        minlength : [20 , 'At least 20 character']

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