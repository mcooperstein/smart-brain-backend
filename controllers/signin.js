const handleSignin = (req,res,db,bcrypt) => {
  const {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to sign in'))
      } else {
        res.status(400).json('incorrect username/password combination')
      }
    })
    .catch(err => res.status(400).json('unable to sign in'))
}

const getProfileRanks = (req,res,db,bcrypt) => {
  const {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        return db.select('*').from('users')
          .then(users => {
            res.json(users)
          })
          .catch(err => res.status(400).json('fail 1'))
      } else {
        res.status(400).json('incorrect username/password combination')
      }
    })
    .catch(err => res.status(400).json('fail 2'))
}

module.exports = {
  handleSignin: handleSignin,
  getProfileRanks: getProfileRanks
}
