const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();

// Define our models
require('../models/models.js');

// Get champion JSON object
const champions = require('../public/champions.json');

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

// Import kayn and REGIONS
const kayn = require('../helpers/helper.js').kayn;
const REGIONS = require('../helpers/helper.js').REGIONS;

// GET home page.
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    body: 'Welcome to lolscouter.com!'
  });
});

router.post("/scouter", async (req, res) => {

  /* For all inputted summoners:
    * Input = summoner_name
    * 1. Check to see if our stats are up to date
    *  a. If so, send stats
    *  b. If not, update stats
    * 2. Update stats
    *  a. Loop through all unanalyzed matches and analyze them
    * 3. Send stats

    * 1. Check to see if our stats are up to datee
    *  a. Case 1: We don't have this player in the DB
    *  b. Case 2: We have the player, but are stats are incomplete
    *  c. Case 3: We have the player and our stats are complete
  */

  try{
    // Need to cache this permanently
    //const champions = await kayn.Static.Champion.list().query({dataById: true});
    //console.log('champions= ' + JSON.stringify(champions, null, 4));

    // Get accountID and summonerID
    const player = await kayn.Summoner.by.name(req.body.summoner_name).region(req.body.region);

    // Get current rank data
    const rank = await getSoloQueueStats(player.id);

    // Check if the summoner exists in our DB already
    const summoner = await summonerExists(player.name);
    
    // Case 1: Player is not in our DB
    if(!summoner){

      // Construct the new Player object
      const new_player = new Player({
        region: req.body.region,
        accountID: player.accountId,
        summonerID: player.id,
        summoner_name: player.name,
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

      // TODO: We can make lines 84-91 a function so we do not repeat code in the if-else
      //       get matchlist, analyze matches, get top5

      // Construct matchlist
      const matchlist = await buildMatchlist(new_player);

      // Analyze match stats
      await analyzeMatches(matchlist, new_player.accountID);

      // Get player's 5 most-played champions
      const top5 = await getTop5Champs(new_player.accountID);
      

      res.render('index',{
        //title: 'New Player!',
        body: 'New Player saved: ' + new_player.summoner_name,
        champ1: champions.data[top5[0].championID].name,
        champ2: champions.data[top5[1].championID].name,
        champ3: champions.data[top5[2].championID].name,
        champ4: champions.data[top5[3].championID].name,
        champ5: champions.data[top5[4].championID].name
      });
    }
    // Case 2/3: Player is in our DB
    else{
      // Check if our data is updated

      // Get current rank data

      // TODO: need to update the rank in our DB
      //       maybe change function to getRankAndUpdate(Player player)?, then we just call player.save() here in index.js
      //const rank = await getSoloQueueStats(player.id);

      const matchlist = await buildMatchlist(summoner);

      await analyzeMatches(matchlist, summoner.accountID);

      const top5Champs = await getTop5Champs(summoner.accountID);

      // Can only make 10 requests to the static endpoint per HOUR, need to store and cache champID->champName

      // Since champions live in the player model, we should just populate the .champion_name attribute whenever 
      // we first add a new champion to that player's list by looking in the full champion list by ID, rather than
      // looking in the full champion list every single time we need to output the name.

      res.render('index', {
        //title: 'Found summoner in DB!',
        body: "Found summoner in DB: " + summoner.summoner_name,
        champ1: champions.data[top5Champs[0].championID].name,
        champ2: champions.data[top5Champs[1].championID].name,
        champ3: champions.data[top5Champs[2].championID].name,
        champ4: champions.data[top5Champs[3].championID].name,
        champ5: champions.data[top5Champs[4].championID].name
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