const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
  });
});

router.post("/form", (req, res) => {
  const User = mongoose.model("User");
  var myData = new User(req.body);
  myData.save()
    .then(item => {
      res.send("item saved to db");
    })
    .catch(err => {
      res.status(400).send("unable to save to db");
    });
});

router.get('/form', (req, res) => {
  res.render('form');
});

router.get('/scouter', (req, res) => {
  res.render('scouter', {
    title: 'Scouter'
  })
})

module.exports = router;