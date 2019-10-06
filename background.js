if (!document.pictureInPictureEnabled) {
    chrome.browserAction.setTitle({ title: 'Picture-in-Picture is not supported' });
} 
else {
    chrome.browserAction.onClicked.addListener(() => {
        chrome.tabs.executeScript({ file: 'picture-in-picture.js', allFrames: true });
    });
}