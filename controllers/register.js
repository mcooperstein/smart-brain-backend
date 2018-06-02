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
  const {email,name,password} = req.body;
  if(!email || !name || !password) {
    return res.status(400).json('unable to register');
  }
  db.select('*').from('users')
  .then(users => {
    if(users.length) {
      res.json(users)
    } else {
      res.status(400).json('users not found')
    }
  }).catch(err => res.status(400).json('error getting users ranks'))
}

module.exports = {
  handleRegister: handleRegister,
  getProfileRank: getProfileRank
};
