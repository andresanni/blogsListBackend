const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String },
    passwordHash: String,
    blogposts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
  },
  {
    versionKey: false,
  }
);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject._v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
