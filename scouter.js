// TODO: Properly print unranked summoners
//       Pull API Key from sheet
Logger.log('Begin.');

// Global Variables
var summoners;
var startTime = new Date().getTime();

var apiKey = 'YOUR_KEY_HERE';

var s = SpreadsheetApp.getActiveSpreadsheet();

var scouterExists = setUp();

var sheet = s.getSheetByName('Scouter');
var sheetName = sheet.getRange('I7').getValue();
var dataSheet = s.getSheetByName('data');

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

var headerRange = 'J2:N2';
var headerSubRange = 'P2:T2';
var headerRangeMerged = 'J2:N3';
var headerSubRangeMerged = 'P2:T3';
var kdaRange = 'N3:N32';
var kdaSubRange = 'T3:T14';
var dataRange = 'L4:N32';
var dataSubRange = 'R4:T14';
var topRange = 'J4:N8';
var jungleRange = 'J10:N14';
var midRange = 'J16:N20';
var adcRange = 'J22:N26';
var supportRange = 'J28:N32';
var subOneRange = 'P4:T8';
var subTwoRange = 'P10:T14';

var summonerColumn = 'J4:J32';
var summonerSubColumn = 'P4:P14';
var championColumn = 'K4:K32';
var championSubColumn = 'Q4:Q14';

function main() {
  //Logger.log('Function executing: main()');
  var time;
  var roleArr = ['top','jungle','mid','adc','support','subOne','subTwo'];
  var z = 0;
  deleteTriggers();
  //ScriptApp.newTrigger('main').timeBased().everyMinutes(5).create();
  
  //Logger.log('Function executing: setUp()');
  if(scouterExists == false) return;
  //Logger.log('Function completed: setUp()');
  
  while(z < 7) {
    time = run(roleArr[z]);
    if(time != 0) return;
    z += 1; 
  }
  
  /*time = run('top');
  if(time != 0) return;
  time = run('jungle');
  if(time != 0) return;
  time = run('mid');
  if(time != 0) return;
  time = run('adc');
  if(time != 0) return;
  time = run('support');
  if(time != 0) return
  time = run('subOne');
  if(time != 0) return;
  time = run('subTwo');
  if(time != 0) return;
  */
  //Logger.log('Function executing: formatOutput()');
  formatOutput();
  //Logger.log('Function completed: formatOutput()');
  deleteTriggers();
  
  //Logger.log('Function completed: main()');
}

function run(role) {
  //Logger.log('Function executing: run()');
  var accountId, matchIds, summoner, completeCell;
  var accountInfo = {};
  var profile = {};
  var topChamps = [-1,-1,-1,-1,-1];
  var accountRange = getAccountRange();
  
  if(role == 'top') {
    if(!summoners[0][0]) return 0;
    completeCell = 'I4';
    summoner = summoners[0][0];
  }
  else if(role == 'jungle') {
    if(!summoners[1][0]) return 0;
    completeCell = 'I10';
    summoner = summoners[1][0];
  }
  else if(role == 'mid') {
    if(!summoners[2][0]) return 0;
    completeCell = 'I16';
    summoner = summoners[2][0];
  }
  else if(role == 'adc') {
    if(!summoners[3][0]) return 0;
    completeCell = 'I22';
    summoner = summoners[3][0];
  }
  else if(role == 'support') {
    if(!summoners[4][0]) return 0;
    completeCell = 'I28';
    summoner = summoners[4][0]; 
  }
  else if(role == 'subOne') {
    if(!summoners[5][0]) return 0;
    completeCell = 'O4';
    summoner = summoners[5][0];
  }
  else if(role == 'subTwo') {
    if(!summoners[6][0]) return 0;
    completeCell = 'O10';
    summoner = summoners[6][0];
  }
  //Logger.log('Function executing: getAccountId');
  accountId = getAccountId(summoner); // worst + best: 1 fetch
  //Logger.log('Function completed: getAccountId');
  
  if(accountExists(accountId)){
    Logger.log('Loading account: ' + accountId);
    accountInfo = loadAccountInfo(accountId);
    Logger.log('Account loaded: ' + accountId);
  }
  
  //Logger.log('Function executing: getRank()');
  profile = getRank(summoner, accountInfo); // worst: 2, best: 1 fetch
  if(profile['tier'] == 'Unranked') return 0;
  //Logger.log('Function completed: getRank()');
  //Logger.log('Function executing: getMatchIds()');
  matchIds = getMatchIds(accountId); // worst + best: 1 fetch
  //Logger.log('Function completed: getMatchIds()');
  //Logger.log('Function executing: analyzeMatches()');
  if(analyzeMatches(matchIds, accountId, profile, accountInfo) == 'Time\'s Up') {
    sheet = s.getSheetByName(sheetName);
    sheet.getRange(completeCell).setValue((Math.round(roundAtTwoPlaces((accountInfo['totalGames'] / matchIds.length) * 100))) + '% analyzed...');
    return 1;
  }// worst: number of matches in matchlist, best: 0
  //Logger.log('Function completed: analyzeMatches()');
  //Logger.log('Function executing: getTop5Champs()');
  getTop5Champs(topChamps, accountInfo); // 0 fetches
  //Logger.log('Function completed: getTop5Champs()');
  //Logger.log('Function executing: printStatsToSheet()');
  printStatsToSheet(accountId, topChamps, role, profile, accountInfo); // 0 fetches
  //Logger.log('Function completed: printStatsToSheet()');
  
  return 0;
}


