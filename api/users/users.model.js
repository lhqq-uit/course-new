var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        minlength: [8, 'The password should be at least 8 characters long']
    },
    fullname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Teacher'],
        // default: 'Admin' // để  admin cho test api, thực tế sẽ là student
    },
    currentToken: {
        type: String
    },
    avatar: {
        type: String,
        default: "https://i.imgur.com/zALNWt9.png"
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);