var appData = Windows.Storage.ApplicationData.current;
var localSettings = appData.localSettings;

function score_post(score_post_string) {
    WinJS.xhr({
        type: "post",
        url: "http://www.kumonivanhoe.com.au/multiply/scoreupdate.php",
        responseType: 'json',
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        data: score_post_string
    }).done(   //
        function complete(result) {
            if (result.status === 200) {
                console.log(result.responseText);
                var jsonContent = JSON.parse(result.responseText);//eval('(' + result.responseText + ')');//result.responseJSON; //
                console.log(jsonContent);
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
}
function upgradeLevel(this_level) {
    var new_level = this_level + 1;
    var return_str;
    if (new_level > localSettings.values["level"]) {
        var upgradelevel_post_string = "sid=" + localSettings.values["sid"] + "&level=" + new_level;
        WinJS.xhr({
            type: "post",
            url: "http://www.kumonivanhoe.com.au/multiply/upgradelevel.php",
            responseType: 'json',
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            data: upgradelevel_post_string
        }).done(   //
          function complete(result) {
              if (result.status === 200) {
                  //console.log(result.responseText);
                  var jsonContent = JSON.parse(result.responseText);//eval('(' + result.responseText + ')');//result.responseJSON; //
                  //console.log(jsonContent);

                  if (jsonContent['upgradesuccess']) {
                      localSettings.values["level"] = jsonContent['level'];//23;//get from server
                      return_str = "You've been upgraded to the next level!!!";
                  } else {
                      return_str = "Upgrade Failed! Database Error.";
                  }
              }
          },
          function error(result) {
              return_str = "Upgrade Failed! Network Error.";
          },
          function progress(progress) {
          }
        );
    } else {
        return_str = "Aren't you playing this level again?";
    }
    return return_str;
}