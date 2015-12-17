/*
 * QUIZ MODEL
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Result = require('./result');

var QuizSchema = new Schema({
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date },
    results: [Result.schema],
    owner_id: {type: String },
    playlist_id: { type: String },
    playlist_name: {type: String }
});

// MIDDLEWARE
QuizSchema.pre('save', function(next){
  // set a created_at and update updated_at
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

// export post model
var Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
