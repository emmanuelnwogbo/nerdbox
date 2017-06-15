const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    userid: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    newpassword: {
      type: String,
      required: true
    }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(userid, newpassword, callback) {
  User.findOne({ userid: userid })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(newpassword, user.newpassword , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        });
      });
};

// hash password before saving to database
UserSchema.pre('save', function(next) {
  let user = this;
  bcrypt.hash(user.newpassword, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.newpassword = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
