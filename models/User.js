const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    username: 'string',
    password: 'string',
    email: 'string',
    createdAt: 'date',
    modifiedAt: 'date'
});

userSchema.pre('save', function (next) {
    let now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }

    this.modifiedAt = now;

    if (this.isModified('password')) {
        bcrypt.genSalt(SALT_WORK_FACTOR).then(salt => {
            bcrypt.hash(this.password, salt).then(password => {
                this.password = password;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);