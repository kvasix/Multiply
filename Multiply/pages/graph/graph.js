(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/graph/graph.html", {
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
                      var highscore_list = JSON.parse(result.responseText);

                      var row = 0;
                      var datetimes = new Array();
                      var timetakens = new Array();
                      var mistakedones = new Array();
                      while (highscore_list[row]) {
                          datetimes[row] = row;//highscore_list[row].date;
                          //level.innerText = highscore_list[row].level;
                          mistakedones[row] = parseInt(highscore_list[row].mistakecount);
                          timetakens[row] = parseInt(highscore_list[row].timetaken);
                          row++;
                      }

                      var ChartData = {
                          labels: datetimes,
                          datasets: [
                                  {
                                      fillColor: "rgba(220,220,220,0.5)",
                                      strokeColor: "rgba(220,220,220,1)",
                                      pointColor: "rgba(220,220,220,1)",
                                      pointStrokeColor: "#fff",
                                      data: timetakens
                                  }/*,
                                  {
                                      fillColor: "rgba(151,187,205,0.5)",
                                      strokeColor: "rgba(151,187,205,1)",
                                      pointColor: "rgba(151,187,205,1)",
                                      pointStrokeColor: "#fff",
                                      data: mistakedones
                                  }*/
                          ]

                      }

                      var chartoptions = {

                          //Boolean - If we show the scale above the chart data			
                          scaleOverlay: false,

                          //Boolean - If we want to override with a hard coded scale
                          scaleOverride: false,

                          //** Required if scaleOverride is true **
                          //Number - The number of steps in a hard coded scale
                          scaleSteps: 10,
                          //Number - The value jump in the hard coded scale
                          scaleStepWidth: 1,
                          //Number - The scale starting value
                          scaleStartValue: 0,

                          //String - Colour of the scale line	
                          scaleLineColor: "rgba(0,0,0,.1)",

                          //Number - Pixel width of the scale line	
                          scaleLineWidth: 1,

                          //Boolean - Whether to show labels on the scale	
                          scaleShowLabels: true,

                          //Interpolated JS string - can access value
                          scaleLabel: "<%=value%>",

                          //String - Scale label font declaration for the scale label
                          scaleFontFamily: "'Arial'",

                          //Number - Scale label font size in pixels	
                          scaleFontSize: 12,

                          //String - Scale label font weight style	
                          scaleFontStyle: "normal",

                          //String - Scale label font colour	
                          scaleFontColor: "#666",

                          ///Boolean - Whether grid lines are shown across the chart
                          scaleShowGridLines: true,

                          //String - Colour of the grid lines
                          scaleGridLineColor: "rgba(0,0,0,.05)",

                          //Number - Width of the grid lines
                          scaleGridLineWidth: 1,

                          //Boolean - If there is a stroke on each bar	
                          barShowStroke: true,

                          //Number - Pixel width of the bar stroke	
                          barStrokeWidth: 2,

                          //Number - Spacing between each of the X value sets
                          barValueSpacing: 5,

                          //Number - Spacing between data sets within X values
                          barDatasetSpacing: 1,

                          //Boolean - Whether to animate the chart
                          animation: true,

                          //Number - Number of animation steps
                          animationSteps: 60,

                          //String - Animation easing effect
                          animationEasing: "easeOutQuart",

                          //Function - Fires when the animation is complete
                          onAnimationComplete: null

                      }
                      var canvs = document.getElementById("canvas");
                      var myLine = new Chart(canvs.getContext("2d")).Line(ChartData, chartoptions);
                  }
              },
              function error(result) {
              },
              function progress(progress) {
              }
            );
        }
    })
})();
