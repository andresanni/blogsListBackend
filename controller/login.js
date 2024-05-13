const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
require('dotenv').config();

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordIsCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordIsCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const secret = process.env.SECRET;

  const userToPayload = { username, id: user._id };

  const token = jwt.sign(userToPayload, secret);

  response.status(200).json({ token, username: user.name });
});

module.exports = loginRouter;
