//Maps Interval Name to Half-steps
var IntervalType = enumeration({Unison:0, MinorSecond:1, MajorSecond:2, MinorThird:3, MajorThird:4, PerfectFourth:5, Tritone:6, PerfectFifth:7, MinorSixth:8, MajorSixth:9, MinorSeventh:10, MajorSeventh:11, Octave:12, MinorNinth:13, MajorNinth:14});

function Interval(option) {
	this.duration = 60 / option.tempo;
	this.newInt = 0;
	this.otherInt = 0;
	this.answer = null;
	this.melodic = true;

	this.generateNewInterval(option);
}

Interval.prototype.generateNewInterval = function(option) {
	//Set options
	this.duration = 60 / option.tempo;
	this.melodic = option.melodic;
	//There are 89 possible notes. Removing the top and bottom octave + 1 half step (since interval upto min9) leaves 63 notes
	var possible = 63;
	//Get possible intervals from options e.g. Unison, Minor Third, and Minor Sixth
	var possibleIntervals = option.intervals;
	//Get the interval to be tested from the possible intervals (select index at random)
	var interval = possibleIntervals[parseInt(Math.random() * possibleIntervals.length)];
	//Set the answer (e.g. Minor Third)
	this.answer = stringToIntervalType(interval).toString();
	//Set the interval Amount (in half steps) e.g. 3 half steps
	interval = stringToIntervalType(interval).valueOf();
	//Starting note for interval
	this.newInt = parseInt(Math.random() * possible + 13);
	//Generate the other interval by +/- the number of half steps for interval based on ascending or descending
	switch (option.ascend) {
		case 'ascend':
			this.otherInt = this.newInt + interval;
			break;
		case 'descend':
			this.otherInt = this.newInt - interval;
			break;
		case 'both':
			var z = parseInt(Math.random() * 2)
			this.otherInt = z == 0 ? this.newInt + interval : this.newInt - interval;
			break;
		default:
			this.otherInt = this.newInt + interval;
			break;
	}
}

Interval.prototype.play = function() {
	if (this.melodic) {
		playSound(this.newInt, 0, this.duration);
		playSound(this.otherInt, this.duration, this.duration);
	} else {
		playSound(this.newInt, 0, this.duration * 2);
		playSound(this.otherInt, 0, this.duration * 2);
	}
}

function stringToIntervalType(str) {
	if (str === 'Unison') {
		return IntervalType.Unison;
	} else if (str === 'MinorSecond') {
		return IntervalType.MinorSecond;
	} else if (str === 'MajorSecond') {
		return IntervalType.MajorSecond;
	} else if (str === 'MinorThird') {
		return IntervalType.MinorThird;
	} else if (str === 'MajorThird') {
		return IntervalType.MajorThird;
	} else if (str === 'PerfectFourth') {
		return IntervalType.PerfectFourth;
	} else if (str === 'Tritone') {
		return IntervalType.Tritone;
	} else if (str === 'PerfectFifth') {
		return IntervalType.PerfectFifth;
	} else if (str === 'MinorSixth') {
		return IntervalType.MinorSixth;
	} else if (str === 'MajorSixth') {
		return IntervalType.MajorSixth;
	} else if (str === 'MinorSeventh') {
		return IntervalType.MinorSeventh;
	} else if (str === 'MajorSeventh') {
		return IntervalType.MajorSeventh;
	} else if (str === 'Octave') {
		return IntervalType.Octave;
	} else if (str === 'MinorNinth') {
		return IntervalType.MinorNinth;
	} else if (str === 'MajorNinth') {
		return IntervalType.MajorNinth;
	} else {
		alert("Programmer Error -- interval.js ~90: String doesn't map to an IntervalType");
	}
}
