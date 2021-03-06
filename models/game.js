const mongoose = require('../config/database')

const {Schema, model} = mongoose

const gameSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    price: {type: Number, required: true},
    qty: {type: Number, required: true},
    dev: String,
    reviews: Array,
    approved: {type: String, default: 'review', enum: ['yes', 'review', 'no']},
    reason: String,
    sold: {type: Number, default: 0}
},
{
    timestamps: true
})

module.exports = model('Game', gameSchema)