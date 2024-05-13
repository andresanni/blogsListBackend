const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

blogRouter.get('/', async (request, response) => {
  const notes = await Blog.find({}).populate('author', { username: 1 });

  response.send(notes);
});

blogRouter.post('/', async (request, response) => {
  const { title, url, likes } = request.body;
  const token = request.token;
  const userInToken = request.user;
  if (!userInToken) {
    return response.status(401).json({ error: 'invalid token' });
  }

  const author = await User.findOne({ _id: userInToken.id });
  const blog = new Blog({ title, url, likes, author: author.id });

  if (!blog.likes) {
    blog.likes = 0;
  }

  if (!blog.url || !blog.title) {
    return response.status(400).send();
  }

  const savedBlog = await blog.save();

  author.blogposts = author.blogposts.concat(savedBlog._id);
  await author.save();

  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  
  const paramId = request.params.id;
  const userInToken = request.user;

  if (!userInToken.id) {
    return response.status(401).json({ error: 'token required' });
  }

  const blogToDelete = await Blog.findById(paramId);
  const authorId = blogToDelete.author.toString();

  if (userInToken.id.toString() !== authorId.toString()) {
    return response
      .status(403)
      .json({ error: 'only author can delete a post' });
  }

  await Blog.findByIdAndDelete(paramId);

  const user = await User.findById(authorId);

  user.blogposts = user.blogposts.filter(
    (postId) => postId.toString() !== paramId
  );

  await user.save();

  return response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const contentToUpdate = request.body;

  const updatedBlogPost = await Blog.findByIdAndUpdate(id, contentToUpdate, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  response.json(updatedBlogPost);
});

module.exports = blogRouter;