function formatOutput() {
  var sheet, cell, newSheetName;
  newSheetName = sheetName;
  sheet = s.getSheetByName(newSheetName);
  
  cell = sheet.getRange('J1:N1');
  cell.mergeAcross();
  cell.setValue('Active Roster');
  cell.setFontSize(12);
  cell.setFontWeight('bold');
  cell.setBorder(true,true,true,true,true,true);
  cell.setHorizontalAlignment('center');
  
  cell = sheet.getRange('P1:T1');
  cell.mergeAcross();
  cell.setValue('Substitutes');
  cell.setFontSize(12);
  cell.setFontWeight('bold');
  cell.setBorder(true,true,true,true,true,true);
  cell.setHorizontalAlignment('center');
  
  // Headers
  cell = sheet.getRange(headerRange);
  cell.setBackgrounds([['#d9d2e9', '#f4cccc', '#c9daf8', '#d9ead3', '#fff2cc']]);
  cell.setValues([['Summoner', 'Champion', 'Games', 'Win %', 'KDA']]);
  cell.setHorizontalAlignment('center');
  cell.setBorder(true,true,true,true,true,true);
  cell.setFontSize(11);
  
  // Sub Headers
  cell = sheet.getRange(headerSubRange);
  cell.setBackgrounds([['#d9d2e9', '#f4cccc', '#c9daf8', '#d9ead3', '#fff2cc']]);
  cell.setValues([['Summoner', 'Champion', 'Games', 'Win %', 'KDA']]);
  cell.setHorizontalAlignment('center');
  cell.setBorder(true,true,true,true,true,true);
  cell.setFontSize(11);
  
  // Merged headeres
  cell = sheet.getRange(headerRangeMerged);
  cell.mergeVertically();
  cell.setVerticalAlignment('middle');
  
  cell = sheet.getRange(headerSubRangeMerged);
  cell.mergeVertically();
  cell.setVerticalAlignment('middle');
  
  // Summoner Column
  cell = sheet.getRange(summonerColumn);
  cell.setHorizontalAlignment('center');
  cell.setBorder(true, true, true, true, false, false);
  cell.setBackground('#f3f3f3');
  
  // Sub Summoner Column
  cell = sheet.getRange(summonerSubColumn);
  cell.setHorizontalAlignment('center');
  cell.setBorder(true, true, true, true, false, false);
  cell.setBackground('#f3f3f3');
  
  // Summoner names
  cell = sheet.getRange('J4');
  cell.setBorder(true,true,true,true,true,true);
  cell = sheet.getRange('J10');
  cell.setBorder(true,true,true,true,true,true);
  cell = sheet.getRange('J16');
  cell.setBorder(true,true,true,true,true,true);
  cell = sheet.getRange('J22');
  cell.setBorder(true,true,true,true,true,true);
  cell = sheet.getRange('J28');
  cell.setBorder(true,true,true,true,true,true);
  cell = sheet.getRange('P4');
  cell.setBorder(true,true,true,true,true,true);
  cell = sheet.getRange('P10');
  cell.setBorder(true,true,true,true,true,true);  
  
  // Champion column
  cell = sheet.getRange(championColumn);
  cell.setHorizontalAlignment('left');
  cell.setBackground('#f3f3f3');
  cell.setBorder(true,true,true,true,true,true);
  
  // Champion Sub Column
  cell = sheet.getRange(championSubColumn);
  cell.setHorizontalAlignment('left');
  cell.setBackground('#f3f3f3');
  cell.setBorder(true,true,true,true,true,true);
  
  // Games, Win %, and KDA columns
  cell = sheet.getRange(dataRange);
  cell.setHorizontalAlignment('right');
  cell.setBackground('#f3f3f3');
  cell.setBorder(true,true,true,true,true,true);
  
  // Sub Data
  cell = sheet.getRange(dataSubRange);
  cell.setHorizontalAlignment('right');
  cell.setBackground('#f3f3f3');
  cell.setBorder(true,true,true,true,true,true);
  
  // KDA column
  cell = sheet.getRange(kdaRange).setNumberFormat('0.00');
  cell = sheet.getRange(kdaSubRange).setNumberFormat('0.00');
  
  // Gap Rows
  cell = sheet.getRange('J9:N9');
  cell.setBackground(null);
  cell.setBorder(true,false,true,false,false,false);
  cell = sheet.getRange('J15:N15');
  cell.setBackground(null);
  cell.setBorder(true,false,true,false,false,false);
  cell = sheet.getRange('J21:N21');
  cell.setBackground(null);
  cell.setBorder(true,false,true,false,false,false);
  cell = sheet.getRange('J27:N27');
  cell.setBackground(null);
  cell.setBorder(true,false,true,false,false,false);  
  
  cell = sheet.getRange('P9:T9');
  cell.setBackground(null);
  cell.setBorder(true,false,true,false,false,false);

  cell = sheet.getRange('I4:I28');
  cell.clearContent();
  
  cell = sheet.getRange('O4:O28');
  cell.clearContent();
  
  // Role Labels
  cell = sheet.getRange('I4:I8');
  cell.mergeVertically();
  cell.setValue('Top');
  cell.setFontSize(11);
  cell.setVerticalAlignment('middle');
  cell.setBorder(true,true,true,true,true,true);
  cell.setFontWeight('bold');
  cell.setHorizontalAlignment('center');
  
  cell = sheet.getRange('I10:I14');
  cell.mergeVertically();
  cell.setValue('Jungle');
  cell.setFontSize(11);
  cell.setVerticalAlignment('middle');
  cell.setBorder(true,true,true,true,true,true);
  cell.setFontWeight('bold');
  cell.setHorizontalAlignment('center');
  
  cell = sheet.getRange('I16:I20');
  cell.mergeVertically();
  cell.setValue('Mid');
  cell.setFontSize(11);
  cell.setVerticalAlignment('middle');
  cell.setBorder(true,true,true,true,true,true);
  cell.setFontWeight('bold');
  cell.setHorizontalAlignment('center');
  
  cell = sheet.getRange('I22:I26');
  cell.mergeVertically();
  cell.setValue('ADC');
  cell.setFontSize(11);
  cell.setVerticalAlignment('middle');
  cell.setBorder(true,true,true,true,true,true);
  cell.setFontWeight('bold');
  cell.setHorizontalAlignment('center');
  
  cell = sheet.getRange('I28:I32');
  cell.mergeVertically();
  cell.setValue('Support');
  cell.setFontSize(11);
  cell.setVerticalAlignment('middle');
  cell.setBorder(true,true,true,true,true,true);
  cell.setFontWeight('bold');
  cell.setHorizontalAlignment('center');
  
  sheet.autoResizeColumn(10);
  sheet.autoResizeColumn(11);
  sheet.autoResizeColumn(16);
  sheet.autoResizeColumn(17);
  
  sheet.setColumnWidth(12,55);
  sheet.setColumnWidth(13,55);
  sheet.setColumnWidth(14,50);
  sheet.setColumnWidth(18,55);
  sheet.setColumnWidth(19,55);
  sheet.setColumnWidth(20,50);
}

