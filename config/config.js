chrome.storage.sync.get(['windowLocation', 'width', 'height'], function(result) {
    document.getElementById('default-window-location').value = result.windowLocation;
    document.getElementById('default-window-width').value = result.width;
    document.getElementById('default-window-height').value = result.height;
});

document.getElementById('save-default-values').addEventListener("click", saveDefaultValues);

function saveDefaultValues() {
    var defaultLocation = document.getElementById('default-window-location').value;
    var defaultWidth = parseInt(document.getElementById('default-window-width').value);
    var defaultHeight = parseInt(document.getElementById('default-window-height').value);

    var attributes = 
    {
        windowLocation: defaultLocation,
        width: defaultWidth,
        height: defaultHeight
    };

    chrome.storage.sync.set(attributes, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 1500);
    });
}