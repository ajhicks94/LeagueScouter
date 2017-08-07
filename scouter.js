// Global Variables
// We can pull this from the spreadsheet and make each user use their own api key, might be the best way once we're done
var apiKey = 'YOUR_API_KEY_HERE';

var s = SpreadsheetApp.getActiveSpreadsheet();
var sheet = s.getSheetByName('Configuration');
var dataSheet = s.getSheetByName('data');
//dataSheet.getRange(1,1,1,2).setValues([['matchId', 'body']]);
var startTime = new Date().getTime();

var summoners = sheet.getRange('J3:N3').getValues();
var summonerTop = summoners[0][0];
var summonerJungle = summoners[0][1];
var summonerMid = summoners[0][2];
var summonerADC = summoners[0][3];
var summonerSupport = summoners[0][4];
sheet = s.getSheetByName('New Stats');

var champions = {
  1: 'Annie', 2: 'Olaf', 3: 'Galio', 4: 'Twisted Fate', 5: 'Xin Zhao', 6: 'Urgot', 7: 'LeBlanc', 8: 'Vladimir', 9: 'Fiddlesticks', 10: 'Kayle',
  11: 'Master Yi', 12: 'Alistar', 13: 'Ryze', 14: 'Sion', 15: 'Sivir', 16: 'Soraka', 17: 'Teemo', 18: 'Tristana', 19: 'Warwick', 20: 'Nunu',
  21: 'Miss Fortune', 22: 'Ashe', 23: 'Tryndamere', 24: 'Jax', 25: 'Morgana', 26: 'Zilean', 27: 'Singed', 28: 'Evelynn', 29: 'Twitch', 30: 'Karthus',
  31: 'Cho\'Gath', 32: 'Amumu', 33: 'Rammus', 34: 'Anivia', 35: 'Shaco', 36: 'Dr. Mundo', 37: 'Sona', 38: 'Kassadin', 39: 'Irelia', 40: 'Janna',
  41: 'Gangplank', 42: 'Corki', 43: 'Karma', 44: 'Taric', 45: 'Veigar', 48: 'Trundle', 50: 'Swain', 51: 'Caitlyn', 53: 'Blitzcrank', 54: 'Malphite',
  55: 'Katarina', 56: 'Nocturne', 57: 'Maokai', 58: 'Renekton', 59: 'Jarvan IV', 60: 'Elise', 61: 'Orianna', 62: 'Wukong', 63: 'Brand', 64: 'Lee Sin', 67: 'Vayne',
  68: 'Rumble', 69: 'Cassiopeia', 72: 'Skarner', 74: 'Heimerdinger', 75: 'Nasus', 76: 'Nidalee', 77: 'Udyr', 78: 'Poppy', 79: 'Gragas', 80: 'Pantheon',
  81: 'Ezreal', 82: 'Mordekaiser', 83: 'Yorick', 84: 'Akali', 85: 'Kennen', 86: 'Garen', 89: 'Leona', 90: 'Malzahar', 91: 'Talon', 92: 'Riven',
  96: 'Kog\'Maw', 98: 'Shen', 99: 'Lux', 101: 'Xerath', 102: 'Shyvana', 103: 'Ahri', 104: 'Graves', 105: 'Fizz', 106: 'Volibear', 107: 'Rengar',
  110: 'Varus', 111: 'Nautilus', 112: 'Viktor', 113: 'Sejuani', 114: 'Fiora', 115: 'Ziggs', 117: 'Lulu', 119: 'Draven', 120: 'Hecarim', 121: 'Kha\'Zix',
  122: 'Darius', 126: 'Jayce', 127: 'Lissandra', 131: 'Diana', 133: 'Quinn', 134: 'Syndra', 136: 'Aurelion Sol', 141: 'Kayn', 143: 'Zyra', 150: 'Gnar',
  154: 'Zac', 157: 'Yasuo', 161: 'Vel\'Koz', 163: 'Taliyah', 164: 'Camille', 201: 'Braum', 202: 'Jhin', 203: 'Kindred', 222: 'Jinx', 223: 'Tahm Kench',
  236: 'Lucian', 238: 'Zed', 240: 'Kled', 245: 'Ekko', 254: 'Vi', 266: 'Aatrox', 267: 'Nami', 268: 'Azir', 412: 'Thresh', 420: 'Illaoi', 421: 'Rek\'Sai',
  427: 'Ivern', 429: 'Kalista', 432: 'Bard', 497: 'Rakan', 498: 'Xayah',
};

