chrome.action.onClicked.addListener(async (tab) => {
    chrome.windows.create({
        'url': 'index.html',
        'type': 'popup',
        'width': 600,
        'height': 400,
        'left': 100,
        'top': 100
    }, function (window) {

    });
});