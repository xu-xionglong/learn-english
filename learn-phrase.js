if (process.argv.length < 2) {
	return;
}


const fs = require('fs')
const readline = require('readline')

const filePath = process.argv[2];
const file = fs.readFileSync(filePath, 'utf8');
const lines = file.split('\n');
let phrases = [];
lines.forEach((line) => {

	if (line !== '' && line !== '\r') {
		phrases.push(line)
	}
})

let showEnlish = false;
let iIndex = 0;
let command = "";

function displayPhrase() {
	process.stdout.write('\033c');
	process.stdout.write((iIndex + 1) + '\n\n');

	process.stdout.write(phrases[iIndex * 2] + '\n');

	if (showEnlish) {
		process.stdout.write('\n' + phrases[iIndex * 2 + 1] + '\n');
	}
}

displayPhrase();

let stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', function(key){
	if (key === '\u001B\u005B\u0041') {
		//up
		showEnlish = !showEnlish;
	}
	else if (key === '\u001B\u005B\u0042'){
		//down
		showEnlish = !showEnlish;
	}
    else if (key == '\u001B\u005B\u0044') {
    	//left
		iIndex = iIndex === 0 ? phrases.length / 2 - 1 : iIndex - 1;
		showEnlish = false;
    }
    else if (key === '\u001B\u005B\u0043') {
    	//right
    	iIndex = (iIndex + 1) * 2  === phrases.length ? 0 : iIndex + 1;
		showEnlish = false;
    }
    else if (key === '\u0003') {
    	//ctrl-c
    	process.exit();
    }    
    else {
    	if (key === '\u000d') {
    		let i = parseInt(command);
    		if (i >= 0 && (i * 2) < phrases.length) {
    			iIndex = i - 1;
    			displayPhrase();
    		}

    		process.stdout.clearLine();
    		process.stdout.cursorTo(0);
    		command = '';
    	}
    	else if (key === '\u007f') {
    		if (command.length > 0) {
    			command = command.substr(0, command.length - 1);
	    		process.stdout.clearLine();
	    		process.stdout.cursorTo(0);
	    		process.stdout.write(command);
    		}
    	}
    	else {
    		process.stdout.write(key);
    		command = command + key;
    	}
    	return;
    }
    displayPhrase();
});