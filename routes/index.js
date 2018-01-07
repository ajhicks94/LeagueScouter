const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();
//const Kayn = require('kayn').Kayn;

// Define our models
require('../models.js');

// Import our helper functions
const summonerExists = require('../helpers/helper.js').summonerExists;
const getChampName = require('../helpers/helper').getChampName;
const getRank = require('../helpers/helper.js').getRank;
const buildMatchlist = require('../helpers/helper.js').buildMatchlist;
const analyzeMatches = require('../helpers/helper.js').analyzeMatches;
const getTop5Champs = require('../helpers/helper.js').getTop5Champs;
const getSoloQueueStats = require('../helpers/helper.js').getSoloQueueStats;
const romanToDecimal = require('../helpers/helper.js').romanToDecimal;

// Import Player model
const Player = mongoose.model("Player");

const kayn = require('../helpers/helper.js').kayn;
const REGIONS = require('../helpers/helper.js').REGIONS;

// GET home page.
router.get('/', (req, res) => {
  console.log('REGIONS= ' + JSON.stringify(REGIONS));
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
    //console.log('body= ' + JSON.stringify(req.body));
    const player = await kayn.Summoner.by.name(req.body.summoner_name).region(req.body.region);
    const rank = await getSoloQueueStats(player.id);
    const summoner = await summonerExists(req.body.summoner_name);
    
    // If the summoner isn't in our DB yet
    if(!summoner){
      // Get accountID and summonerID
      
      // Get rank data

      // Construct the new Player object
      const new_player = new Player({
        region: req.body.region,
        accountID: player.accountId,
        summonerID: player.id,
        summoner_name: req.body.summoner_name,
        rank: {
          current: {
            tier: rank.tier,
            division: rank.rank,
            league_points: rank.leaguePoints
          },
        },
      });
      // Save the new Player object to DB
      await new_player.save();

      // Get matchIds
      const matchlist = await buildMatchlist(new_player);

      // Analyze matches
      await analyzeMatches(matchlist, new_player.accountID);

      // Top 5 Champions
     
      await getTop5Champs(new_player.accountID);
      

      res.render('index',{
        //title: 'New Player!',
        body: 'New Player saved: ' + new_player.summoner_name
      });
    }
    else{
      // Check if our data is updated

      const matchlist = await buildMatchlist(summoner);

      await analyzeMatches(matchlist, summoner.accountID);

      const top5Champs = await getTop5Champs(summoner.accountID);

      //for(let i = 0; i < top5Champs.length; i++) {
        //top5Champs[i].championName = await getChampName(top5Champs[i].championID);
      //}
      console.log('top5Champs= ' + JSON.stringify(top5Champs, null, 4));
      console.log('top5Champs.length= ' + top5Champs.length);
      const ori = await kayn.Static.Champion.get(top5Champs[4].championID);
      console.log('???= ' + ori.name);
      res.render('index', {
        title: 'Success!',
        //body: "Found summoner in DB: " + summoner.summoner_name,
        champ1: top5Champs[0].championName,
        champ2: top5Champs[1].championID,
        champ3: top5Champs[2].championID,
        champ4: top5Champs[3].championID,
        champ5: top5Champs[4].championID
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
    title: 'Scouter',
    regions: REGIONS,
  })
})

module.exports = router;