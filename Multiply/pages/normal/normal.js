﻿(function () {
    "use strict";

    var timeCtrl = null, fixed_num = -1;

    WinJS.UI.Pages.define("/pages/normal/normal.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            fixed_num = options.toString();

            for (var fnum = 0; fnum <= 10; fnum++) {
                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_num;

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = fnum;
                
                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                result.innerText = fnum * fixed_num;

                row.appendChild(fixed);
                row.appendChild(mult);
                row.appendChild(numCol);
                row.appendChild(equals);
                row.appendChild(result);
                
                id('readTable').appendChild(row);
            }

            for (var fnum = 0; fnum <= 10; fnum++) {
                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_num;

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = fnum;

                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                var resBox = document.createElement("input");                
                resBox.id = fnum * fixed_num;
                resBox.addEventListener("focusout", checkResult, false);
                resBox.size = 3;
                result.appendChild(resBox);

                row.appendChild(fixed);
                row.appendChild(mult);
                row.appendChild(numCol);
                row.appendChild(equals);
                row.appendChild(result);

                id('testTable').appendChild(row);
            }

            id('reset').addEventListener("click", resetTable, false);

            timeCtrl = setInterval(timer, 500);            

        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            clearInterval(timeCtrl);
        }
    });

    var mistakeCount = 0;
    function checkResult(eventInfo) {
        if (this.value) {
            if (this.id == this.value) {
                id("mistakeCount").innerHTML = mistakeCount;
            }
            else {
                mistakeCount++;
                id("mistakeCount").innerHTML = mistakeCount + ": Check that Again!";
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
        for (var fnum = 0; fnum <= 10; fnum++) {
            id(fnum * fixed_num).value = "";
        }
    }
})();
