const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const schema = new mongoose.Schema({
    local: {
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        }
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

});

schema.methods.encryptPassword = function (password) {
    // @ts-ignore
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', schema);