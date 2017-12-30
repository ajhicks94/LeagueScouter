const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();

// Define our models
require('../models.js');

// Import Player model
const Player = mongoose.model("Player");

// GET home page.
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    body: 'Welcome to lolscouter.com!'
  });
});

router.post("/scouter", async (req, res) => {
  /*
  Do some processing to obtain all data needed
  in order to populate a new Player object
  */

  // For all inputted summoners:
  // Input = summoner_name
  // 1. Check to see if our stats are up to date
  //  a. If so, send stats
  //  b. If not, update stats
  // 2. Update stats
  //  a. Loop through all unanalyzed matches and analyze them
  // 3. Send stats

  // 1. Check to see if our stats are up to datee
  //  a. Case 1: We don't have this player in the DB
  //  b. Case 2: We have the player, but are stats are incomplete
  //  c. Case 3: We have the player and our stats are complete

  // 1.

  try{
    const summoner = await Player.findOne({summoner_name: req.body.summoner_name});

    if(!summoner){

      // Add the summoner to the db
      const new_player = await new Player({
        summoner_name: req.body.summoner_name
      });

      await new_player.save();

      res.render('index',{
        title: 'New Player!',
        body: "Added summoner to DB: " + new_player.summoner_name
      });
    }
    else{
      res.render('index', {
        title: 'Success!',
        body: "Found summoner in DB: " + summoner.summoner_name
      });
    }
  }
  catch (e) {
    res.status(400).send('error somewhere');
  }
  /*
  let new_player = new Player({
    summoner_name: req.body.summoner_name
  });
  */
  // If save is successful, print message and redirect to index
  /*new_player.save()
    .then(item => {
      res.render('index', {
        title: 'Home',
        body: "Successfully added " + new_player.summoner_name
      });
    })
    .catch(err => {
      res.status(400).send("unable to save to db");
    });*/
});

router.get('/scouter', (req, res) => {
  res.render('scouter', {
    title: 'Scouter'
  })
})

module.exports = router;