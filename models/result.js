/*
 * RESULT MODEL
 */

 var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

 var ResultSchema = new Schema({
     created_at: { type: Date, default: Date.now() },
     score: { type: Number },
     possible_score: { type: Number }
 });

 ResultSchema.pre('save', function(next){
   // set a created_at
   now = new Date();
   this.created_at = now;
   next();
 });

 // export Result model
 var Result = mongoose.model('Result', ResultSchema);

 module.exports = Result;
