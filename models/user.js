/*
 * USER MODEL
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Quiz = require('./quiz');

var UserSchema = new Schema({
    created_at: { type: Date,  default: Date.now() },
    updated_at: { type: Date },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    quizzes: [Quiz.schema]
});

UserSchema.pre('save', function(next){
  // set a created_at and update updated_at
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

// export User model
var User = mongoose.model('User', UserSchema);

module.exports = User;
