(function () {
    "use strict";

    var TABLE_SIZE = 12, TABLE_START_NUM = 1, MISTAKE_THRESHOLD = 5;
    var audioTable;
    var timeCtrl = null;
    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;
    var mistakeCount = 0, max_right, mistakes;
    var fixed_nums;
    var isset, gameover;

    WinJS.UI.Pages.define("/pages/surprise/surprise.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            
            fixed_nums = new Array();
            for (var var_num = TABLE_START_NUM; var_num < TABLE_START_NUM + TABLE_SIZE; var_num++) {
                // Couldn't find localSettings.values["level"] in fixed_nums
                fixed_nums[var_num - TABLE_START_NUM] = Math.floor(Math.random() * (parseInt(localSettings.values["level"]) - 1)) + 1;

                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_nums[var_num - TABLE_START_NUM];

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = var_num;

                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                result.innerText = var_num * fixed_nums[var_num - TABLE_START_NUM];

                row.appendChild(numCol);
                row.appendChild(mult);
                row.appendChild(fixed);
                row.appendChild(equals);
                row.appendChild(result);

                id('readTable').appendChild(row);
            }

            mistakeCount = 0;
            max_right = TABLE_SIZE;
            mistakes = new Array();
            isset = new Array();
            for (var var_num = TABLE_START_NUM; var_num < TABLE_START_NUM + TABLE_SIZE; var_num++) {
                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_nums[var_num - TABLE_START_NUM];

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = var_num;

                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                var resBox = document.createElement("input");
                resBox.id = var_num;// * fixed_nums[var_num - TABLE_START_NUM];
                resBox.type = "number";
                resBox.addEventListener("keydown", checkandmovefocus, false);
                resBox.addEventListener("focusout", checkResult, false);
                resBox.size = 3;
                resBox.setAttribute("boxid", var_num);
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

            gameover = false;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            clearInterval(timeCtrl);
            hours = 0, mins = 0, secs = 0;

            //max_right = TABLE_SIZE;
        }
    });

    function checkandmovefocus(eventInfo) {
        if (eventInfo.keyCode == 13) {
            var isRight = checkResult(eventInfo);
            //console.log(isRight);
            if (isRight) {
                var boxid = parseInt(eventInfo.currentTarget.getAttribute("boxid"));
                var nextBoxID = (boxid + 1) * fixed_nums[boxid - TABLE_START_NUM + 1];
                //console.log(nextBoxID);
                if(id(nextBoxID))
                    id(nextBoxID).focus();
            }
        }
    }

    function checkResult(eventInfo) {
        var thisBox = eventInfo.currentTarget;
        if (thisBox.value && !gameover) {
            //console.log(thisBox.id * fixed_nums[thisBox.id - TABLE_START_NUM]);
            if (thisBox.id * fixed_nums[thisBox.id - TABLE_START_NUM] == thisBox.value) {
                id("mistakeCount").innerHTML = mistakeCount;
                thisBox.setAttribute("style", "background-color:white");
/*
                var boxid;
                for (var i = TABLE_START_NUM; i < TABLE_START_NUM + TABLE_SIZE; i++) {
                    if (parseInt(thisBox.id) == i * fixed_nums[i - TABLE_START_NUM]) {
                        boxid = i;
                        break;
                    }
                }
                */

                var boxid = parseInt(eventInfo.currentTarget.getAttribute("boxid"));
                //console.log(boxid);
                if (boxid && !isset[thisBox.id - TABLE_START_NUM]) {
                    --max_right;
                    isset[thisBox.id - TABLE_START_NUM] = true;
                }

                if (!max_right) {
                    clearInterval(timeCtrl);
                    //applaudAudio.volume = localSettings.values["volume"];
                    //applaudAudio.play();

                    var message = "Good Job, " + localSettings.values["usrName"] + "!!! You've completed this level in " +
                        (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs +
                         " with " + mistakeCount + " mistakes. Why don't you try it again?";
                    var msgBox = new Windows.UI.Popups.MessageDialog(message);
                    msgBox.showAsync();

                    var score_post_string = "sid=" + localSettings.values["sid"] + "&level=" + 24;
                    score_post_string += "&mistakeCount=" + mistakeCount + "&mistakes=" + "" + "&timetaken=" + ((hours * 60 + mins) * 60 + secs);
                    score_post(score_post_string);

                    gameover = true;
                    id('reset').setAttribute("disabled", true);
                }
                return true;
            }
            else {
                mistakes[mistakeCount++] = thisBox.id +"*"+ fixed_nums[thisBox.id - TABLE_START_NUM];
                id("mistakeCount").innerHTML = mistakeCount + ": Check that Again!";
                thisBox.setAttribute("style", "background-color:red");
                return false;
            }
        }
    }

    function id(element) {
        return document.getElementById(element);
    }

    var hours = 0, mins = 0, secs = 0;
    function timer() {
        ++secs;
        (secs == 60) ? (++mins, secs = 0) : true;
        (mins == 60) ? (++hours, mins = 0) : true;
        id('timeCounter').innerHTML = (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    }

    function resetTable() {
        for (var var_num = TABLE_START_NUM; var_num < TABLE_START_NUM + TABLE_SIZE; var_num++) {
            //fixed_nums[var_num - TABLE_START_NUM] = Math.floor(Math.random() * (parseInt(localSettings.values["level"]) - 1)) + 1;

            id(var_num).value = "";
            id(var_num).setAttribute("style", "background-color:white");
            isset[var_num] = false;
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
        id('timeBox').style.visibility = "visible";
        id('reset').style.visibility = "visible";
        timeCtrl = setInterval(timer, 1000);
    }
})();
