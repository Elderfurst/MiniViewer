chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set(
        {
            windowLocation: 'bottom-right',
            width: 550,
            height: 400
        });
});

chrome.browserAction.onClicked.addListener(tab => {
    // Build all async calls as promises to resolve them together and save callback hell
    var locationPromise = new Promise(function(resolve) {
        chrome.storage.sync.get('windowLocation', function(result) {
            // Default to bottom-right
            resolve(result.windowLocation || 'bottom-right');
        });
    });

    var widthPromise = new Promise(function(resolve) {
        chrome.storage.sync.get('width', function(result) {
            // Default to 450 pixels
            resolve(result.width || 450);
        });
    });

    var heightPromise = new Promise(function(resolve) {
        chrome.storage.sync.get('height', function(result) {
            // Default to 600 pixels
            resolve(result.height || 600);
        });
    });

    var displayInfoPromise = new Promise(function(resolve) {
        chrome.system.display.getInfo(function(displays) {
            resolve(displays[0].bounds);
        });
    });

    Promise.all([locationPromise, widthPromise, heightPromise, displayInfoPromise]).then(function(values) {
        var windowLocation = values[0];
        var windowWidth = values[1];
        var windowHeight = values[2];
        var windowBounds = values[3];

        // Offset by 50 from any given edge by default
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