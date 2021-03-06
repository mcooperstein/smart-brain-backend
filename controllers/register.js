const handleRegister = (req,res,db,bcrypt) => {
  const {email,name,password} = req.body;
  if(!email || !name || !password) {
    return res.status(400).json('unable to register');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        }).then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .then(response => console.log('transaction complete'))
  .catch(err => res.status(400).json('unable to register'))
}

const getProfileRank = (req,res,db,bcrypt) => {
  const {email, password, name} = req.body;
  if(!email || !password || !name) {
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
  handleRegister: handleRegister,
  getProfileRank: getProfileRank
};
