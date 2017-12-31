var mongoose = require('mongoose');
// User
// email - require it - trim it - set type - set min length of 1

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

module.exports = {
  User
}