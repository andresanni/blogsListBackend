const mongoose = require('mongoose');
const { test, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert');
const app = require('../app');
const supertest = require('supertest');
const helper = require('./test_helpers');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

describe.only('whith some users and blogposts initially added', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await helper.saveTwoUsers();

    const user1 = await User.findOne({ username: 'andy' });
    const user2 = await User.findOne({ username: 'rafita' });

    const initialBlogs = helper.getInitialBlogs(user1.id, user2.id);
    const blogsObjects = initialBlogs.map((blog) => new Blog(blog));

    const saveBlogsPromisesArray = blogsObjects.map((blog) => blog.save());
    await Promise.all(saveBlogsPromisesArray);

    const savedBlogPosts = await Blog.find({});

    for (let blogPost of savedBlogPosts) {
      const user = await User.findById(blogPost.author);
      user.blogposts = user.blogposts.concat(blogPost.id);
      await user.save();
    }
  });

  test.only('all blogposts are returned as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/);
    assert.strictEqual(response.body.length, helper.getInitialBlogs().length);
  });

  test.only('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');

    response.body.forEach((blog) => {
      assert(blog.hasOwnProperty('id'));
      assert(!blog.hasOwnProperty('_id'));
    });
  });

  describe.only('when adding a new post with correct user token', async () => {
    test.only('a blog publication is created', async () => {
      const author = await User.findOne({ username: 'rafita' });
      const validUserToken = helper.generateValidTokenFor(author);

      const blogPost = {
        title: 'Programming things',
        url: 'https://andresanni.com/',
        likes: 2,
      };

      const initialBlogs = await helper.getBlogs();

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${validUserToken}`)
        .send(blogPost)
        .expect(201);

      const finalBlogs = await helper.getBlogs();

      const blogsTitles = finalBlogs.map((blog) => blog.title);

      assert.strictEqual(initialBlogs.length + 1, finalBlogs.length);
      assert(blogsTitles.includes('Programming things'));
    });

    test.only('a blog publication without likes property is set to 0', async () => {
      const author = await User.findOne({ username: 'andy' });
      const token = helper.generateValidTokenFor(author);

      const blogPostWithoutLikes = {
        title: 'Programming things',
        url: 'https://andresanni.com/',
      };

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogPostWithoutLikes)
        .expect(201);

      const savedPost = response.body;
      assert(savedPost.hasOwnProperty('id'));
      assert(savedPost.likes === 0);
    });

    test.only('a blog publication without url or without title receives a response status 400', async () => {
      const author = await User.findOne({ username: 'andy' });
      const token = helper.generateValidTokenFor(author);

      const blogWithoutUrl = {
        title: 'Programming things',
        author: 'Andres Anni',
        likes: 7,
      };

      const blogWithoutTitle = {
        author: 'Andres Anni',
        url: 'https://andresanni.com/',
        likes: 7,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400);
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutTitle)
        .expect(400);
    });
  });

  describe.only('when deleting a post with correct author user token', async () => {
    test.only('a blog post is deleted with valid id', async () => {
      const author = await User.findOne({ username: 'andy' });
      const token = helper.generateValidTokenFor(author);

      const blogsAtStart = await helper.getBlogs();
      const id = blogsAtStart[0].id;

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`);
      const blogsAtEnd = await helper.getBlogs();

      assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length);
    });
  });
});

test('a valid blogpost is updated correctly', async () => {
  const blogsAtStart = await helper.getBlogs();
  const idToUpdate = blogsAtStart[0].id;

  const newContent = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 8,
  };

  await api.put(`/api/blogs/${idToUpdate}`).send(newContent);

  const blogsAtEnd = await helper.getBlogs();

  assert.deepStrictEqual(blogsAtEnd[0], { ...newContent, id: idToUpdate });
});

test('username and password too short give an error message', async () => {
  const userWithShortPassword = {
    username: 'andy',
    name: 'andres',
    password: 'as',
  };

  const userWithShortUsername = {
    username: 'an',
    name: 'andres',
    password: 'assadada',
  };

  let response = await api
    .post('/api/users')
    .send(userWithShortPassword)
    .expect(400);
  assert(response.body.error.includes('3'));

  response = await api
    .post('/api/users')
    .send(userWithShortUsername)
    .expect(400);
  assert(response.body.error.includes('3'));
});

after(() => {
  mongoose.connection.close();
});
