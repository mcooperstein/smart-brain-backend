const getProfile = (req,res,db) => {
  const {id} = req.params;
  let found = false;
  db.select('*').from('users').where({
    id
  }).then(user => {
    if(user.length) {
      res.json(user[0])
    } else {
      res.status(400).json('user not found')
    }
  }).catch(err => res.status(400).json('error getting user'))
}

const getProfileRank = (req,res,db) => {
  const {id} = req.params;
  let found = false;
  db.select('*').from('users').then(users => {
    if(users.length) {
      res.json(users)
    } else {
      res.status(400).json('users db not found')
    }
  }).catch(err => res.status(400).json('error getting user'))
}


module.exports = {
  getProfile: getProfile,
  getProfileRank: getProfileRank
};
