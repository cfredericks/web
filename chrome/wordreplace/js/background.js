var enabled = true;
chrome.storage.sync.get('wordReplaceEnabled', function(result){
    if (result.wordReplaceEnabled === undefined) {
        // add config option to local storage
        chrome.storage.sync.set({'wordReplaceEnabled': enabled}, function(){});
    }
    else {
        // config is already set
        enabled = result.wordReplaceEnabled;
    }
    // Update icon status
    updateWordReplaceState();
});

function toggleWordReplaceState() {
    // Flip plugin status
    enabled = !enabled;
    // save the new value
    chrome.storage.sync.set({'wordReplaceEnabled': enabled}, function(){
        // update the icon state
        updateWordReplaceState();
        // reload the page
        chrome.tabs.reload();
    });
}

function updateWordReplaceState() {
    if (enabled) {
        chrome.browserAction.setIcon({path:'/img/icon_on.png'});
    }
    else {
        chrome.browserAction.setIcon({path:'/img/icon_off.png'});
    }
}

chrome.browserAction.onClicked.addListener(toggleWordReplaceState);

// Allow content script to access word replacements from local storage
chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
	{
		if (request.method == "word_replacements")
			sendResponse({status: localStorage["word_replacements"]});
		else
			sendResponse({});
	});