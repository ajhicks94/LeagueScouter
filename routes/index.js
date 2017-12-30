const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();
const Kayn = require('kayn').Kayn;

// Define our models
require('../models.js');

// Import our helper functions
const summonerExists = require('../helpers/helper.js').summonerExists;
const getRank = require('../helpers/helper.js').getRank;
const getSoloQueueStats = require('../helpers/helper.js').getSoloQueueStats;
const romanToDecimal = require('../helpers/helper.js').romanToDecimal;

// Import Player model
const Player = mongoose.model("Player");

const kayn = Kayn(process.env.RIOT_API_KEY)();

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

    const summoner = await summonerExists(req.body.summoner_name);
    
    // If the summoner isn't in our DB yet
    if(!summoner){

      // Get account_id and summoner_id
      const player = await kayn.Summoner.by.name(req.body.summoner_name);
      
      // Get rank data
      const rank = await getSoloQueueStats(player.id);

      const new_player = new Player({
        account_id: player.accountId,
        summoner_id: player.id,
        summoner_name: req.body.summoner_name,
        wins: rank.wins,
        losses: rank.losses,
        rank: {
          current: {
            tier: rank.tier,
            division: rank.rank,
            league_points: rank.leaguePoints
          },
        }
      });

      // Get matchIds

      // Analyze matches

      // Top 5 Champions

      // Create a new Player object
     

      // Save the new Player object to DB
      await new_player.save();

      res.render('index',{
        //title: 'New Player!',
        body: 'New Player saved! = ' + new_player
        //body: "Added summoner to DB: " + new_player.summoner_name
      });
    }
    else{
      // Check if our data is updated



      res.render('index', {
        title: 'Success!',
        body: "Found summoner in DB: " + summoner.summoner_name
      });
    }
  }
  catch (e) {
    console.log('ERROR: ' + e);
    res.status(400).send('ERROR: ' + e);
  }
});

router.get('/scouter', (req, res) => {
  res.render('scouter', {
    title: 'Scouter'
  })
})

module.exports = router;