function main() {
  deleteTriggers();
  ScriptApp.newTrigger('main').timeBased().everyMinutes(5).create();
  Logger.log('Begin.');
  try {
    //run('top');
    //run('jungle');
    //run('mid');
    //run('adc');
    //run('support');
  } catch (e) {
    return;
  }
  Logger.log('Complete.');
  deleteTriggers();
}

function run(role) {
  var accountId, matchIds;
  
  var stats = {};
  var champStats = {};
  
  var top = [-1, -1, -1, -1, -1];
  
  if(role == 'top') {
    accountId = getAccountId(summonerTop);
    stats = getStats(summonerTop);
    matchIds = getMatchIds(summonerTop);
    
    sumStatsPerMatch(accountId, matchIds, champStats, stats)
    calculateTop5Champs(champStats, top);
    
    sendDataToSheet(stats, champStats, top, role);
  }
  else if(role == 'jungle') {
   accountId = getAccountId(summonerJungle);
    stats = getStats(summonerJungle);
    matchIds = getMatchIds(summonerJungle);
    
    sumStatsPerMatch(accountId, matchIds, champStats, stats)
    calculateTop5Champs(champStats, top);
    
    sendDataToSheet(stats, champStats, top, role);
  }
  else if(role == 'mid') {
    accountId = getAccountId(summonerMid);
    stats = getStats(summonerMid);
    matchIds = getMatchIds(summonerMid);
    
    sumStatsPerMatch(accountId, matchIds, champStats, stats)
    calculateTop5Champs(champStats, top);
    
    sendDataToSheet(stats, champStats, top, role);
  }
  else if(role == 'adc') {
    accountId = getAccountId(summonerADC);
    stats = getStats(summonerADC);
    matchIds = getMatchIds(summonerADC);
    
    sumStatsPerMatch(accountId, matchIds, champStats, stats)
    calculateTop5Champs(champStats, top);
    
    sendDataToSheet(stats, champStats, top, role);
  }
  else if(role == 'support') {
    accountId = getAccountId(summonerSupport);
    stats = getStats(summonerSupport);
    matchIds = getMatchIds(summonerSupport);
    
    sumStatsPerMatch(accountId, matchIds, champStats, stats)
    calculateTop5Champs(champStats, top);
    
    sendDataToSheet(stats, champStats, top, role);
  }
}

function sendDataToSheet(stats, champStats, top, role) {
  var range;
  var championName = [];
  var champString = [];
  var sumString = stats['name'] + ' - ' + stats['tier'][0] + stats['division'] + ' ' + stats['lp'] + 'LP';
  
  for(var i = 0; i < 5; i++) {
    champStats[top[i]]['kda'] = roundAtTwoPlaces((champStats[top[i]]['kills'] + champStats[top[i]]['assists']) / champStats[top[i]]['deaths']);
    champStats[top[i]]['wr'] = Math.round(roundAtTwoPlaces((champStats[top[i]]['wins'] / champStats[top[i]]['totalGames']) * 100));
    championName[i] = getChampionName(top[i]);
    champString[i] = championName[i] + ' - ' + champStats[top[i]]['totalGames'] + ' games\n' + champStats[top[i]]['kda'] + ':1 KDA, ' + champStats[top[i]]['wr'] + '% WR';
  }
  
  if(role == 'top') range = 'J3:J9';
  else if(role == 'jungle') range = 'K3:K9';
  else if(role == 'mid') range = 'L3:L9';
  else if(role == 'adc') range = 'M3:M9';
  else if(role == 'support') range = 'N3:N9';
  
  sheet.getRange(range).setValues([[sumString], [''], [champString[0]], [champString[1]], [champString[2]], [champString[3]], [champString[4]]]);
}

