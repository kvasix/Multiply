(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            localSettings.values["level"] = 15;
            //Windows.Storage.ApplicationData.current.clearAsync();

            document.getElementById("greetings").innerHTML = "Hi " + localSettings.values["usrName"] + "! Welcome to Multiply.";
            document.getElementById("level").innerHTML = localSettings.values["level"];
        }
    });
})();
