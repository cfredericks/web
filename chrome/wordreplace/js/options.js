window.addEventListener("load", populate_replacements);
window.addEventListener("load", setup_button_listeners);

// Populate drop down with list of replacements: 'word_to_replace -> replacement_word'
function populate_replacements()
{
	var replacements = get_replacements();
	var select = document.getElementById("word_substitutions_select");
	
	// Clear the drop down first
    for (var i = select.options.length - 1; i >= 0; i--)
    {
        select.remove(i);
    }
	
	for (var key in replacements)
	{
		if (replacements.hasOwnProperty(key))
		{
			select.options.add(new Option(key + " -> " + replacements[key]));
		}
	}
}

function setup_button_listeners()
{
	document.getElementById("add_button").addEventListener("click", save_replacement);
	document.getElementById("remove_button").addEventListener("click", remove_replacement);
}

// Check local storage for word replacements
function get_replacements()
{
	var replacement_json = localStorage['word_replacements'];
	if (replacement_json == undefined)
	{
		replacement_json = JSON.stringify({});
	}
	return JSON.parse(replacement_json);
}

function save_replacement()
{
	var word_to_replace = document.getElementById("word_to_replace");
	var replacement_word = document.getElementById("replacement_word");
	
	// Add new replacement
	var replacements = get_replacements();
	replacements[word_to_replace.value] = replacement_word.value;
	localStorage['word_replacements'] = JSON.stringify(replacements);
	
	// Clear text boxes
	word_to_replace.value = null;
	replacement_word.value = null;

	// Refresh drop down
	populate_replacements();
}

function remove_replacement()
{
	var select = document.getElementById("word_substitutions_select");
	var selected_replacement = select.options[select.selectedIndex].value;
	
	if (selected_replacement == undefined)
	{
		return;
	}
	
	// Get word to replace from 'word_to_replace -> replacement_word' in the drop down
	var idx = selected_replacement.indexOf(' -> ');
	if (idx < 1)
	{
		return;
	}
	var selected_key = selected_replacement.substring(0, idx);
	
	// Remove the selected word
	var replacements = get_replacements();
	delete replacements[selected_key];
	localStorage['word_replacements'] = JSON.stringify(replacements);
	
	// Refresh drop down
	populate_replacements();
}