function calculateTop5Champs(champStats, top){
  for (champ in champStats) {
    if(champStats[champ]['totalGames'] > champStats[top[0]]['totalGames']) {        
      top[4] = top[3];
      top[3] = top[2];
      top[2] = top[1];
      top[1] = top[0];
      top[0] = champStats[champ]['champId'];
    }
    else if(champStats[champ]['totalGames'] > champStats[top[1]]['totalGames']) {
      top[4] = top[3];
      top[3] = top[2];
      top[2] = top[1];
      top[1] = champStats[champ]['champId'];
    }
    else if(champStats[champ]['totalGames'] > champStats[top[2]]['totalGames']) {
      top[4] = top[3];
      top[3] = top[2];
      top[2] = champStats[champ]['champId'];
    }
    else if(champStats[champ]['totalGames'] > champStats[top[3]]['totalGames']) {
      top[4] = top[3];
      top[3] = champStats[champ]['champId'];
    }
    else if(champStats[champ]['totalGames'] > champStats[top[4]]['totalGames']) {
      top[4] = champStats[champ]['champId'];
    }
  }
}

function sumStatsPerMatch(accountId, matchIds, champStats, stats) {
  var matchStats;
  var cId;
  
  for(var i = 0; i < matchIds.length; i++) {
    matchStats = getMatchData(matchIds[i], accountId);
    
    // Some preseason games were being included
    if(matchStats == '0'){
      Logger.log('Match skipped due to incorrect season: ' + matchIds[i]);
      continue;
    }
    
    cId = matchStats['champId'];
    
    // Prevent undefined errors
    initializeVars(champStats, stats, cId);
   
    // Add the match's kills, deaths, assists, and win or loss to the grand total
    champStats[cId]['kills'] += matchStats['kills'];
    champStats[cId]['deaths'] += matchStats['deaths'];
    champStats[cId]['assists'] += matchStats['assists'];
    champStats[cId]['champId'] = cId;
    
    if(matchStats['outcome'] == true) champStats[cId]['wins'] += 1;
    else if(matchStats['outcome'] == false) champStats[cId]['losses'] += 1;
    
    champStats[cId]['totalGames'] += 1;
    stats['totalGames'] += 1;
    
    Logger.log('Match analyzed: ' + matchIds[i])
  }
  Logger.log('\nTotal games analyzed: ' + stats['totalGames'] + '\n');
}

function initializeVars(champStats, stats, cId) {
  
  if(typeof(stats['totalGames']) === 'undefined') stats['totalGames'] = 0;
  
  if(typeof(champStats[-1]) === 'undefined') champStats[-1] = {};
  if(typeof(champStats[-1]['totalGames']) === 'undefined') champStats[-1]['totalGames'] = 0;
  
  if(typeof(champStats[cId]) === 'undefined') {
    champStats[cId] = {};
  }
  
  if(typeof(champStats[cId]['kills']) === 'undefined') champStats[cId]['kills'] = 0;
  if(typeof(champStats[cId]['deaths']) === 'undefined') champStats[cId]['deaths'] = 0;
  if(typeof(champStats[cId]['assists']) === 'undefined') champStats[cId]['assists'] = 0;
  if(typeof(champStats[cId]['kda']) === 'undefined') champStats[cId]['kda'] = 0.0;
  if(typeof(champStats[cId]['wins']) === 'undefined') champStats[cId]['wins'] = 0;
  if(typeof(champStats[cId]['losses']) === 'undefined') champStats[cId]['losses'] = 0;
  if(typeof(champStats[cId]['totalGames']) === 'undefined') champStats[cId]['totalGames'] = 0;
  if(typeof(champStats[cId]['champId']) === 'undefined') champStats[cId]['champId'] = 0;
}

