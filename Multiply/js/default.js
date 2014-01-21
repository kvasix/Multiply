﻿// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));                     

            for (var num = 5; num <= 10; num+=5) {
                var option = document.createElement("option");
                option.innerText = num + "'s Table"
                id('selectkids').appendChild(option);
            }

            for (var num = 1; num <= 12; num++) {
                var option = document.createElement("option");
                option.innerText = num + "'s Table"                
                option.disabled = true;
                option.id = "L" + num;
                id('selectpage').appendChild(option);
            }
            id('L1').removeAttribute("disabled");

            for (var num = 13; num <= 22; num++) {
                var option = document.createElement("option");
                option.innerText = num + "'s Table"
                option.disabled = true;
                option.id = "L" + num;
                id('selectadvanced').appendChild(option);
            }
            id('advflybtn').disabled = true;
            updatelevel();//Small bug, when the app is started the updation happens to the last value

            if (localSettings.values["usrName"]) {
                id('usrName').value = localSettings.values["usrName"];
            } else {
                localSettings.values["usrName"] = id('usrName').value;
            }

            if (localSettings.values["volume"]) {
                id('volume').value = localSettings.values["volume"] * 100;
            }
            else {
                id('volume').value = 100;
                localSettings.values["volume"] = 1.0;
            }

            if (!localSettings.values["level"]) {
                localSettings.values["level"] = 1;
            }

            id('home').addEventListener("click", homeBoard, false);
            id('surprise').addEventListener("click", surpriseme, false);
            id('graph').addEventListener("click", renderGraph, false);
            id('highscores').addEventListener("click", showScores, false);
            id('volume').addEventListener("change", changeVolume, false);
            id('usrName').addEventListener("change", changeusrName, false);

            id('selectpage').addEventListener("click", changetable, false);
            id('selectadvanced').addEventListener("click", changetable_adv, false);
            id('selectkids').addEventListener("click", changetable_kids, false);

            id('pageflybtn').addEventListener("click", updatelevel, false);
            id('advflybtn').addEventListener("click", updatelevel, false);
            //localSettings.values.remove("highscores");
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();

    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;
    function id(elementId) {
        return document.getElementById(elementId);
    }

    function homeBoard(eventInfo) {
        eventInfo.preventDefault();
        WinJS.Navigation.navigate("/pages/home/home.html");
    }   

    function surpriseme(eventInfo) {
        eventInfo.preventDefault();
        WinJS.Navigation.navigate("/pages/surprise/surprise.html");
    }

    function renderGraph(eventInfo) {
        eventInfo.preventDefault();
        WinJS.Navigation.navigate("/pages/graph/graph.html");
    }

    function showScores(eventInfo) {
        eventInfo.preventDefault();
        WinJS.Navigation.navigate("/pages/highscores/highscore.html");
    }

    function changeVolume(eventInfo) {
        localSettings.values["volume"] = id('volume').value / 100;//eventInfo.srcElement.nodeValue;
    }

    function changeusrName(eventInfo) {
        localSettings.values["usrName"] = id('usrName').value;//eventInfo.srcElement.nodeValue;
    }

    var previousSelected = -1;
    function changetable(eventInfo) {
        if (previousSelected != id('selectpage').options.selectedIndex) {
            WinJS.Navigation.navigate("/pages/normal/normal.html", id('selectpage').options.selectedIndex + 1);
            previousSelected = id('selectpage').options.selectedIndex
        }
    }

    function changetable_adv(eventInfo) {
        if (previousSelected != id('selectadvanced').options.selectedIndex) {
            WinJS.Navigation.navigate("/pages/advanced/advanced.html", id('selectadvanced').options.selectedIndex + 13);
            previousSelected = id('selectadvanced').options.selectedIndex
        }
    }

    var previousSelected_kids = -1;
    function changetable_kids(eventInfo) {
        if (previousSelected_kids != id('selectkids').options.selectedIndex) {
            WinJS.Navigation.navigate("/pages/kids/kids.html", (id('selectkids').options.selectedIndex + 1) * 5);
            previousSelected_kids = id('selectkids').options.selectedIndex;
        }
    }

    function updatelevel(eventInfo) {
        var level = parseInt(localSettings.values["level"]);
        for (var num = 1; num < level; num++) {
            var option = id('L' + num);
            option.removeAttribute("disabled");
        }
        if (level >= 13) {
            id('advflybtn').removeAttribute('disabled');
        }
        if (level <= 22) {
            id('L' + num).removeAttribute("disabled");
        }
    }
})();
