const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: String,
    p1: String,
    p2: String,
    p3: String,
    p4: String,
    p5: String
  });

const playerSchema = new mongoose.Schema({
    accountID: Number,
    summonerID: Number,
    summoner_name: String,
    games_played: {
        type: Number,
        default: 0
    },
    newest_analyzed_match: Number,
    oldest_analyzed_match: Number,
    last_analyzed_match: Number,
    terminate_match: Number,
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    rank: {
        current: {
            tier: String,
            division: Number,
            league_points: Number
        },

        // List of previous season ranks
        previous: [{
            // NOTE: RIOT API Does not provide previous season data
            //       Thus, we would have to store everyone's ranks on the
            //       last day of the season
            season: Number,
            tier: String,
            division: Number,
            league_points: Number
        }]
    },
    champions: [{
        championID: Number,
        champion_name: String,
        wins: {
            type: Number,
            default: 0
        },
        losses: {
            type: Number,
            default: 0
        },
        games_played: {
            type: Number,
            default: 0
        },
        kills: {
            type: Number,
            default: 0
        },
        deaths: {
            type: Number,
            default: 0
        },
        assists: {
            type: Number,
            default: 0
        },
        // List of champions played vs
        matchups: [{
            championID: Number,
            champion_name: String,
            wins: Number,
            losses: Number,
            games_played: Number,

            // List of keystones used
            keystones: [{
                keystoneID: Number,
                keystone_name: String,
                wins: Number,
                losses: Number,
                games_played: Number,

                // List of keystones played vs
                vs_keystones: [{
                    keystoneID: Number,
                    keystone_name: String,
                    wins: Number,
                    losses: Number,
                    games_played: Number
                }]
            }]
        }]
    }]
})

mongoose.model("Team", teamSchema);
mongoose.model("Player", playerSchema);