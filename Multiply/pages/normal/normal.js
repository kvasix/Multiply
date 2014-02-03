(function () {
    "use strict";

    var TABLE_SIZE = 12, TABLE_START_NUM = 1, MISTAKE_THRESHOLD = 5;
    var audioTable;
    var timeCtrl = null, fixed_num = -1;
    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;
    var mistakeCount = 0, max_right;
    var isset, gameover;

    WinJS.UI.Pages.define("/pages/normal/normal.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            mistakeCount = 0;
            max_right = TABLE_SIZE;
            fixed_num = parseInt(options.toString());

            for (var var_num = TABLE_START_NUM; var_num < TABLE_START_NUM + TABLE_SIZE; var_num++) {
                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_num;

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = var_num;

                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                result.innerText = var_num * fixed_num;

                row.appendChild(numCol);
                row.appendChild(mult);
                row.appendChild(fixed);
                row.appendChild(equals);
                row.appendChild(result);

                id('readTable').appendChild(row);
            }

            isset = new Array();
            for (var var_num = TABLE_START_NUM; var_num < TABLE_START_NUM + TABLE_SIZE; var_num++) {
                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_num;

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = var_num;

                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                var resBox = document.createElement("input");
                resBox.id = var_num * fixed_num;
                resBox.type = "number";
                resBox.addEventListener("keydown", checkandmovefocus, false);
                resBox.addEventListener("focusout", checkResult, false);
                resBox.size = 3;
                isset[var_num - TABLE_START_NUM] = false;
                result.appendChild(resBox);

                row.appendChild(numCol);
                row.appendChild(mult);
                row.appendChild(fixed);
                row.appendChild(equals);
                row.appendChild(result);

                id('testTable').appendChild(row);
            }

            id('reset').addEventListener("click", resetTable, false);
            id('showTest').addEventListener("click", showTable, false);

            timeCtrl = setInterval(timer, 500);

            if (fixed_num < 10) {
                audioTable = new Array();
                audioTable[0] = new Audio("/sounds/0" + fixed_num + ".wma");
                audioTable[0].load();

                audioTable[1] = new Audio("/sounds/1" + fixed_num + ".wma");
                audioTable[1].load();

                audioTable[2] = new Audio("/sounds/2" + fixed_num + ".wma");
                audioTable[2].load();

                var select = document.createElement("select");
                select.id ="selecttableaudio";

                for (var i = 1; i <= 3; i++) {
                    var option = document.createElement("option");
                    option.innerHTML="Speed "+ i;
                    select.appendChild(option);
                }
                select.addEventListener("click", changeSpeed, false);
                id("audioselectSpan").appendChild(select);
                id("audioselectSpan").style.visibility = "visible";
            }

            gameover = false;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            clearInterval(timeCtrl);
            hours = 0, mins = 0, secs = 0;
            for (var i = 0; i < 3; i++)
                if (!audioTable[i].paused)
                    audioTable[i].pause();

            //max_right = TABLE_SIZE;
        }
    });

    var previousSelected = -1;
    function changeSpeed(eventInfo) {
        var index = id('selecttableaudio').options.selectedIndex;
        if (previousSelected != index &&
            audioTable[index].paused) {
            readTable(index);
            previousSelected = index;
        }
    }

    function readTable(speed) {
        for (var i = 0; i < 3; i++) {
            if (!audioTable[i].paused && i != speed)
                audioTable[i].pause();
        }
        if (audioTable[speed].paused) {
            audioTable[speed].load();
            audioTable[speed].volume = localSettings.values["volume"];
            audioTable[speed].play();
        }
    }
    
    function checkandmovefocus(eventInfo) {
        if (eventInfo.keyCode == 13) {
            var isRight = checkResult(eventInfo);
            console.log(isRight);
            if (isRight) {
                var nextBoxID = parseInt(eventInfo.currentTarget.id) + fixed_num;
                console.log(nextBoxID);
                if(id(nextBoxID))
                    id(nextBoxID).focus();
            }
        }
    }

    function checkResult(eventInfo) {
        console.log(max_right);
        var thisBox = eventInfo.currentTarget;
        if (thisBox.value && !gameover) {
            if (thisBox.id == thisBox.value) {
                id("mistakeCount").innerHTML = mistakeCount;
                document.getElementById(thisBox.id).setAttribute("style", "background-color:white");

                if (!isset[parseInt(thisBox.id) / fixed_num - TABLE_START_NUM]) {
                    --max_right;
                    isset[parseInt(thisBox.id) / fixed_num - TABLE_START_NUM] = true;
                }

                if (!max_right) {
                    clearInterval(timeCtrl);
                    //applaudAudio.volume = localSettings.values["volume"];
                    //applaudAudio.play();
                    
                    if (localSettings.values["highscores"]) {
                        localSettings.values["highscores"] += ',{ "user": "' + localSettings.values["usrName"] + '", "levelType": "Medium", "level": ' + localSettings.values["level"];
                        localSettings.values["highscores"] += ', "mistakes": ' + mistakeCount + ', "hours": ' + hours + ', "mins": ' + mins + ', "secs": ' + secs + ' }';
                    }
                    else {
                        localSettings.values["highscores"] = '{ "user":"' + localSettings.values["usrName"] + '", "levelType": "Medium", "level": ' + localSettings.values["level"];
                        localSettings.values["highscores"] += ', "mistakes": ' + mistakeCount + ', "hours": ' + hours + ', "mins": ' + mins + ', "secs": ' + secs + ' }';
                    }

                    var message = "Good Job, " + localSettings.values["usrName"] + "!!! You've completed this level in " +
                        (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs +
                         " with " + mistakeCount + " mistakes. ";
                    if (mistakeCount > MISTAKE_THRESHOLD) {
                        message += "Why don't you try it again?";
                    }
                    else {
                        message += "You've been upgraded to the next level!!!";
                        upgradeLevel();
                    }
                    var msgBox = new Windows.UI.Popups.MessageDialog(message);
                    msgBox.showAsync();
                    gameover = true;
                    id('reset').setAttribute("disabled", true);
                }
                return true;
            }
            else {
                mistakeCount++;
                id("mistakeCount").innerHTML = mistakeCount + ": Check that Again!";
                document.getElementById(thisBox.id).setAttribute("style", "background-color:red");
                return false;
            }
        }
    }

    function id(element) {
        return document.getElementById(element);
    }

    var hours = 0, mins = 0, secs = 0;
    var blink = true;
    var separator = ":";
    function timer() {
        blink ? (++secs, separator = " ", blink = false) : (separator = ":", blink = true);
        (secs == 60) ? (++mins, secs = 0) : true;
        (mins == 60) ? (++hours, mins = 0) : true;
        id('timeCounter').innerHTML = (hours < 10 ? "0" : "") + hours + separator + (mins < 10 ? "0" : "") + mins + separator + (secs < 10 ? "0" : "") + secs;
    }
     
    function resetTable() {
        for (var var_num = TABLE_START_NUM; var_num < TABLE_START_NUM + TABLE_SIZE; var_num++) {
            id(var_num * fixed_num).value = "";
            id(var_num * fixed_num).setAttribute("style", "background-color:white");
            isset[var_num - TABLE_START_NUM] = false;

            id(var_num * fixed_num).removeEventListener("keydown", checkandmovefocus, false);
            id(var_num * fixed_num).removeEventListener("focusout", checkResult, false);

            //id(var_num * fixed_num).addEventListener("keydown", checkandmovefocus, false);
            //id(var_num * fixed_num).addEventListener("focusout", checkResult, false);
        }
        max_right = TABLE_SIZE;
        hours = 0, mins = 0, secs = 0;
        gameover = false;
    }

    function showTable() {
        id('readTable').style.visibility = "hidden";
        id('showTest').style.visibility = "hidden";
        id('audioselectSpan').style.visibility = "hidden";
        id('testTable').style.visibility = "visible";
        id('mistakesBox').style.visibility = "visible";

        for (var i = 0; i < 3; i++)
            if (!audioTable[i].paused)
                audioTable[i].pause();
    }

    function upgradeLevel() {
        var new_level = fixed_num + 1;
        if (new_level > localSettings.values["level"])
            localSettings.values["level"] = new_level;
    }
})();
