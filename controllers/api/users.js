const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  create,
  login,
  Delete,
  checkToken
};

function checkToken(req, res) {
  console.log('req.user', req.user);
  res.status(200).json(req.exp);
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    res.status(200).json( createJWT(user) );
  } catch(e) {
    res.status(400).json({msg: e.message, reason: 'Bad Credentials'});
  }
}

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    // token will be a string
    const token = createJWT(user);
    // send back the token as a string
    // which we need to account for
    // in the client
    res.status(200).json(token);
  } catch (e) {
    res.status(400).json({msg: e.message});
  }
}

async function Delete(req,res) {
  try{
      await User.findByIdAndDelete(req.params.id, (e) => {
          if(e) res.status(400).json(e)
      })
  }catch(e){
      res.status(400).json(e)
  }
}


/*-- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}