function getMatchData(matchId, accountId) {
  var partId, data;
  var matchStats = {};
  
  url = 'https://na1.api.riotgames.com/lol/match/v3/matches/' + matchId + '?forAccountId=' + accountId + '&api_key=' + apiKey;
  data = getData(url, matchId.toString(), 'sheet', matchId, accountId);
  
  if(new Date().getTime() - startTime >= 290000) {
    Logger.log('Time\s Up');
    throw 'Time\'s Up';
  }  
  
  if(data == '0'){
    return '0';
  }
  
  // Get the player's stats from the match
  for(var i = 0; i < data['participantIdentities'].length; i++) {
    if(data['participantIdentities'][i]['player']['accountId'] == accountId) {
      partId = data['participantIdentities'][i]['participantId'];
      
      matchStats['kills'] = data['participants'][partId - 1]['stats']['kills'];
      matchStats['deaths'] = data['participants'][partId - 1]['stats']['deaths'];
      matchStats['assists'] = data['participants'][partId - 1]['stats']['assists'];
      matchStats['champId'] = data['participants'][partId - 1]['championId'];
      matchStats['outcome'] = data['participants'][partId - 1]['stats']['win'];
      
      return matchStats;
    }
  }
  
}

// Get a list of all solo queue matches this season for that summoner
function getMatchIds(summoner) {
  var matchIds = [];
  var accountId = getAccountId(summoner);
  
  url = 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/' + accountId + '?queue=420&season9&' + 'api_key=' + apiKey;
  data = getData(url, accountId.toString(), 'cache');
  
  for(var i = 0; i < data['matches'].length; i++) {
    matchIds.push(data['matches'][i]['gameId']);
  }
  
  return matchIds;
}

function getChampionName(id) {
  var name;
  name = champions[id];
  return name;
}

function getAccountId(summoner) {
  var data, accountId;
  
  url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + summoner + '?api_key=' + apiKey;
  data = getData(url, summoner, 'cache');
  accountId = data['accountId'];
  
  return accountId;
}

function getStats(summoner) {
  var data, id, tierStats;
  
  url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + summoner + '?api_key=' + apiKey;
  var cacheString = summoner + 'id';
  data = getData(url, cacheString, 'cache');
  id = data['id'];
  
  url = 'https://na1.api.riotgames.com/lol/league/v3/leagues/by-summoner/' + id + '?api_key=' + apiKey;
  cacheString = summoner + 'tier';
  data = getData(url, cacheString, 'cache');
  
  tierStats = getTierStats(id, data);
  
  return tierStats;
}
function getTierStats(id, data) {
  var stats = {};
  
  stats['tier'] = data[0]['tier'];
  
  for(var i = 0; i < data[0]['entries'].length; i++) {
    if(data[0]['entries'][i]['playerOrTeamId'] == id) {
      stats['name'] = data[0]['entries'][i]['playerOrTeamName'];
      stats['division'] = romanToDecimal(data[0]['entries'][i]['rank']);
      stats['lp'] = data[0]['entries'][i]['leaguePoints'];
    }
  }
  return stats;
}

function dealWithResponses(url, string, cache, statusCode) {
  if(statusCode == 429) {
    
    Logger.log('429: Rate limit exceeded.');
    if(new Date().getTime() - startTime >= 250000) {
      Logger.log('Time\'s Up');
      throw 'Time\'s Up';
    }
    Utilities.sleep(8000);
    return getData(url, string, cache);
  }
  else if(typeof(statusCode) == 'number') {
    Utilities.sleep(statusCode);
    return getData(url, string, cache);
  }
}  

