const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateHash = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const generateValidTokenFor = (user)=>{
  const payload = {
    id: user._id,
    username: user.username
  }
  return jwt.sign(payload , process.env.SECRET);
}

const saveTwoUsers = async () => {
  const user1Hash = await generateHash('123');
  const user2Hash = await generateHash('345');

  const user1 = new User({
    username: 'andy',
    name: 'andres',
    passwordHash: user1Hash,
  });
  const user2 = new User({
    username: 'rafita',
    name: 'rafael',
    passwordHash: user2Hash,
  });

  await user1.save();
  await user2.save();
};

const getInitialBlogs = (user1Id, user2Id) => {
  return [
    {
      title: 'React patterns',
      author: user1Id,
      url: 'https://reactpatterns.com/',
      likes: 7,
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: user1Id,
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      title: 'Canonical string reduction',
      author: user2Id,
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 1,
    },
    {
      title: 'First class tests',
      author: user2Id,
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 1,
    },
    {
      title: 'TDD harms architecture',
      author: user2Id,
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    },
    {
      title: 'Type wars',
      author: user1Id,
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    },
  ];
};

const getBlogs = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { getInitialBlogs, getBlogs, saveTwoUsers, generateValidTokenFor };
