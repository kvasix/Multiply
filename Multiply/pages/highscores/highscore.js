(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/highscores/highscore.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            

            var highscore_table = document.getElementById("highscores");

            var appData = Windows.Storage.ApplicationData.current;
            var localSettings = appData.localSettings;
            
            if (localSettings.values["highscores"]) {
                var highscore_dense = localSettings.values["highscores"];
                var highscore_list = eval("(" + '[' + highscore_dense + ']' + ")");
                
                highscore_table.innerHTML = "<tr><th>UserName</th><th>Class</th><th>Level</th><th>Number of Mistakes</th><th>Timetaken in secs</th></tr>";
                var row = 0;
                while (highscore_list[row]) {
                    var row_html = document.createElement("tr");

                    //localSettings.values["highscores"] += '{ "user": ' + localSettings.values["usrName"] + ', "levelType": "Beginner", "level": ' + indexSelected;
                    //localSettings.values["highscores"] += ', "mistakes": ' + mistakeCount + ', "hours": ' + hours + ', "mins": ' + mins + ', "secs": ' + secs + ' }';

                    var usr = document.createElement("td");
                    usr.innerText = highscore_list[row].user;
                    row_html.appendChild(usr);

                    var levelType = document.createElement("td");
                    levelType.innerText = highscore_list[row].levelType;
                    row_html.appendChild(levelType);

                    var level = document.createElement("td");
                    level.innerText = highscore_list[row].level;
                    row_html.appendChild(level);

                    var mistakes = document.createElement("td");
                    mistakes.innerText = highscore_list[row].mistakes;
                    row_html.appendChild(mistakes);
                    
                    var timetaken = document.createElement("td");
                    timetaken.innerText = highscore_list[row].hours * 3600 + highscore_list[row].mins * 60 + highscore_list[row].secs;
                    row_html.appendChild(timetaken);

                    highscore_table.appendChild(row_html);
                    row++;
                }
                //highscore_table.innerHTML = highscore_list;
            }
            else {                
                highscore_table.innerHTML = "<th>No games completed yet!!! Please complete atleast one game and then check this page.</th>";
            }
        }
    });

    
    
})();
