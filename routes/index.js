const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();

// GET home page.
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    body: 'Welcome to lolscouter.com!'
  });
});

router.post("/form", (req, res) => {

  //let myData = new Team(req.body);
  const Player = mongoose.model("Player");
  let new_player = new Player({
    summoner_name: req.body.p1
  });

  // If save is successful, print message and redirect to index
  new_player.save()
    .then(item => {
      res.render('index', {
        title: 'Home',
        body: "Successfully added " + new_player.summoner_name
      });
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