function setUp() {
  if(s.getSheetByName('Scouter')){
    var newSheetName;
    
    sheet = s.getSheetByName('Scouter');
    
    newSheetName = sheet.getRange('I7').getValue();
    
    summoners = sheet.getRange('I8:I14').getValues();
    
    if(s.getSheetByName(newSheetName)) return;
    
    s.insertSheet(newSheetName);

    return true;
  }
  else {
    var sheet, cell;
    s.insertSheet('Scouter',0);
    s.insertSheet('data');
    
    sheet = s.getSheetByName('Scouter');
    
    cell = sheet.getRange('I3');
    cell.setValue('League Scouter');
    cell.setFontSize(14);
    cell.setFontWeight('bold');
    cell.setHorizontalAlignment('center');
    cell.setBackground('#c9daf8');
    
    cell = sheet.getRange('H3:J3');
    cell.mergeAcross();
    cell.setBorder(true,true,true,true,true,true);
    
    cell = sheet.getRange('H7:H12');
    cell.setValues([['Sheet Name'],['Top'],['Jungle'],['Mid'],['ADC'],['Support']]);
    cell.setHorizontalAlignment('center');
    cell.setFontSize(11);
    cell.setBorder(true,true,true,true,true,true);
    cell.setBackgrounds([['#d9d2e9'],['#f4cccc'],['#c9daf8'],['#d9ead3'],['#fff2cc'],['#fce5cd']]);
    
    cell = sheet.getRange('I7:J12');
    cell.setHorizontalAlignment('center');
    cell.setBorder(true,true,true,true,true,true);
    cell.mergeAcross();
    
    sheet.autoResizeColumn(8);
    
    cell = sheet.getRange('I5');
    cell.setValue('Run the script after filling out the information below.');
    cell.setFontSize(11);
    cell.setFontWeight('bold');
    cell.setHorizontalAlignment('center');
    
    cell = sheet.getRange('H3:J12');
    cell.setFontFamily('Roboto');
    
    return false;
  }
}

