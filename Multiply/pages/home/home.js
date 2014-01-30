(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            localSettings.values["level"] = 20;
            document.getElementById("level").innerHTML = localSettings.values["level"];
            //Windows.Storage.ApplicationData.current.clearAsync();
        }
    });
})();
