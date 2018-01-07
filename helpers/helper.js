const mongoose = require('mongoose');
const Kayn = require('kayn').Kayn;
const REGIONS = require('kayn').REGIONS;

//mongoose.set('debug', true);
require('../models.js');

const kayn = Kayn(process.env.RIOT_API_KEY)();
const Player = mongoose.model('Player');
const fs = require('fs');

const fn = async () => {
    const champions = await kayn.Static.Champion.list().query({dataById: true})
    fs.writeFile('champions.json', JSON.stringify(champions), (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}

fn();

exports.kayn = kayn;
exports.REGIONS = REGIONS;

exports.summonerExists = async name => {
    const summoner = await Player.findOne({summoner_name: name});

    return summoner;
}

// Instead of creating a full matchlist and then checking
// newest/latestAnalyzedMatch, why don't we just create a list
// that only contains the matches we don't have analyzed?
// I guess the problem with that is, with a development key,
// we won't be able to finish analyzing a whole summoner without
// having to wait

exports.getChampName = async champID => {
    const champion = await kayn.Static.Champion.get(champID);

    return champion.name;
}

exports.getTop5Champs = async accountID => {
    topChamps = await Player.find({accountID: accountID }, 
                            { champions: { $slice: 5 } });
    return topChamps[0].champions;
}

exports.analyzeMatches = async (matchlist, accountID) => {
    console.log("Analyzing matches...");

    let i = 0;
    let cleanSlate = false;

    const summoner = await Player.findOne({accountID: accountID});
    
    // If the summoner doesn't have any matches analyzed yet
    if(summoner.newest_analyzed_match == undefined){
        summoner.newest_analyzed_match = summoner.oldest_analyzed_match = summoner.last_analyzed_match = matchlist[0];
        summoner.terminate_match = matchlist[matchlist.length - 1];
        cleanSlate = true;
    }
    // If there's new matches to analyze
    else if(matchlist[0] > summoner.newest_analyzed_match) {
        summoner.newest_analyzed_match = summoner.last_analyzed_match = matchlist[0];
    }
    // If there's a gap in our matches (caused by rate limit or timeout/interrupt)
    else if(summoner.last_analyzed_match > summoner.terminate_match) {
        for(let j = 0; j < matchlist.length; j++) {
            if(matchlist[j] == summoner.last_analyzed_match){
                i = j + 1;
                break;
            }
        }
    }
    for( i ; i < matchlist.length; i++ ) {

        if(matchlist[i] == summoner.terminate_match && cleanSlate == false) {
            summoner.terminate_match = summoner.newest_analyzed_match;
            return summoner;
        }
        // Could use ternary operator here but it's already a bit verbose
        if(summoner.oldest_analyzed_match > matchlist[i]) {
            summoner.oldest_analyzed_match = matchlist[i];
        }
        const matchStats = await exports.getMatchStats(matchlist[i], accountID);
        const champID = matchStats.championID;

        const cursor = await Player.findOne({accountID: accountID, 'champions.championID': champID},
                                            {champions: {$elemMatch: {championID: champID}}});
        
        if(!cursor) {

            // Insert a new champion and maintain sort of decreasing #games_played (so we can pull top 5 champs easier)
            // Or would it be more efficient to just query the 5 champs with highest games_played?
            await Player.update(
                { 'accountID': accountID },
                { '$push': { 'champions': { '$each': [{ 'championID': matchStats.championID }],
                                            '$sort': { 'games_played': -1 }}}});
        }

        // Increment stats (we could do two updates for massively improved readability, are updates heavy on mongo?)
        if(matchStats.outcome == true) {
            await Player.update(
                {   'accountID': accountID,
                    'champions': {
                        '$elemMatch': {
                            'championID': matchStats.championID
                        }
                    }
                },
                {   '$inc': {
                        'champions.$.kills': matchStats.kills,
                        'champions.$.deaths': matchStats.deaths,
                        'champions.$.assists': matchStats.assists,
                        'champions.$.wins': 1,
                        'champions.$.games_played': 1,
                        'games_played': 1,
                        'wins': 1,
                        'last_analyzed_match': matchlist[i],
                    }
                });
        }
        else if(matchStats.outcome == false) {

            await Player.update(
                {   'accountID': accountID,
                    'champions': {
                        '$elemMatch': {
                            'championID': matchStats.championID
                        }
                    }
                },
                {   '$inc': {
                        'champions.$.kills': matchStats.kills,
                        'champions.$.deaths': matchStats.deaths,
                        'champions.$.assists': matchStats.assists,
                        'champions.$.losses': 1,
                        'champions.$.games_played': 1,
                        'games_played': 1,
                        'losses': 1,
                        'last_analyzed_match': matchlist[i],
                    }
                });
        }

        await summoner.save();
    }

    summoner.terminate_match = summoner.newest_analyzed_match;
    await summoner.save();

    return summoner;
    // Once again, should we save after analyzing each match??
}

exports.buildMatchlist = async summoner => {
    let beginIndex = 0;
    let endIndex = 0;
    let totalGames = 1;
    let matchlist = [];

    while(endIndex != totalGames){
        const partial_matchlist = await kayn.Matchlist.by.accountID(summoner.accountID)
                                                         .query({ queue: 420,
                                                                  season: 9,
                                                                  beginIndex: beginIndex});
        if(partial_matchlist.matches[0].gameId == summoner.terminate_match) {
            return 0;
        }
        partial_matchlist.matches.forEach(element => {
            matchlist.push(element.gameId);
        });

        beginIndex += 100;
        endIndex = partial_matchlist.endIndex;
        totalGames = partial_matchlist.totalGames;
    }
    
    return matchlist;
}

exports.getMatchStats = async (matchID, accountID) => {
    const matchStats = {};

    const match = await kayn.Match.get(matchID);

    // Can't break or return out of forEach loop, is there a better way to do this?
    match.participantIdentities.forEach(element => {
        // TODO: Re-evaluate the need for that OR statement
        if( element.player.accountId == accountID || element.player.currentAccountId == accountID) {
            const partID = element.participantId;
            const player = match['participants'][partID - 1];

            matchStats.kills = player.stats.kills;
            matchStats.deaths = player.stats.deaths;
            matchStats.assists = player.stats.assists;
            matchStats.championID = player.championId;
            matchStats.outcome = player.stats.win;
        }
    });

    return matchStats;
}

exports.getSoloQueueStats = async summonerID => {
    const ranks = await kayn.LeaguePositions.by.summonerID(summonerID);
    let rank;

    // Loop through all queues because we only care about solo_queue
    ranks.forEach(element => {
        if( element.queueType == 'RANKED_SOLO_5x5'){
            rank = element;
        }
    });

    // Convert "division" attribute from roman numeral to decimal
    rank.rank = exports.romanToDecimal(rank.rank);

    return rank;
}

exports.romanToDecimal = (roman) => {
    switch (roman) {
        case 'I': return 1;
            break;
        case 'II': return 2;
            break;
        case 'III': return 3;
            break;
        case 'IV': return 4;
            break;
        case 'V': return 5;
            break;
    }
}