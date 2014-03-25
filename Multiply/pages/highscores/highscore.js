(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/highscores/highscore.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            var appData = Windows.Storage.ApplicationData.current;
            var localSettings = appData.localSettings;

            var score_post_string = "sid=" + localSettings.values["sid"];
            var parsedData;
            WinJS.xhr({
                type: "post",
                url: "http://kvasix.com/Multiply/scorecheck.php",
                responseType: 'json',
                headers: { "Content-type": "application/x-www-form-urlencoded" },
                data: score_post_string
            }).done(   //
              function complete(result) {
                  if (result.status === 200) {
                      /*
                      if (jsonContent['upgradesuccess']) {
                          localSettings.values["usrName"] = jsonContent['usrName'];//"Gautam";//get from server
                          localSettings.values["level"] = jsonContent['level'];//23;//get from server
                          id("greetings").innerHTML = "Hi " + localSettings.values["usrName"] + "! Welcome to Number Magic.";
                          id("userStatus").innerHTML = "You are in Level: " + localSettings.values["level"];
                          id("logindiv").style.display = "none";
                          id("signout").style.display = "block";
                      } else {
                          id("greetings").innerHTML = "Login Failed!";
                          id("userStatus").innerHTML = "Please enter the right username and password";
                      }
                      */

                      //console.log(result.responseText);
                      var highscore_list = JSON.parse(result.responseText);//eval('(' + result.responseText + ')');//result.responseJSON; //
                      //console.log(highscore_list);

                      var highscore_table = document.getElementById("scoretable");
                      highscore_table.innerHTML = "<tr><th>Date</th><th>Table</th><th>Individual Mistakes (times : Number of Mistakes)</th><th>Total Mistakes</th><th>Timetaken in secs</th></tr>";
                      var row = 0;                      
                      while (highscore_list[row]) {
                          var row_html = document.createElement("tr");

                          var date = document.createElement("td");
                          date.innerText = highscore_list[row].date;
                          row_html.appendChild(date);

                          var level = document.createElement("td");
                          level.innerText = highscore_list[row].level;
                          row_html.appendChild(level);

                          var mistakes = document.createElement("td");
                          var mistakeArray = JSON.parse(highscore_list[row].mistakes);
                          mistakes.innerText = "";
                          var miscount = 0;
                          for (var num = 1; num <= 12; num++) {
                              if (mistakeArray[num - 1]) {
                                  mistakes.innerText += num + " : " + mistakeArray[num - 1] + ", ";
                                  miscount += mistakeArray[num - 1];
                              }
                          }
                          //if (mistakeArray[12 - 1])
                          //  mistakes.innerText += 12 + " : " + mistakeArray[12 - 1];
                          row_html.appendChild(mistakes);

                          var mistakecount = document.createElement("td");
                          mistakecount.innerText = miscount;//highscore_list[row].mistakecount;
                          row_html.appendChild(mistakecount);

                          var timetaken = document.createElement("td");
                          timetaken.innerText = highscore_list[row].timetaken;//highscore_list[row].hours * 3600 + highscore_list[row].mins * 60 + highscore_list[row].secs;
                          row_html.appendChild(timetaken);

                          highscore_table.appendChild(row_html);
                          row++;
                      }
                  }
              },
              function error(result) {
                  /*
                  id("greetings").innerHTML = "Connection Error!";
                  id("userStatus").innerHTML = "Error connecting to Database! Please check your network.";
                  */
              },
              function progress(progress) {
              }
            );
            /*
            localSettings.values["highscores"] = parsedData;
            console.log(parsedData);
            var highscore_table = document.getElementById("highscores");
            
            if (localSettings.values["highscores"]) {
                var highscore_dense = localSettings.values["highscores"];
                var highscore_list = JSON.parse(highscore_dense);
                
                highscore_table.innerHTML = "<tr><th>Date</th><th>Level</th><th>Number of Mistakes</th><th>Timetaken in secs</th></tr>";
                var row = 0;
                while (highscore_list[row]) {
                    var row_html = document.createElement("tr");

                    var date = document.createElement("td");
                    date.innerText = highscore_list[row].date;
                    row_html.appendChild(date);

                    var level = document.createElement("td");
                    level.innerText = highscore_list[row].level;
                    row_html.appendChild(level);

                    var mistakes = document.createElement("td");
                    mistakes.innerText = highscore_list[row].mistakecount;
                    row_html.appendChild(mistakes);
                    
                    var timetaken = document.createElement("td");
                    timetaken.innerText = highscore_list[row].timetaken;//highscore_list[row].hours * 3600 + highscore_list[row].mins * 60 + highscore_list[row].secs;
                    row_html.appendChild(timetaken);

                    highscore_table.appendChild(row_html);
                    row++;
                }
            }
            else {                
                highscore_table.innerHTML = "<th>No games completed yet!!! Please complete atleast one game and then check this page.</th>";
            }
            */
        }
    });



})();
