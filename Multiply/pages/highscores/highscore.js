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
                /*var highscore_list = toString(highscore_dense).split(".");
                
                var row = 0;
                while (highscore_list[row]) {
                    var row_html = document.createElement("tr");
                    var one_entry = highscore_list[row].split(",");
                    var col = 0;
                    while (one_entry[col]) {
                        var col_html = document.createElement("td");
                        col_html.innerHTML = one_entry[col];
                        row_html.appendChild(col_html);
                        highscore_table.innerHTML += toString(one_entry[col]) + "-";
                        col++;
                    }
                    //highscore_table.appendChild(row_html);
                    row++;
                }*/
                highscore_table.innerHTML = highscore_dense;
            }
            else {
                highscores.innerHTML = "No games completed yet!!! Please complete atleast one game and then check this page.";
            }
        }
    });

    
    
})();