function printStatsToSheet(accountId, topChamps, role, profile, accountInfo) {
  var range;
  var championName = [];
  var rankString = profile['name'] + ' - ' + profile['tier'][0] + profile['division'] + ' ' + profile['lp'] + 'LP';
  
  for(var i = 0; i < 5; i++) {
    var topId = topChamps[i];
    accountInfo[topId]['kda'] = (roundAtTwoPlaces((accountInfo[topId]['kills'] + accountInfo[topId]['assists']) / accountInfo[topId]['deaths']));
    
    accountInfo[topId]['wr'] = Math.round(roundAtTwoPlaces((accountInfo[topId]['wins'] / accountInfo[topId]['totalGames']) * 100));
    championName[i] = getChampionName(topId);
  }
  
  if(role == 'top') range = topRange;
  else if(role == 'jungle') range = jungleRange;
  else if(role == 'mid') range = midRange;
  else if(role == 'adc') range = adcRange;
  else if(role == 'support') range = supportRange;
  else if(role == 'subOne') range = subOneRange;
  else if(role == 'subTwo') range = subTwoRange;
  
  saveAccountInfo(accountId, accountInfo);
  
  sheet = s.getSheetByName(sheetName);
  
  sheet.getRange(range).setValues([[rankString, championName[0], accountInfo[topChamps[0]]['totalGames'], accountInfo[topChamps[0]]['wr'] + '%', accountInfo[topChamps[0]]['kda']],
                                   [Math.round((roundAtTwoPlaces(accountInfo['totalWins'] / accountInfo['totalGames'] * 100))) + '% WR - ' + accountInfo['totalGames'] + ' games', championName[1], accountInfo[topChamps[1]]['totalGames'], accountInfo[topChamps[1]]['wr'] + '%', accountInfo[topChamps[1]]['kda']],
                                   ['', championName[2], accountInfo[topChamps[2]]['totalGames'], accountInfo[topChamps[2]]['wr'] + '%', accountInfo[topChamps[2]]['kda']],
                                   ['', championName[3], accountInfo[topChamps[3]]['totalGames'], accountInfo[topChamps[3]]['wr'] + '%', accountInfo[topChamps[3]]['kda']],
                                   ['', championName[4], accountInfo[topChamps[4]]['totalGames'], accountInfo[topChamps[4]]['wr'] + '%', accountInfo[topChamps[4]]['kda']]
                                  ]);
}

