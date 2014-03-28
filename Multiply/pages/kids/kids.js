(function () {
    "use strict";

    var TABLE_SIZE = 12, TABLE_START_NUM = 1, MISTAKE_THRESHOLD = 5;
    var audioTable;
    var timeCtrl = null, fixed_num = -1;
    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;
    var mistakeCount, max_right, mistakes;
    var isset, gameover;

    WinJS.UI.Pages.define("/pages/kids/kids.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
           
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

            mistakeCount = 0;
            max_right = TABLE_SIZE;
            mistakes = new Array();
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
                resBox.addEventListener("focusin", setFocus, false);                
                resBox.size = 3;
                resBox.maxLength = 3;
                result.appendChild(resBox);

                row.appendChild(numCol); 
                row.appendChild(mult);
                row.appendChild(fixed);
                row.appendChild(equals);
                row.appendChild(result);

                isset[var_num - TABLE_START_NUM] = false;
                mistakes[var_num - TABLE_START_NUM] = false;
                id('testTable').appendChild(row);
            }

            for (var in_num = 0; in_num < 10; in_num++) {
                id("input" + in_num).addEventListener("click", typeInput, false);
            }
            id('inputClear').addEventListener("click", function () { if (focus_id_num != -1) id(focus_id_num).value = ""; }, false);
            id('inputEnter').addEventListener("click", function () { if (focus_id_num != -1) checkandmovefocus(event) }, false);

            id('reset').addEventListener("click", resetTable, false);
            id('showTest').addEventListener("click", showTable, false);
            
            if (fixed_num < 10) {
                audioTable = new Array();
                for (var i = 0; i < 3; i++) {
                    audioTable[i] = new Audio("/sounds/" + i + "" + fixed_num + ".wma");
                    audioTable[i].load();

                    var button = document.createElement("button");
                    button.id = "Speed" + i;
                    button.addEventListener("click", function () { readTable(parseInt(this.id.replace("Speed", ""))) }, false);//readTable(i) doesn't work;
                    button.innerText = "Speed" + (i + 1);
                    id("audioselectSpan").appendChild(button);
                }
                id("audioselectSpan").style.visibility = "visible";
            }
            /*           
           audioTable[0].addEventListener("timeupdate", function () {
               var duration = document.getElementById('duration');
               var s = parseInt(audioTable[0].currentTime % 60);
               var m = parseInt((audioTable[0].currentTime / 60) % 60);
               duration.innerHTML = m + '.' + s + 'sec';
           }, false);
           */
            gameover = false;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            clearInterval(timeCtrl);
            hours = 0, mins = 0, secs = 0;
            if (audioTable) {
                for (var i = 0; i < 3; i++)
                    if (!audioTable[i].paused)
                        audioTable[i].pause();
            }

            max_right = TABLE_SIZE;
        }
    });
    
    function changeSpeed(eventInfo) {
        var index = id('selecttableaudio').options.selectedIndex;
        if (audioTable[index].paused) {
            readTable(index);
        }
    }

    function readTable(speed) {
        for (var i = 0; i < 3; i++) {
            if (!audioTable[i].paused && i != speed)
                audioTable[i].pause();
        }
        if (audioTable[speed].paused) {
            audioTable[speed].load();
            audioTable[speed].play();
        }
    }

    function typeInput(eventInfo) {
        if (focus_id_num != -1) {
            id(focus_id_num).value += this.id.replace("input", "");
        }
    }

    var mistakeCount = 0, max_right = TABLE_SIZE;
    function checkandmovefocus(eventInfo) {
        var isRight = checkResult(id(focus_id_num));
        //console.log(isRight);
        if (isRight) {
            var nextBoxID = parseInt(focus_id_num) + fixed_num;
            //console.log(nextBoxID);
            if (id(nextBoxID)) {
                focus_id_num = -1;
                id(nextBoxID).focus();
            }
        }        
    }

    var focus_id_num = -1;
    function setFocus(eventInfo) {
        eventInfo.preventDefault();
        
        if (focus_id_num != -1 && focus_id_num != eventInfo.currentTarget.id) {
            checkResult(id(focus_id_num));
        }
        focus_id_num = eventInfo.currentTarget.id;
    }
    
    function checkResult(thisBox) {        
        if (thisBox.value && !gameover) {
            if (thisBox.id == thisBox.value) {
                id("mistakeCount").innerHTML = mistakeCount;
                thisBox.setAttribute("style", "background-color:white");

                if (!isset[parseInt(thisBox.id) / fixed_num - TABLE_START_NUM]) {
                    --max_right;
                    isset[parseInt(thisBox.id) / fixed_num - TABLE_START_NUM] = true;
                }

                if (!max_right) {
                    clearInterval(timeCtrl);
                    //applaudAudio.volume = localSettings.values["volume"];
                    //applaudAudio.play();
                    
                    var message = "Good Job, " + localSettings.values["usrName"] + "!!! You've completed this level in " +
                        (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs +
                         " with " + mistakeCount + " mistakes. ";
                    var msgBox = new Windows.UI.Popups.MessageDialog(message);
                    msgBox.showAsync();
                    gameover = true;
                    id('reset').setAttribute("disabled", true);
                }
                return true;
            }
            else {
                mistakeCount++;
                mistakes[parseInt(thisBox.id) / fixed_num - TABLE_START_NUM] = true;
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
            id(var_num * fixed_num).value = "";
            id(var_num * fixed_num).setAttribute("style", "background-color:white");
            isset[var_num - TABLE_START_NUM] = false;
            mistakes[var_num - TABLE_START_NUM] = false;
        }
        id(fixed_num).focus();
        max_right = TABLE_SIZE;
        hours = 0, mins = 0, secs = 0;
        gameover = false;
    }

    function showTable() {
        id('readTable').style.visibility = "hidden";
        id('showTest').style.visibility = "hidden";
        id('audioselectSpan').style.visibility = "hidden";
        id('testTable').style.visibility = "visible";
        id('inputTable').style.visibility = "visible";
        id('mistakesBox').style.visibility = "visible";
        id('timeBox').style.visibility = "visible";
        id('reset').style.visibility = "visible";
        id(fixed_num).focus();
        timeCtrl = setInterval(timer, 1000);

        if(fixed_num < 10) 
            for (var i = 0; i < 3; i++)
                if (!audioTable[i].paused)
                    audioTable[i].pause();
    }
})();
