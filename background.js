chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set(
        {
            windowLocation: 'top-right',
            width: 500,
            height: 650
        });
});

chrome.browserAction.onClicked.addListener(tab => {

    var locationPromise = chrome.storage.sync.get('windowLocation', function(result) {
        // Default to bottom-right
        return result.windowLocation || 'bottom-right';
    });

    var widthPromise = chrome.storage.sync.get('width', function(result) {
        // Default to 450 pixels
        return result.width || 450;
    });

    var heightPromise = chrome.storage.sync.get('height', function(result) {
        // Default to 600 pixels
        return result.height || 600;
    });

    var displayInfoPromise = chrome.system.display.getInfo(function(displays) {
        return displays[0].bounds;
    });

    Promise.all([locationPromise, widthPromise, heightPromise, displayInfoPromise]).then(function(values) {
        var windowLocation = values[0];
        var windowWidth = values[1];
        var windowHeight = values[2];
        var windowBounds = values[3];

        // Default to 50 pixels from the top and left
        var offset = 50;
        var windowLeft = offset;
        var windowTop = offset;

        switch(windowLocation)
        {
            case 'bottom-right':
                windowLeft = windowBounds.width - windowWidth - offset;
                windowTop = windowBounds.height - windowHeight - offset;
                break;
            case 'bottom-left':
                windowLeft = offset;
                windowTop = windowBounds.height - windowHeight - offset;
                break;
            case 'top-right':
                windowLeft = windowBounds.width - windowWidth - offset;
                windowTop = offset;
                break;
        }

        chrome.windows.create({
            url: chrome.runtime.getURL("picture-in-picture.html"),
            type: "popup",
            focused: true,
            width: windowWidth,
            height: windowHeight,
            left: windowLeft,
            top: windowTop
        });
    });
});