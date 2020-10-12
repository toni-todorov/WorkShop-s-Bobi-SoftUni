const mongoose = require('mongoose')

const AccessoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    },
    cubes: [{
        type: 'ObjectId',
        ref: 'Cube'
    }]
})

module.exports = mongoose.model('Accessory', AccessoriesSchema)