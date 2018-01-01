const mongoose = require('mongoose');
const Kayn = require('kayn').Kayn;
require('../models.js');

const kayn = Kayn(process.env.RIOT_API_KEY)();
const Player = mongoose.model('Player');

exports.kayn = kayn;

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

exports.analyzeMatches = async (matchlist, accountID) => {
    // Save after analyzing each match?
    console.log("analyzing matches...");
    let i = 0;
    let cleanSlate = false;

    const summoner = await Player.findOne({accountID: accountID});
    console.log("retrieved summoner from db: " + summoner.summoner_name);
    console.log("summoner wins before analyzing: " + summoner.wins);
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
    console.log("begin loop");
    for( i ; i < matchlist.length; i++ ) {

        if(matchlist[i] == summoner.terminate_match && cleanSlate == false) {
            summoner.terminate_match = summoner.newest_analyzed_match;
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
            // This means that the player doesn't have stats for this champion yet
            // So we may need to do some stuff to initialize attributes to default values
            // 0...etc. Possibly not though, since I have listed defaults in the model.
            await Player.update(
                {
                    'accountID': accountID
                },
                {
                    '$push': {
                        'champions': {
                            'championID': matchStats.championID
                        }
                    }
                }
            )
        }

        // Increment number of wins/losses
        if(matchStats.outcome == true) {
            await Player.update(
                {
                    'accountID': accountID,
                    'champions': {
                        '$elemMatch': {
                            'championID': matchStats.championID
                        }
                    }
                },
                {
                    '$inc': {
                        'champions.$.kills': matchStats.kills,
                        'champions.$.deaths': matchStats.deaths,
                        'champions.$.assists': matchStats.assists,
                        'champions.$.wins': 1,
                        'champions.$.games_played': 1,
                        'games_played': 1,
                        'wins': 1,
                        'last_analyzed_match': matchlist[i],
                    },
                    /*
                    '$set': {
                        'champions.$.championID': 999999
                    }*/
                }
                /*{
                    'arrayFilters': {
                        'index.championID': 39
                    }
                }*/
            );
            //summoner.wins++;
        }
        else if(matchStats.outcome == false) {

            await Player.update(
                {
                    'accountID': accountID,
                    'champions': {
                        '$elemMatch': {
                            'championID': matchStats.championID
                        }
                    }
                },
                {
                    '$inc': {
                        'champions.$.kills': matchStats.kills,
                        'champions.$.deaths': matchStats.deaths,
                        'champions.$.assists': matchStats.assists,
                        'champions.$.losses': 1,
                        'champions.$.games_played': 1,
                        'games_played': 1,
                        'losses': 1,
                        'last_analyzed_match': matchlist[i],
                    },
                    /*
                    '$set': {
                        'champions.$.championID': 999999
                    }*/
                }
                /*{
                    'arrayFilters': {
                        'index.championID': 39
                    }
                }*/
            );
        }

        await summoner.save();
    }

    summoner.terminate_match = summoner.newest_analyzed_match;
    summoner.save();

    return summoner;
    // Once again, should we save after analyzing each match??
}

exports.buildMatchlist = async accountID => {
    let beginIndex = 0;
    let endIndex = 0;
    let totalGames = 1;
    let matchlist = [];

    while(endIndex != totalGames){
        const partial_matchlist = await kayn.Matchlist.by.accountID(accountID)
                                                         .query({ queue: 420,
                                                                  season: 9,
                                                                  beginIndex: beginIndex});

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