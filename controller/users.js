const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.get('/', async(request, response)=>{

  const users = await User.find({}).populate('notes',{url:1, title:1});
  response.json(users);
});

userRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;

  //user ya esta validado en el modelo
  if(password.length<3 || username.length<3 || !password){
    return response.status(400).json({error: "user and password required, with min length 3"})
  }
  

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try{
    const user = new User({ username, name, passwordHash });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
  catch(exception){
    next(exception);
  }
});



module.exports = userRouter;