function getData(url, string, cache, matchId, accountId) {
  var response, statusCode, json, data;
  
  if(new Date().getTime() - startTime >= 250000) {
    Logger.log('Time\'s Up');
    throw 'Time\'s Up';
  }
  
  if(cache == 'cache'){
    var c = getCachedItem(string);
    
    if(c != false){
      Logger.log('Cache loaded: ' + string);
      data = JSON.parse(c);
      return data;
    }
    
    response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    statusCode = response.getResponseCode();
    
    if(statusCode == 200) {
      var cache = CacheService.getScriptCache();
      
      json = response.getContentText();
      cache.put(string, json, 3000);
      data = JSON.parse(json);
      
      return data;
    }
    dealWithResponses(url, string, cache, statusCode);
  }
  else if(cache == 'sheet') {
  
    var lastColumn = dataSheet.getLastColumn();
    if(lastColumn == 0) lastColumn++;
    
    var accountExists = false;
    var accountColumn;
    var rngArr = dataSheet.getRange(1,1,1,lastColumn).getValues();
    
    Logger.log('Looking for account in sheet: ' + accountId);
    // First, check to see if we have that match in our data already.
    // Loop through the headers of accountIds
    for( var i = 0; i < lastColumn; i++) {
      if(rngArr[0][i] == accountId) {
        Logger.log('Found account in sheet: ' + accountId);
        accountExists = true;
        accountColumn = i + 1;
        
        // Get the last row in that column
        var lastRow = lastValue(columnToLetter(accountColumn));
        
        // Get the values from those two columns since we have a [matchId][details] structure
        var arr = dataSheet.getRange(2,accountColumn,lastRow,2).getValues();
        
        // Loop through that account's matchIds in the sheet
        Logger.log('Searching for match in sheet: ' + matchId);
        for(var j = 0; j < lastRow; j++) {
          if(arr[j][0] == matchId) {
            Logger.log('Match found in sheet: ' + matchId);
            var data = JSON.parse(arr[j][1]);
            return data;
          }
        }
        Logger.log('Match not found in sheet: ' + matchId);
      }
    }
    
    // If we've gotten this far, then the match isn't in our data yet.
    response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    statusCode = response.getResponseCode();
    
    if(statusCode == 200) {
      
      // If we have the account, but not the match
      if(accountExists == true) {
        var emptyRow = lastValue(columnToLetter(accountColumn)) + 1;
        json = response.getContentText();
        data = JSON.parse(json);
        
        if(data['seasonId'] && data['seasonId'] != 9) return '0';
        
        dataSheet.getRange(emptyRow, accountColumn, 1, 2).setValues([[matchId, json]]);
        Logger.log('Match saved in sheet: ' + matchId);
        
        return data;
      }
      // If we don't have the account nor the match
      else{
        lastColumn = dataSheet.getLastColumn();
        
        json = response.getContentText();
        data = JSON.parse(json);
        
        if(data['seasonId'] && data['seasonId'] != 9) return '0';
        if(lastColumn == 0) lastColumn = 0;
        
        dataSheet.getRange(1,lastColumn + 1,2,2).setValues([[accountId, ''],[matchId, json]]);
        
        Logger.log('New account saved in sheet: ' + accountId);
        
        return data;
      }
    }
    else if(statusCode == 429) {
      Logger.log('429: Rate limit exceeded.');
      
      Utilities.sleep(10000);
      return getData(url, string, cache, matchId, accountId);
    }
    else if(typeof(statusCode) == 'number') {
      Utilities.sleep(statusCode);
      return getData(url, string, cache, matchId, accountId);
    }    
  }
}

function getCachedItem(string) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(string);
  
  if (cached != null) {
    return cached;
  }
  return false;
}

function romanToDecimal(num) {
 if(num == 'I') num = '1';
 else if(num == 'II') num = '2';
 else if(num == 'III') num = '3';
 else if(num == 'IV') num = '4';
 else if(num == 'V') num = '5';
  
 return num;
}

function roundAtTwoPlaces(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function lastValue(column) {
  var lastRow = dataSheet.getMaxRows();
  var values = dataSheet.getRange(column + "1:" + column + lastRow).getValues();
  
  for (; values[lastRow - 1] == "" && lastRow > 0; lastRow--) {}
  return lastRow;
}

function columnToLetter(column)
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function deleteTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for(var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}