function analyzeMatches(matchIds, accountId, profile, accountInfo) {
  var i = 0;
  var endIndex = matchIds.length;
  var cleanSlate = false;
  
  //If we don't have any stats on the account yet, CLEAN SLATE
  if(!accountExists(accountId)){
    Logger.log('Clean slate');
    initializeVars(1, accountInfo);
    accountInfo['newestAnalyzedMatch'] = accountInfo['oldestAnalyzedMatch'] = accountInfo['lastAnalyzedMatch'] = matchIds[0];
    accountInfo['terminateMatch'] = matchIds[matchIds.length - 1];
    cleanSlate = true;
  }
  //New matches to analyze
  else if(matchIds[0] > accountInfo['newestAnalyzedMatch']){
    Logger.log('Found new matches to analyze.');
    accountInfo['newestAnalyzedMatch'] = accountInfo['lastAnalyzedMatch'] = matchIds[0];
  }
  //If there's a gap in our matches (likely caused by timeout/interrupt)
  else if(accountInfo['lastAnalyzedMatch'] > accountInfo['terminateMatch']){
    Logger.log('Found a gap in our match data. l= ' + accountInfo['lastAnalyzedMatch'] + ' t= ' + accountInfo['terminateMatch']);
    for(var j = 0; j < endIndex; j++) {
      if(matchIds[j] == accountInfo['lastAnalyzedMatch']) i = j + 1;
    }
  }
  else if(accountInfo['newestAnalyzedMatch'] == matchIds[0]){
    Logger.log('No new matches to analyze.');
  }
  
  for(i; i < endIndex; i++) {
    if(matchIds[i] == accountInfo['terminateMatch'] && cleanSlate == false){
      accountInfo['terminateMatch'] = accountInfo['newestAnalyzedMatch'];
      return;
    }
    
    var matchStats = getMatchStats(matchIds[i], accountId);
    var championId = matchStats['championId'];
    
    initializeVars(championId, accountInfo);
    
    if(matchStats['outcome'] == true) {
      accountInfo['totalWins'] += 1;
      accountInfo[championId]['wins'] += 1;
    }
    else if(matchStats['outcome'] == false) {
      accountInfo['totalLosses'] += 1;
      accountInfo[championId]['losses'] += 1;
    }
    
    accountInfo[championId]['totalGames'] += 1;
    accountInfo['totalGames'] += 1;
    
    accountInfo[championId]['kills'] += matchStats['kills'];
    accountInfo[championId]['deaths'] += matchStats['deaths'];
    accountInfo[championId]['assists'] += matchStats['assists'];
    accountInfo[championId]['championId'] = championId;
    
    Logger.log('Match analyzed: ' + matchIds[i]);
    
    if(accountInfo['oldestAnalyzedMatch'] > matchIds[i]) accountInfo['oldestAnalyzedMatch'] = matchIds[i];
    
    accountInfo['lastAnalyzedMatch'] = matchIds[i];
    
    if((new Date().getTime() - startTime) >= 240000){
      saveAccountInfo(accountId, accountInfo);
      formatOutput();
      Logger.log('Execution time approaching limits, saving progress and terminating...');
      return 'Time\'s Up';
    }
  }
  accountInfo['terminateMatch'] = accountInfo['newestAnalyzedMatch'];
  Logger.log('Total games analyzed for account ' + accountId + ' : ' + accountInfo['totalGames']);
}

function getMatchStats(matchId, accountId) {
  var data;
  var matchStats = {};
  
  url = 'https://na1.api.riotgames.com/lol/match/v3/matches/' + matchId + '?forAccountId=' + accountId + '&api_key=' + apiKey;
  data = getDataFromUrl(url);
  
  for(var i = 0; i < data['participantIdentities'].length; i++) {
    if(data['participantIdentities'][i]['player']['accountId'] == accountId || data['participantIdentities'][i]['player']['currentAccountId'] == accountId) {
      //Logger.log('Found account in match data: ' + accountId);
      var partId = data['participantIdentities'][i]['participantId'];
      
      matchStats['kills'] = data['participants'][partId - 1]['stats']['kills'];
      matchStats['deaths'] = data['participants'][partId - 1]['stats']['deaths'];
      matchStats['assists'] = data['participants'][partId - 1]['stats']['assists'];
      matchStats['championId'] = data['participants'][partId - 1]['championId'];
      matchStats['outcome'] = data['participants'][partId - 1]['stats']['win'];
      
      return matchStats;
    }
  }
  Logger.log('Unable to find account #' + accountId + ' in match# ' + matchId);
}

