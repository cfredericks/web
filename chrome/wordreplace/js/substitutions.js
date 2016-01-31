// this script run on document_idle.

var replacements_json = "";
chrome.extension.sendRequest({method: "word_replacements"}, function(response) {
        replacements_json = response.status;
    });

var walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);

function replaceWords()
{
	var replacements = JSON.parse(replacements_json);
	
	var keyToIndex = {};
	var nextIndex = 0;
	for (var key in replacements)
	{
		if (replacements.hasOwnProperty(key))
		{
			keyToIndex[key] = nextIndex++;
		}
	}
	
    var node;
    while (node = walker.nextNode())
	{
		// Flag replacements
		for (var key in replacements)
		{
			if (replacements.hasOwnProperty(key))
			{
				var index = keyToIndex[key];
				var substitution = replacements[key];
				// As is cases in the replacements array.
				node.nodeValue = node.nodeValue.replace(new RegExp(key), '{' + index + '}');
				// Lower case versions
				node.nodeValue = node.nodeValue.replace(new RegExp(key.toLowerCase()), '{' + index + 'l}');
				// All caps [cruise control for awesome] versions
				node.nodeValue = node.nodeValue.replace(new RegExp(key.toUpperCase()), '{' + index + 'c}');
			}
		}
		// Replace flaged items
		for (var key in replacements)
		{
			if (replacements.hasOwnProperty(key))
			{
				var index = keyToIndex[key];
				var substitution = replacements[key];
				node.nodeValue = node.nodeValue.replace(new RegExp('\\{' + index + '\\}'), substitution);
				node.nodeValue = node.nodeValue.replace(new RegExp('\\{' + index + '\\l}'), substitution.toLowerCase());
				node.nodeValue = node.nodeValue.replace(new RegExp('\\{' + index + '\\c}'), substitution.toUpperCase());
			}
		}
    }
}

// Check local storage. If the plugin is enabled run the word replacements.
chrome.storage.sync.get('wordReplaceEnabled', function(result)
{
    if (result.wordReplaceEnabled)
	{
        replaceWords();
    }
});