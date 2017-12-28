# Current (master)
A script that lives in your Google Sheets Script Editor.
* Scouts actual Solo Queue statistics of players:
    * Top 5 champions played this season
    * Games played (total and per champion)
    * Win rate per champion
    * K/D/A per champion.
* Limitations/Issues:
    * Forced 6-minute execution time limit
    * Stores API_KEY in the script
    * Runs using RIOT API development key
    * Uses a 'data' sheet within your spreadsheet to act as an in-page database
        * This causes the most amount of slowness aside from api rate limiting.
    * Hardcoded url values for 'season'
    * Global variables
    * Cluttered code due to formatting of output and inexperience with JS

* Usage Instructions
    1. Copy & paste scouter.js into Tools > Script Editor of your Google Spreadsheet
    2. Replace 'YOUR_KEY_HERE' (line 9) to your Riot API Key
    3. Select function "main()" from drop-down menu and press Run
        * This will create a new sheet labeled 'Scouter'
    4. Fill out the information on the 'Scouter' sheet
        * ![scoutermain](https://raw.githubusercontent.com/ajhicks94/lolscouter/master/screenshots/scoutermain.png)
        * A new sheet will be generated with the statistics
        * ![scouterteam](https://raw.githubusercontent.com/ajhicks94/lolscouter/master/screenshots/scouterteam.png)
    5. You will have to run the script multiple times due to the 6-minute timeout, just completely wait for the sheet to update before doing so


# In Progress (development):
 Converting the script into a hosted webapp that allows the user all of the current functionality of the script, with **NONE** of the previous limitations/sloppiness:

|Problem | Solution|
|:---:|:---:|
|6-minute execution time limit | App will live in a heroku instance|
|Storing API_KEY in script | API_KEY will be secure in server|
|DevKey Rate Limiting | Apply for Prod Key|
|Makeshift DB | Redis/MongoDB/*other actual DB solution*|
|Hardcoded URLS | Retrieve current season via API endpoints|
|Global Vars | Restructured flow-of-data |
|Cluttered Code | Refactoring of code |

...and additional functionality for the user:
* Export stats to Google Sheets
* Register and save previous queries