function getTop5Champs(topChamps, accountInfo) {
  for(champion in accountInfo){
    if(typeof(accountInfo[champion]) == 'object') {
      if(accountInfo[champion]['totalGames'] > accountInfo[topChamps[0]]['totalGames']) {
        topChamps[4] = topChamps[3];
        topChamps[3] = topChamps[2];
        topChamps[2] = topChamps[1];
        topChamps[1] = topChamps[0];
        topChamps[0] = accountInfo[champion]['championId'];
      }
      else if(accountInfo[champion]['totalGames'] > accountInfo[topChamps[1]]['totalGames']) {
        topChamps[4] = topChamps[3];
        topChamps[3] = topChamps[2];
        topChamps[2] = topChamps[1];
        topChamps[1] = accountInfo[champion]['championId'];
      }
      else if(accountInfo[champion]['totalGames'] > accountInfo[topChamps[2]]['totalGames']) {
        topChamps[4] = topChamps[3];
        topChamps[3] = topChamps[2];
        topChamps[2] = accountInfo[champion]['championId'];
      }
      else if(accountInfo[champion]['totalGames'] > accountInfo[topChamps[3]]['totalGames']) {
        topChamps[4] = topChamps[3];
        topChamps[3] = accountInfo[champion]['championId'];
      }
      else if(accountInfo[champion]['totalGames'] > accountInfo[topChamps[4]]['totalGames']) {
        topChamps[4] = accountInfo[champion]['championId'];
      }
    }
  }
}

function getMatchIds(accountId) {
  var data;
  var matchIds = [];
  var beginIndex = 0;
  var endIndex = 0;
  var totalGames = 1;
  
  while(endIndex != totalGames) {
    url = 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/' + accountId + '?queue=420&beginIndex=' + beginIndex + '&season=9&api_key=' + apiKey;
    data = getDataFromUrl(url);
  
    for(var i = 0; i < data['matches'].length; i++) {
      if(data['matches'][i]['platformId'] != 'NA1') continue;
      matchIds.push(data['matches'][i]['gameId']);
    }
    beginIndex += 100;
    endIndex = data['endIndex'];
    totalGames = data['totalGames'];
  }
  
  return matchIds;
}

function getRank(summonerName, accountInfo){
  var data, summonerId;
  var j = 0;
  var unranked = false;
  var profile = {};
  
  if(accountInfo['summonerId']) summonerId = accountInfo['summonerId'];
  else {
    url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + summonerName + '?api_key=' + apiKey;
    data = getDataFromUrl(url);
    summonerId = data['id'];
    accountInfo['summonerId'] = summonerId;
  }
   
  url = 'https://na1.api.riotgames.com/lol/league/v3/leagues/by-summoner/' + summonerId + '?api_key=' + apiKey;
  data = getDataFromUrl(url);
  
  if(data[0]['queue'] == 'RANKED_FLEX_SR') {
    profile['tier'] = 'Unranked';
    profile['name'] = summonerName;
    unranked = true;
  }
  
  for(j = 0; j < data.length; j++){
    if(data[j]['queue'] == 'RANKED_SOLO_5x5'){
      profile['tier'] = data[j]['tier'];
      profile['name'] = summonerName;
      break;
    }
  }
  
  if(unranked == false) {
    for(var i = 0; i < data[j]['entries'].length; i++){
      if(data[j]['entries'][i]['playerOrTeamId'] == summonerId){
        profile['division'] = romanToDecimal(data[j]['entries'][i]['rank']);
        profile['lp'] = data[j]['entries'][i]['leaguePoints'];
      }
    }
  }
  Logger.log('Rank retrieved.');
  return profile;
}

function getAccountId(summonerName, accountInfo){
  var data;
  
  url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + summonerName + '?api_key=' + apiKey;
  data = getDataFromUrl(url);
  
  return data['accountId'];
}

