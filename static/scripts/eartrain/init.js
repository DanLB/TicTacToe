var context;
var bufferedNotes;
var interval;
var option;
var notesKeyArray;

function init() {

	// TODO Should load cookie here with options 

	option = new Option();
	saveOptions(null);

  	// Fix up prefixing
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	} catch(e) {
		alert('Web Audio API is not supported in this browser. Please update to a modern browser to practice sightsinging');
	}

	notesKeyArray = loadNotesArray();

  	var bufferLoader = new BufferLoader(
	    context,
	    notesKeyArray,
	    finishedLoading
    );

  	bufferLoader.load();

  	addEventHandlers();
}

function finishedLoading(bufferList) {
	bufferedNotes = bufferList;
	interval = new Interval(option);
	interval.play();
}

/**
 * Sorts the key array from the acoustic grand piano.
 * Returns the array of notes sorted from lowest to highest
 * This can then be used to access the acoustic_grand_piano
 */
function loadNotesArray() {
	var notesArray = Object.keys(MIDI.Soundfont.acoustic_grand_piano);
	notesArray.sort(function(a,b) {
		// A0 - A7, Ab 1-7, B 0-7
		var aDigit = a[a.length - 1];
		var bDigit = b[b.length - 1];

		//different digits are can be compared using the difference of the digit
		//e.g. A0 goes before A7 (0 - 7 = -7 -> therefore, A0 goes first)
		if (aDigit != bDigit) {
			return aDigit - bDigit;
		//If the note names for the first letter are equal
		//e.g. B and Bb -> The one that is 3 letters long goes first (Bb goes before B)
		} else if (a[0] == b[0]) {
			if (a.length == 3)
				return -1;
			else
				return 1;
		//For White key notes that are in the same octave (0-8)
		//need to compare using the first digit but remembering that each octave starts with C
		//e.g. C2 D2 E2 F2 G2 A2 B2
		//Therefore 'B' is always last
		} else if (a[0] == 'B') {
			return 1;
		//'A' is first if the other note is 'B' but otherwise is always last
		} else if (a[0] == 'A') {
			if (b[0] == 'B')
				return -1
			else
				return 1;
		//Otherwise compare using normal comparisons
		}else {
			return a.localeCompare(b);
		}

	});
	return notesArray;
}

function playSound(index, startTime, duration) {
	console.log('PlaySound(' + index + ', ' + context.currentTime + startTime + ', ' + duration + ')');
	var source = context.createBufferSource();
	source.buffer = bufferedNotes[notesKeyArray[index]];
	source.connect(context.destination);
	source.start(context.currentTime + startTime, 0, duration);
}

function addEventHandlers() {
	/**
	 * Adding the handler to the div containing all interval options buttons.
	 * event.target will contain which button was clicked.
	 */
	document.getElementById('buttons').addEventListener('click', function(event) {
		//Because this adds Listener to the div, need to check if whitespace or a button was clicked
		if (event.originalTarget.localName != 'button') {
			return;
		}

		clearAnswer();

		if (interval.answer.toString() === event.target.name) {
			setAnswer('Correct!');
			newInterval();
		} else {
			setAnswer('Incorrect');
		}
	}, false);
	//Save Options button handler
	document.getElementById('saveOptions').addEventListener('click', function(event) {
		document.getElementById('bod').style.cursor = 'wait';
		saveOptions(event);
		document.getElementById('bod').style.cursor = 'auto';
	}, false);
	//Play Again button handler
	document.getElementById('playagain').addEventListener('click', function(event) {
		event.stopPropagation();
		clearAnswer();
		interval.play();
	}, false);
	//New Interval button handler
	document.getElementById('newinterval').addEventListener('click', function(event) {
		event.stopPropagation();
		clearAnswer();
		newInterval();
	}, false);
	//Tempo Range handler
	document.getElementById('temporange').addEventListener('change', function(event) {
		document.getElementById('tempotext').value = event.target.value;
	}, false);
	//Tempo Text handler
	document.getElementById('tempotext').addEventListener('change', function(event) {
		document.getElementById('temporange').value = event.target.value;
	}, false);
	//Options Header to close and open options pane
	document.getElementById('optionsHeader').addEventListener('click', function(event) {
		event.stopPropagation();
		if (document.getElementById('options').style.display === 'none' ||
					document.getElementById('options').style.display === 'none') {
			document.getElementById('options').style.display = 'inline';
		} else {
			document.getElementById('options').style.display = 'none';
		}
	}, false);
}

function cancelDefaultAction(event) {
	if (event.preventDefault) event.preventDefault();
	event.returnValue = false;
	return false;
}

function saveOptions(event) {
	option.intervals = [];
	var elem = null;
	//Get all 'input' elements from the 'options' div into an array
	var optionForm = document.getElementById('options');
	var inputElements = document.getElementsByTagName('input');
	//Loop through input elements and set options from them
	for (var i = 0, j = 0; i < inputElements.length; ++i) {
		//Grab the element here to avoid messy array access
		elem = inputElements[i];
		if (elem.type === 'radio') {
			//If the radio button is checked
			if (elem.checked) {
				//Ascend option
				if (elem.name === 'ascend') {
					//If the value is ascend. Otherwise it must be descend
					if (elem.value === 'ascend') {
						option.ascend = 'ascend';
					} else if (elem.value === 'descend') {
						option.ascend = 'descend';
					} else {
						option.ascend = 'both';
					}
				//Melodic option
				} else if (elem.name === 'melodic') {
					//If the value is melodic. Otherwise it must be harmonic
					if (elem.value === 'melodic') {
						option.melodic = true;
					} else {
						option.melodic = false;
					}
				}
			}
		} else if (elem.type === 'range') {
			//range is the tempo
			option.tempo = elem.value;
		} else if (elem.type == 'checkbox') {
			//Checkboxes are the interval types.
			//These are the intervals that will be tested
			if (elem.checked) {
				option.intervals[j++] = elem.name;
			}
		} else if (elem.type === 'text') {
			//Do nothing with text at this time
			continue;
		} else {
			//Should never get here but I've been wrong before.
			continue;
		}
	}
	if (event != null) {
		document.getElementById('random').innerHTML = "Options saved";
		return cancelDefaultAction(event);
	}
}

function newInterval() {
	interval.generateNewInterval(option);
	interval.play();
}

function setAnswer(str) {
	document.getElementById('answer').innerHTML = str;
}

function clearAnswer() {
	setAnswer('&nbsp;');
}