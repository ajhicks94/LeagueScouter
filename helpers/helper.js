const mongoose = require('mongoose');
const Kayn = require('kayn').Kayn;
require('../models.js');

const kayn = Kayn(process.env.RIOT_API_KEY)();
const Player = mongoose.model('Player');

exports.summonerExists = async name => {
    const summoner = await Player.findOne({summoner_name: name});

    return summoner;
}

exports.getSoloQueueStats = async summoner_id => {
    const ranks = await kayn.LeaguePositions.by.summonerID(summoner_id);
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