function initializeVars(championId, accountInfo){
  if(typeof(accountInfo['totalGames']) === 'undefined') accountInfo['totalGames'] = 0;
  if(typeof(accountInfo['totalWins']) === 'undefined') accountInfo['totalWins'] = 0;
  if(typeof(accountInfo['totalLosses']) === 'undefined') accountInfo['totalLosses'] = 0;
  if(typeof(accountInfo['oldestAnalyzedMatch']) === 'undefined') accountInfo['oldestAnalyzedMatch'] = 0;
  if(typeof(accountInfo['newestAnalyzedMatch']) === 'undefined') accountInfo['newestAnalyzedMatch'] = 0;
  if(typeof(accountInfo['lastAnalyzedMatch']) === 'undefined') accountInfo['lastAnalyzedMatch'] = 0;
  if(typeof(accountInfo['terminateMatch']) === 'undefined') accountInfo['terminateMatch'] = 0;
  
  if(typeof(accountInfo[-1]) === 'undefined') accountInfo[-1] = {};
  if(typeof(accountInfo[-1]['totalGames']) === 'undefined') accountInfo[-1]['totalGames'] = 0;
  
  if(typeof(accountInfo[championId]) === 'undefined') accountInfo[championId] = {};
  if(typeof(accountInfo[championId]['kills']) === 'undefined') accountInfo[championId]['kills'] = 0;
  if(typeof(accountInfo[championId]['deaths']) === 'undefined') accountInfo[championId]['deaths'] = 0;
  if(typeof(accountInfo[championId]['assists']) === 'undefined') accountInfo[championId]['assists'] = 0;
  if(typeof(accountInfo[championId]['kda']) === 'undefined') accountInfo[championId]['kda'] = 0.0;
  if(typeof(accountInfo[championId]['wins']) === 'undefined') accountInfo[championId]['wins'] = 0;
  if(typeof(accountInfo[championId]['losses']) === 'undefined') accountInfo[championId]['losses'] = 0;
  if(typeof(accountInfo[championId]['totalGames']) === 'undefined') accountInfo[championId]['totalGames'] = 0;
  if(typeof(accountInfo[championId]['championId']) === 'undefined') accountInfo[championId]['championId'] = 0;
}

function getDataFromUrl(url){
  //Logger.log('Begin fetching...');
  var response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
  //Logger.log('Fetching complete.');
  var statusCode = response.getResponseCode();
  
  if(statusCode == 200) {
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data;
  }
  else if(statusCode == 429){
    Logger.log('429: Rate limit exceeded.');
    Utilities.sleep(10000);
    return getDataFromUrl(url);
  }
  else if(typeof(statusCode) == 'number'){
    Logger.log(statusCode + ': sleeping...');
    Utilities.sleep(statusCode);
    return getDataFromUrl(url);
  }
}

function accountExists(accountId) {
  var accountRange = getAccountRange();
  for(var i = 0; i < accountRange.length; i++) {
    if(accountRange[i][0] == accountId) return true;
  }
  Logger.log('Account not found: ' + accountId);
  return false;
}

function loadAccountInfo(accountId) {
  var accountRange = getAccountRange();
  for(var i = 0; i < accountRange.length; i++) {
    if(accountRange[i][0] == accountId) {
      return JSON.parse(accountRange[i][1]);
    }
  }
}

function saveAccountInfo(accountId, accountInfo) {
  var accountRange = getAccountRange();
  
  if(!accountExists(accountId)){
    var lastRow = dataSheet.getLastRow();
    
    dataSheet.getRange(lastRow + 2,1,1,2).setValues([[accountId, JSON.stringify(accountInfo)]]);
    Logger.log('New account saved in sheet: ' + accountId);
    return;
  }
  
  for(var i = 0; i < accountRange.length; i++) {
    if(accountRange[i][0] == accountId) {
      dataSheet.getRange(i + 1, 2).setValue(JSON.stringify(accountInfo));
      return;                                          
    }
  }
}

function getAccountRange() {
  var lastRow = dataSheet.getLastRow();
  if(lastRow == 0) lastRow += 1;
  
  return dataSheet.getRange(1,1,lastRow,2).getValues();
}

function getChampionName(id) {
  return champions[id];
}

function deleteTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for(var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}

function getlastRow(column) {
  var lastRow = dataSheet.getMaxRows();
  var values = dataSheet.getRange(column + "1:" + column + lastRow).getValues();
  
  for (; values[lastRow - 1] == "" && lastRow > 0; lastRow--) {}
  return lastRow;
}

function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function roundAtTwoPlaces(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function romanToDecimal(num) {
 if(num == 'I') num = '1';
 else if(num == 'II') num = '2';
 else if(num == 'III') num = '3';
 else if(num == 'IV') num = '4';
 else if(num == 'V') num = '5';
  
 return num;
}
