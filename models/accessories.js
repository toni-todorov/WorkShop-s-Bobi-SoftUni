const mongoose = require('mongoose')

const AccessoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [/^[A-Za-z0-9]+$/gi , 'Accessory name is not valid'],
        minlength : [5 , 'At least 5 character']

    },
    imageUrl: {
        type: String,
        required: true,
        match: [/^[a-z]+:\/\//gi , 'Please write valid Url'],
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
        match: [/[A-Za-z0-9]+/gi , 'Accessory disctription is not valid'],
        minlength : [20 , 'At least 20 character']

    },
    cubes: [{
        type: 'ObjectId',
        ref: 'Cube'
    }]
})

module.exports = mongoose.model('Accessory', AccessoriesSchema)