const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'a0535ef45dfd4d75b2498a2f651fafca'
});

const handleApiCall = (req,res) => {
  app.models.predict(
    Clarifai.FACE_DETECT_MODEL,
    req.body.input
  ).then(data => {
    res.json(data)

  }).catch(err => res.status(400).json('unable to complete API call'))
}

const demographicApiCall = (req,res) => {
  app.models.predict(
    "c0c0ac362b03416da06ab3fa36fb58e3",
    req.body.input
  ).then(data => {
    res.json(data)
  }).catch(err => res.status(400).json('unable to complete API call'))
}

const handleImageCount = (req,res,db) => {
  const {id} = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('unable to update entries count'))
}

module.exports = {
  handleImageCount,
  handleApiCall,
  demographicApiCall
}
