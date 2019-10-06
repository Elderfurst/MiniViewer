(async () => {
    const videos = Array.from(document.querySelectorAll('video'))
    // Don't try to PiP any videos that aren't ready and have PiP disabled
    .filter(video => video.readyState != 0)
    .filter(video => video.disablePictureInPicture == false)
    .sort((v1, v2) => {
        // Prioritize the largest video on the page
        const v1Rect = v1.getClientRects()[0];
        const v2Rect = v2.getClientRects()[0];
        return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
    });

    // Weirdness with the video not actually having anything to play
    if (videos.length === 0) {
        return;
    }

    const video = videos[0];

    // Exit PiP if already in PiP
    if (video.hasAttribute('__pip__')) {
        await document.exitPictureInPicture();
    }
    else {
        await video.requestPictureInPicture();
        video.setAttribute('__pip__', true);
        video.addEventListener('leavepictureinpicture', () => {
            video.removeAttribute('__pip__');
        }, { once: true });
    }
})();