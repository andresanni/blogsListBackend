const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    url: String,
    likes: Number,
  },
  {
    versionKey: false,
  }
);

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject._v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
