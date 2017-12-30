const mongoose = require('mongoose');
const Kayn = require('kayn').Kayn;
require('../models.js');

const kayn = Kayn(process.env.RIOT_API_KEY)();
const Player = mongoose.model('Player');

exports.summonerExists = async name => {
    const summoner = await Player.findOne({summoner_name: name});

    return summoner;
}

exports.test = async name => {
    const summoner = await kayn.Summoner.by.name(name);

    return summoner;
}