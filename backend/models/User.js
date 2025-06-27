const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}, // Fixed: removed unique:true from password
    points: {type: Number, default: 0},
    badges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Badge'}],
});

userSchema.pre('save', async function(next) { // Fixed: 'save' not 'Save'
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);