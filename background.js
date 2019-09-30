chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({windowLocation: 'bottom-right'}, function() {
        console.log("The default window location is: bottom-right");
    });
});
